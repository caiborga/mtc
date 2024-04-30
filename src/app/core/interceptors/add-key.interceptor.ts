import { HttpInterceptorFn } from '@angular/common/http';

export const addKeyInterceptor: HttpInterceptorFn = (req, next) => {

    //console.log("interceptor start", req)
    if (req.url.startsWith('http://localhost:3000/api/')) {
        // Den Wert aus dem Local Storage abrufen (ersetze 'meinSchlüssel' durch den tatsächlichen Schlüssel)
        const token = localStorage.getItem('key');

        // Wenn ein Token im Local Storage vorhanden ist, füge es als Header 'Authorization' hinzu
        if (token) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: token
                }
            });
            //console.log("interceptor result", authReq)
            return next(authReq);
        }
    }

    // Wenn die Anfrage nicht mit 'http://localhost:3000/api/' beginnt oder kein Token im Local Storage vorhanden ist, führe die ursprüngliche Anfrage durch
    return next(req);
};