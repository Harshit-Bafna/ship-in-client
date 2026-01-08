import { EBookingStatus } from "../../enums/EBookingStatus";

export interface IBookingList {
    customerId: string;
    bookingId: string;
    bookingDate: string;
    receiverName: string;
    deliveredAddress: string;
    amount: number;
    status: EBookingStatus;
    hasFeedback?: boolean;
    paymentStatus?: 'Paid' | 'Pending';
}