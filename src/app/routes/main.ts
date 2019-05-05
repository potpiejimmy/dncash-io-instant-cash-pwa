import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { InstantApiService } from '../services/instantapi.service';
import { AppService } from '../services/app.service';

@Component({
    selector: "main",
    templateUrl: "main.html"
})
export class MainComponent implements OnInit {

    constructor(
        private localStorage: LocalStorageService,
        private appService: AppService,
        private instantApiService: InstantApiService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        let uuid = this.localStorage.get('device-uuid');
        if (!uuid) {
            // not registered yet
            this.router.navigate(['/register'], { replaceUrl: true });
        } else {
            this.route.queryParams.subscribe(params => this.appService.triggerCode = params.triggercode);
                // try to load the first available token
            this.loadAvailableToken();
        }
    }

    async loadAvailableToken() {
        let t = await this.instantApiService.getToken();
        if (t) {
            this.appService.currentToken = t;
            if (this.appService.triggerCode) {
                this.router.navigate(['/process'], { replaceUrl: true });
            } else {
                this.router.navigate(['/token'], { replaceUrl: true });
            }
        } else {
            this.router.navigate(['/amount'], { replaceUrl: true });
        }
    }
}
