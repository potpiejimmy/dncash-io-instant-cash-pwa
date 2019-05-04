import { Injectable } from "@angular/core";
import { AuthHttp } from "./authhttp.service";
import { environment } from "../../environments/environment";

@Injectable()
export class InstantApiService extends AuthHttp {
    
    getClientToken(): Promise<string> {
        return this.get(environment.apiUrl+"clientToken").then(res => res.token);
    }
}
