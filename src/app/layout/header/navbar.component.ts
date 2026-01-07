import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { LinkComponent } from '../../shared/components/link/link.component';

export interface NavItem {
    label: string;
    route: string;
    icon?: string;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, LinkComponent, AvatarComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    navItems = input<NavItem[]>([]);
    userInitials = input<string>('U');

    myProfileClicked = output<void>();
    logoutClicked = output<void>();

    isUserMenuOpen = signal(false);
    isMobileMenuOpen = signal(false);

    toggleUserMenu(): void {
        this.isUserMenuOpen.update((v) => !v);
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen.update((v) => !v);
    }

    handleMyProfile(): void {
        this.isUserMenuOpen.set(false);
        this.myProfileClicked.emit();
    }

    handleLogout(): void {
        this.isUserMenuOpen.set(false);
        this.logoutClicked.emit();
    }
}
