import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface FooterSection {
    title: string;
    links: { label: string; route: string }[];
}

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
})
export class FooterComponent {
    sections = input<FooterSection[]>([]);
    companyName = input<string>('Ship In');
    currentYear = input<number>(new Date().getFullYear());
}
