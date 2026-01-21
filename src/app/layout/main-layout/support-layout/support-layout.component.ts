import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent, FooterSection } from '../../footer/footer.component';
import { NavbarComponent, NavItem } from '../../header/navbar.component';

@Component({
    selector: 'app-support-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './support-layout.component.html',
    styleUrl: './support-layout.component.css',
})
export class SupportLayoutComponent {
    navItems = input<NavItem[]>([]);

    footerSections = input<FooterSection[]>([]);
}
