import { Routes } from '@angular/router';
import path from './path';

export const routes: Routes = [
    {
        path: path.LANDING,
        loadComponent: () =>
            import('./app.component').then((m) => m.AppComponent),
    },
    {
        path: path.COMPONENT_TESTING,
        loadComponent: () =>
            import(
                './features/component-testing/component-testing.component'
            ).then((m) => m.ComponentTestingComponent),
    },
    {
        path: path.LOGIN,
        loadComponent: () =>
            import('./features/common/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: path.CUSTOMER_REGISTRATION,
        loadComponent: () =>
            import('./features/customer/signup/signup.component').then(
                (m) => m.SignupComponent
            ),
    },
    {
        path: path.CUSTOMER_HOME,
        loadComponent: () =>
            import('./features/customer/home/home.component').then(
                (m) => m.CustomerHomeComponent
            ),
    },
    {
        path: path.TRACKING,
        loadComponent: () =>
            import('./features/common/tracking/tracking.component').then(
                (m) => m.TrackingComponent
            ),
    },
];
