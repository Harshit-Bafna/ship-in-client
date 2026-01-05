import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type LinkVariant = 'default' | 'primary' | 'muted' | 'destructive';
type LinkSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-link',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        @if (routerLink()) {
        <a
            [routerLink]="routerLink()"
            [class]="getLinkClasses()"
            (click)="handleClick($event)"
        >
            @if (iconLeft()) {
            <svg
                class="link-icon-left"
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
            <span class="link-text"><ng-content></ng-content></span>
            @if (iconRight()) {
            <svg
                class="link-icon-right"
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
            } @if (external()) {
            <svg
                class="link-external-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
            }
        </a>
        } @else {
        <a
            [href]="href()"
            [target]="external() ? '_blank' : '_self'"
            [rel]="external() ? 'noopener noreferrer' : ''"
            [class]="getLinkClasses()"
            (click)="handleClick($event)"
        >
            @if (iconLeft()) {
            <svg
                class="link-icon-left"
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
            <span class="link-text"><ng-content></ng-content></span>
            @if (iconRight()) {
            <svg
                class="link-icon-right"
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
            } @if (external()) {
            <svg
                class="link-external-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
            }
        </a>
        }
    `,
    styles: [
        `
            .link-base {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                text-decoration: none;
                font-weight: 500;
                transition: all 200ms ease;
                cursor: pointer;
            }

            .link-default {
                color: var(--foreground);
            }

            .link-default:hover {
                color: var(--primary);
            }

            .link-primary {
                color: var(--primary);
            }

            .link-primary:hover {
                color: var(--success);
            }

            .link-muted {
                color: var(--muted-foreground);
            }

            .link-muted:hover {
                color: var(--foreground);
            }

            .link-destructive {
                color: var(--destructive);
            }

            .link-destructive:hover {
                color: #dc2626;
            }

            .link-sm {
                font-size: 13px;
            }

            .link-md {
                font-size: 14px;
            }

            .link-lg {
                font-size: 16px;
            }

            .link-underline {
                text-decoration: underline;
                text-underline-offset: 2px;
            }

            .link-underline-hover:hover {
                text-decoration: underline;
                text-underline-offset: 2px;
            }

            .link-icon-left,
            .link-icon-right,
            .link-external-icon {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }

            .link-external-icon {
                width: 14px;
                height: 14px;
                opacity: 0.7;
            }

            .link-text {
                display: inline-block;
            }
        `,
    ],
})
export class LinkComponent {
    href = input<string>('#');
    routerLink = input<string>('');
    variant = input<LinkVariant>('primary');
    size = input<LinkSize>('md');
    underline = input<boolean>(false);
    underlineHover = input<boolean>(true);
    external = input<boolean>(false);
    iconLeft = input<string>('');
    iconRight = input<string>('');

    clicked = output<Event>();

    getLinkClasses(): string {
        const classes = [
            'link-base',
            `link-${this.variant()}`,
            `link-${this.size()}`,
        ];
        if (this.underline()) classes.push('link-underline');
        if (this.underlineHover() && !this.underline())
            classes.push('link-underline-hover');
        return classes.join(' ');
    }

    handleClick(event: Event): void {
        this.clicked.emit(event);
    }
}
