import { Component, OnInit } from "@angular/core";
import * as keypair from 'keypair';
import { LocalStorageService } from "angular-2-local-storage";
import { InstantApiService } from "../services/instantapi.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
    selector: 'register',
    templateUrl: 'register.html'
})
export class RegisterComponent {

    processing: boolean;
    pair: any;

    constructor(
        private localStorageService: LocalStorageService,
        private instantApiService: InstantApiService,
        public toast: ToastrService,
        private router: Router
    ) {
    }

    register() {
        this.processing = true;
        setTimeout(() => this.registerDevice(), 1000);
    }

    registerDevice() {
        this.pair = keypair({bits: 2048});
        console.log(JSON.stringify(this.pair));
        this.localStorageService.set("keypair", this.pair);

        this.instantApiService.registerDevice().then(res => {
            console.log("Registration Result: " + JSON.stringify(res));
            this.localStorageService.set('device-uuid', res.uuid);
            this.localStorageService.set('braintree-auth', res.braintree_auth);
            this.finish();
        }).catch(err => {
            console.log("Registration failed: " + err);
            this.pair = null;
            this.processing = false;
            //this.snackBar.open(err, null, {duration: 5000, verticalPosition: 'top'});
            this.toast.error(err, null, {timeOut: 5000, positionClass: 'toast-bottom-center'} );
        });
    }

    finish() {
        this.router.navigate(['/']);
    }
}
  