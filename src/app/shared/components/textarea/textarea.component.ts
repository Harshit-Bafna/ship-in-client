import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TextareaSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="textarea-wrapper">
            @if (label()) {
            <label [for]="id()" class="textarea-label">{{ label() }}</label>
            }
            <div class="textarea-container">
                <textarea
                    [id]="id()"
                    [placeholder]="placeholder()"
                    [disabled]="disabled()"
                    [readonly]="readonly()"
                    [rows]="rows()"
                    [(ngModel)]="value"
                    [class]="getTextareaClasses()"
                    (blur)="handleBlur()"
                    (focus)="handleFocus()"
                    [maxlength]="maxLength() || null"
                ></textarea>
                @if (maxLength() && showCount()) {
                <span class="textarea-count">
                    {{ value().length }} / {{ maxLength() }}
                </span>
                }
            </div>
            @if (error()) {
            <span class="textarea-error">{{ error() }}</span>
            } @if (hint() && !error()) {
            <span class="textarea-hint">{{ hint() }}</span>
            }
        </div>
    `,
    styles: [
        `
            .textarea-wrapper {
                width: 100%;
            }

            .textarea-label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: var(--foreground);
                margin-bottom: 8px;
            }

            .textarea-container {
                position: relative;
            }

            .textarea-base {
                width: 100%;
                font-size: 15px;
                color: var(--foreground);
                background: var(--muted);
                border: 2px solid var(--border);
                border-radius: 10px;
                outline: none;
                transition: all 300ms ease;
                font-family: inherit;
                resize: vertical;
            }

            .textarea-base::placeholder {
                color: var(--muted-foreground);
            }

            .textarea-base:focus {
                background: var(--background);
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .textarea-base:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                resize: none;
            }

            .textarea-base:readonly {
                background: var(--secondary);
                cursor: default;
                resize: none;
            }

            .textarea-error-state {
                border-color: var(--destructive);
                background: #fff5f5;
            }

            .textarea-error-state:focus {
                border-color: var(--destructive);
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .textarea-sm {
                padding: 8px 12px;
                font-size: 13px;
            }

            .textarea-md {
                padding: 12px 16px;
                font-size: 15px;
            }

            .textarea-lg {
                padding: 14px 18px;
                font-size: 16px;
            }

            .textarea-no-resize {
                resize: none;
            }

            .textarea-count {
                position: absolute;
                bottom: 12px;
                right: 12px;
                font-size: 12px;
                color: var(--muted-foreground);
                background: var(--background);
                padding: 4px 8px;
                border-radius: 6px;
                pointer-events: none;
            }

            .textarea-error {
                display: block;
                margin-top: 6px;
                font-size: 13px;
                color: var(--destructive);
            }

            .textarea-hint {
                display: block;
                margin-top: 6px;
                font-size: 13px;
                color: var(--muted-foreground);
            }
        `,
    ],
})
export class TextareaComponent {
    id = input<string>(`textarea-${Math.random().toString(36).substr(2, 9)}`);
    label = input<string>('');
    placeholder = input<string>('');
    error = input<string>('');
    hint = input<string>('');
    size = input<TextareaSize>('md');
    rows = input<number>(4);
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    resize = input<boolean>(true);
    maxLength = input<number>(0);
    showCount = input<boolean>(false);

    value = model<string>('');

    focused = output<void>();
    blurred = output<void>();

    getTextareaClasses(): string {
        const classes = ['textarea-base', `textarea-${this.size()}`];
        if (this.error()) classes.push('textarea-error-state');
        if (!this.resize()) classes.push('textarea-no-resize');
        return classes.join(' ');
    }

    handleFocus(): void {
        this.focused.emit();
    }

    handleBlur(): void {
        this.blurred.emit();
    }
}
