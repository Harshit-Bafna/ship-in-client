import { Injectable } from '@angular/core';
import { ISupportTicketRequest } from '../interfaces/request/supportTicketRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ISupportTicket extends ISupportTicketRequest {
    ticketId: string;
    bookingId: string;
    status: 'Open' | 'Closed';
    createdAt: Date;
    response?: string;
}

@Injectable({
    providedIn: 'root',
})
export class SupportService {
    private apiUrl = `${environment.apiUrl}/support`;

    constructor(private http: HttpClient) {}

    createTicket(
        request: ISupportTicketRequest,
        bookingId: string
    ): Observable<string> {
        return this.http
            .post<number>(`${this.apiUrl}/raise/${bookingId}`, request)
            .pipe(
                map((response: any) => {
                    return response.toString();
                })
            );
    }

    getTicket(ticketId: string): Observable<ISupportTicket> {
        return this.http.get<any>(`${this.apiUrl}/${ticketId}`).pipe(
            map((data: any) => {
                return {
                    ticketId: data.ticketId.toString(),
                    bookingId: data.bookingId,
                    title: data.title,
                    description: data.description,
                    status: data.response ? 'Closed' : 'Open',
                    createdAt: data.createdAt
                        ? new Date(data.createdAt)
                        : new Date(),
                    response: data.response,
                } as ISupportTicket;
            })
        );
    }

    getAllTickets(): Observable<ISupportTicket> {
        return this.http.get<any>(`${this.apiUrl}/all`);
    }

    cancelTicket(
        ticketId: String,
        ticketData: { response: string }
    ): Observable<ISupportTicket> {
        console.log('here');

        const data = this.http.put<any>(
            `${this.apiUrl}/close/${ticketId}`,
            ticketData
        );

        console.log(data);

        return data;
    }
}
