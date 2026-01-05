import { Component, input, output, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type InputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search';
type InputSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div [class]="getWrapperClasses()">
            @if (label()) {
            <label [for]="id()" class="input-label">{{ label() }}</label>
            }
            <div class="input-container">
                @if (iconLeft()) {
                <svg
                    class="input-icon-left"
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
                <input
                    [id]="id()"
                    [type]="getInputType()"
                    [placeholder]="placeholder()"
                    [disabled]="disabled()"
                    [readonly]="readonly()"
                    [(ngModel)]="value"
                    [class]="getInputClasses()"
                    (blur)="handleBlur()"
                    (focus)="handleFocus()"
                />
                @if (type() === 'password') {
                <button
                    type="button"
                    class="input-toggle"
                    (click)="togglePasswordVisibility()"
                    [attr.aria-label]="
                        isPasswordVisible() ? 'Hide password' : 'Show password'
                    "
                >
                    @if (isPasswordVisible()) {
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                    </svg>
                    } @else {
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    }
                </button>
                } @if (iconRight() && type() !== 'password') {
                <svg
                    class="input-icon-right"
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
            </div>
            @if (error()) {
            <span class="input-error">{{ error() }}</span>
            } @if (hint() && !error()) {
            <span class="input-hint">{{ hint() }}</span>
            }
        </div>
    `,
    styles: [
        `
            .input-wrapper {
                width: 100%;
            }

            .input-label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: var(--foreground);
                margin-bottom: 8px;
            }

            .input-container {
                position: relative;
                display: flex;
                align-items: center;
            }

            .input-base {
                width: 100%;
                font-size: 15px;
                color: var(--foreground);
                background: var(--muted);
                border: 2px solid var(--border);
                border-radius: 10px;
                outline: none;
                transition: all 300ms ease;
                font-family: inherit;
            }

            .input-base::placeholder {
                color: var(--muted-foreground);
            }

            .input-base:focus {
                background: var(--background);
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .input-base:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .input-base:readonly {
                background: var(--secondary);
                cursor: default;
            }

            .input-error-state {
                border-color: var(--destructive);
                background: #fff5f5;
            }

            .input-error-state:focus {
                border-color: var(--destructive);
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .input-sm {
                padding: 8px 12px;
                font-size: 13px;
            }

            .input-md {
                padding: 12px 16px;
                font-size: 15px;
            }

            .input-lg {
                padding: 14px 18px;
                font-size: 16px;
            }

            .input-with-icon-left.input-sm {
                padding-left: 36px;
            }

            .input-with-icon-left.input-md {
                padding-left: 44px;
            }

            .input-with-icon-left.input-lg {
                padding-left: 48px;
            }

            .input-with-icon-right.input-sm,
            .input-with-toggle.input-sm {
                padding-right: 36px;
            }

            .input-with-icon-right.input-md,
            .input-with-toggle.input-md {
                padding-right: 44px;
            }

            .input-with-icon-right.input-lg,
            .input-with-toggle.input-lg {
                padding-right: 48px;
            }

            .input-icon-left,
            .input-icon-right {
                position: absolute;
                width: 20px;
                height: 20px;
                color: var(--muted-foreground);
                pointer-events: none;
                transition: color 200ms ease;
            }

            .input-icon-left {
                left: 14px;
            }

            .input-icon-right {
                right: 14px;
            }

            .input-base:focus ~ .input-icon-left,
            .input-base:focus ~ .input-icon-right {
                color: var(--primary);
            }

            .input-toggle {
                position: absolute;
                right: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background: none;
                border: none;
                color: var(--muted-foreground);
                cursor: pointer;
                transition: color 200ms ease;
                padding: 0;
            }

            .input-toggle:hover {
                color: var(--primary);
            }

            .input-toggle svg {
                width: 20px;
                height: 20px;
            }

            .input-error {
                display: block;
                margin-top: 6px;
                font-size: 13px;
                color: var(--destructive);
            }

            .input-hint {
                display: block;
                margin-top: 6px;
                font-size: 13px;
                color: var(--muted-foreground);
            }
        `,
    ],
})
export class InputComponent {
    id = input<string>(`input-${Math.random().toString(36).substr(2, 9)}`);
    type = input<InputType>('text');
    size = input<InputSize>('md');
    label = input<string>('');
    placeholder = input<string>('');
    error = input<string>('');
    hint = input<string>('');
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    iconLeft = input<string>('');
    iconRight = input<string>('');

    value = model<string>('');

    focused = output<void>();
    blurred = output<void>();

    isPasswordVisible = signal(false);

    togglePasswordVisibility(): void {
        this.isPasswordVisible.update((v) => !v);
    }

    getInputType(): string {
        if (this.type() === 'password') {
            return this.isPasswordVisible() ? 'text' : 'password';
        }
        return this.type();
    }

    getWrapperClasses(): string {
        return 'input-wrapper';
    }

    getInputClasses(): string {
        const classes = ['input-base', `input-${this.size()}`];
        if (this.error()) classes.push('input-error-state');
        if (this.iconLeft()) classes.push('input-with-icon-left');
        if (this.iconRight() && this.type() !== 'password')
            classes.push('input-with-icon-right');
        if (this.type() === 'password') classes.push('input-with-toggle');
        return classes.join(' ');
    }

    handleFocus(): void {
        this.focused.emit();
    }

    handleBlur(): void {
        this.blurred.emit();
    }
}
