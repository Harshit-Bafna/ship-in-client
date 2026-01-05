import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="select-wrapper">
            @if (label()) {
            <label [for]="id()" class="select-label">{{ label() }}</label>
            }
            <div class="select-container">
                <select
                    [id]="id()"
                    [(ngModel)]="value"
                    [disabled]="disabled()"
                    [class]="getSelectClasses()"
                    (change)="handleChange()"
                    (blur)="handleBlur()"
                    (focus)="handleFocus()"
                >
                    @if (placeholder()) {
                    <option value="" disabled [selected]="!value()">
                        {{ placeholder() }}
                    </option>
                    } @for (option of options(); track option.value) {
                    <option
                        [value]="option.value"
                        [disabled]="option.disabled || false"
                    >
                        {{ option.label }}
                    </option>
                    }
                </select>
                <svg
                    class="select-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            @if (error()) {
            <span class="select-error">{{ error() }}</span>
            } @if (hint() && !error()) {
            <span class="select-hint">{{ hint() }}</span>
            }
        </div>
    `,
    styles: [
        `
            .select-wrapper {
                width: 100%;
            }

            .select-label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: var(--foreground);
                margin-bottom: 8px;
            }

            .select-container {
                position: relative;
                display: flex;
                align-items: center;
            }

            .select-base {
                width: 100%;
                font-size: 15px;
                color: var(--foreground);
                background: var(--muted);
                border: 2px solid var(--border);
                border-radius: 10px;
                outline: none;
                transition: all 300ms ease;
                font-family: inherit;
                cursor: pointer;
                appearance: none;
                padding-right: 40px;
            }

            .select-base:focus {
                background: var(--background);
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .select-base:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .select-error-state {
                border-color: var(--destructive);
                background: #fff5f5;
            }

            .select-error-state:focus {
                border-color: var(--destructive);
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .select-sm {
                padding: 8px 12px;
                font-size: 13px;
            }

            .select-md {
                padding: 12px 16px;
                font-size: 15px;
            }

            .select-lg {
                padding: 14px 18px;
                font-size: 16px;
            }

            .select-icon {
                position: absolute;
                right: 12px;
                width: 20px;
                height: 20px;
                color: var(--muted-foreground);
                pointer-events: none;
                transition: color 200ms ease;
            }

            .select-base:focus ~ .select-icon {
                color: var(--primary);
            }

            .select-error {
                display: block;
                margin-top: 6px;
                font-size: 13px;
                color: var(--destructive);
            }

            .select-hint {
                display: block;
                margin-top: 6px;
                font-size: 13px;
                color: var(--muted-foreground);
            }
        `,
    ],
})
export class SelectComponent {
    id = input<string>(`select-${Math.random().toString(36).substr(2, 9)}`);
    label = input<string>('');
    placeholder = input<string>('');
    error = input<string>('');
    hint = input<string>('');
    size = input<SelectSize>('md');
    disabled = input<boolean>(false);
    options = input<SelectOption[]>([]);

    value = model<string>('');

    changed = output<string>();
    focused = output<void>();
    blurred = output<void>();

    getSelectClasses(): string {
        const classes = ['select-base', `select-${this.size()}`];
        if (this.error()) classes.push('select-error-state');
        return classes.join(' ');
    }

    handleChange(): void {
        this.changed.emit(this.value());
    }

    handleFocus(): void {
        this.focused.emit();
    }

    handleBlur(): void {
        this.blurred.emit();
    }
}
