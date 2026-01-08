import { Injectable } from '@angular/core';

const TRAKING_DB = {
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
};

@Injectable({ providedIn: 'root' })
export class BookingService {
    getTrackingDetails() {}
}
