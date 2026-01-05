import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CheckboxSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <label [class]="getWrapperClasses()">
            <input
                type="checkbox"
                [id]="id()"
                [(ngModel)]="checked"
                [disabled]="disabled()"
                [indeterminate]="indeterminate()"
                class="checkbox-input"
                (change)="handleChange()"
            />
            <span [class]="getCheckboxClasses()">
                @if (checked() && !indeterminate()) {
                <svg
                    class="checkbox-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                } @if (indeterminate()) {
                <svg
                    class="checkbox-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M6 12h12"
                    />
                </svg>
                }
            </span>
            @if (label()) {
            <span [class]="getLabelClasses()">{{ label() }}</span>
            }
        </label>
        @if (description()) {
        <p class="checkbox-description">{{ description() }}</p>
        }
    `,
    styles: [
        `
            .checkbox-wrapper {
                display: inline-flex;
                align-items: flex-start;
                gap: 10px;
                cursor: pointer;
                user-select: none;
            }

            .checkbox-wrapper-disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .checkbox-input {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            }

            .checkbox-base {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--border);
                border-radius: 6px;
                background: var(--background);
                transition: all 200ms ease;
                flex-shrink: 0;
            }

            .checkbox-sm {
                width: 16px;
                height: 16px;
            }

            .checkbox-md {
                width: 20px;
                height: 20px;
            }

            .checkbox-lg {
                width: 24px;
                height: 24px;
            }

            .checkbox-input:checked ~ .checkbox-base,
            .checkbox-input:indeterminate ~ .checkbox-base {
                background: var(--primary);
                border-color: var(--primary);
            }

            .checkbox-input:focus ~ .checkbox-base {
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .checkbox-wrapper:hover .checkbox-base {
                border-color: var(--primary);
            }

            .checkbox-icon {
                width: 100%;
                height: 100%;
                color: white;
            }

            .checkbox-label {
                font-size: 14px;
                color: var(--foreground);
                font-weight: 500;
                margin-top: 2px;
            }

            .checkbox-label-sm {
                font-size: 13px;
            }

            .checkbox-label-lg {
                font-size: 15px;
            }

            .checkbox-description {
                margin-left: 30px;
                margin-top: 4px;
                font-size: 13px;
                color: var(--muted-foreground);
                line-height: 1.5;
            }
        `,
    ],
})
export class CheckboxComponent {
    id = input<string>(`checkbox-${Math.random().toString(36).substr(2, 9)}`);
    label = input<string>('');
    description = input<string>('');
    size = input<CheckboxSize>('md');
    disabled = input<boolean>(false);
    indeterminate = input<boolean>(false);

    checked = model<boolean>(false);

    changed = output<boolean>();

    getWrapperClasses(): string {
        const classes = ['checkbox-wrapper'];
        if (this.disabled()) classes.push('checkbox-wrapper-disabled');
        return classes.join(' ');
    }

    getCheckboxClasses(): string {
        return `checkbox-base checkbox-${this.size()}`;
    }

    getLabelClasses(): string {
        const classes = ['checkbox-label'];
        if (this.size() !== 'md') classes.push(`checkbox-label-${this.size()}`);
        return classes.join(' ');
    }

    handleChange(): void {
        this.changed.emit(this.checked());
    }
}
