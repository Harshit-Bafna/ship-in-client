import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfficerLayoutComponent } from "../../../layout/main-layout/officer-layout/officer-layout.component";

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
    bookings: Booking[] = [
        {
            bookingId: 'BK-1001',
            fullName: 'Ojasi',
            address: 'Pune, MH',
            receiverName: 'Ojasi Lavanya',
            receiverAddress: 'Mumbai, MH',
            bookingDate: '2026-01-08',
            status: 'Pending',
        },
    ];

    searchBookingId = '';
    booking: Booking | null = null;
    pickupTime = '';
    dropoffTime = '';
    message = '';

    search() {
        this.message = '';
        this.booking =
            this.bookings.find((b) => b.bookingId === this.searchBookingId) ||
            null;

        if (!this.booking) {
            this.message = 'Booking not found';
            return;
        }

        this.pickupTime = this.booking.pickupTime || '';
        this.dropoffTime = this.booking.dropoffTime || '';
    }

    save() {
        if (!this.booking) return;

        if (!this.pickupTime || !this.dropoffTime) {
            this.message = 'Pickup & Drop-off time required';
            return;
        }

        if (this.dropoffTime < this.pickupTime) {
            this.message = 'Drop-off cannot be before Pickup';
            return;
        }

        this.booking.pickupTime = this.pickupTime;
        this.booking.dropoffTime = this.dropoffTime;
        this.booking.status = 'In Transit';

        this.message = 'Pickup & Drop-off updated successfully';
    }
}
