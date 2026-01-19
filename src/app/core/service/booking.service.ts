import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EBookingStatus } from '../enums/EBookingStatus';
import { ITrackingResponse } from '../interfaces/response/trackingResponse';
import { ApiResponse } from '../interfaces/ApiResponse';
import { IBookingList } from '../interfaces/response/bookingList';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BookingParcelRequest } from '../interfaces/request/bookingParcelRequest';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private apiUrl = `${environment.apiUrl}/booking`;
    private trackingUrl = `${environment.apiUrl}/traking`;

    constructor(private http: HttpClient) { }

    getTrackingDetails(bookingId: string): Observable<ApiResponse> {
        return this.http.get<any>(`${this.trackingUrl}/${bookingId}`).pipe(
            map(backendData => {
                // Map backend DTO (with typos) to frontend interface
                const trackingData: ITrackingResponse = {
                    id: 0, // Placeholder, backend main DTO doesn't have ID
                    bookingId: backendData.parcelDeatils?.bookingId || bookingId,
                    trackingId: backendData.parcelDeatils?.bookingId || bookingId, // Use bookingId as trackingId for now
                    currentStatus: backendData.parcelDeatils?.bookingStatus,
                    currentLocation: '', // Backend doesn't seem to provide current location directly
                    estimatedDeliveryDate: new Date(), // Placeholder
                    progressPercentage: this.calculateProgress(backendData.parcelDeatils?.bookingStatus),

                    senderDetails: backendData.senderDetails,
                    receiverDetails: backendData.recieverDetails, // Fix typo
                    parcelDetails: {
                        ...backendData.parcelDeatils,
                        weightInGrams: backendData.parcelDeatils?.weight, // Map weight
                        estimatedDeliveryDate: new Date(), // Placeholder
                        estimatedPickupDate: new Date() // Placeholder
                    },
                    paymentDetails: {
                        ...backendData.paymentDetails,
                        paymentStatus: backendData.paymentDetails?.paymentStatus || 'Pending', // Ensure enum/string match
                        // Backend payment details might need more mapping if structure differs significantly
                        id: 0, // Placeholder
                        transactionId: '', // Placeholder
                        baseRate: 0,
                        packagingRate: 0,
                        adminFee: 0,
                        weightCharge: 0,
                        deliveryCharge: 0,
                        taxAmount: 0,
                        finalAmount: backendData.paymentDetails?.amount || 0,
                    },
                    statusHistory: backendData.history ? backendData.history.map((h: any) => ({
                        label: h.status,
                        timestamp: h.dateTime,
                        description: h.description || '',
                        completed: true // Assumption
                    })) : []
                };

                return {
                    statusCode: 200,
                    success: true,
                    message: 'Tracking details fetched successfully',
                    data: trackingData
                };
            })
        );
    }

    private calculateProgress(status: EBookingStatus): number {
        switch (status) {
            case EBookingStatus.BOOKED: return 25;
            case EBookingStatus.PICKED_UP: return 50;
            case EBookingStatus.IN_TRANSIT: return 75;
            case EBookingStatus.OUT_FOR_DELIVERY: return 90;
            case EBookingStatus.DELIVERED: return 100;
            default: return 0;
        }
    }

    getAllBookings(
        bookingStatus: string = '',
        bookingKeyword: string = '',
        date: string = '',
        page: number = 0,
        size: number = 10
    ): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (bookingStatus) params = params.set('bookingStatus', bookingStatus);
        if (bookingKeyword) params = params.set('bookingKeyword', bookingKeyword);
        if (date) params = params.set('date', date);

        return this.http.get<any>(`${this.apiUrl}/history/customer`, { params }).pipe(
            map(pageData => {
                // Map Page<BookingHistoryCustomerResponseDto> content to IBookingList[]
                const mappedContent: IBookingList[] = pageData.content.map((item: any) => ({
                    id: item.id,
                    trakingId: item.trakingId,
                    bookingDate: item.bookingDate,
                    receiverName: item.receiverName,
                    deliveryAddress: item.deliveryAddress,
                    amount: item.amount,
                    bookingStatus: item.bookingStatus,
                    isPaid: item.isPaid,
                    hasFeedback: false
                }));

                return {
                    statusCode: 200,
                    success: true,
                    message: 'All bookings fetched successfully',
                    data: mappedContent,
                    // Pass pagination metadata if component needs it
                    totalPages: pageData.totalPages,
                    totalElements: pageData.totalElements
                };
            })
        );
    }

    createBooking(bookingData: BookingParcelRequest): Observable<ApiResponse> {
        return this.http.post<any>(`${this.apiUrl}/create/customer`, bookingData).pipe(
            map(response => ({
                statusCode: 201,
                success: true,
                message: 'Booking created successfully',
                data: response // This contains { bookingId: "BOOK-...", id: 123 }
            }))
        );
    }
}
