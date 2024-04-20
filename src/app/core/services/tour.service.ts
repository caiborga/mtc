import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class TourService {

    private apiUrl: string = 'http://localhost:3000/api';

    constructor(private httpClient: HttpClient) { }

    // PARTICIPANTS

    post(endpoint: string, data: any) {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.post(url, data);
    }

    get(endpoint: string): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.get(url);
    }

    put(endpoint: string, data: any): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.put(url, data);
    }

    delete(endpoint: string): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.delete(url);
    }

}
