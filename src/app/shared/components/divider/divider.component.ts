import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type DividerOrientation = 'horizontal' | 'vertical';

@Component({
    selector: 'app-divider',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (label()) {
        <div [class]="getWrapperClasses()">
            <div class="divider-line"></div>
            <span class="divider-label">{{ label() }}</span>
            <div class="divider-line"></div>
        </div>
        } @else {
        <div [class]="getDividerClasses()"></div>
        }
    `,
    styles: [
        `
            .divider-horizontal {
                width: 100%;
                height: 1px;
                background: var(--border);
            }

            .divider-vertical {
                width: 1px;
                height: 100%;
                background: var(--border);
            }

            .divider-with-label {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
            }

            .divider-line {
                flex: 1;
                height: 1px;
                background: var(--border);
            }

            .divider-label {
                font-size: 13px;
                color: var(--muted-foreground);
                font-weight: 500;
                white-space: nowrap;
            }

            .divider-dashed {
                border-style: dashed;
            }

            .divider-dotted {
                border-style: dotted;
            }
        `,
    ],
})
export class DividerComponent {
    orientation = input<DividerOrientation>('horizontal');
    label = input<string>('');
    dashed = input<boolean>(false);
    dotted = input<boolean>(false);

    getWrapperClasses(): string {
        return 'divider-with-label';
    }

    getDividerClasses(): string {
        const classes = [`divider-${this.orientation()}`];
        if (this.dashed()) classes.push('divider-dashed');
        if (this.dotted()) classes.push('divider-dotted');
        return classes.join(' ');
    }
}
