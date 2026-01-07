import { Routes } from '@angular/router';
import { LoginComponent } from './features/common/login/login.component';
import { SignupComponent } from './features/customer/signup/signup.component';
import { CustomerHomeComponent } from './features/customer/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { EUserRole } from './core/enums/EUserRole';
import { TrackingComponent } from './features/customer/tracking/tracking.component';
import { AppComponent } from './app.component';
import { CustomerProfileComponent } from './features/customer/customer-profile/customer-profile.component';
import { UnAuthGuard } from './core/guards/unauth.guard';
import { SupportComponent } from './features/customer/support/support.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
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
        component: TrackingComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
    {
        path: 'customer/support',
        component: SupportComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    }
];
