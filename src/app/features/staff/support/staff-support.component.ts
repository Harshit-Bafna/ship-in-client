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

    tickets: IStaffTicket[] = [];

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
