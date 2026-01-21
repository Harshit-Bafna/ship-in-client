import { EBookingStatus } from '../../enums/EBookingStatus';
import { EDeliveryType } from '../../enums/EDeliveryType';
import { EPackagingType } from '../../enums/EPackagingType';
import { EPaymentMethod } from '../../enums/EPaymentMethod';
import { EPaymentStatus } from '../../enums/EPaymentStatus';

export interface ITrackingResponse {
    id: number;
    bookingId: string;
    trackingId: string;
    currentStatus: EBookingStatus;
    currentLocation: string;
    estimatedDeliveryDate: Date;
    progressPercentage: number;

    receiverDetails: {
        id: number;
        name: string;
        houseNo: string;
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        phoneNumber: string;
        alternatePhoneNumber: string;
        email: string;
    };

    parcelDetails: {
        id: number;
        packagingType: EPackagingType;
        deliveryType: EDeliveryType;
        estimatedDeliveryDate: Date;
        estimatedPickupDate: Date;

        actualPickupDate?: Date;
        pickUpTime?: Date;

        actualDeliveryDate?: Date;
        dropOffTime?: Date;

        weightInGrams: number;
    };

    paymentDetails: {
        id: number;
        transactionId: string;

        baseRate: number;
        packagingRate: number;
        adminFee: number;
        weightCharge: number;
        deliveryCharge: number;
        taxAmount: number;
        finalAmount: number;

        paymentStatus: EPaymentStatus;
        paymentMethod: EPaymentMethod;
        paymentAt: Date | null;

        cardLastFour: string | null;
        cardBrand: string | null;
        cardHolderName: string | null;

        isRefund: {
            amount: number;
            transactionId: string;
            refundAt: Date;
        } | null;
    };

    statusHistory: {
        label: string;
        timestamp?: Date;
        location?: string;
        description: string;
        completed: boolean;
    }[];

    senderDetails: {
        name: string;
        phone: string;
        email: string;

        houseNo: string;
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
}
