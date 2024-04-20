import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Überprüfen, ob die Anfrage mit 'http://localhost:3000/api/' beginnt
    if (req.url.startsWith('http://localhost:3000/api/')) {
      // Den Wert aus dem Local Storage abrufen (ersetze 'meinSchlüssel' durch den tatsächlichen Schlüssel)
      const token = localStorage.getItem('key');

      // Wenn ein Token im Local Storage vorhanden ist, füge es als Header 'Authorization' hinzu
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }
    }

    // Wenn die Anfrage nicht mit 'http://localhost:3000/api/' beginnt oder kein Token im Local Storage vorhanden ist, führe die ursprüngliche Anfrage durch
    return next.handle(req);
  }
}
