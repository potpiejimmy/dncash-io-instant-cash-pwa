import { Component, OnInit, ViewChild } from "@angular/core";
import { DenomSelComponent } from "../components/denomsel";
import { AppService } from "../services/app.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { InstantApiService } from '../services/instantapi.service';
import { ToastrService } from "ngx-toastr";
import * as client from 'braintree-web/client';
import * as paymentRequest from 'braintree-web/payment-request';

@Component({
    selector: 'amount',
    templateUrl: 'amount.html'
})
export class AmountComponent implements OnInit {

    @ViewChild("sel5")   sel5:   DenomSelComponent
    @ViewChild("sel10")  sel10:  DenomSelComponent
    @ViewChild("sel20")  sel20:  DenomSelComponent
    @ViewChild("sel50")  sel50:  DenomSelComponent

    denoms;

    amount: number = 0;
    symbol: string = 'EUR';

    processing: boolean;

    constructor(
        public appService: AppService,
        private instantApiService: InstantApiService,
        private localStorage: LocalStorageService,
        private router: Router,
        public toast: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.denoms = [this.sel5,this.sel10, this.sel20, this.sel50];
    }

    update(): void {
        this.amount = 0;
        this.denoms.forEach(i => this.amount += i.amount());
    }

    valid(): boolean {
        return this.amount > 0;
    }

    denomData(): Array<any> {
        let data = [];
        this.denoms.forEach(i => data.push(i.denomData()));
        return data;
    }

    async finish() {
        this.processing = true;

        // now buy the token:
        try {
            // create a braintree client
            let clientInstance = await client.create({
                authorization: this.localStorage.get('braintree-auth')
            });
    
            // create payment request API
            let request = await paymentRequest.create({
                client: clientInstance
            });
    
            // get the payment token nonce
            let payload = await request.tokenize({
                details: {
                    total: {
                        label: 'Amount',
                        amount: {
                            currency: this.symbol,
                            value: this.amount/100
                        }
                    }
                }
            });
            console.log(payload);
    
            // now buy the token
            await this.buyToken(payload.nonce);

        } catch(err) {
            this.toast.error(err, null, {timeOut: 5000, positionClass: 'toast-bottom-center'});
            // XXX demo: buy anyway
            await this.buyToken("fake-valid-nonce");
        } finally {
            this.processing = false;
        }
    }

    async buyToken(nonce: any) {
        // buy the token, pass the nonce to the server
        let t = await this.instantApiService.buyToken({
            amount: this.amount,
            symbol: this.symbol,
            device_uuid: this.localStorage.get("device-uuid"),
            expires: Date.now() + 3600000, // expires in 1 hour
            info: {
                denomData: this.denomData()
            },
            paymentMethodNonce: nonce
        });

        console.log("Token: " + t);
        this.appService.currentToken = t;
        this.router.navigate(['token'], { replaceUrl: true });
    }
}

