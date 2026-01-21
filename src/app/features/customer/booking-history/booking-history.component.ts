import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { Router } from '@angular/router';
import { AuthService, IUserDetails } from '../../../core/service/auth.service';
import { BookingService } from '../../../core/service/booking.service';
import { IBookingList } from '../../../core/interfaces/response/bookingList';
import { EBookingStatus } from '../../../core/enums/EBookingStatus';

import { FeedbackService } from '../../../core/service/feedback.service';

@Component({
    selector: 'app-booking-history',
    standalone: true,
    imports: [CommonModule, CustomerLayoutComponent, FormsModule],
    templateUrl: './booking-history.component.html',
    styleUrl: './booking-history.component.css',
})
export class BookingHistoryComponent implements OnInit {
    allBookings: IBookingList[] = [];
    displayedBookings: IBookingList[] = [];
    downloadBookings: IBookingList[] = [];

    filterBookingId: string = '';
    filterDate: string = '';
    filterStatus: string = '';

    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 1;

    isFeedbackModalOpen: boolean = false;
    selectedBooking: IBookingList | null = null;
    feedbackRating: number = 0;
    feedbackSuggestion: string = '';
    feedbackError: string = '';
    feedbackSuccess: string = '';

    deliveredStatus: EBookingStatus = EBookingStatus.DELIVERED;
    cancelledStatus: EBookingStatus = EBookingStatus.CANCELLED;

    openMenuId: string | null = null;

    constructor(
        private router: Router,
        private bookingService: BookingService,
        private authService: AuthService,
        private feedbackService: FeedbackService
    ) {}

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings() {
        this.bookingService
            .getAllBookings(
                this.filterStatus,
                this.filterBookingId, // bookingKeyword? Service has bookingKeyword param?
                this.filterDate,
                this.currentPage - 1, // API is 0-indexed
                this.itemsPerPage
            )
            .subscribe({
                next: (response: any) => {
                    if (response.success && response.data) {
                        this.allBookings = response.data as IBookingList[]; // This is actually the current page items
                        this.displayedBookings = this.allBookings; // Since it's paginated server-side
                        this.downloadBookings = this.allBookings; // For now, download current page. Ideally fetch all for download.

                        this.totalPages = response.totalPages;
                        if (this.totalPages === 0) this.totalPages = 1;
                    } else {
                        console.error(
                            'Failed to load bookings:',
                            response.message
                        );
                    }
                },
                error: (err: any) => {
                    console.error('Error loading bookings:', err);
                },
            });
    }

    onFilterChange() {
        this.currentPage = 1;
        this.loadBookings();
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadBookings();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadBookings();
        }
    }

    downloadExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            this.downloadBookings
        );
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
        XLSX.writeFile(wb, 'bookings.xlsx');
    }

    downloadPDF() {
        const doc = new jsPDF();
        const head = [
            [
                'Customer ID',
                'Booking ID',
                'Date',
                'Receiver',
                'Address',
                'Amount',
                'Status',
            ],
        ];
        const data = this.downloadBookings.map((b) => [
            this.getCustomerId(),
            b.trakingId,
            b.bookingDate,
            b.receiverName,
            b.deliveryAddress,
            b.amount,
            b.bookingStatus,
        ]);

        autoTable(doc, {
            head: head,
            body: data,
        });

        doc.save('bookings.pdf');
    }

    get showDownloadOptions(): boolean {
        return this.allBookings.length > 10;
    }

    openFeedbackModal(booking: IBookingList) {
        this.selectedBooking = booking;
        this.feedbackRating = 0;
        this.feedbackSuggestion = '';
        this.feedbackError = '';
        this.feedbackSuccess = '';
        this.isFeedbackModalOpen = true;
    }

    closeFeedbackModal() {
        this.isFeedbackModalOpen = false;
        this.selectedBooking = null;
    }

    setRating(rating: number) {
        this.feedbackRating = rating;
    }

    submitFeedback() {
        if (!this.selectedBooking) return;

        if (this.feedbackRating === 0) {
            this.feedbackError = 'Please select a star rating.';
            return;
        }

        const feedbackData = {
            rating: this.feedbackRating,
            suggestion: this.feedbackSuggestion,
        };

        if (this.selectedBooking.hasFeedback) {
            this.feedbackError = 'Feedback already submitted for this booking.';
            return;
        }

        this.feedbackService
            .addFeedback(feedbackData, this.selectedBooking.id)
            .subscribe({
                next: () => {
                    this.selectedBooking!.hasFeedback = true;
                    this.feedbackSuccess = 'Feedback submitted successfully!';

                    setTimeout(() => {
                        this.closeFeedbackModal();
                    }, 1500);
                },
                error: (err: any) => {
                    console.error('Feedback submission error', err);
                    this.feedbackError =
                        'Failed to submit feedback. Please try again.';
                },
            });
    }

    toggleMenu(evt: MouseEvent, id: string) {
        evt.stopPropagation();
        this.openMenuId = this.openMenuId === id ? null : id;
    }

    closeMenu() {
        this.openMenuId = null;
    }

    isPaymentCompleted(booking: IBookingList): boolean {
        if (booking.bookingStatus === 'CANCELLED') {
            return true;
        }

        return booking.isPaid;
    }

    onCancelBooking(booking: IBookingList) {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        this.bookingService.cancelBooking(booking.trakingId).subscribe({
            next: (response) => {
                if (response.success) {
                    alert('Booking cancelled successfully');
                    booking.bookingStatus = EBookingStatus.CANCELLED;
                    this.closeMenu();
                } else {
                    alert('Failed to cancel booking: ' + response.message);
                }
            },
            error: (err) => {
                console.error('Cancellation failed:', err);
                alert('Cancellation failed. Please try again.');
            },
        });
    }

    onPayBill(booking: IBookingList) {
        console.log('Initiating payment flow for Booking:', booking.trakingId);

        setTimeout(() => {
            this.router.navigate(['/customer/pay-bill'], {
                state: { bookingId: booking.trakingId, amount: booking.amount },
            });
        }, 500);
    }

    onDownloadInvoice(booking: IBookingList) {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Parcel Invoice', 14, 18);

        doc.setFontSize(12);
        const lines = [
            `Booking ID: ${booking.trakingId}`,
            `Customer ID: ${this.getCustomerId()}`,
            `Date: ${booking.bookingDate}`,
            `Receiver: ${booking.receiverName}`,
            `Address: ${booking.deliveryAddress}`,
            `Amount: Rs. ${booking.amount}`,
            `Status: ${booking.bookingStatus}`,
            `Payment: ${booking.isPaid ? 'Paid' : 'Pending'}`,
        ];

        let y = 26;
        lines.forEach((l) => {
            doc.text(l, 14, y);
            y += 6;
        });

        autoTable(doc, {
            startY: y + 4,
            head: [
                [
                    'Customer ID',
                    'Booking ID',
                    'Date',
                    'Receiver',
                    'Address',
                    'Amount',
                    'Status',
                ],
            ],
            body: [
                [
                    this.getCustomerId(),
                    booking.trakingId,
                    booking.bookingDate,
                    booking.receiverName,
                    booking.deliveryAddress,
                    booking.amount.toString(),
                    booking.bookingStatus,
                ],
            ],
        });

        doc.save(`invoice_${booking.trakingId}.pdf`);
        this.closeMenu();
    }

    onViewBookingDetails(booking: IBookingList) {
        this.router.navigateByUrl(
            `/customer/tracking?bookingId=${booking.trakingId}`
        );
        this.closeMenu();
    }

    private getCustomerId(): number {
        const userDetails = this.authService.getUserDetails();
        return (userDetails.data as IUserDetails)?.id || 0;
    }
}
