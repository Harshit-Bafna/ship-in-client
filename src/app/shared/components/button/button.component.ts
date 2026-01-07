import { Component, input } from '@angular/core';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'ghost'
    | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css',
})
export class ButtonComponent {
    variant = input<ButtonVariant>('primary');
    size = input<ButtonSize>('md');
    type = input<'button' | 'submit' | 'reset'>('button');
    disabled = input<boolean>(false);
    loading = input<boolean>(false);
    fullWidth = input<boolean>(false);
    iconLeft = input<string>('');
    iconRight = input<string>('');

    getButtonClasses(): string {
        const classes = ['btn-base'];
        classes.push(`btn-${this.variant()}`);
        classes.push(`btn-${this.size()}`);
        if (this.fullWidth()) classes.push('btn-full');
        return classes.join(' ');
    }
}
