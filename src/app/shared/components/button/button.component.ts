import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    imports: [CommonModule],
    template: `
        <button
            [type]="type()"
            [disabled]="disabled() || loading()"
            [class]="getButtonClasses()"
            (click)="handleClick($event)"
        >
            @if (loading()) {
            <svg class="btn-spinner" viewBox="0 0 24 24">
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
            } @if (iconLeft() && !loading()) {
            <svg
                class="btn-icon-left"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    [attr.d]="iconLeft()"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                />
            </svg>
            }
            <span class="btn-text"><ng-content></ng-content></span>
            @if (iconRight() && !loading()) {
            <svg
                class="btn-icon-right"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    [attr.d]="iconRight()"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                />
            </svg>
            }
        </button>
    `,
    styles: [
        `
            .btn-base {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-weight: 600;
                border-radius: 10px;
                cursor: pointer;
                transition: all 200ms ease;
                border: none;
                outline: none;
                font-family: inherit;
            }

            .btn-base:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                pointer-events: none;
            }

            .btn-sm {
                padding: 8px 16px;
                font-size: 14px;
            }

            .btn-md {
                padding: 12px 20px;
                font-size: 15px;
            }

            .btn-lg {
                padding: 16px 24px;
                font-size: 16px;
            }

            .btn-primary {
                background: var(--primary);
                color: var(--primary-foreground);
                box-shadow: 0 4px 15px rgba(12, 141, 77, 0.3);
            }

            .btn-primary:hover:not(:disabled) {
                background: var(--success);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(12, 141, 77, 0.4);
            }

            .btn-primary:active:not(:disabled) {
                transform: translateY(0);
            }

            .btn-secondary {
                background: var(--secondary);
                color: var(--secondary-foreground);
            }

            .btn-secondary:hover:not(:disabled) {
                background: var(--muted);
            }

            .btn-destructive {
                background: var(--destructive);
                color: var(--destructive-foreground);
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            }

            .btn-destructive:hover:not(:disabled) {
                background: #dc2626;
                transform: translateY(-2px);
            }

            .btn-ghost {
                background: transparent;
                color: var(--foreground);
            }

            .btn-ghost:hover:not(:disabled) {
                background: var(--muted);
            }

            .btn-outline {
                background: transparent;
                color: var(--primary);
                border: 2px solid var(--primary);
            }

            .btn-outline:hover:not(:disabled) {
                background: var(--primary);
                color: var(--primary-foreground);
            }

            .btn-full {
                width: 100%;
            }

            .btn-spinner {
                width: 20px;
                height: 20px;
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

            .btn-icon-left,
            .btn-icon-right {
                width: 20px;
                height: 20px;
            }

            .btn-text {
                display: inline-block;
            }
        `,
    ],
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

    clicked = output<Event>();

    getButtonClasses(): string {
        const classes = ['btn-base'];
        classes.push(`btn-${this.variant()}`);
        classes.push(`btn-${this.size()}`);
        if (this.fullWidth()) classes.push('btn-full');
        return classes.join(' ');
    }

    handleClick(event: Event): void {
        if (!this.disabled() && !this.loading()) {
            this.clicked.emit(event);
        }
    }
}
