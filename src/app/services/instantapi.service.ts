import { Injectable } from "@angular/core";
import { AuthHttp } from "./authhttp.service";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class InstantApiService extends AuthHttp {
    
    constructor(
        private httpClient: HttpClient,
        private localStorage: LocalStorageService) {
        super(httpClient);
    }
    
    registerDevice(): Promise<any> {
        return this.post(environment.apiUrl+"register", {
            pubkey: this.localStorage.get("keypair")['public'],
            refname: navigator.userAgent.substr(0,36)
        });
    }

    buyToken(token: any): Promise<any> {
        return this.post(environment.apiUrl+"buy", token);
    }

    getToken(): Promise<any> {
        return this.get(environment.apiUrl+"tokens?device_uuid="+this.localStorage.get("device-uuid"));
    }

    processCashout(triggercode: string, radiocode: string, signature: string): Promise<any> {
        return this.post(environment.apiUrl+"trigger", {
            triggercode: triggercode,
            radiocode: radiocode,
            signature: signature
        })
    }
}
