import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { AppService } from "../services/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as crypto from "crypto-browserify";
import { LocalStorageService } from "angular-2-local-storage";
import { Buffer } from "buffer";
import { InstantApiService } from "../services/instantapi.service";
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment';

@Component({
    selector: 'token',
    templateUrl: 'token.html'
})
export class TokenComponent implements OnInit, OnDestroy {

    decryptedToken: Buffer;
    decrypting: boolean = false;

    expirationString: string;
    updateExpirationTimeout: any;

    triggercodeQueryParam: string;

    constructor(
        private localStorageService: LocalStorageService,
        public appService: AppService,
        private instantApiService: InstantApiService,
        private router: Router,
        private route: ActivatedRoute,
        public toast: ToastrService
    ) {
    }

    ngOnInit(): void {
        // fetch triggercode if passed via query param
        this.route.queryParams.subscribe(params => this.triggercodeQueryParam = params.triggercode);
        if (!this.appService.currentToken) {
            // no token set, try to load the first available token if this route is directly invoked or hard-refreshed
            this.instantApiService.getToken().then(t => {
                this.appService.currentToken = t;
                this.initializeToken();
            });
        } else {
            this.initializeToken();
        }
    }

    ngOnDestroy(): void {
        clearTimeout(this.updateExpirationTimeout);
    }

    initializeToken(): void {
        if (!this.appService.currentToken) this.finish();
        console.log(this.appService.currentToken);
//        setTimeout(() => this.decryptToken(), 200);
        this.buildExpirationString();
    }
    
    delete() {
        this.instantApiService.deleteToken(this.appService.currentToken.uuid).then(() => {
            this.appService.currentToken = null;
            this.finish();
        });
    }

    headerLabel() {
        let t = this.token();
        return t.amount/100 + " " + t.symbol;
    }

    token() {
        if (!this.appService.currentToken) return {};
        return this.appService.currentToken;
    }

    decryptToken(): void {
        if (!this.appService.currentToken) return;
        try {
            let buf = new Buffer(this.token().secure_code, 'base64');
            this.decryptedToken = crypto.privateDecrypt({
                key: this.localStorageService.get("keypair")['private'],
                padding: 1 // constants.RSA_PKCS1_PADDING
            }, buf);
        } catch (err) {
            console.log(err);
        }
        this.decrypting = false;
        // trigger code already available (passed in as param?)
        if (this.triggercodeQueryParam) this.processCashout(this.triggercodeQueryParam);
    }

    qrCodeData(): string {
        if (!this.decryptedToken) return null;
        return this.token().uuid + this.decryptedToken.toString('hex');
    }

    qrCodeDataInfo(): string {
        if (this.decrypting) return "";
        if (!this.decryptedToken) return "Sorry, could not decrypt the token";
        return this.qrCodeData();
    }

    eanCodeData(): string {
        return this.token().plain_code + this.decryptedToken.toString();
    }

    buildExpirationString(): void {
        let t = this.token();
        if (!t.expires) return;
        let d = new Date(t.expires);
        if (d.getTime() <= Date.now()) this.expirationString = "Expired";
        else this.expirationString = "Expires " + moment(d).fromNow();
        this.updateExpirationTimeout = setTimeout(()=>this.buildExpirationString(), 10000);
    }

    processCashout(triggercode: string) {
        let triggerCodeParam = "triggercode=";
        let triggerCodeParamIx = triggercode.indexOf(triggerCodeParam);
        if (triggerCodeParamIx>=0) {
            triggercode = triggercode.substr(triggerCodeParamIx + triggerCodeParam.length);
        }
        console.log(triggercode);
        let radiocode = this.qrCodeData();
        // create signature for triggercode+radiocode
        let sign = crypto.createSign("RSA-SHA256");
        sign.write(triggercode+radiocode);
        let signature = sign.sign(this.localStorageService.get("keypair")['private']).toString('base64');
        this.instantApiService.processCashout(triggercode, radiocode, signature).then(() => {
            this.finish();
        }).catch(err => {
            console.log(err);
            this.toast.warning("Invalid trigger code.", null, {timeOut: 5000, positionClass: 'toast-bottom-center'});
        });
    }

    finish() {
        this.router.navigate(['/'], { replaceUrl: true });
    }
}
