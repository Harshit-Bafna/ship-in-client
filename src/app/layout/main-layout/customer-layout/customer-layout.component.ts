import { Component, input } from '@angular/core';
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
        { label: 'Home', route: '/customer' },
        { label: 'New Booking', route: '/customer/new-booking' },
        { label: 'Track Shipment', route: '/customer/tracking' },
        { label: 'Booking History', route: '/customer/history' },
        { label: 'Support', route: '/customer/support' },
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
}
