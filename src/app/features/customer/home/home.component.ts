import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

interface AnalyticsData {
    totalBookings: number;
    activeShipments: number;
    delivered: number;
    supportRequests: number;
}

interface ActivityItem {
    id: string;
    message: string;
    timestamp: Date;
}

@Component({
    selector: 'app-customer-home',
    standalone: true,
    imports: [
        CommonModule,
        CustomerLayoutComponent,
        CardComponent,
        BadgeComponent,
        AvatarComponent,
        SkeletonComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class CustomerHomeComponent implements OnInit {
    userName = signal('John Doe');
    isLoading = signal(true);

    analytics = signal<AnalyticsData>({
        totalBookings: 0,
        activeShipments: 0,
        delivered: 0,
        supportRequests: 0,
    });

    recentActivities = signal<ActivityItem[]>([]);

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.loadData();
    }

    async loadData(): Promise<void> {
        this.isLoading.set(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.analytics.set({
            totalBookings: 128,
            activeShipments: 5,
            delivered: 119,
            supportRequests: 2,
        });

        this.recentActivities.set([
            {
                id: '1',
                message: 'Booking #BK1021 created',
                timestamp: new Date(),
            },
            {
                id: '2',
                message: 'Shipment #SH778 in transit',
                timestamp: new Date(),
            },
            {
                id: '3',
                message: 'Booking #BK099 delivered',
                timestamp: new Date(),
            },
        ]);

        this.isLoading.set(false);
    }

    getUserInitials(): string {
        return this.userName()
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    navigateToNewBooking(): void {
        this.router.navigate(['/new-booking']);
    }

    navigateToTracking(): void {
        this.router.navigate(['/track']);
    }

    navigateToHistory(): void {
        this.router.navigate(['/history']);
    }

    navigateToProfile(): void {
        this.router.navigate(['/profile']);
    }

    handleLogout(): void {
        console.log('Logout clicked');
        // Implement logout logic
    }
}
