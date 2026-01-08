import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent, FooterSection } from '../../footer/footer.component';
import { NavbarComponent, NavItem } from '../../header/navbar.component';

@Component({
    selector: 'app-officer-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './officer-layout.component.html',
    styleUrl: './officer-layout.component.css',
})
export class OfficerLayoutComponent {
    navItems = input<NavItem[]>([
        { label: 'Home', route: '/officer' },
        { label: 'New Booking', route: '/officer/new-booking' },
        { label: 'Track Shipment', route: '/officer/tracking' },
        { label: 'Pickup Shipment', route: '/officer/pickup' },
        { label: 'Booking History', route: '/officer/history' },
    ]);

    footerSections = input<FooterSection[]>([
        {
            title: 'Quick Links',
            links: [
                { label: 'Home', route: '/officer' },
                { label: 'New Booking', route: '/officer/new-booking' },
                { label: 'Tracking', route: '/officer/tracking' },
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
