import { EBookingStatus } from "../../enums/EBookingStatus";

export interface IBookingList {
    id: number;
    trakingId: string;
    bookingDate: string;
    receiverName: string;
    deliveryAddress: string;
    amount: number;
    bookingStatus: EBookingStatus;
    isPaid: boolean;
    hasFeedback?: boolean;
}