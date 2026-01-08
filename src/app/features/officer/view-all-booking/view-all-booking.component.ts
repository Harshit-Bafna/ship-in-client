import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';

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
    status: 'Pending' | 'In Process' | 'Delivered' | 'Cancelled';
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

    // Filters
    filterCustomerId = '';
    filterBookingId = '';
    filterDate = '';
    filterStatus = '';

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;
    totalPages = 1;

    ngOnInit(): void {
        this.loadMockData();
        this.applyFilters();
    }

    loadMockData() {
        const statuses: Booking['status'][] = [
            'Pending',
            'In Process',
            'Delivered',
            'Cancelled',
        ];

        for (let i = 1; i <= 55; i++) {
            this.allBookings.push({
                customerId: `CUST-${1000 + i}`,
                customerName: `Customer ${i}`,
                bookingId: `BK-${2025000 + i}`,
                bookingDate: this.randomDate(),
                receiverName: `Receiver ${i}`,
                deliveredAddress: `${i} Main St, City ${i}`,
                amount: Math.floor(Math.random() * 500) + 100,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                feedback:
                    Math.random() > 0.6
                        ? {
                              rating: Math.floor(Math.random() * 5) + 1,
                              comment: 'Good service',
                          }
                        : undefined,
            });
        }
    }

    randomDate(): string {
        const start = new Date(2024, 0, 1).getTime();
        const end = new Date().getTime();
        return new Date(start + Math.random() * (end - start))
            .toISOString()
            .split('T')[0];
    }

    applyFilters() {
        let temp = [...this.allBookings];

        // Sort DESC by booking date
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

    onStatusChange(booking: Booking) {
        if (booking.status === 'Cancelled') {
            console.log(`Booking ${booking.bookingId} cancelled`);
        }
    }

    viewFeedback(booking: Booking) {
        if (!booking.feedback) return;
        alert(
            `Rating: ${booking.feedback.rating}\nComment: ${booking.feedback.comment}`
        );
    }

    downloadExcel() {
        const ws = XLSX.utils.json_to_sheet(this.downloadBookings);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
        XLSX.writeFile(wb, 'all-bookings.xlsx');
    }

    downloadPDF() {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [
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
            ],
            body: this.downloadBookings.map((b) => [
                b.customerId,
                b.customerName,
                b.bookingId,
                b.bookingDate,
                b.receiverName,
                b.deliveredAddress,
                b.amount,
                b.status,
            ]),
        });
        doc.save('all-bookings.pdf');
    }

    get showDownloadOptions(): boolean {
        return this.allBookings.length > 10;
    }
}
