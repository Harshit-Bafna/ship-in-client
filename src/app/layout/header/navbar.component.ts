import { Component, input, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, IUserDetails } from '../../core/service/auth.service';

export interface NavItem {
    label: string;
    route: string;
    icon?: string;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    constructor(private authService: AuthService, private router: Router) {}

    navItems = input<NavItem[]>([]);
    profileRoute = input<string>('');

    isUserMenuOpen = signal(false);
    isMobileMenuOpen = signal(false);

    toggleUserMenu(): void {
        this.isUserMenuOpen.update((v) => !v);
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen.update((v) => !v);
    }

    handleMyProfile(): void {
        console.log(this.profileRoute());
        
        this.router.navigateByUrl(this.profileRoute());
        this.isUserMenuOpen.set(false);
    }

    handleLogout(): void {
        this.authService.logout();
        this.isUserMenuOpen.set(false);
    }

    getUserInitials(): string {
        const user: IUserDetails = this.authService.getUserDetails()
            .data as IUserDetails;

        return user.name.slice(0, 1);
    }
}
