import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerVariant = 'primary' | 'secondary' | 'white';
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getWrapperClasses()">
            <svg [class]="getSpinnerClasses()" viewBox="0 0 24 24">
                <circle
                    class="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                />
            </svg>
            @if (label()) {
            <span class="spinner-label">{{ label() }}</span>
            }
        </div>
    `,
    styles: [
        `
            .spinner-wrapper {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }

            .spinner-base {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .spinner-circle {
                stroke-dasharray: 50;
                stroke-dashoffset: 25;
                animation: dash 1.5s ease-in-out infinite;
            }

            @keyframes dash {
                0% {
                    stroke-dashoffset: 50;
                }
                50% {
                    stroke-dashoffset: 12.5;
                }
                100% {
                    stroke-dashoffset: 50;
                }
            }

            .spinner-xs {
                width: 16px;
                height: 16px;
            }

            .spinner-sm {
                width: 20px;
                height: 20px;
            }

            .spinner-md {
                width: 24px;
                height: 24px;
            }

            .spinner-lg {
                width: 32px;
                height: 32px;
            }

            .spinner-xl {
                width: 40px;
                height: 40px;
            }

            .spinner-primary {
                color: var(--primary);
            }

            .spinner-secondary {
                color: var(--muted-foreground);
            }

            .spinner-white {
                color: #ffffff;
            }

            .spinner-label {
                font-size: 14px;
                color: var(--muted-foreground);
                font-weight: 500;
            }
        `,
    ],
})
export class SpinnerComponent {
    size = input<SpinnerSize>('md');
    variant = input<SpinnerVariant>('primary');
    label = input<string>('');

    getWrapperClasses(): string {
        return 'spinner-wrapper';
    }

    getSpinnerClasses(): string {
        return `spinner-base spinner-${this.size()} spinner-${this.variant()}`;
    }
}
