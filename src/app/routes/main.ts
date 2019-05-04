import { Component, OnInit } from "@angular/core";
import * as client from 'braintree-web/client';
import * as paymentRequest from 'braintree-web/payment-request';
import { InstantApiService } from '../services/instantapi.service';

@Component({
    selector: "main",
    templateUrl: "main.html"
})
export class MainComponent implements OnInit {

    clientAuthorizationToken;
    processing;

    constructor(
        public api: InstantApiService
    ) {}

    ngOnInit() {
        if (window['PaymentRequest']) {
            // This browser supports Payment Request
            // Display your Payment Request button
            console.log("Payment Request API is available. How cool is that.");
            this.loadClientToken();
        } else {
            // Browser does not support Payment Request
            // Set up Hosted Fields, etc.
            console.log("Payment Request API not available. Too bad.");
        }
    }

    async loadClientToken() {
        this.clientAuthorizationToken = await this.api.getClientToken();
        console.log(this.clientAuthorizationToken);
    }

    async pay() {
        console.log("CLICKED");
        this.processing = true;
        try {
            let clientInstance = await client.create({
                authorization: this.clientAuthorizationToken
            });
            console.log(clientInstance);

            let request = await paymentRequest.create({
                client: clientInstance
            });
            console.log(request);

            let payload = await request.tokenize({
                details: {
                total: {
                    label: 'Amount',
                    amount: {
                    currency: 'EUR',
                    value: 1.00
                    }
                }
                }
            });
            console.log(payload);

        } finally {
            this.processing = false;
        }
    }
}
