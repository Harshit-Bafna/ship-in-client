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
        EBookingStatus.PICKED_UP,
        EBookingStatus.IN_TRANSIT,
        EBookingStatus.OUT_FOR_DELIVERY,
        EBookingStatus.DELIVERED,
    ];

    openMenuId: string | null = null;
    isFeedbackModalOpen = false;
    selectedBooking: Booking | null = null;

    constructor(
        private router: Router,
        private bookingService: BookingService
    ) {}

    ngOnInit(): void {
        const response = this.bookingService.getAllBookings();
        if (response.success && response.data) {
            this.allBookings = response.data.map((booking, index) => ({
                customerId: booking.customerId,
                customerName: `Customer ${index + 1}`, 
                bookingId: booking.bookingId,
                bookingDate: booking.bookingDate,
                receiverName: booking.receiverName,
                deliveredAddress: booking.deliveredAddress,
                amount: booking.amount,
                status: booking.status,
                feedback:
                    Math.random() > 0.6
                        ? {
                              rating: Math.floor(Math.random() * 5) + 1,
                              comment: 'Good service',
                          }
                        : undefined,
            }));
        }
        this.applyFilters();
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
            temp = temp.filter((b) => b.bookingDate === this.filterDate);
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

    onStatusChange(booking: Booking) {
        const payload = {
            bookingId: booking.bookingId,
            customerId: booking.customerId,
            newStatus: booking.status,
        };

        this.applyFilters();
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
