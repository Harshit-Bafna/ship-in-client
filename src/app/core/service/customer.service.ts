import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ICustomerProfileDetailsResponse } from '../interfaces/response/customerProfileDetails';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    private apiUrl = `${environment.apiUrl}/customer`;

    constructor(private http: HttpClient) { }

    getCustomerDetails(userId: number): Observable<ApiResponse> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.get<ICustomerProfileDetailsResponse>(`${this.apiUrl}/details/profile-page/${userId}`, { headers }).pipe(
            map(data => {
                return {
                    statusCode: 200,
                    message: 'Data fetched successfully',
                    success: true,
                    data: data,
                };
            })
        );
    }
}
