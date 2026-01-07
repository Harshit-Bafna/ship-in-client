import { Component, input } from '@angular/core';

type BadgeVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [],
    template: `
        <span [class]="getBadgeClasses()">
            @if (icon()) {
            <svg
                class="badge-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    [attr.d]="icon()"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                />
            </svg>
            } @if (dot()) {
            <span class="badge-dot"></span>
            }
            <ng-content></ng-content>
        </span>
    `,
    styles: [
        `
            .badge-base {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-weight: 600;
                border-radius: 6px;
                transition: all 200ms ease;
                white-space: nowrap;
            }

            .badge-sm {
                padding: 2px 8px;
                font-size: 11px;
            }

            .badge-md {
                padding: 4px 10px;
                font-size: 12px;
            }

            .badge-lg {
                padding: 6px 12px;
                font-size: 13px;
            }

            .badge-default {
                background: var(--muted);
                color: var(--foreground);
            }

            .badge-primary {
                background: var(--primary);
                color: var(--primary-foreground);
            }

            .badge-secondary {
                background: var(--secondary);
                color: var(--secondary-foreground);
            }

            .badge-success {
                background: #dcfce7;
                color: #14532d;
            }

            .badge-warning {
                background: #fef3c7;
                color: #78350f;
            }

            .badge-error {
                background: #fee2e2;
                color: #7f1d1d;
            }

            .badge-info {
                background: #e0f2fe;
                color: #0c4a6e;
            }

            .badge-outline {
                background: transparent;
                border: 1px solid var(--border);
                color: var(--foreground);
            }

            .badge-pill {
                border-radius: 9999px;
            }

            .badge-icon {
                width: 14px;
                height: 14px;
                flex-shrink: 0;
            }

            .badge-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: currentColor;
                flex-shrink: 0;
            }
        `,
    ],
})
export class BadgeComponent {
    variant = input<BadgeVariant>('default');
    size = input<BadgeSize>('md');
    pill = input<boolean>(false);
    dot = input<boolean>(false);
    icon = input<string>('');

    getBadgeClasses(): string {
        const classes = [
            'badge-base',
            `badge-${this.variant()}`,
            `badge-${this.size()}`,
        ];
        if (this.pill()) classes.push('badge-pill');
        return classes.join(' ');
    }
}
