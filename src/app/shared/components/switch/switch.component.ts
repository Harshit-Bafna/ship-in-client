import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SwitchSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-switch',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <label [class]="getWrapperClasses()">
            <input
                type="checkbox"
                [id]="id()"
                [(ngModel)]="checked"
                [disabled]="disabled()"
                class="switch-input"
                (change)="handleChange()"
            />
            <span [class]="getSwitchClasses()">
                <span class="switch-thumb"></span>
            </span>
            @if (label()) {
            <span [class]="getLabelClasses()">{{ label() }}</span>
            }
        </label>
        @if (description()) {
        <p class="switch-description">{{ description() }}</p>
        }
    `,
    styles: [
        `
            .switch-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                user-select: none;
            }

            .switch-wrapper-disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .switch-input {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            }

            .switch-base {
                position: relative;
                display: inline-flex;
                align-items: center;
                border-radius: 9999px;
                background: var(--muted);
                border: 2px solid var(--border);
                transition: all 200ms ease;
                flex-shrink: 0;
            }

            .switch-sm {
                width: 32px;
                height: 18px;
            }

            .switch-md {
                width: 40px;
                height: 22px;
            }

            .switch-lg {
                width: 48px;
                height: 26px;
            }

            .switch-thumb {
                position: absolute;
                border-radius: 50%;
                background: white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 200ms ease;
            }

            .switch-sm .switch-thumb {
                width: 12px;
                height: 12px;
                left: 2px;
            }

            .switch-md .switch-thumb {
                width: 16px;
                height: 16px;
                left: 2px;
            }

            .switch-lg .switch-thumb {
                width: 20px;
                height: 20px;
                left: 2px;
            }

            .switch-input:checked ~ .switch-base {
                background: var(--primary);
                border-color: var(--primary);
            }

            .switch-input:checked ~ .switch-sm .switch-thumb {
                transform: translateX(14px);
            }

            .switch-input:checked ~ .switch-md .switch-thumb {
                transform: translateX(18px);
            }

            .switch-input:checked ~ .switch-lg .switch-thumb {
                transform: translateX(22px);
            }

            .switch-input:focus ~ .switch-base {
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .switch-label {
                font-size: 14px;
                color: var(--foreground);
                font-weight: 500;
            }

            .switch-label-sm {
                font-size: 13px;
            }

            .switch-label-lg {
                font-size: 15px;
            }

            .switch-description {
                margin-left: 50px;
                margin-top: 4px;
                font-size: 13px;
                color: var(--muted-foreground);
                line-height: 1.5;
            }
        `,
    ],
})
export class SwitchComponent {
    id = input<string>(`switch-${Math.random().toString(36).substr(2, 9)}`);
    label = input<string>('');
    description = input<string>('');
    size = input<SwitchSize>('md');
    disabled = input<boolean>(false);

    checked = model<boolean>(false);

    changed = output<boolean>();

    getWrapperClasses(): string {
        const classes = ['switch-wrapper'];
        if (this.disabled()) classes.push('switch-wrapper-disabled');
        return classes.join(' ');
    }

    getSwitchClasses(): string {
        return `switch-base switch-${this.size()}`;
    }

    getLabelClasses(): string {
        const classes = ['switch-label'];
        if (this.size() !== 'md') classes.push(`switch-label-${this.size()}`);
        return classes.join(' ');
    }

    handleChange(): void {
        this.changed.emit(this.checked());
    }
}
