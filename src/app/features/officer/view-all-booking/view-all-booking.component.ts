import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/service/booking.service';
import { EBookingStatus } from '../../../core/enums/EBookingStatus';
import { OfficerService } from '../../../core/service/officer.service';
import { Observable } from 'rxjs';

interface Feedback {
    rating: number;
    comment: string;
}

interface Booking {
    customerId: string;
    customerName: string;
    bookingId: string;
    bookingDate: string;
    receiverName: string;
    deliveredAddress: string;
    amount: number;
    status: EBookingStatus;
    feedback?: Feedback;
}

@Component({
    selector: 'app-view-all-bookings-officer',
    standalone: true,
    imports: [CommonModule, FormsModule, OfficerLayoutComponent],
    templateUrl: './view-all-booking.component.html',
    styleUrls: ['./view-all-booking.component.css'],
})
export class ViewAllBookingsOfficerComponent implements OnInit {
    allBookings: Booking[] = [];
    displayedBookings: Booking[] = [];
    downloadBookings: Booking[] = [];

    filterCustomerId = '';
    filterBookingId = '';
    filterDate = '';
    filterStatus = '';

    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;

    allStatuses: EBookingStatus[] = Object.values(EBookingStatus);

    statusFlow: EBookingStatus[] = [
        EBookingStatus.BOOKED,
        EBookingStatus.IN_TRANSIT,
        EBookingStatus.OUT_FOR_DELIVERY,
    ];

    openMenuId: string | null = null;
    isFeedbackModalOpen = false;
    selectedBooking: Booking | null = null;

    constructor(
        private router: Router,
        private bookingService: BookingService,
        private officerService: OfficerService
    ) {}

    ngOnInit(): void {
        this.officerService.getBookingHistory().subscribe((response) => {
            if (response.success && response.data) {
                this.allBookings = response.data.map((booking: any) => ({
                    customerId: booking.username,
                    customerName: booking.customerName || 'Customer',
                    bookingId: booking.trakingId,
                    bookingDate: booking.bookingDate,
                    receiverName: booking.receiverName,
                    deliveredAddress: booking.deliveryAddress,
                    amount: booking.amount,
                    status: booking.bookingStatus,
                    feedback: booking.feedback
                        ? {
                              rating: booking.feedback.rating,
                              comment: booking.feedback.suggestion,
                          }
                        : undefined,
                }));
                this.applyFilters();
            }
        });
    }

    // ... applyFilters ...

    onStatusChange(booking: Booking) {
        const bookingIdString = booking.bookingId;

        let obs: Observable<string>;

        switch (booking.status) {
            case EBookingStatus.PICKED_UP:
                obs = this.officerService.setPickupTime(
                    bookingIdString,
                    new Date().toISOString()
                );
                break;
            case EBookingStatus.IN_TRANSIT:
                obs = this.officerService.markInTransit(bookingIdString);
                break;
            case EBookingStatus.OUT_FOR_DELIVERY:
                obs = this.officerService.markOutForDelivery(bookingIdString);
                break;
            case EBookingStatus.DELIVERED:
                obs = this.officerService.setDropoffTime(
                    bookingIdString,
                    new Date().toISOString()
                );
                break;
            case EBookingStatus.CANCELLED:
                obs = this.officerService.cancelBooking(bookingIdString);
                break;
            default:
                return;
        }

        obs.subscribe({
            next: (msg: string) => {
                this.applyFilters();
            },
            error: (err: any) => {
                console.error('Status update failed', err);
            },
        });
    }

    applyFilters() {
        let temp = [...this.allBookings];

        temp.sort(
            (a, b) =>
                new Date(b.bookingDate).getTime() -
                new Date(a.bookingDate).getTime()
        );

        if (this.filterCustomerId) {
            temp = temp.filter((b) =>
                b.customerId
                    .toLowerCase()
                    .includes(this.filterCustomerId.toLowerCase())
            );
        }

        if (this.filterBookingId) {
            temp = temp.filter((b) =>
                b.bookingId
                    .toLowerCase()
                    .includes(this.filterBookingId.toLowerCase())
            );
        }

        if (this.filterDate) {
            temp = temp.filter((b) =>
                b.bookingDate.startsWith(this.filterDate)
            );
        }

        if (this.filterStatus) {
            temp = temp.filter((b) => b.status === this.filterStatus);
        }

        this.downloadBookings = temp;
        this.totalPages = Math.ceil(temp.length / this.itemsPerPage) || 1;

        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedBookings = temp.slice(
            startIndex,
            startIndex + this.itemsPerPage
        );
    }

    onFilterChange() {
        this.currentPage = 1;
        this.applyFilters();
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.applyFilters();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.applyFilters();
        }
    }

    getUpcomingStatuses(currentStatus: EBookingStatus): EBookingStatus[] {
        if (
            currentStatus === EBookingStatus.CANCELLED ||
            currentStatus === EBookingStatus.DELIVERED
        ) {
            return [];
        }

        const currentIndex = this.statusFlow.indexOf(currentStatus);
        if (currentIndex === -1) {
            return [];
        }

        const upcomingStatuses = this.statusFlow.slice(currentIndex + 1);

        return [...upcomingStatuses, EBookingStatus.CANCELLED];
    }

    viewFeedback(booking: Booking) {
        if (!booking.feedback) return;
        this.selectedBooking = booking;
        this.isFeedbackModalOpen = true;
    }

    closeFeedbackModal() {
        this.isFeedbackModalOpen = false;
        this.selectedBooking = null;
    }

    toggleMenu(evt: MouseEvent, id: string) {
        evt.stopPropagation();
        this.openMenuId = this.openMenuId === id ? null : id;
    }

    closeMenu() {
        this.openMenuId = null;
    }

    onViewBookingDetails(booking: Booking) {
        this.router.navigateByUrl(
            `/officer/tracking?bookingId=${booking.bookingId}`
        );
        this.closeMenu();
    }

    downloadExcel() {
        const ws = XLSX.utils.json_to_sheet(this.downloadBookings);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
        XLSX.writeFile(wb, 'all-bookings.xlsx');
    }

    downloadPDF() {
        const doc = new jsPDF();
        const head = [
            [
                'Customer ID',
                'Customer Name',
                'Booking ID',
                'Date',
                'Receiver',
                'Address',
                'Amount',
                'Status',
            ],
        ];
        const data = this.downloadBookings.map((b) => [
            b.customerId,
            b.customerName,
            b.bookingId,
            b.bookingDate,
            b.receiverName,
            b.deliveredAddress,
            b.amount,
            b.status,
        ]);

        autoTable(doc, {
            head: head,
            body: data,
        });

        doc.save('all-bookings.pdf');
    }

    get showDownloadOptions(): boolean {
        return this.allBookings.length > 10;
    }
}
