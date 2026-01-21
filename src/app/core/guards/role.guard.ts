import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authSerive: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const allowedRoles = route.data['roles'];
        const userRole = this.authSerive.getUserRoles();

        if (allowedRoles.includes(userRole)) {
            return true;
        }

        this.router.navigate(['/404']);
        return false;
    }
}
