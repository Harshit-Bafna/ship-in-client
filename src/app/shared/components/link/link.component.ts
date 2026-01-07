import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type LinkVariant = 'default' | 'primary' | 'muted' | 'destructive';
type LinkSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-link',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './link.component.html',
    styleUrl: './link.component.css',
})
export class LinkComponent {
    routerLink = input<string | null>();
    variant = input<LinkVariant>('primary');
    size = input<LinkSize>('md');
    underline = input<boolean>(false);
    underlineHover = input<boolean>(true);

    getLinkClasses(): string {
        const classes = [
            'link-base',
            `link-${this.variant()}`,
            `link-${this.size()}`,
        ];
        if (this.underline()) classes.push('link-underline');
        if (this.underlineHover() && !this.underline())
            classes.push('link-underline-hover');
        return classes.join(' ');
    }
}
