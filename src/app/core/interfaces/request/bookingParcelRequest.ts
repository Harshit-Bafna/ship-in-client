export interface BookingParcelRequest {
    customerId: number;
    parcel: {
        weightInGrams: number;
        description: string;
        expectedPickupTime: string;
        expectedDropofTime: string;
        baseRate: number;
        packagingRate: number;
        adminFee: number;
        weightCharge: number;
        deliveryCharge: number;
        taxAmount: number;
        totalCost: number;
    };
    receiverDetails: {
        name: string;
        email: string;
        mobileCountryCode: string;
        mobileNumber: string;
        alternateMobileCountryCode?: string;
        alternateNumber?: string;
        houseNo: string;
        addressLine1: string;
        addressLine2?: string;
        landmark?: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
    packagingType: string;
    deliveryType: string;
    deliveryInstruction?: string;
}
