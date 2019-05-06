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
        // returns the first available OPEN token
        return this.get(environment.apiUrl+"tokens/"+this.localStorage.get("device-uuid")).then(res => res[0]);
    }

    deleteToken(uid: number): Promise<any> {
        return this.delete(environment.apiUrl+"tokens/"+this.localStorage.get("device-uuid")+"/"+uid);
    }

    processCashout(uuid: string, triggercode: string, radiocode: string, signature: string): Promise<any> {
        return this.post(environment.apiUrl+"trigger", {
            uuid: uuid,
            triggercode: triggercode,
            radiocode: radiocode,
            signature: signature
        })
    }
}
