import { Component, input } from '@angular/core';
import { LinkComponent } from '../../shared/components/link/link.component';

export interface FooterSection {
    title: string;
    links: { label: string; route: string }[];
}

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [LinkComponent],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
})
export class FooterComponent {
    sections = input<FooterSection[]>([]);
    companyName = input<string>('Ship In');
    currentYear = input<number>(new Date().getFullYear());
}
