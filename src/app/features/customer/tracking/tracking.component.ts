import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { BookingService } from '../../../core/service/booking.service';
import { EBookingStatus } from '../../../core/enums/EBookingStatus';
import { ITrackingResponse } from '../../../core/interfaces/response/trackingResponse';

@Component({
    selector: 'app-tracking',
    standalone: true,
    imports: [CommonModule, CustomerLayoutComponent, FormsModule, DatePipe],
    templateUrl: './tracking.component.html',
    styleUrl: './tracking.component.css',
})
export class CustomerTrackingComponent implements OnInit {
    bookingId = ''; // For NgModel binding in template which might expect a property, lets check template again.
    // Template uses [(ngModel)]="bookingId". So we need a plain property 'bookingId'.

    isSearching = signal(false);
    notFound = signal(false);
    trackingData = signal<ITrackingResponse | null>(null);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const bookingId = params['bookingId'];
            if (bookingId) {
                this.bookingId = bookingId;
                this.searchTracking(bookingId);
            }
        });
    }

    onSearch() { // Template calls searchTracking(bookingId) directly in (click), so this might not be used or needed? 
        // Template: (click)="searchTracking(bookingId)"
        // But there is also a reset button.
    }

    searchTracking(id: string) {
        if (!id || !id.trim()) {
            // this.errorMessage = 'Please enter a valid Booking ID'; // Template handles errors via notFound()?
            return;
        }

        // Update URL to match search
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { bookingId: id },
            queryParamsHandling: 'merge',
        });

        this.isSearching.set(true);
        this.notFound.set(false);
        this.trackingData.set(null);

        this.bookingService.getTrackingDetails(id).subscribe({
            next: (response) => {
                this.isSearching.set(false);
                if (response.success && response.data) {
                    this.trackingData.set(response.data as ITrackingResponse);
                } else {
                    this.notFound.set(true);
                }
            },
            error: (err) => {
                this.isSearching.set(false);
                console.error('Tracking error:', err);
                this.notFound.set(true);
            }
        });
    }

    resetSearch() {
        this.bookingId = '';
        this.trackingData.set(null);
        this.notFound.set(false);
        this.isSearching.set(false);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { bookingId: null },
            queryParamsHandling: 'merge',
        });
    }

    // Template accesses properties on trackingData() directly?
    // Template line 55: trackingData()?.currentStatus
    // We don't need the isDeliveredOrCancelled getter here unless template uses it. 
    // Template doesn't seem to use isDeliveredOrCancelled based on the file view I saw.
}
