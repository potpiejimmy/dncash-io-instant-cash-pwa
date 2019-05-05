import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
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
        private router: Router
    ) {}

    ngOnInit() {
        let uuid = this.localStorage.get('device-uuid');
        if (!uuid) {
            // not registered yet
            this.router.navigate(['/register']);
        } else {
            // try to load the first available token
            this.loadAvailableToken();
        }
    }

    async loadAvailableToken() {
        let t = await this.instantApiService.getToken();
        if (t) {
            this.appService.currentToken = t;
            this.router.navigate(['/token']);
        } else {
            this.router.navigate(['/amount']);
        }
    }
}
