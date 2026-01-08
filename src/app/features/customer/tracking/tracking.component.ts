import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITrackingResponse } from '../../../core/interfaces/response/trackingResponse';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../../core/service/booking.service';

@Component({
    selector: 'app-tracking',
    standalone: true,
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.css'],
    imports: [CustomerLayoutComponent, FormsModule, DatePipe],
})
export class CustomerTrackingComponent implements OnInit {
    bookingId = '';

    isSearching = signal(false);
    hasSearched = signal(false);
    notFound = signal(false);

    trackingData = signal<ITrackingResponse | null>(null);

    constructor(
        private route: ActivatedRoute,
        private bookingService: BookingService
    ) {}

    ngOnInit(): void {
        const queryId = this.route.snapshot.queryParamMap.get('bookingId');
        if (queryId) {
            this.bookingId = queryId;
            this.searchTracking(this.bookingId);
        }
    }

    searchTracking(bookingId: string): void {
        if (!bookingId || !bookingId.trim()) {
            this.notFound.set(true);
            this.trackingData.set(null);
            return;
        }

        this.isSearching.set(true);
        this.hasSearched.set(true);
        this.notFound.set(false);
        this.trackingData.set(null);

        setTimeout(() => {
            try {
                const response = this.bookingService.getTrackingDetails(
                    bookingId.trim()
                );

                if (!response || !response.success || !response.data) {
                    this.notFound.set(true);
                    this.trackingData.set(null);
                } else {
                    const trackingData = response.data as ITrackingResponse;
                    this.trackingData.set(trackingData);
                    this.notFound.set(false);
                }
            } catch (error) {
                console.error('Error fetching tracking details:', error);
                this.notFound.set(true);
                this.trackingData.set(null);
            } finally {
                this.isSearching.set(false);
            }
        }, 800);
    }

    resetSearch(): void {
        this.bookingId = '';
        this.trackingData.set(null);
        this.hasSearched.set(false);
        this.notFound.set(false);
        this.isSearching.set(false);
    }
}
