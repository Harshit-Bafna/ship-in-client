import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent, FooterSection } from '../../footer/footer.component';
import { NavbarComponent, NavItem } from '../../header/navbar.component';

@Component({
    selector: 'app-customer-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './customer-layout.component.html',
    styleUrl: './customer-layout.component.css',
})
export class CustomerLayoutComponent {
    navItems = input<NavItem[]>([
        { label: 'Home', route: '/' },
        { label: 'New Booking', route: '/new-booking' },
        { label: 'Track Shipment', route: '/track' },
        { label: 'Booking History', route: '/history' },
        { label: 'Support', route: '/support' },
    ]);

    footerSections = input<FooterSection[]>([
        {
            title: 'Quick Links',
            links: [
                { label: 'Home', route: '/' },
                { label: 'New Booking', route: '/new-booking' },
                { label: 'Tracking', route: '/track' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Help Center', route: '/help' },
                { label: 'Contact Support', route: '/support' },
                { label: 'FAQs', route: '/faqs' },
            ],
        },
    ]);

    userInitials = input<string>('U');

    myProfile = output<void>();
    logout = output<void>();
}
