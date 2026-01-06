import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (!isDismissed()) {
        <div [class]="getAlertClasses()" role="alert">
            <div class="alert-icon">
                @if (variant() === 'success') {
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                    />
                </svg>
                } @if (variant() === 'error') {
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                    />
                </svg>
                } @if (variant() === 'warning') {
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
                } @if (variant() === 'info') {
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                    />
                </svg>
                }
            </div>
            <div class="alert-content">
                @if (title()) {
                <h4 class="alert-title">{{ title() }}</h4>
                }
                <div class="alert-description">
                    <ng-content></ng-content>
                </div>
            </div>
            @if (dismissible()) {
            <button
                class="alert-close"
                (click)="handleDismiss()"
                aria-label="Close alert"
                type="button"
            >
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
            }
        </div>
        }
    `,
    styles: [
        `
            .alert-base {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 14px 16px;
                border-radius: 10px;
                font-size: 14px;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .alert-info {
                background: #e0f2fe;
                color: #0c4a6e;
                border: 1px solid #7dd3fc;
            }

            .alert-success {
                background: #dcfce7;
                color: #14532d;
                border: 1px solid #86efac;
            }

            .alert-warning {
                background: #fef3c7;
                color: #78350f;
                border: 1px solid #fde047;
            }

            .alert-error {
                background: #fee2e2;
                color: #7f1d1d;
                border: 1px solid #fca5a5;
            }

            .alert-icon {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .alert-content {
                flex: 1;
                min-width: 0;
            }

            .alert-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .alert-description {
                font-size: 14px;
                line-height: 1.5;
            }

            .alert-close {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 200ms ease;
                padding: 0;
                margin-top: 2px;
            }

            .alert-close:hover {
                opacity: 1;
            }

            .alert-close svg {
                width: 100%;
                height: 100%;
            }
        `,
    ],
})
export class AlertComponent {
    variant = input<AlertVariant>('info');
    title = input<string>('');
    dismissible = input<boolean>(false);

    dismissed = output<void>();

    isDismissed = signal(false);

    getAlertClasses(): string {
        return `alert-base alert-${this.variant()}`;
    }

    handleDismiss(): void {
        this.isDismissed.set(true);
        this.dismissed.emit();
    }
}
