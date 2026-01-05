import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (isOpen()) {
        <div class="modal-overlay" (click)="handleOverlayClick()">
            <div [class]="getModalClasses()" (click)="$event.stopPropagation()">
                @if (showClose()) {
                <button
                    class="modal-close"
                    (click)="handleClose()"
                    aria-label="Close modal"
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
                <ng-content></ng-content>
            </div>
        </div>
        }
    `,
    styles: [
        `
            .modal-overlay {
                position: fixed;
                inset: 0;
                z-index: 50;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 200ms ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .modal-content {
                position: relative;
                background: var(--card);
                border-radius: 16px;
                box-shadow: var(--shadow-xl);
                width: 100%;
                max-height: calc(100vh - 40px);
                overflow-y: auto;
                animation: slideUp 300ms ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .modal-sm {
                max-width: 400px;
            }

            .modal-md {
                max-width: 500px;
            }

            .modal-lg {
                max-width: 700px;
            }

            .modal-xl {
                max-width: 900px;
            }

            .modal-full {
                max-width: calc(100vw - 40px);
                max-height: calc(100vh - 40px);
            }

            .modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--muted);
                border: none;
                border-radius: 8px;
                color: var(--foreground);
                cursor: pointer;
                transition: all 200ms ease;
                z-index: 10;
            }

            .modal-close:hover {
                background: var(--border);
                transform: rotate(90deg);
            }

            .modal-close svg {
                width: 20px;
                height: 20px;
            }
        `,
    ],
})
export class ModalComponent {
    isOpen = input<boolean>(false);
    size = input<ModalSize>('md');
    showClose = input<boolean>(true);
    closeOnOverlayClick = input<boolean>(true);

    closed = output<void>();

    getModalClasses(): string {
        return `modal-content modal-${this.size()}`;
    }

    handleClose(): void {
        this.closed.emit();
    }

    handleOverlayClick(): void {
        if (this.closeOnOverlayClick()) {
            this.handleClose();
        }
    }
}

@Component({
    selector: 'app-modal-header',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="modal-header">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .modal-header {
                padding: 24px 24px 16px;
                border-bottom: 1px solid var(--border);
            }
        `,
    ],
})
export class ModalHeaderComponent {}

@Component({
    selector: 'app-modal-title',
    standalone: true,
    imports: [CommonModule],
    template: `
        <h2 class="modal-title">
            <ng-content></ng-content>
        </h2>
    `,
    styles: [
        `
            .modal-title {
                font-size: 24px;
                font-weight: 700;
                color: var(--foreground);
                margin: 0;
            }
        `,
    ],
})
export class ModalTitleComponent {}

@Component({
    selector: 'app-modal-body',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="modal-body">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .modal-body {
                padding: 24px;
            }
        `,
    ],
})
export class ModalBodyComponent {}

@Component({
    selector: 'app-modal-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="modal-footer">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .modal-footer {
                padding: 16px 24px 24px;
                border-top: 1px solid var(--border);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 12px;
            }
        `,
    ],
})
export class ModalFooterComponent {}
