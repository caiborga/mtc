import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class TourService {

    // Definieren Sie die Basis-URL Ihrer API
    private apiUrl: string = 'http://localhost:3000/';

    // Injizieren Sie den HttpClient im Konstruktor
    constructor(private httpClient: HttpClient) { }

    // Methode zum Ausführen einer GET-Anfrage
    get(): Observable<any> {
        const url = `${this.apiUrl}`;
        return this.httpClient.get(url);
    }

    // Methode zum Ausführen einer POST-Anfrage
    post(endpoint: string, data: any): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.post(url, data);
    }

    // Methode zum Ausführen einer PUT-Anfrage
    put(endpoint: string, data: any): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.put(url, data);
    }

    // Methode zum Ausführen einer DELETE-Anfrage
    delete(endpoint: string): Observable<any> {
        const url = `${this.apiUrl}/${endpoint}`;
        return this.httpClient.delete(url);
    }
}
