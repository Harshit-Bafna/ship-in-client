import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
    label: string;
    url?: string;
    icon?: string;
}

type BreadcrumbSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav [class]="getBreadcrumbClasses()" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                @for (item of items(); track $index; let isLast = $last) {
                <li class="breadcrumb-item">
                    @if (!isLast && item.url) {
                    <a
                        [routerLink]="item.url"
                        class="breadcrumb-link"
                        (click)="handleClick(item, $index)"
                    >
                        @if (item.icon) {
                        <svg
                            class="breadcrumb-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                [attr.d]="item.icon"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        }
                        {{ item.label }}
                    </a>
                    } @else {
                    <span [class]="getCurrentClasses()">
                        @if (item.icon) {
                        <svg
                            class="breadcrumb-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                [attr.d]="item.icon"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        }
                        {{ item.label }}
                    </span>
                    } @if (!isLast) {
                    <svg
                        class="breadcrumb-separator"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            [attr.d]="getSeparatorPath()"
                        />
                    </svg>
                    }
                </li>
                }
            </ol>
        </nav>
    `,
    styles: [
        `
            .breadcrumb {
                display: flex;
                align-items: center;
            }

            .breadcrumb-list {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
                list-style: none;
                margin: 0;
                padding: 0;
            }

            .breadcrumb-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .breadcrumb-link {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--muted-foreground);
                text-decoration: none;
                transition: color 200ms ease;
                font-weight: 500;
            }

            .breadcrumb-link:hover {
                color: var(--primary);
            }

            .breadcrumb-current {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--foreground);
                font-weight: 600;
            }

            .breadcrumb-icon {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }

            .breadcrumb-separator {
                width: 16px;
                height: 16px;
                color: var(--muted-foreground);
                flex-shrink: 0;
            }

            .breadcrumb-sm {
                font-size: 12px;
            }

            .breadcrumb-sm .breadcrumb-icon,
            .breadcrumb-sm .breadcrumb-separator {
                width: 14px;
                height: 14px;
            }

            .breadcrumb-md {
                font-size: 14px;
            }

            .breadcrumb-lg {
                font-size: 16px;
            }

            .breadcrumb-lg .breadcrumb-icon,
            .breadcrumb-lg .breadcrumb-separator {
                width: 18px;
                height: 18px;
            }
        `,
    ],
})
export class BreadcrumbComponent {
    items = input<BreadcrumbItem[]>([]);
    size = input<BreadcrumbSize>('md');
    separator = input<'chevron' | 'slash' | 'dot'>('chevron');

    itemClicked = output<{ item: BreadcrumbItem; index: number }>();

    getBreadcrumbClasses(): string {
        return `breadcrumb breadcrumb-${this.size()}`;
    }

    getCurrentClasses(): string {
        return 'breadcrumb-current';
    }

    getSeparatorPath(): string {
        switch (this.separator()) {
            case 'chevron':
                return 'M9 5l7 7-7 7';
            case 'slash':
                return 'M9 18l6-12';
            case 'dot':
                return 'M12 12h.01';
            default:
                return 'M9 5l7 7-7 7';
        }
    }

    handleClick(item: BreadcrumbItem, index: number): void {
        this.itemClicked.emit({ item, index });
    }
}
