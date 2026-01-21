import {
    ICustomerAnalyticsData,
    IOfficerAnalyticsData,
} from './../interfaces/response/customerAnalytics';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/ApiResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ICustomerProfileDetailsResponse } from '../interfaces/response/customerProfileDetails';

@Injectable({
    providedIn: 'root',
})
export class ApplicationService {
    private apiUrl = `${environment.apiUrl}/customer`;

    constructor(private http: HttpClient) {}

    getCustomerHomeAnalytics(customerId: number): Observable<ApiResponse> {
        return this.http
            .get<any>(`${this.apiUrl}/details/home-page/${customerId}`)
            .pipe(
                map((response) => {
                    const analytics: ICustomerAnalyticsData = {
                        totalBookings: response.totalBookings,
                        activeShipments: response.ongoingBookings,
                        delivered: response.completedBookings,
                        cancelRequests: response.cancelledBookings,
                    };
                    console.log(analytics);
                    return {
                        statusCode: 200,
                        success: true,
                        data: analytics,
                        message: 'Customer analytics data fetched successfully',
                    };
                })
            );
    }

    getOfficerHomeAnalytics(officerId: number): Observable<ApiResponse> {
        return this.http
            .get<any>(`${this.apiUrl}/officer/details/home-page/${officerId}`)
            .pipe(
                map((response) => {
                    const analytics: IOfficerAnalyticsData = {
                        totalBookings: response.totalBookings,
                        activeShipments: response.ongoingBookings,
                        delivered: response.completedBookings,
                        cancelRequests: response.cancelledBookings,
                        rating: response.rating,
                    };
                    console.log(analytics);
                    return {
                        statusCode: 200,
                        success: true,
                        data: analytics,
                        message: 'Officer analytics data fetched successfully',
                    };
                })
            );
    }

    getAllCustomers(): Observable<ApiResponse> {
        return this.http.get<any>(`${this.apiUrl}/list`).pipe(
            map((response) => {
                const data1: ICustomerProfileDetailsResponse = {
                    id: response.data.id,
                    userCode: response.data.userCode,
                    name: response.data.name,
                    email: response.data.email,
                    mobileCountryCode: response.data.mobileCountryCode,
                    mobileNumber: response.data.mobileNumber,
                    alternateMobileCountryCode:
                        response.data.alternateMobileCountryCode ?? null,
                    alternateMobileNumber:
                        response.data.alternateMobileNumber ?? null,
                    houseNo: response.data.houseNo,
                    addressLine1: response.data.addressLine1,
                    addressLine2: response.data.addressLine2 ?? null,
                    landmark: response.data.landmark ?? null,
                    city: response.data.city,
                    state: response.data.state,
                    pinCode: response.data.pinCode,
                    country: response.data.country,
                    allowNotifications: response.data.allowNotifications,
                };
                console.log(data1);
                return {
                    statusCode: 200,
                    success: true,
                    data: data1,
                    message: 'Customer analytics data fetched successfully',
                };
            })
        );
    }
}
