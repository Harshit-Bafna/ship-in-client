import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, IUserDetails } from '../../../core/service/auth.service';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';
import { ApplicationService } from '../../../core/service/application.service';
import { IOfficerAnalyticsData } from '../../../core/interfaces/response/customerAnalytics';

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

    constructor(
        private router: Router,
        private authService: AuthService,
        private applicationService: ApplicationService
    ) {}

    ngOnInit(): void {
        this.user.set(this.authService.getUserDetails().data as IUserDetails);
        console.log(this.user());
        console.log(this.user()?.id);
        this.userName.set(this.user()?.name || '');
        this.loadData();
    }

    async loadData(): Promise<void> {
        this.isLoading.set(true);

        const userId = this.user()?.id;
        console.log(userId);
        if (userId) {
            this.applicationService.getOfficerHomeAnalytics(userId).subscribe({
                next: (response: any) => {
                    console.log(response.data);

                    if (response.success) {
                        console.log(response.data);
                        this.analytics.set({
                            totalBookings: response.data.totalBookings,
                            activeShipments: response.data.activeShipments,
                            delivered: response.data.delivered,
                            supportRequests: response.data.cancelRequests,
                            rating: response.data.rating ?? 0,
                        });
                    }
                    this.isLoading.set(false);
                },
                error: (error: any) => {
                    console.error('Error fetching analytics:', error);
                    this.isLoading.set(false);
                },
            });
        } else {
            this.isLoading.set(false);
        }

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
