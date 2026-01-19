import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITrackingResponse } from '../../../core/interfaces/response/trackingResponse';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookingService } from '../../../core/service/booking.service';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';

@Component({
    selector: 'app-tracking',
    standalone: true,
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.css'],
    imports: [OfficerLayoutComponent, FormsModule, DatePipe],
})
export class OfficerTrackingComponent implements OnInit {
    bookingId = '';

    isSearching = signal(false);
    hasSearched = signal(false);
    notFound = signal(false);

    trackingData = signal<ITrackingResponse | null>(null);

    constructor(
        private route: ActivatedRoute,
        private bookingService: BookingService
    ) { }

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

        this.bookingService.getTrackingDetails(bookingId.trim()).subscribe({
            next: (response) => {
                this.isSearching.set(false);
                if (response && response.success && response.data) {
                    this.trackingData.set(response.data as ITrackingResponse);
                    this.notFound.set(false);
                } else {
                    this.notFound.set(true);
                    this.trackingData.set(null);
                }
            },
            error: (error) => {
                this.isSearching.set(false);
                console.error('Error fetching tracking details:', error);
                this.notFound.set(true);
                this.trackingData.set(null);
            }
        });
    }

    resetSearch(): void {
        this.bookingId = '';
        this.trackingData.set(null);
        this.hasSearched.set(false);
        this.notFound.set(false);
        this.isSearching.set(false);
    }
}
