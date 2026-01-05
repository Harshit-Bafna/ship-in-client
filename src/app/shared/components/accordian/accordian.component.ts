import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-accordion-item',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getItemClasses()">
            <button
                [class]="getHeaderClasses()"
                (click)="toggle()"
                type="button"
                [attr.aria-expanded]="isOpen()"
            >
                <span class="accordion-title">{{ title() }}</span>
                <svg
                    [class]="getIconClasses()"
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
            </button>
            @if (isOpen()) {
            <div class="accordion-content">
                <div class="accordion-body">
                    <ng-content></ng-content>
                </div>
            </div>
            }
        </div>
    `,
    styles: [
        `
            .accordion-item {
                border: 1px solid var(--border);
                border-radius: 10px;
                overflow: hidden;
                transition: all 200ms ease;
            }

            .accordion-item:hover {
                border-color: var(--primary);
            }

            .accordion-item-bordered {
                border-radius: 0;
                border-left: none;
                border-right: none;
                border-top: none;
            }

            .accordion-item-bordered:first-child {
                border-top: 1px solid var(--border);
            }

            .accordion-header {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: var(--background);
                border: none;
                cursor: pointer;
                transition: all 200ms ease;
                text-align: left;
            }

            .accordion-header:hover {
                background: var(--muted);
            }

            .accordion-header-active {
                background: var(--muted);
            }

            .accordion-title {
                font-size: 16px;
                font-weight: 600;
                color: var(--foreground);
            }

            .accordion-icon {
                width: 20px;
                height: 20px;
                color: var(--muted-foreground);
                transition: transform 200ms ease;
                flex-shrink: 0;
            }

            .accordion-icon-open {
                transform: rotate(180deg);
            }

            .accordion-content {
                animation: slideDown 300ms ease;
                overflow: hidden;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    max-height: 0;
                }
                to {
                    opacity: 1;
                    max-height: 500px;
                }
            }

            .accordion-body {
                padding: 0 20px 20px;
                color: var(--foreground);
                font-size: 14px;
                line-height: 1.6;
            }
        `,
    ],
})
export class AccordionItemComponent {
    title = input.required<string>();
    defaultOpen = input<boolean>(false);
    bordered = input<boolean>(false);

    isOpen = signal(false);

    ngOnInit(): void {
        this.isOpen.set(this.defaultOpen());
    }

    toggle(): void {
        this.isOpen.update((v) => !v);
    }

    open(): void {
        this.isOpen.set(true);
    }

    close(): void {
        this.isOpen.set(false);
    }

    getItemClasses(): string {
        const classes = ['accordion-item'];
        if (this.bordered()) classes.push('accordion-item-bordered');
        return classes.join(' ');
    }

    getHeaderClasses(): string {
        const classes = ['accordion-header'];
        if (this.isOpen()) classes.push('accordion-header-active');
        return classes.join(' ');
    }

    getIconClasses(): string {
        const classes = ['accordion-icon'];
        if (this.isOpen()) classes.push('accordion-icon-open');
        return classes.join(' ');
    }
}

@Component({
    selector: 'app-accordion',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getAccordionClasses()">
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .accordion {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .accordion-flush {
                gap: 0;
            }
        `,
    ],
})
export class AccordionComponent {
    flush = input<boolean>(false);

    getAccordionClasses(): string {
        const classes = ['accordion'];
        if (this.flush()) classes.push('accordion-flush');
        return classes.join(' ');
    }
}
