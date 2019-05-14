import { Component, OnInit, ViewChild, Host, ViewContainerRef } from "@angular/core";
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { DenomSelComponent } from "../components/denomsel";
import { AppService } from "../services/app.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { InstantApiService } from '../services/instantapi.service';
import { ToastrService } from "ngx-toastr";
import { trigger, transition, style, animate } from '@angular/animations';
import * as braintreeClient from 'braintree-web/client';
// Option A) Payment Request API version:
import * as paymentApi from 'braintree-web/payment-request';
import { ComponentPortal } from '@angular/cdk/portal';

// Option B) Google Pay API version:
// Note: this one also needs the pay.js script in index.html, see there
//import * as paymentApi from 'braintree-web/google-payment';
//declare var google: any; // compile workaround for pay.js Google lib

@Component({
    selector: 'amount',
    templateUrl: 'amount.html',
    animations: [
        trigger('slideInOut1', [
            transition(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('500ms 0ms ease-in', style({transform: 'translateX(0%)'}))
            ])
        ]),
        trigger('slideInOut2', [
            transition(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('500ms 100ms ease-in', style({transform: 'translateX(0%)'}))
            ])
        ]),
        trigger('slideInOut3', [
            transition(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('500ms 200ms ease-in', style({transform: 'translateX(0%)'}))
            ])
        ]),
        trigger('slideInOut4', [
            transition(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('500ms 300ms ease-in', style({transform: 'translateX(0%)'}))
            ])
        ])
    ]
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

    controlsVisible = false;

    overlayRef: OverlayRef;

    constructor(
        public appService: AppService,
        private instantApiService: InstantApiService,
        private localStorage: LocalStorageService,
        private router: Router,
        public toast: ToastrService,
        private overlay: Overlay,
        public viewContainerRef: ViewContainerRef
    ) {
    }

    ngOnInit(): void {
        this.denoms = [this.sel5,this.sel10, this.sel20, this.sel50];
        setTimeout(()=>this.controlsVisible=true, 900);
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
        // --- FAKE APPLE PAY INTERACTION ---
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)){
            let config = new OverlayConfig({
                width: '100%',
                hasBackdrop: true
            });  
            config.positionStrategy = this.overlay
              .position()
              .global()
              .centerHorizontally()
              .bottom('0');
            this.overlayRef = this.overlay.create(config);
            this.overlayRef.attach(new ComponentPortal(ApplePayPanel, this.viewContainerRef));
        } else {
            await this.pay();
        }
    }

    async pay() {
        this.processing = true;

        // now buy the token:
        try {
            // create a braintree client
            let braintreeClientInstance = await braintreeClient.create({
                authorization: this.localStorage.get('braintree-auth')
            });
    
            // --- OPTION A: Payment Request API ---
            
            // create payment request API
            let request = await paymentApi.create({
                client: braintreeClientInstance
            });
    
            // get the payment token nonce
            let payload = await request.tokenize({
                details: {
                    total: {
                        label: 'Amount',
                        amount: {
                            currency: this.symbol,
                            value: ""+(this.amount/100)
                        }
                    }
                }
            });
            console.log(payload);
  
            // --- END OPTION A ---
            // --- OPTION B: Google Pay API ---
/*
            let googlePaymentsClient = new google.payments.api.PaymentsClient({
                environment: 'TEST' // Or 'PRODUCTION'
            });

            // create payment request API
            let googlePaymentInstance = await paymentApi.create({
                client: braintreeClientInstance,
                googlePayVersion: 2,
                //googleMerchantId: 'merchant-id-from-google'
            });
   
            let readyToPay = await googlePaymentsClient.isReadyToPay({
                // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods,
                existingPaymentMethodRequired: true // Optional
            });
            if (!readyToPay.result) throw "Google Pay not available";

            let paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
                transactionInfo: {
                    currencyCode: this.symbol,
                    totalPriceStatus: 'FINAL',
                    totalPrice: ""+(this.amount/100)
                }
            });

            // We recommend collecting billing address information, at minimum
            // billing postal code, and passing that billing postal code with all
            // Google Pay card transactions as a best practice.
            // See all available options at https://developers.google.com/pay/api/web/reference/object
            let cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
            cardPaymentMethod.parameters.billingAddressRequired = true;
            cardPaymentMethod.parameters.billingAddressParameters = {
                format: 'FULL',
                phoneNumberRequired: false
            };

            let paymentData = await googlePaymentsClient.loadPaymentData(paymentDataRequest);
            let payload = googlePaymentInstance.parseResponse(paymentData);
            // --- END OPTION B ---
*/
            // now buy the token (demo: use fake nonce, not the real one)
            await this.buyToken("fake-valid-nonce"); //(payload.nonce);

        } catch(err) {
            //this.toast.error(err, null, {timeOut: 5000, positionClass: 'toast-bottom-center'});
            // XXX demo: buy anyway
            console.log(err);
            await this.buyToken(null); // buy without nonce = create token without payment
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

        this.appService.currentToken = t;
        this.router.navigate(['token'], { replaceUrl: true });
    }
}

// ---- Apple Pay Demo

@Component({
    selector: 'applepay-panel',
    templateUrl: '../components/applepay.html',
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({transform: 'translateY(100%)'}),
                animate('300ms 0ms ease-in', style({transform: 'translateY(0%)'}))
            ]),
            transition(':leave', [
                animate('200ms 0ms ease-in', style({transform: 'translateY(100%)'}))
            ])
        ])
    ]
})
export class ApplePayPanel {
    amount;
    component;
    displayed = true;

    constructor(@Host() _component: AmountComponent) {
        this.component = _component;
        this.amount = _component.amount/100;
        this.amount = this.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        _component.overlayRef.backdropClick().subscribe(() => {
            this.dismiss();
        });
    }

    process() {
        this.dismiss();
        this.component.buyToken(null);
    }

    dismiss() {
        this.displayed = false;
        setTimeout(()=>{this.component.overlayRef.dispose();},300);
    }
}
