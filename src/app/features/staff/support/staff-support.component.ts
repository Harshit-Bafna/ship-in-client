import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportLayoutComponent } from '../../../layout/main-layout/support-layout/support-layout.component';
import { SupportService } from '../../../core/service/support.service';

interface IStaffTicket {
    ticketId: string;
    bookingId: string;
    title: string;
    description: string;
    status: 'OPEN' | 'CLOSED' | 'Open' | 'Closed';
    officerRemark?: string;
    closedAt?: Date;
}

@Component({
    selector: 'app-staff-support',
    standalone: true,
    imports: [CommonModule, FormsModule, SupportLayoutComponent],
    templateUrl: './staff-support.component.html',
    styleUrl: './staff-support.component.css',
})
export class StaffSupportComponent implements OnInit {
    // Dummy Data

    tickets: IStaffTicket[] = [
        {
            ticketId: 'TKT-1001',
            bookingId: 'BOOK-001',
            title: 'Package Damaged',
            description: 'The box was crushed on arrival.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1002',
            bookingId: 'BOOK-005',
            title: 'Delayed Delivery',
            description: 'Arrived 2 days late.',
            status: 'CLOSED',
            officerRemark: 'Refund processed',
            closedAt: new Date('2024-01-15'),
        },
        {
            ticketId: 'TKT-1003',
            bookingId: 'BOOK-012',
            title: 'Wrong Item',
            description: 'Received shoes instead of shirt.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1004',
            bookingId: 'BOOK-020',
            title: 'Tracking Issue',
            description: 'Tracking not updating.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1005',
            bookingId: 'BOOK-025',
            title: 'Rude Driver',
            description: 'Driver was rude.',
            status: 'CLOSED',
            officerRemark: 'Warning issued to driver',
            closedAt: new Date('2023-12-20'),
        },
        {
            ticketId: 'TKT-1006',
            bookingId: 'BOOK-030',
            title: 'Lost Package',
            description: 'Package never arrived.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1007',
            bookingId: 'BOOK-033',
            title: 'Package Wet',
            description: 'The box was wet.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1008',
            bookingId: 'BOOK-040',
            title: 'Wrong Address',
            description: 'Delivered to neighbor.',
            status: 'CLOSED',
            officerRemark: 'Apology email sent',
            closedAt: new Date('2023-11-05'),
        },
        {
            ticketId: 'TKT-1009',
            bookingId: 'BOOK-045',
            title: 'Late Pickup',
            description: 'Pickup person came late.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1010',
            bookingId: 'BOOK-050',
            title: 'Wrong Bill',
            description: 'Charged extra.',
            status: 'OPEN',
        },
        {
            ticketId: 'TKT-1011',
            bookingId: 'BOOK-055',
            title: 'System Error',
            description: 'Cannot login.',
            status: 'CLOSED',
            officerRemark: 'Reset password',
            closedAt: new Date('2023-10-10'),
        },
        {
            ticketId: 'TKT-1012',
            bookingId: 'BOOK-060',
            title: 'App Crash',
            description: 'App closes on open.',
            status: 'OPEN',
        },
    ];

    displayedTickets: IStaffTicket[] = [];

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    // Modal
    activeModal: 'close' | 'view' | null = null;
    selectedTicket: IStaffTicket | null = null;
    officerRemark = '';
    supportService = inject(SupportService);

    ngOnInit() {
        this.getTickets();
        // this.updateDisplayedTickets();
    }

    getTickets() {
        this.supportService.getAllTickets().subscribe({
            next: (response: any) => {
                response.forEach((a: any) => {
                    this.tickets.push(a);
                });
                this.updateDisplayedTickets();
            },
            error: (err: any) => {
                console.error('Error loading bookings:', err);
            },
        });
    }

    updateDisplayedTickets() {
        this.totalPages = Math.ceil(this.tickets.length / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        // console.log(this.tickets);
        // this.displayedTickets = this.tickets;
        this.displayedTickets = this.tickets.slice(
            startIndex,
            startIndex + this.pageSize
        );
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedTickets();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedTickets();
        }
    }

    // Actions
    openCloseModal(ticket: IStaffTicket) {
        this.selectedTicket = ticket;
        this.officerRemark = '';
        this.activeModal = 'close';
    }

    confirmClose() {
        if (this.selectedTicket && this.officerRemark.trim()) {
            this.supportService
                .cancelTicket(this.selectedTicket.ticketId, {
                    response: this.officerRemark,
                })
                .subscribe();
            this.selectedTicket.status = 'CLOSED';
            this.selectedTicket.officerRemark = this.officerRemark;
            this.selectedTicket.closedAt = new Date();
            this.closeModal();
        }
    }

    openViewModal(ticket: IStaffTicket) {
        this.selectedTicket = ticket;
        this.activeModal = 'view';
    }

    closeModal() {
        this.activeModal = null;
        this.selectedTicket = null;
    }
}
