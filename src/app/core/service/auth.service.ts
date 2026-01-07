import { Injectable } from '@angular/core';
import { CustomerRegisterRequest } from '../interfaces/request/customerRegister';
import { ApiResponse } from '../interfaces/ApiResponse';
import { EUserRole } from '../enums/EUserRole';

export interface IUserDetails {
    id: number;
    name: string;
    email: string;
    userCode: string;
    role: EUserRole;
}

export interface ILoginResponse {
    token: string;
    userDetails: IUserDetails;
}

const USERS_DB_RESPONSE: ILoginResponse[] = [
    {
        token: 'token',
        userDetails: {
            id: 1,
            name: 'Harshit Bafna',
            email: 'harshit@gmail.com',
            userCode: 'CUST000001',
            role: EUserRole.CUSTOMER,
        },
    },
    {
        token: 'token',
        userDetails: {
            id: 2,
            name: 'Harish Bendale',
            email: 'harish@gmail.com',
            userCode: 'ADMI000002',
            role: EUserRole.ADMIN,
        },
    },
];

export const USERS_DB = [
    {
        email: 'harshit@gmail.com',
        userCode: 'CUST000001',
        password: 'Customer@1',
    },
    {
        email: 'harish@gmail.com',
        userCode: 'ADMI000002',
        password: 'ADMIN',
    },
];

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    login(username: string, password: string): ApiResponse {
        const isUser = USERS_DB.find(
            (u) =>
                (u.email === username || u.userCode === username) &&
                u.password === password
        );

        if (!isUser) {
            return {
                statusCode: 400,
                success: false,
                message: 'INVALID CREDENTIALS',
            };
        }

        const user = USERS_DB_RESPONSE.find(
            (u) =>
                u.userDetails.email === username ||
                u.userDetails.userCode === username
        );

        if (!user) {
            return {
                statusCode: 400,
                success: false,
                message: 'INVALID CREDENTIALS',
            };
        }

        localStorage.setItem('token', user.token);
        localStorage.setItem('userDetails', JSON.stringify(user.userDetails));

        console.log('Success');

        return {
            statusCode: 200,
            success: true,
            message: 'Login successfull',
            data: user.userDetails,
        };
    }

    logout(): ApiResponse {
        localStorage.clear();

        return {
            statusCode: 200,
            success: true,
            message: 'Logout successfull',
        };
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getUserDetails(): ApiResponse {
        const user = localStorage.getItem('userDetails');
        return {
            statusCode: 200,
            success: true,
            message: 'Data fetched successfully',
            data: user ? JSON.parse(user) : undefined,
        };
    }

    getUserRoles(): EUserRole {
        const user: IUserDetails = JSON.parse(
            localStorage.getItem('userDetails') || ''
        );
        return user.role;
    }

    registerCustomer(input: CustomerRegisterRequest): ApiResponse {
        return {
            statusCode: 200,
            success: true,
            message: 'Customer Registered Successfully',
            data: input,
        };
    }

    getRedirectRouteByRole(): string {
        const user: IUserDetails = JSON.parse(
            localStorage.getItem('userDetails') || ''
        );

        if (!user) {
            return '/login';
        }

        const role = user.role;

        if (role === EUserRole.OFFICER) {
            return '/officer';
        } else if (role === EUserRole.CUSTOMER) {
            return '/customer';
        }

        return '/login';
    }
}
