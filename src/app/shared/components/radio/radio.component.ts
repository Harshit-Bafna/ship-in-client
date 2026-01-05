import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type RadioSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-radio',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <label [class]="getWrapperClasses()">
            <input
                type="radio"
                [id]="id()"
                [name]="name()"
                [value]="value()"
                [(ngModel)]="selectedValue"
                [disabled]="disabled()"
                class="radio-input"
                (change)="handleChange()"
            />
            <span [class]="getRadioClasses()">
                <span class="radio-dot"></span>
            </span>
            @if (label()) {
            <span [class]="getLabelClasses()">{{ label() }}</span>
            }
        </label>
        @if (description()) {
        <p class="radio-description">{{ description() }}</p>
        }
    `,
    styles: [
        `
            .radio-wrapper {
                display: inline-flex;
                align-items: flex-start;
                gap: 10px;
                cursor: pointer;
                user-select: none;
            }

            .radio-wrapper-disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .radio-input {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            }

            .radio-base {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--border);
                border-radius: 50%;
                background: var(--background);
                transition: all 200ms ease;
                flex-shrink: 0;
            }

            .radio-sm {
                width: 16px;
                height: 16px;
            }

            .radio-md {
                width: 20px;
                height: 20px;
            }

            .radio-lg {
                width: 24px;
                height: 24px;
            }

            .radio-dot {
                width: 0;
                height: 0;
                border-radius: 50%;
                background: white;
                transition: all 200ms ease;
            }

            .radio-input:checked ~ .radio-base {
                background: var(--primary);
                border-color: var(--primary);
            }

            .radio-input:checked ~ .radio-base .radio-dot {
                width: 50%;
                height: 50%;
            }

            .radio-input:focus ~ .radio-base {
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .radio-wrapper:hover .radio-base {
                border-color: var(--primary);
            }

            .radio-label {
                font-size: 14px;
                color: var(--foreground);
                font-weight: 500;
                margin-top: 2px;
            }

            .radio-label-sm {
                font-size: 13px;
            }

            .radio-label-lg {
                font-size: 15px;
            }

            .radio-description {
                margin-left: 30px;
                margin-top: 4px;
                font-size: 13px;
                color: var(--muted-foreground);
                line-height: 1.5;
            }
        `,
    ],
})
export class RadioComponent {
    id = input<string>(`radio-${Math.random().toString(36).substr(2, 9)}`);
    name = input<string>('');
    value = input<string>('');
    label = input<string>('');
    description = input<string>('');
    size = input<RadioSize>('md');
    disabled = input<boolean>(false);

    selectedValue = model<string>('');

    changed = output<string>();

    getWrapperClasses(): string {
        const classes = ['radio-wrapper'];
        if (this.disabled()) classes.push('radio-wrapper-disabled');
        return classes.join(' ');
    }

    getRadioClasses(): string {
        return `radio-base radio-${this.size()}`;
    }

    getLabelClasses(): string {
        const classes = ['radio-label'];
        if (this.size() !== 'md') classes.push(`radio-label-${this.size()}`);
        return classes.join(' ');
    }

    handleChange(): void {
        this.changed.emit(this.selectedValue());
    }
}

@Component({
    selector: 'app-radio-group',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getGroupClasses()">
            @if (label()) {
            <label class="radio-group-label">{{ label() }}</label>
            }
            <div [class]="getRadiosClasses()">
                <ng-content></ng-content>
            </div>
            @if (error()) {
            <span class="radio-group-error">{{ error() }}</span>
            }
        </div>
    `,
    styles: [
        `
            .radio-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .radio-group-label {
                font-size: 14px;
                font-weight: 600;
                color: var(--foreground);
                margin-bottom: 4px;
            }

            .radio-group-radios {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .radio-group-horizontal {
                flex-direction: row;
                flex-wrap: wrap;
                gap: 20px;
            }

            .radio-group-error {
                font-size: 13px;
                color: var(--destructive);
                margin-top: 4px;
            }
        `,
    ],
})
export class RadioGroupComponent {
    label = input<string>('');
    error = input<string>('');
    orientation = input<'vertical' | 'horizontal'>('vertical');

    getGroupClasses(): string {
        return 'radio-group';
    }

    getRadiosClasses(): string {
        const classes = ['radio-group-radios'];
        if (this.orientation() === 'horizontal')
            classes.push('radio-group-horizontal');
        return classes.join(' ');
    }
}
