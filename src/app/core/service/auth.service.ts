import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerRegisterRequest } from '../interfaces/request/customerRegister';
import { ApiResponse } from '../interfaces/ApiResponse';
import { EUserRole } from '../enums/EUserRole';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface IUserDetails {
    id: number;
    name: string;
    email: string;
    username: string; // Changed from userCode to match backend
    role: EUserRole;
}

export interface ILoginResponse {
    token: string;
    userDetails: IUserDetails;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private router: Router, private http: HttpClient) { }

    login(username: string, password: string): Observable<ApiResponse> {
        return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, { indentifier: username, password }).pipe(
            map(response => {
                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userDetails', JSON.stringify(response.userDetails));
                    return {
                        statusCode: 200,
                        success: true,
                        message: 'Login successful',
                        data: response.userDetails,
                    };
                }
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Invalid credentials',
                };
            })
        );
    }

    logout(): ApiResponse {
        localStorage.clear();
        this.router.navigate(['/login']);
        return {
            statusCode: 200,
            success: true,
            message: 'Logout successful',
        };
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getUserDetails(): ApiResponse {
        const userStr = localStorage.getItem('userDetails');
        const user: IUserDetails | null = userStr ? JSON.parse(userStr) : null;
        return {
            statusCode: 200,
            success: true,
            message: 'Data fetched successfully',
            data: user ? user : undefined,
        };
    }

    getUserRoles(): EUserRole {
        const userStr = localStorage.getItem('userDetails');
        const user: IUserDetails = userStr ? JSON.parse(userStr) : {};
        return user.role;
    }

    registerCustomer(input: CustomerRegisterRequest): Observable<ApiResponse> {
        const payload = {
            ...input,
            preferences: input.allowNotifications
        };

        return this.http.post<any>(`${this.apiUrl}/register/customer`, payload).pipe(
            map(response => ({
                statusCode: 201, // Assuming 201 Created from backend
                success: true,
                message: 'Customer Registered Successfully',
                data: response
            }))
        );
    }

    getRedirectRouteByRole(): string {
        const userStr = localStorage.getItem('userDetails');
        const user: IUserDetails | null = userStr ? JSON.parse(userStr) : null;

        if (!user) {
            return '/login';
        }

        const role = user.role;

        if (role === EUserRole.OFFICER) {
            return '/officer';
        } else if (role === EUserRole.CUSTOMER) {
            return '/customer';
        }

        return '/login';
    }
}
