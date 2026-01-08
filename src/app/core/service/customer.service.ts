import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ICustomerProfileDetailsResponse } from '../interfaces/response/customerProfileDetails';

export const CUSTOMER_PROFILE_DETAILS_DB: ICustomerProfileDetailsResponse[] = [
    {
        id: 1,
        userCode: 'CUST000001',
        name: 'Harshit Bafna',
        email: 'harshit@gmail.com',

        mobileCountryCode: '+91',
        mobileNumber: '9876543210',
        alternateMobileCountryCode: '+91',
        alternateMobileNumber: '9123456780',

        houseNo: '12A',
        addressLine1: 'MG Road',
        addressLine2: 'Near City Mall',
        landmark: 'Opposite Metro Station',

        city: 'Indore',
        state: 'Madhya Pradesh',
        pinCode: '452001',
        country: 'India',

        allowNotifications: true,
    },
    {
        id: 2,
        userCode: 'ADMI000002',
        name: 'Harish Bendale',
        email: 'harish@gmail.com',

        mobileCountryCode: '+91',
        mobileNumber: '9988776655',
        alternateMobileCountryCode: null,
        alternateMobileNumber: null,

        houseNo: '221B',
        addressLine1: 'FC Road',
        addressLine2: null,
        landmark: null,

        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411004',
        country: 'India',

        allowNotifications: false,
    },
];

@Injectable({ providedIn: 'root' })
export class CustomerService {
    getCustomerDetails(userId: number): ApiResponse {
        const customerDetail: ICustomerProfileDetailsResponse | undefined =
            CUSTOMER_PROFILE_DETAILS_DB.find((c) => c.id === userId);

        if (!customerDetail) {
            return {
                statusCode: 500,
                message: 'Something went wrong',
                success: false,
            };
        }

        return {
            statusCode: 200,
            message: 'Data fetched successfully',
            success: true,
            data: customerDetail,
        };
    }
}
