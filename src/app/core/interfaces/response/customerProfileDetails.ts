export interface ICustomerProfileDetailsResponse {
    id: number;
    userCode: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobileCountryCode: string;
    mobileNumber: string;
    alternateMobileCountryCode: string | null;
    alternateMobileNumber: string | null;
    houseNo: string;
    addressLine1: string;
    addressLine2: string | null;
    landmark: string | null;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    allowNotifications: boolean;
}
