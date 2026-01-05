import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getCardClasses()">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .card-base {
                background: var(--card);
                color: var(--card-foreground);
                border-radius: 16px;
                transition: all 300ms ease;
            }

            .card-default {
                border: 1px solid var(--border);
            }

            .card-elevated {
                box-shadow: var(--shadow-lg);
            }

            .card-elevated:hover {
                box-shadow: var(--shadow-xl);
                transform: translateY(-2px);
            }

            .card-outlined {
                border: 2px solid var(--border);
            }

            .card-ghost {
                background: transparent;
            }

            .card-padding-none {
                padding: 0;
            }

            .card-padding-sm {
                padding: 16px;
            }

            .card-padding-md {
                padding: 24px;
            }

            .card-padding-lg {
                padding: 32px;
            }

            .card-padding-xl {
                padding: 40px;
            }

            .card-hoverable {
                cursor: pointer;
            }

            .card-hoverable:hover {
                border-color: var(--primary);
            }
        `,
    ],
})
export class CardComponent {
    variant = input<CardVariant>('default');
    padding = input<CardPadding>('md');
    hoverable = input<boolean>(false);

    getCardClasses(): string {
        const classes = [
            'card-base',
            `card-${this.variant()}`,
            `card-padding-${this.padding()}`,
        ];
        if (this.hoverable()) classes.push('card-hoverable');
        return classes.join(' ');
    }
}

@Component({
    selector: 'app-card-header',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="card-header">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .card-header {
                padding: 24px 24px 0;
            }
        `,
    ],
})
export class CardHeaderComponent {}

@Component({
    selector: 'app-card-title',
    standalone: true,
    imports: [CommonModule],
    template: `
        <h3 [class]="getTitleClasses()">
            <ng-content></ng-content>
        </h3>
    `,
    styles: [
        `
            .card-title {
                font-size: 20px;
                font-weight: 700;
                color: var(--foreground);
                margin-bottom: 4px;
            }

            .card-title-lg {
                font-size: 24px;
            }

            .card-title-sm {
                font-size: 18px;
            }
        `,
    ],
})
export class CardTitleComponent {
    size = input<'sm' | 'md' | 'lg'>('md');

    getTitleClasses(): string {
        const classes = ['card-title'];
        if (this.size() !== 'md') classes.push(`card-title-${this.size()}`);
        return classes.join(' ');
    }
}

@Component({
    selector: 'app-card-description',
    standalone: true,
    imports: [CommonModule],
    template: `
        <p class="card-description">
            <ng-content></ng-content>
        </p>
    `,
    styles: [
        `
            .card-description {
                font-size: 14px;
                color: var(--muted-foreground);
                line-height: 1.5;
            }
        `,
    ],
})
export class CardDescriptionComponent {}

@Component({
    selector: 'app-card-content',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="card-content">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .card-content {
                padding: 24px;
            }
        `,
    ],
})
export class CardContentComponent {}

@Component({
    selector: 'app-card-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="card-footer">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .card-footer {
                padding: 0 24px 24px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
        `,
    ],
})
export class CardFooterComponent {}
