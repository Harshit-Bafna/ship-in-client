import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EBookingStatus } from '../../../core/enums/EBookingStatus';
import { EDeliveryType } from '../../../core/enums/EDeliveryType';
import { EPackagingType } from '../../../core/enums/EPackagingType';
import { ITrackingResponse } from '../../../core/interfaces/response/trackingResponse';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';

@Component({
    selector: 'app-tracking',
    standalone: true,
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.css'],
    imports: [FormsModule, DatePipe, OfficerLayoutComponent],
})
export class OfficerTrackingComponent implements OnInit {
    trackingId = '';

    isSearching = signal(false);
    hasSearched = signal(false);
    notFound = signal(false);

    trackingData = signal<ITrackingResponse | null>(null);

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        const queryId = this.route.snapshot.queryParamMap.get('trackingId');
        if (queryId) {
            this.trackingId = queryId;
            this.searchTracking();
        }
    }

    searchTracking(): void {
        if (!this.trackingId) {
            this.notFound.set(true);
            return;
        }

        this.isSearching.set(true);
        this.hasSearched.set(true);
        this.notFound.set(false);

        setTimeout(() => {
            this.trackingData.set({
                id: 1,
                bookingId: 'BK-1001',
                trackingId: 'TRK123456789',
                currentStatus: EBookingStatus.IN_TRANSIT,
                currentLocation: 'Mumbai Distribution Center',
                estimatedDeliveryDate: new Date('2026-01-08'),
                progressPercentage: 65,

                receiverDetails: {
                    id: 1,
                    name: 'Jane Smith',
                    houseNo: '202',
                    addressLine1: 'XYZ Residency',
                    addressLine2: 'Andheri East',
                    landmark: 'Near Metro Station',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    country: 'India',
                    phoneNumber: '+91 87654 32109',
                    alternatePhoneNumber: '+91 99999 88888',
                    email: 'jane.smith@example.com',
                },

                parcelDetails: {
                    id: 10,
                    packagingType: EPackagingType.PREMIUM,
                    deliveryType: EDeliveryType.EXPRESS,
                    estimatedDeliveryDate: new Date('2026-01-08'),
                    estimatedPickupDate: new Date('2026-01-04'),
                    actualPickupDate: new Date('2026-01-04'),
                    pickUpTime: new Date(),
                    actualDeliveryDate: new Date('2026-01-08'),
                    dropOffTime: undefined,
                    weightInGrams: 5200,
                },

                paymentDetails: {
                    id: 99,
                    transactionId: 'TXN789456123',
                    baseRate: 300,
                    packagingRate: 50,
                    adminFee: 20,
                    weightCharge: 40,
                    deliveryCharge: 40,
                    taxAmount: 30,
                    finalAmount: 480,
                    paymentStatus: 'PAID',
                    paymentMethod: 'UPI',
                    paymentAt: Date.now(),
                    cardLastFour: '1234',
                    cardBrand: 'VISA',
                    cardHolderName: 'John Doe',
                    isRefund: null,
                },

                statusHistory: [
                    {
                        label: 'Delivered',
                        timestamp: new Date(),
                        location: '',
                        description: 'Package will be delivered',
                        completed: false,
                    },
                    {
                        label: 'Out for Delivery',
                        timestamp: new Date(),
                        location: '',
                        description: 'Out for delivery',
                        completed: false,
                    },
                    {
                        label: 'In Transit',
                        timestamp: new Date('2026-01-06T14:30'),
                        location: 'Mumbai DC',
                        description: 'In transit',
                        completed: true,
                    },
                    {
                        label: 'Picked Up',
                        timestamp: new Date('2026-01-04T09:00'),
                        location: 'Pune',
                        description: 'Picked from sender',
                        completed: true,
                    },
                    {
                        label: 'Booked',
                        timestamp: new Date('2026-01-04T08:00'),
                        location: 'Online',
                        description: 'Booking created',
                        completed: true,
                    },
                ],

                senderDetails: {
                    name: 'John Doe',
                    phone: '+91 98765 43210',
                    email: 'john.doe@example.com',
                    houseNo: '5',
                    addressLine1: 'ABC Complex',
                    addressLine2: 'Pimpri',
                    landmark: 'Near Bank',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411018',
                    country: 'India',
                },
            });

            this.isSearching.set(false);
        }, 800);
    }

    resetSearch(): void {
        this.trackingId = '';
        this.trackingData.set(null);
        this.hasSearched.set(false);
        this.notFound.set(false);
    }
}
