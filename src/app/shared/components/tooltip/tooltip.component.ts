import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
    selector: 'app-tooltip',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            class="tooltip-wrapper"
            (mouseenter)="showTooltip()"
            (mouseleave)="hideTooltip()"
        >
            <ng-content></ng-content>
            @if (isVisible() && content()) {
            <div [class]="getTooltipClasses()">
                {{ content() }}
                <div class="tooltip-arrow"></div>
            </div>
            }
        </div>
    `,
    styles: [
        `
            .tooltip-wrapper {
                position: relative;
                display: inline-block;
            }

            .tooltip-base {
                position: absolute;
                z-index: 50;
                padding: 6px 10px;
                font-size: 13px;
                font-weight: 500;
                color: white;
                background: #1e293b;
                border-radius: 6px;
                white-space: nowrap;
                pointer-events: none;
                animation: tooltipFadeIn 200ms ease;
            }

            @keyframes tooltipFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .tooltip-top {
                bottom: calc(100% + 8px);
                left: 50%;
                transform: translateX(-50%);
            }

            .tooltip-bottom {
                top: calc(100% + 8px);
                left: 50%;
                transform: translateX(-50%);
            }

            .tooltip-left {
                right: calc(100% + 8px);
                top: 50%;
                transform: translateY(-50%);
            }

            .tooltip-right {
                left: calc(100% + 8px);
                top: 50%;
                transform: translateY(-50%);
            }

            .tooltip-arrow {
                position: absolute;
                width: 0;
                height: 0;
                border-style: solid;
            }

            .tooltip-top .tooltip-arrow {
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 4px 4px 0 4px;
                border-color: #1e293b transparent transparent transparent;
            }

            .tooltip-bottom .tooltip-arrow {
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0 4px 4px 4px;
                border-color: transparent transparent #1e293b transparent;
            }

            .tooltip-left .tooltip-arrow {
                right: -4px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 4px 0 4px 4px;
                border-color: transparent transparent transparent #1e293b;
            }

            .tooltip-right .tooltip-arrow {
                left: -4px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 4px 4px 4px 0;
                border-color: transparent #1e293b transparent transparent;
            }
        `,
    ],
})
export class TooltipComponent {
    content = input<string>('');
    position = input<TooltipPosition>('top');
    delay = input<number>(0);

    isVisible = signal(false);
    timeoutId: any = null;

    showTooltip(): void {
        if (this.delay()) {
            this.timeoutId = setTimeout(() => {
                this.isVisible.set(true);
            }, this.delay());
        } else {
            this.isVisible.set(true);
        }
    }

    hideTooltip(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.isVisible.set(false);
    }

    getTooltipClasses(): string {
        return `tooltip-base tooltip-${this.position()}`;
    }
}
