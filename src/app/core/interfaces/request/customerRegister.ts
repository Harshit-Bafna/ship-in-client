export interface CustomerRegisterRequest {
    name: string;
    email: string;
    password: string;
    mobileCountryCode: string;
    mobileNumber: string;
    alternateMobileCountryCode: string;
    alternateMobileNumber: string;
    houseNo: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    allowNotifications: boolean;
}
