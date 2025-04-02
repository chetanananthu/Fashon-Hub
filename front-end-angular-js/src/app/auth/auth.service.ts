import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Auth } from "../../models/auth.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private roleSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('role'));  
    role$ = this.roleSubject.asObservable();  // Observable for role updates

    private userSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('userId'));
    userId$ = this.userSubject.asObservable();  // Corrected reference

    private authStatusSubject = new BehaviorSubject<boolean>(!!sessionStorage.getItem('token'));
    authStatus$ = this.authStatusSubject.asObservable();

    constructor(private http: HttpClient, private route: Router) {}

    getRole() {
        return sessionStorage.getItem('role');
    }

    getUserId() {
        return sessionStorage.getItem('userId');
    }

    onLogin(login: Auth) {
        return this.http.post<{ message: string, token: string, userId: string, role: string }>(
            'http://localhost:3000/api/auth/login', 
            login
        ).subscribe((res: any) => {
            console.log("Login successful:", res);

            // Store session data
            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('role', res.role);
            sessionStorage.setItem('userId', res.userId);

            // Notify all subscribers
            this.roleSubject.next(res.role);
            this.userSubject.next(res.userId);  // Corrected
            this.authStatusSubject.next(true);
        });
    }

    createUser(signup: Auth) {
        return this.http.post<{ message: string, userId: string }>(
            'http://localhost:3000/api/auth/signup', 
            signup
        ).subscribe((res: any) => {
            console.log(res.userId);
            alert("Successfully created Account");
            this.route.navigate(['/login']);
        });
        
    }

    onLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userId');

        this.roleSubject.next(null);
        this.userSubject.next(null); // Reset user ID
        this.authStatusSubject.next(false);

        this.route.navigate(['']);
    }
}



// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Router } from "@angular/router";
// import { BehaviorSubject } from "rxjs";
// import { Auth } from "../../models/auth.model";

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthService {

//     private roleSubject:any = new BehaviorSubject<string | null>(sessionStorage.getItem('role'));  
//     role$ = this.roleSubject.asObservable();  // Observable for role updates

//     constructor(private http: HttpClient, private route: Router) {}

//     getRole() {
//         return sessionStorage.getItem('role');
//     }

//     getUserId(){
//         return sessionStorage.getItem('userId');
//     }

//     onLogin(login: Auth) {
//         return this.http.post<{ message: string, token: string, userId: string, role: string }>(
//             'http://localhost:3000/api/auth/login', 
//             login
//         ).subscribe((res:any) => {
//             console.log(res)
//             sessionStorage.setItem('token', res.token);
//             sessionStorage.setItem('role', res.role);
//             sessionStorage.setItem('userId',res.userId);
//             this.roleSubject.next(res.role);  // Notify all subscribers
//             console.log("User logged in");
//         });
//     }

//     createUser(signup: Auth) {
//         return this.http.post<{ message: string, userId: string }>(
//             'http://localhost:3000/api/auth/signup', 
//             signup
//         ).subscribe((res:any) => {
//             console.log(res.userId);
//         });
//     }

//     onLogout() {
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('role');
//         sessionStorage.removeItem('userId');
//         this.roleSubject.next(null);  // Notify all subscribers
//         this.route.navigate(['']);
//     }
// }

