import { Routes } from '@angular/router';
import { LoginComponent } from './features/common/login/login.component';
import { SignupComponent } from './features/customer/signup/signup.component';
import { CustomerHomeComponent } from './features/customer/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { EUserRole } from './core/enums/EUserRole';
import { TrackingComponent } from './features/customer/tracking/tracking.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'login', component: LoginComponent },
    { path: 'customer/register', component: SignupComponent },
    {
        path: 'customer',
        component: CustomerHomeComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
    {
        path: 'customer/tracking',
        component: TrackingComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [EUserRole.CUSTOMER] },
    },
];
