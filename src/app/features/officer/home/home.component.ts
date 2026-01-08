import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, IUserDetails } from '../../../core/service/auth.service';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';

interface AnalyticsData {
    totalBookings: number;
    activeShipments: number;
    delivered: number;
    supportRequests: number;
    rating: number;
}

@Component({
    selector: 'app-officers',
    imports: [OfficerLayoutComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class OfficerHomeComponent implements OnInit {
    officerRating = signal<string>('');

    user = signal<IUserDetails | null>(null);
    userName = signal('');
    isLoading = signal(true);

    analytics = signal<AnalyticsData>({
        totalBookings: 0,
        activeShipments: 0,
        delivered: 0,
        supportRequests: 0,
        rating: 0,
    });

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.loadData();
        this.user.set(this.authService.getUserDetails().data as IUserDetails);
        this.userName.set(this.user()?.name || '');
    }

    async loadData(): Promise<void> {
        this.isLoading.set(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.analytics.set({
            totalBookings: 128,
            activeShipments: 5,
            delivered: 119,
            supportRequests: 2,
            rating: 2,
        });

        const stars =
            '★'.repeat(this.analytics().rating) +
            '☆'.repeat(5 - this.analytics().rating);
        this.officerRating.set(stars);

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
        this.router.navigate(['officer/new-booking']);
    }

    navigateToTracking(): void {
        this.router.navigate(['/officer/tracking']);
    }

    navigateToHistory(): void {
        this.router.navigate(['/officer/history']);
    }
}
