import { Component, OnInit } from "@angular/core";
import { AppService } from '../services/app.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { InstantApiService } from '../services/instantapi.service';
import { ToastrService } from 'ngx-toastr';
import * as crypto from "crypto-browserify";
import { Buffer } from "buffer";
import { Router } from '@angular/router';

@Component({
    selector: "process",
    templateUrl: "process.html"
})
export class ProcessComponent implements OnInit {

    processing: boolean = false;
    processingInfo: string;
    decryptedToken: Buffer;

    constructor(
        private localStorageService: LocalStorageService,
        public appService: AppService,
        public instantApiService: InstantApiService,
        private router: Router,
        public toast: ToastrService
    ) {}

    ngOnInit() {
        if (this.appService.currentToken) this.initializeToken();
        else this.finish();
    }

    get token() {
        if (!this.appService.currentToken) return {};
        return this.appService.currentToken;
    }

    get headerLabel() {
        let t = this.token;
        return "Cashing out " + t.amount/100 + " " + t.symbol;
    }

    initializeToken(): void {
        setTimeout(() => this.decryptToken(), 200);
    }

    decryptToken(): void {
        this.processing = true;
        this.processingInfo = "Decrypting token...";
        if (!this.appService.currentToken) return;
        try {
            let buf = new Buffer(this.token.secure_code, 'base64');
            this.decryptedToken = crypto.privateDecrypt({
                key: this.localStorageService.get("keypair")['private'],
                padding: 1 // constants.RSA_PKCS1_PADDING
            }, buf);
        } catch (err) {
            console.log(err);
        }

        this.processCashout(this.appService.triggerCode);
    }

    async processCashout(triggercode: string) {
        console.log(triggercode);
        this.processingInfo = "Signing request...";
        try {
            let radiocode = this.token.uuid + this.decryptedToken.toString('hex');
            // create signature for triggercode+radiocode
            let sign = crypto.createSign("RSA-SHA256");
            sign.write(triggercode+radiocode);
            let signature = sign.sign(this.localStorageService.get("keypair")['private']).toString('base64');
            this.processingInfo = "Processing cashout...";
            let result = await this.instantApiService.processCashout(triggercode, radiocode, signature);
            console.log(result);
            this.processingInfo = result.status;
        } catch (err) {
            console.log(err);
            this.toast.warning(err, null, {timeOut: 5000, positionClass: 'toast-bottom-center'});
        } finally {
            this.processing = false;
        }
    }

    finish() {
        this.router.navigate(['/'], { replaceUrl: true });
    }
}
