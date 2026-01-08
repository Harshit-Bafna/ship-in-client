import { Routes } from '@angular/router';
import { LoginComponent } from './features/common/login/login.component';
import { SignupComponent } from './features/customer/signup/signup.component';
import { CustomerHomeComponent } from './features/customer/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { EUserRole } from './core/enums/EUserRole';
import { CustomerTrackingComponent } from './features/customer/tracking/tracking.component';
import { CustomerProfileComponent } from './features/customer/customer-profile/customer-profile.component';
import { UnAuthGuard } from './core/guards/unauth.guard';
import { SupportComponent } from './features/customer/support/support.component';
import { BookingHistoryComponent } from './features/customer/booking-history/booking-history.component';
import { OfficerHomeComponent } from './features/officer/home/home.component';
import { ViewAllBookingsOfficerComponent } from './features/officer/view-all-booking/view-all-booking.component';
import { OfficerTrackingComponent } from './features/officer/tracking/tracking.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Unauth Routes
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnAuthGuard],
    },
    {
        path: 'customer/register',
        component: SignupComponent,
        canActivate: [UnAuthGuard],
    },

    // Customer Routes
    {
        path: 'customer',
        component: CustomerHomeComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
    {
        path: 'customer/my-profile',
        component: CustomerProfileComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
    {
        path: 'customer/tracking',
        component: CustomerTrackingComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
    {
        path: 'customer/support',
        component: SupportComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
    {
        path: 'customer/history',
        component: BookingHistoryComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },

    // Officer Routes
    {
        path: 'officer',
        component: OfficerHomeComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.OFFICER] },
    },
    {
        path: 'officer/history',
        component: ViewAllBookingsOfficerComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.OFFICER] },
    },
    {
        path: 'officer/tracking',
        component: OfficerTrackingComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.OFFICER] },
    },
];
