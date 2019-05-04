import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthHttp {
    constructor (
        private http: HttpClient) {
    }

    requestOptions() {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        return { headers: headers };
    }

    handleResponse(request: Observable<Object>): Promise<any> {
        return request.toPromise()
               .catch(err => this.handleError(err, this));
    }

    getBlob(url): Promise<any>  {
        let options = this.requestOptions();
        options["responseType"] = "blob";
        return this.handleResponse(this.http.get(url, options));
    }

    get(url): Promise<any>  {
        return this.handleResponse(this.http.get(url, this.requestOptions()));
    }

    post(url, data): Promise<any>  {
        return this.handleResponse(this.http.post(url, data, this.requestOptions()));
    }

    put(url, data): Promise<any>  {
        return this.handleResponse(this.http.put(url, data, this.requestOptions()));
    }

    delete(url): Promise<any>  {
        return this.handleResponse(this.http.delete(url, this.requestOptions()));
    }

    private handleError(error: any, me: AuthHttp): Promise<any> {
        console.error('An error occurred', JSON.stringify(error)); // XXX for debugging purposes
        if (!error.status || error.status==504) error.message = "Sorry, " + environment.apiUrl + " cannot be reached.";        
        return Promise.reject((error.error ? error.error.message : null) || error.message || error);
    }
}
