import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/ApiResponse';

export interface IPickupTimeRequest {
    pickupTime: string; // ISO String
}

export interface IDropoffTimeRequest {
    dropoffTime: string; // ISO String
}

@Injectable({
    providedIn: 'root',
})
export class OfficerService {
    private apiUrl = `${environment.apiUrl}/booking`;

    constructor(private http: HttpClient) {}

    getBookingHistory(
        bookingStatus: string = '',
        bookingKeyword: string = '',
        customerKeyword: string = '',
        date: string = '',
        page: number = 0,
        size: number = 10
    ): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (bookingStatus) params = params.set('bookingStatus', bookingStatus);
        if (bookingKeyword)
            params = params.set('bookingKeyword', bookingKeyword);
        if (customerKeyword)
            params = params.set('customerKeyword', customerKeyword);
        if (date) params = params.set('date', date);

        return this.http
            .get<any>(`${this.apiUrl}/history/officer`, { params })
            .pipe(
                map((response: any) => {
                    return {
                        statusCode: 200,
                        success: true,
                        data: response.content,
                        totalPages: response.totalPages,
                        totalElements: response.totalElements,
                    };
                })
            );
    }

    setPickupTime(bookingId: string, pickupTime: string): Observable<string> {
        return this.http.patch(
            `${this.apiUrl}/set/pickUp-time/${bookingId}`,
            { pickupTime },
            { responseType: 'text' }
        );
    }

    setDropoffTime(bookingId: string, dropoffTime: string): Observable<string> {
        return this.http.patch(
            `${this.apiUrl}/set/dropoff-time/${bookingId}`,
            { dropoffTime },
            { responseType: 'text' }
        );
    }

    markInTransit(bookingId: string): Observable<string> {
        return this.http.patch(
            `${this.apiUrl}/${bookingId}/in-transit`,
            {},
            { responseType: 'text' }
        );
    }

    markOutForDelivery(bookingId: string): Observable<string> {
        return this.http.patch(
            `${this.apiUrl}/${bookingId}/out-for-delivery`,
            {},
            { responseType: 'text' }
        );
    }

    cancelBooking(bookingId: string): Observable<string> {
        return this.http.patch(
            `${this.apiUrl}/${bookingId}/cancel`,
            {},
            { responseType: 'text' }
        );
    }

    markDeliveryFailed(bookingId: string): Observable<string> {
        return this.http.patch(
            `${this.apiUrl}/${bookingId}/failed-delivery`,
            {},
            { responseType: 'text' }
        );
    }
}
