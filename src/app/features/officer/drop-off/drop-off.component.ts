import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';

@Component({
    selector: 'app-drop-off',
    standalone: true,
    imports: [CommonModule, FormsModule, OfficerLayoutComponent],
    templateUrl: './drop-off.component.html',
    styleUrl: './drop-off.component.css',
})
export class DropOffComponent {
    bookingId = signal('');
    isLoading = signal(false);

    bookingDetails = signal<null | {
        trackingId: string;
        deliveryAddress: string;
    }>(null);

    errorMessage = signal('');
    successMessage = signal('');

    fetchBooking() {
        this.errorMessage.set('');
        this.successMessage.set('');
        this.bookingDetails.set(null);

        if (!this.bookingId()) return;

        this.isLoading.set(true);

        // 🔌 Backend integration point
        setTimeout(() => {
            // ❌ Simulate booking not found
            if (this.bookingId() !== 'BOOK123') {
                this.errorMessage.set(
                    'Booking not found. Please check the Booking ID.',
                );
                this.isLoading.set(false);
                return;
            }

            // ✅ Simulate success
            this.bookingDetails.set({
                trackingId: 'TRK-982347234',
                deliveryAddress: '221B Baker Street, London, UK',
            });

            this.isLoading.set(false);
        }, 1000);
    }

    dropOffParcel() {
        this.errorMessage.set('');
        this.successMessage.set('');

        // 🔌 Backend integration point
        setTimeout(() => {
            this.successMessage.set('Parcel dropped off successfully.');
        }, 500);
    }
}
