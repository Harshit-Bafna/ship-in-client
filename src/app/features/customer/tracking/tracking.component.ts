import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
} from '../../../shared/components/card/card.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { DividerComponent } from '../../../shared/components/divider/divider.component';
import { ProgressComponent } from '../../../shared/components/progress/progress.component';
import {
    TableComponent,
    TableColumn,
} from '../../../shared/components/table/table.component';

interface TrackingStatus {
    label: string;
    timestamp: string;
    location: string;
    description: string;
    completed: boolean;
}

interface BookingDetails {
    bookingId: string;
    bookingDate: string;
    estimatedDelivery: string;
    serviceType: string;
    priority: string;
}

interface ParcelDetails {
    weight: string;
    dimensions: string;
    packageType: string;
    quantity: number;
    declaredValue: string;
    insurance: string;
}

interface PaymentDetails {
    amount: string;
    paymentMethod: string;
    paymentStatus: string;
    transactionId: string;
    paymentDate: string;
}

interface PackagingDetails {
    packagingType: string;
    specialHandling: string[];
    fragile: boolean;
    perishable: boolean;
}

interface AddressDetails {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
}

interface TrackingData {
    trackingId: string;
    currentStatus: string;
    statusHistory: TrackingStatus[];
    bookingDetails: BookingDetails;
    parcelDetails: ParcelDetails;
    paymentDetails: PaymentDetails;
    packagingDetails: PackagingDetails;
    senderDetails: AddressDetails;
    receiverDetails: AddressDetails;
    estimatedDeliveryDate: string;
    currentLocation: string;
    progressPercentage: number;
}

interface OngoingParcel {
    trackingId: string;
    currentStatus: string;
    destination: string;
    estimatedDelivery: string;
    lastUpdate: string;
}

@Component({
    selector: 'app-tracking',
    standalone: true,
    imports: [
        CommonModule,
        CustomerLayoutComponent,
        InputComponent,
        ButtonComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardContentComponent,
        AlertComponent,
        BadgeComponent,
        SkeletonComponent,
        SpinnerComponent,
        DividerComponent,
        ProgressComponent,
        TableComponent,
    ],
    templateUrl: './tracking.component.html',
    styleUrl: './tracking.component.css',
})
export class TrackingComponent implements OnInit {
    trackingId = signal<string>('');
    isSearching = signal<boolean>(false);
    isLoadingOngoing = signal<boolean>(true);
    hasSearched = signal<boolean>(false);
    trackingData = signal<TrackingData | null>(null);
    notFound = signal<boolean>(false);
    searchError = signal<string>('');

    ongoingParcels = signal<OngoingParcel[]>([]);

    ongoingTableColumns: TableColumn[] = [
        { key: 'trackingId', label: 'Tracking ID', sortable: true },
        { key: 'currentStatus', label: 'Status', sortable: true },
        { key: 'destination', label: 'Destination', sortable: false },
        { key: 'lastUpdate', label: 'Last Update', sortable: true },
    ];

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.loadOngoingParcels();
    }

    async loadOngoingParcels(): Promise<void> {
        this.isLoadingOngoing.set(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.ongoingParcels.set([
            {
                trackingId: 'TRK123456789',
                currentStatus: 'In Transit',
                destination: 'Mumbai, Maharashtra',
                estimatedDelivery: '2026-01-08',
                lastUpdate: '2 hours ago',
            },
            {
                trackingId: 'TRK987654321',
                currentStatus: 'Out for Delivery',
                destination: 'Pune, Maharashtra',
                estimatedDelivery: '2026-01-07',
                lastUpdate: '30 minutes ago',
            },
            {
                trackingId: 'TRK456789123',
                currentStatus: 'Processing',
                destination: 'Delhi, Delhi',
                estimatedDelivery: '2026-01-10',
                lastUpdate: '5 hours ago',
            },
        ]);

        this.isLoadingOngoing.set(false);
    }

    async searchTracking(): Promise<void> {
        if (!this.trackingId().trim()) {
            this.searchError.set('Please enter a tracking ID');
            return;
        }

        this.searchError.set('');
        this.isSearching.set(true);
        this.hasSearched.set(true);
        this.notFound.set(false);
        this.trackingData.set(null);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate different responses based on tracking ID
        if (this.trackingId().toUpperCase() === 'TRK123456789') {
            this.trackingData.set({
                trackingId: 'TRK123456789',
                currentStatus: 'In Transit',
                currentLocation: 'Mumbai Distribution Center',
                estimatedDeliveryDate: '2026-01-08',
                progressPercentage: 65,
                statusHistory: [
                    {
                        label: 'Delivered',
                        timestamp: '',
                        location: '',
                        description: 'Package will be delivered',
                        completed: false,
                    },
                    {
                        label: 'Out for Delivery',
                        timestamp: '',
                        location: '',
                        description: 'Package is out for delivery',
                        completed: false,
                    },
                    {
                        label: 'In Transit',
                        timestamp: '2026-01-06 14:30',
                        location: 'Mumbai Distribution Center',
                        description: 'Package is in transit to destination',
                        completed: true,
                    },
                    {
                        label: 'Processing',
                        timestamp: '2026-01-05 10:15',
                        location: 'Pune Sorting Facility',
                        description: 'Package is being processed',
                        completed: true,
                    },
                    {
                        label: 'Picked Up',
                        timestamp: '2026-01-04 09:00',
                        location: 'Pimpri, Maharashtra',
                        description: 'Package picked up from sender',
                        completed: true,
                    },
                    {
                        label: 'Booking Created',
                        timestamp: '2026-01-04 08:00',
                        location: 'Online',
                        description: 'Booking created successfully',
                        completed: true,
                    },
                ],
                bookingDetails: {
                    bookingId: 'BK123456',
                    bookingDate: '2026-01-04',
                    estimatedDelivery: '2026-01-08',
                    serviceType: 'Express Delivery',
                    priority: 'High',
                },
                parcelDetails: {
                    weight: '5.2 kg',
                    dimensions: '30 x 20 x 15 cm',
                    packageType: 'Box',
                    quantity: 1,
                    declaredValue: '₹15,000',
                    insurance: 'Yes',
                },
                paymentDetails: {
                    amount: '₹450',
                    paymentMethod: 'UPI',
                    paymentStatus: 'Paid',
                    transactionId: 'TXN789456123',
                    paymentDate: '2026-01-04',
                },
                packagingDetails: {
                    packagingType: 'Standard Box',
                    specialHandling: ['Fragile', 'Handle with Care'],
                    fragile: true,
                    perishable: false,
                },
                senderDetails: {
                    name: 'John Doe',
                    address: 'Shop No. 5, ABC Complex',
                    city: 'Pimpri',
                    state: 'Maharashtra',
                    pincode: '411018',
                    phone: '+91 98765 43210',
                    email: 'john.doe@example.com',
                },
                receiverDetails: {
                    name: 'Jane Smith',
                    address: 'Flat 202, XYZ Residency',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    phone: '+91 87654 32109',
                    email: 'jane.smith@example.com',
                },
            });
            this.notFound.set(false);
        } else {
            this.notFound.set(true);
        }

        this.isSearching.set(false);
    }

    handleOngoingRowClick(row: OngoingParcel): void {
        this.trackingId.set(row.trackingId);
        this.searchTracking();
    }

    resetSearch(): void {
        this.trackingId.set('');
        this.hasSearched.set(false);
        this.trackingData.set(null);
        this.notFound.set(false);
        this.searchError.set('');
    }

    getUserInitials(): string {
        return 'JD';
    }

    navigateToProfile(): void {
        this.router.navigate(['/profile']);
    }

    handleLogout(): void {
        console.log('Logout clicked');
    }

    getStatusBadgeVariant(
        status: string
    ):
        | 'info'
        | 'success'
        | 'warning'
        | 'error'
        | 'primary'
        | 'secondary'
        | 'default'
        | 'outline' {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('delivered')) return 'success';
        if (
            statusLower.includes('transit') ||
            statusLower.includes('out for delivery')
        )
            return 'primary';
        if (
            statusLower.includes('processing') ||
            statusLower.includes('picked')
        )
            return 'info';
        if (statusLower.includes('failed') || statusLower.includes('cancelled'))
            return 'error';
        if (statusLower.includes('pending') || statusLower.includes('delayed'))
            return 'warning';
        return 'default';
    }
}
