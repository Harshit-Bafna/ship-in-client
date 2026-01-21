import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ParcelFeedbackRequest {
    rating: number;
    suggestion: string;
}

export interface ParcelFeedbackResponse {
    bookingId: number;
    rating: number;
    suggestion: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = `${environment.apiUrl}/feedback`;

    constructor(private http: HttpClient) { }

    addFeedback(feedbackData: ParcelFeedbackRequest, bookingId: number): Observable<string> {
        return this.http.post(`${this.apiUrl}/${bookingId}`, feedbackData, { responseType: 'text' });
    }

    getFeedback(bookingId: number): Observable<ParcelFeedbackResponse> {
        return this.http.get<ParcelFeedbackResponse>(`${this.apiUrl}/${bookingId}`);
    }
}
