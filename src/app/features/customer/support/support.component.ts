import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { BookingService } from '../../../core/service/booking.service';
import {
    SupportService,
    ISupportTicket,
} from '../../../core/service/support.service';

@Component({
    selector: 'app-support',
    standalone: true,
    imports: [CustomerLayoutComponent, CommonModule, ReactiveFormsModule],
    templateUrl: './support.component.html',
    styleUrl: './support.component.css',
})
export class SupportComponent {
    errorMsg: String = '';
    private fb = inject(FormBuilder);
    private bookingService = inject(BookingService);
    private supportService = inject(SupportService);

    companyEmail = 'shipin@gmail.com';
    supportPhone = '+91 98765 43210';
    workingDays = 'Mon – Sat';
    workingHours = '9:00 AM – 6:00 PM';

    activeModal: 'register' | 'track' | null = null;
    isSuccess = false;
    isError = false;
    generatedTicketId: string | null = null;
    trackedTicket: ISupportTicket | null = null;
    trackError = '';

    complaintForm = this.fb.group({
        bookingId: ['', Validators.required],
        title: [
            '',
            [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100),
            ],
        ],
        description: [
            '',
            [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(1000),
            ],
        ],
    });

    trackingForm = this.fb.group({
        ticketId: ['', Validators.required],
    });

    openModal(type: 'register' | 'track') {
        this.activeModal = type;
        this.resetState();
    }

    closeModal() {
        this.activeModal = null;
    }

    onRegister() {
        console.log(this.complaintForm.value);
        if (this.complaintForm.invalid) return;
        const { bookingId, title, description } = this.complaintForm.value;

        this.supportService
            .createTicket(
                { title: title!, description: description! },
                bookingId!
            )
            .subscribe({
                next: (ticketId: string) => {
                    this.generatedTicketId = ticketId;
                    this.isSuccess = true;
                    this.isError = false;
                },
                error: (err) => {
                    console.error(
                        'In frontend Ticket creation failed',
                        err.message
                    );
                    this.isError = true;
                    this.isSuccess = false;
                    this.errorMsg = err.message;
                },
            });
    }

    onTrack() {
        if (this.trackingForm.invalid) return;
        this.supportService
            .getTicket(this.trackingForm.value.ticketId!)
            .subscribe({
                next: (ticket: ISupportTicket) => {
                    this.trackedTicket = ticket;
                    this.trackError = '';
                },
                error: () => {
                    this.trackedTicket = null;
                    this.trackError = 'Ticket ID not found';
                },
            });
    }

    private resetState() {
        this.isSuccess = false;
        this.isError = false;
        this.generatedTicketId = null;
        this.trackedTicket = null;
        this.trackError = '';
        this.complaintForm.reset();
        this.trackingForm.reset();
    }
}
