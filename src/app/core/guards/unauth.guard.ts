import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { EUserRole } from '../enums/EUserRole';

@Injectable({ providedIn: 'root' })
export class UnAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            const role = this.authService.getUserRoles();

            if (role === EUserRole.CUSTOMER) {
                this.router.navigate(['/customer']);
            } else if (role === EUserRole.OFFICER) {
                this.router.navigate(['/officer']);
            } else if (role === EUserRole.SUPPORT) {
                this.router.navigate(['/support'])
            }
        }

        return true;
    }
}
