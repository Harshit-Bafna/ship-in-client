import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfficerLayoutComponent } from "../../../layout/main-layout/officer-layout/officer-layout.component";
import { BookingService } from '../../../core/service/booking.service';
import { OfficerService } from '../../../core/service/officer.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

interface Booking {
    bookingId: string;
    fullName: string;
    address: string;
    receiverName: string;
    receiverAddress: string;
    bookingDate: string;
    status: string;
    pickupTime?: string;
    dropoffTime?: string;
}

@Component({
    selector: 'app-pick-up',
    standalone: true,
    imports: [CommonModule, FormsModule, OfficerLayoutComponent],
    templateUrl: './pick-up.component.html',
    styleUrl: './pick-up.component.css',
})
export class PickUpComponent {
    private bookingService = inject(BookingService);
    private officerService = inject(OfficerService);

    bookings: Booking[] = []; // Not used anymore

    searchBookingId = '';
    booking: Booking | null = null;
    pickupTime = '';
    dropoffTime = '';
    message = '';

    search() {
        this.message = '';
        this.booking = null;

        if (!this.searchBookingId) return;

        this.bookingService.getTrackingDetails(this.searchBookingId).subscribe({
            next: (response: any) => {
                const data = response.data;
                if (!data) {
                    this.message = 'Booking not found';
                    return;
                }
                const parcel = data.parcelDetails;
                this.booking = {
                    bookingId: parcel.bookingId,
                    fullName: data.senderDetails?.name || 'Unknown',
                    address: `${data.senderDetails?.houseNo || ''}, ${data.senderDetails?.addressLine1 || ''}, ${data.senderDetails?.city || ''}`,
                    receiverName: data.receiverDetails?.name || '',
                    receiverAddress: `${data.receiverDetails?.houseNo || ''}, ${data.receiverDetails?.addressLine1 || ''}, ${data.receiverDetails?.city || ''}`,
                    bookingDate: parcel.bookingDate,
                    status: parcel.bookingStatus,
                    pickupTime: '', // Not returned by tracking API usually
                    dropoffTime: ''
                };
            },
            error: () => {
                this.message = 'Booking not found';
            }
        });
    }

    save() {
        if (!this.booking) return;

        if (!this.pickupTime && !this.dropoffTime) {
            this.message = 'Please provide Pickup or Drop-off time';
            return;
        }

        if (this.dropoffTime && this.pickupTime && this.dropoffTime < this.pickupTime) {
            this.message = 'Drop-off cannot be before Pickup';
            return;
        }

        if (this.pickupTime) {
            const formattedDate = new Date(this.pickupTime).toISOString();
            this.officerService.setPickupTime(this.booking.bookingId, formattedDate)
                .subscribe({
                    next: (msg: string) => {
                        this.message = 'Pickup & Drop-off updated successfully'; // Unified success message
                        if (this.dropoffTime) {
                            this.officerService.setDropoffTime(this.booking!.bookingId, new Date(this.dropoffTime).toISOString())
                                .subscribe({
                                    next: (msg2: string) => { /* already handled success msg */ },
                                    error: (err: any) => this.message += ' but failed to update dropoff time'
                                });
                        }
                    },
                    error: (err: any) => {
                        this.message = err.error || 'Failed to update pickup time';
                    }
                });
        } else if (this.dropoffTime) {
            this.officerService.setDropoffTime(this.booking.bookingId, new Date(this.dropoffTime).toISOString())
                .subscribe({
                    next: (msg: string) => this.message = 'Pickup & Drop-off updated successfully',
                    error: (err: any) => {
                        this.message = err.error || 'Failed to update dropoff time';
                    }
                });
        }
    }
}
