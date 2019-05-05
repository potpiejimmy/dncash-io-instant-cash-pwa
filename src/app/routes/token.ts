import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { AppService } from "../services/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import { InstantApiService } from "../services/instantapi.service";
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment';

@Component({
    selector: 'token',
    templateUrl: 'token.html'
})
export class TokenComponent implements OnInit, OnDestroy {

    expirationString: string;
    updateExpirationTimeout: any;

    constructor(
        public appService: AppService,
        private instantApiService: InstantApiService,
        private router: Router,
        public toast: ToastrService
    ) {
    }

    ngOnInit(): void {
        // fetch triggercode if passed via query param
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

    buildExpirationString(): void {
        let t = this.token();
        if (!t.expires) return;
        let d = new Date(t.expires);
        if (d.getTime() <= Date.now()) this.expirationString = "Expired";
        else this.expirationString = "Expires " + moment(d).fromNow();
        this.updateExpirationTimeout = setTimeout(()=>this.buildExpirationString(), 10000);
    }

    finish() {
        this.router.navigate(['/'], { replaceUrl: true });
    }
}
