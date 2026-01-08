import { ICustomerAnalyticsData } from './../interfaces/response/customerAnalytics';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/ApiResponse';

@Injectable({
    providedIn: 'root',
})
export class ApplicationService {
    getCustomerHomeAnalytics(): ApiResponse {
        const analytics: ICustomerAnalyticsData = {
            totalBookings: 128,
            activeShipments: 5,
            delivered: 119,
            cancelRequests: 2,
        };

        return {
            statusCode: 200,
            success: true,
            data: analytics,
            message: 'Customer analytics data fetched successfully',
        };
    }
}
