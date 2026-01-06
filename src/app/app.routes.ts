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
];
