import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ProgressVariant = 'default' | 'success' | 'warning' | 'error';
type ProgressSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-progress',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="progress-wrapper">
            @if (label()) {
            <div class="progress-header">
                <span class="progress-label">{{ label() }}</span>
                @if (showValue()) {
                <span class="progress-value">{{ value() }}%</span>
                }
            </div>
            }
            <div [class]="getProgressClasses()">
                <div
                    [class]="getBarClasses()"
                    [style.width.%]="getClampedValue()"
                >
                    @if (striped()) {
                    <div class="progress-stripes"></div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .progress-wrapper {
                width: 100%;
            }

            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .progress-label {
                font-size: 14px;
                font-weight: 600;
                color: var(--foreground);
            }

            .progress-value {
                font-size: 13px;
                font-weight: 600;
                color: var(--muted-foreground);
            }

            .progress-container {
                width: 100%;
                background: var(--muted);
                border-radius: 9999px;
                overflow: hidden;
                position: relative;
            }

            .progress-sm {
                height: 6px;
            }

            .progress-md {
                height: 10px;
            }

            .progress-lg {
                height: 14px;
            }

            .progress-bar {
                height: 100%;
                transition: width 300ms ease;
                border-radius: 9999px;
                position: relative;
                overflow: hidden;
            }

            .progress-default {
                background: var(--primary);
            }

            .progress-success {
                background: var(--success);
            }

            .progress-warning {
                background: var(--warning);
            }

            .progress-error {
                background: var(--destructive);
            }

            .progress-stripes {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.15) 75%,
                    transparent 75%,
                    transparent
                );
                background-size: 20px 20px;
                animation: progress-stripes 1s linear infinite;
            }

            @keyframes progress-stripes {
                0% {
                    background-position: 0 0;
                }
                100% {
                    background-position: 20px 0;
                }
            }

            .progress-indeterminate .progress-bar {
                animation: progress-indeterminate 1.5s ease-in-out infinite;
            }

            @keyframes progress-indeterminate {
                0% {
                    width: 30%;
                    margin-left: 0;
                }
                50% {
                    width: 30%;
                    margin-left: 70%;
                }
                100% {
                    width: 30%;
                    margin-left: 0;
                }
            }
        `,
    ],
})
export class ProgressComponent {
    value = input<number>(0);
    variant = input<ProgressVariant>('default');
    size = input<ProgressSize>('md');
    label = input<string>('');
    showValue = input<boolean>(false);
    striped = input<boolean>(false);
    indeterminate = input<boolean>(false);

    getProgressClasses(): string {
        const classes = ['progress-container', `progress-${this.size()}`];
        if (this.indeterminate()) classes.push('progress-indeterminate');
        return classes.join(' ');
    }

    getBarClasses(): string {
        return `progress-bar progress-${this.variant()}`;
    }

    getClampedValue(): number {
        if (this.indeterminate()) return 100;
        return Math.min(100, Math.max(0, this.value()));
    }
}
