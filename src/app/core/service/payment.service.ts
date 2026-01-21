import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ParcelPaymentRequest {
    bookingId: string;
    transactionId: string;
    paymentStatus: string;
    paymentMethod: string;
    cardHolderName: string;
    cardBrand: string;
    last4digits: string;
    expiryDate: string; // YYYY-MM-DD
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payment`;

    constructor(private http: HttpClient) { }

    payForParcel(paymentData: ParcelPaymentRequest): Observable<string> {
        return this.http.post(`${this.apiUrl}/pay`, paymentData, { responseType: 'text' });
    }
}
