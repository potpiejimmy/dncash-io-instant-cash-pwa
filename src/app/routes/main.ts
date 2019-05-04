import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
    selector: "main",
    templateUrl: "main.html"
})
export class MainComponent implements OnInit {

    constructor(
        private localStorage: LocalStorageService,
        private router: Router
    ) {}

    ngOnInit() {
        let uuid = this.localStorage.get('device-uuid');
        if (!uuid) {
            // not registered yet
            this.router.navigate(['/register']);
        } else {
            this.router.navigate(['/amount']);
        }
    }
}
