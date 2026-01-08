import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { AuthService, IUserDetails } from '../../../core/service/auth.service';
import { ICustomerAnalyticsData } from '../../../core/interfaces/response/customerAnalytics';
import { ApplicationService } from '../../../core/service/application.service';

@Component({
    selector: 'app-customer-home',
    standalone: true,
    imports: [CustomerLayoutComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class CustomerHomeComponent implements OnInit {
    user = signal<IUserDetails | null>(null);
    userName = signal('');
    isLoading = signal(true);

    analytics = signal<ICustomerAnalyticsData>({
        totalBookings: 0,
        activeShipments: 0,
        delivered: 0,
        cancelRequests: 0,
    });

    constructor(
        private router: Router,
        private authService: AuthService,
        private applicationSerice: ApplicationService
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.user.set(this.authService.getUserDetails().data as IUserDetails);
        this.userName.set(this.user()?.name || '');
    }

    async loadData(): Promise<void> {
        this.isLoading.set(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.analytics.set(
            this.applicationSerice.getCustomerHomeAnalytics()
                .data as ICustomerAnalyticsData
        );

        this.isLoading.set(false);
    }

    getUserInitials(): string {
        return this.userName().slice(0, 1);
    }

    navigateToNewBooking(): void {
        this.router.navigate(['/new-booking']);
    }

    navigateToTracking(): void {
        this.router.navigate(['/customer/tracking']);
    }

    navigateToHistory(): void {
        this.router.navigate(['/customer/history']);
    }
}
