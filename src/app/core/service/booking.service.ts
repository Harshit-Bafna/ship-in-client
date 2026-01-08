import { Injectable } from '@angular/core';
import { EBookingStatus } from '../enums/EBookingStatus';
import { EDeliveryType } from '../enums/EDeliveryType';
import { EPackagingType } from '../enums/EPackagingType';
import { EPaymentMethod } from '../enums/EPaymentMethod';
import { EPaymentStatus } from '../enums/EPaymentStatus';
import { ITrackingResponse } from '../interfaces/response/trackingResponse';
import { ApiResponse } from '../interfaces/ApiResponse';
import { IBookingList } from '../interfaces/response/bookingList';

const TRAKING_DB: ITrackingResponse[] = [
    {
        id: 1,
        bookingId: 'BOOK-2026-0001',
        trackingId: 'TRK-IND-987654321',
        currentStatus: EBookingStatus.OUT_FOR_DELIVERY,
        currentLocation: 'Bangalore Distribution Center',
        estimatedDeliveryDate: new Date('2026-01-12'),
        progressPercentage: 75,

        senderDetails: {
            name: 'Rahul Sharma',
            phone: '+91-9876543210',
            email: 'rahul.sharma@gmail.com',
            houseNo: '221B',
            addressLine1: 'MG Road',
            addressLine2: 'Near Metro Station',
            landmark: 'Opposite Mall',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India',
        },

        receiverDetails: {
            id: 101,
            name: 'Harshit Bafna',
            houseNo: '12A',
            addressLine1: 'Park Street',
            addressLine2: '2nd Floor',
            landmark: 'Near City Hospital',
            city: 'Kolkata',
            state: 'West Bengal',
            pincode: '700016',
            country: 'India',
            phoneNumber: '+91-9123456789',
            alternatePhoneNumber: '+91-9988776655',
            email: 'harshit.bafna@gmail.com',
        },

        parcelDetails: {
            id: 501,
            packagingType: EPackagingType.BASIC,
            deliveryType: EDeliveryType.EXPRESS,
            estimatedPickupDate: new Date('2026-01-08'),
            estimatedDeliveryDate: new Date('2026-01-12'),

            actualPickupDate: new Date('2026-01-08'),
            pickUpTime: new Date('2026-01-08T10:30:00'),

            actualDeliveryDate: undefined,
            dropOffTime: undefined,

            weightInGrams: 2500,
        },

        paymentDetails: {
            id: 9001,
            transactionId: 'TXN-456789123',

            baseRate: 200,
            packagingRate: 50,
            adminFee: 30,
            weightCharge: 120,
            deliveryCharge: 100,
            taxAmount: 45,
            finalAmount: 545,

            paymentStatus: EPaymentStatus.PAID,
            paymentMethod: EPaymentMethod.CREDIT_CARD,
            paymentAt: new Date('2026-01-08T11:00:00'),

            cardLastFour: '4321',
            cardBrand: 'VISA',
            cardHolderName: 'Rahul Sharma',

            isRefund: null,
        },

        statusHistory: [
            {
                label: EBookingStatus.BOOKED,
                timestamp: new Date('2026-01-07T09:00:00'),
                location: 'Online Portal',
                description: 'Parcel booking confirmed',
                completed: true,
            },
            {
                label: EBookingStatus.PICKED_UP,
                timestamp: new Date('2026-01-08T10:30:00'),
                location: 'Bangalore',
                description: 'Parcel picked up from sender',
                completed: true,
            },
            {
                label: EBookingStatus.IN_TRANSIT,
                timestamp: new Date('2026-01-09T14:00:00'),
                location: 'Hyderabad Hub',
                description: 'Parcel in transit to destination city',
                completed: true,
            },
            {
                label: EBookingStatus.OUT_FOR_DELIVERY,
                timestamp: new Date('2026-01-11T08:30:00'),
                location: 'Kolkata Delivery Center',
                description: 'Courier out for final delivery',
                completed: true,
            },
            {
                label: EBookingStatus.DELIVERED,
                description: 'Parcel will be delivered soon',
                completed: false,
            },
        ],
    },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
    getTrackingDetails(bookingId: string): ApiResponse {
        const trackingInfo = TRAKING_DB.find(
            (track) => track.bookingId === bookingId
        );

        if (!trackingInfo) {
            return {
                statusCode: 404,
                success: false,
                message: 'Tracking details not found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            data: trackingInfo,
            message: 'Tracking details fetched successfully',
        };
    }

    getAllBookings(): {
        success: boolean;
        statusCode: number;
        message: string;
        data?: IBookingList[] | undefined;
    } {
        const bookings: IBookingList[] = [];
        const statuses: EBookingStatus[] = Object.values(EBookingStatus);

        const getRandomDate = (start: Date, end: Date): string => {
            const date = new Date(
                start.getTime() +
                    Math.random() * (end.getTime() - start.getTime())
            );
            return date.toISOString().split('T')[0];
        };

        bookings.push({
            customerId: 'CUST-1001',
            bookingId: 'BOOK-2026-0001',
            bookingDate: '2025-12-15',
            receiverName: 'Amit Kumar',
            deliveredAddress: 'Mumbai, India',
            amount: 350,
            status: EBookingStatus.OUT_FOR_DELIVERY,
            hasFeedback: false,
        });

        for (let i = 1; i <= 50; i++) {
            bookings.push({
                customerId: `CUST-${1000 + i}`,
                bookingId: `BOOK-2025-${String(i).padStart(4, '0')}`,
                bookingDate: getRandomDate(new Date(2024, 0, 1), new Date()),
                receiverName: `Receiver ${i}`,
                deliveredAddress: `${i} Main St, City ${i}`,
                amount: Math.floor(Math.random() * 500) + 50,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                hasFeedback: false,

                paymentStatus: 'Pending',
            });
        }

        return {
            statusCode: 200,
            success: true,
            data: bookings,
            message: 'All bookings fetched successfully',
        };
    }
}
