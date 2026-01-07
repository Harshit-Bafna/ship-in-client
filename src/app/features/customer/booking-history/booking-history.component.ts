import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent, BadgeVariant } from '../../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

type BookingStatus = 'delivered' | 'in-transit' | 'pending' | 'cancelled';

interface Booking {
    id: string;
    bookingNumber: string;
    origin: string;
    destination: string;
    date: Date;
    status: BookingStatus;
    weight: string;
    cost: number;
}

@Component({
    selector: 'app-booking-history',
    standalone: true,
    imports: [
        CommonModule,
        CustomerLayoutComponent,
        CardComponent,
        BadgeComponent,
        SkeletonComponent,
    ],
    templateUrl: './booking-history.component.html',
    styleUrl: './booking-history.component.css',
})
export class BookingHistoryComponent implements OnInit {
    isLoading = signal(true);
    selectedFilter = signal<BookingStatus | 'all'>('all');
    bookings = signal<Booking[]>([]);

    filteredBookings = computed(() => {
        const filter = this.selectedFilter();
        if (filter === 'all') {
            return this.bookings();
        }
        return this.bookings().filter((booking) => booking.status === filter);
    });

    stats = computed(() => {
        const bookings = this.bookings();
        return {
            total: bookings.length,
            delivered: bookings.filter((b) => b.status === 'delivered').length,
            inTransit: bookings.filter((b) => b.status === 'in-transit').length,
            pending: bookings.filter((b) => b.status === 'pending').length,
        };
    });

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.loadBookings();
    }

    async loadBookings(): Promise<void> {
        this.isLoading.set(true);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        this.bookings.set([
            {
                id: '1',
                bookingNumber: 'BK1028',
                origin: 'Mumbai, India',
                destination: 'Delhi, India',
                date: new Date('2024-01-05'),
                status: 'delivered',
                weight: '25 kg',
                cost: 1250,
            },
            {
                id: '2',
                bookingNumber: 'BK1021',
                origin: 'Pune, India',
                destination: 'Bangalore, India',
                date: new Date('2024-01-08'),
                status: 'in-transit',
                weight: '15 kg',
                cost: 980,
            },
            {
                id: '3',
                bookingNumber: 'BK1015',
                origin: 'Chennai, India',
                destination: 'Kolkata, India',
                date: new Date('2024-01-03'),
                status: 'delivered',
                weight: '30 kg',
                cost: 1580,
            },
            {
                id: '4',
                bookingNumber: 'BK1009',
                origin: 'Hyderabad, India',
                destination: 'Mumbai, India',
                date: new Date('2024-01-07'),
                status: 'in-transit',
                weight: '20 kg',
                cost: 1120,
            },
            {
                id: '5',
                bookingNumber: 'BK1005',
                origin: 'Delhi, India',
                destination: 'Jaipur, India',
                date: new Date('2023-12-28'),
                status: 'delivered',
                weight: '18 kg',
                cost: 750,
            },
            {
                id: '6',
                bookingNumber: 'BK0998',
                origin: 'Ahmedabad, India',
                destination: 'Surat, India',
                date: new Date('2024-01-06'),
                status: 'pending',
                weight: '12 kg',
                cost: 450,
            },
            {
                id: '7',
                bookingNumber: 'BK0987',
                origin: 'Lucknow, India',
                destination: 'Varanasi, India',
                date: new Date('2023-12-20'),
                status: 'cancelled',
                weight: '22 kg',
                cost: 890,
            },
            {
                id: '8',
                bookingNumber: 'BK0975',
                origin: 'Kochi, India',
                destination: 'Trivandrum, India',
                date: new Date('2023-12-15'),
                status: 'delivered',
                weight: '28 kg',
                cost: 1340,
            },
        ]);

        this.isLoading.set(false);
    }

    getStatusBadgeVariant(
        status: BookingStatus
    ): BadgeVariant {
        const variants = {
            delivered: 'success' as const,
            'in-transit': 'primary' as const,
            pending: 'warning' as const,
            cancelled: 'destructive' as const,
        };
        return variants[status] as BadgeVariant;
    }

    getStatusLabel(status: BookingStatus): string {
        const labels = {
            delivered: 'Delivered',
            'in-transit': 'In Transit',
            pending: 'Pending',
            cancelled: 'Cancelled',
        };
        return labels[status];
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    }

    setFilter(filter: BookingStatus | 'all'): void {
        this.selectedFilter.set(filter);
    }

    viewBookingDetails(bookingId: string): void {
        this.router.navigate(['/booking', bookingId]);
    }
}
