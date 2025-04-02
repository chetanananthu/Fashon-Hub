import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

        // console.log("Auth Token:", authToken); // Debugging

        // Clone request and add Authorization header only if token exists
        const authRequest = authToken 
            ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } }) 
            : req;

        // console.log("Intercepted request:", authRequest); // Debugging

        return next.handle(authRequest);
    }
}
