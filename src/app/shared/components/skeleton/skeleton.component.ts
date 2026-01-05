import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

@Component({
    selector: 'app-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getSkeletonClasses()" [style]="getStyles()"></div>
    `,
    styles: [
        `
            .skeleton {
                background: linear-gradient(
                    90deg,
                    var(--muted) 0%,
                    var(--border) 50%,
                    var(--muted) 100%
                );
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s ease-in-out infinite;
            }

            @keyframes skeleton-loading {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }

            .skeleton-text {
                height: 1em;
                border-radius: 4px;
            }

            .skeleton-circular {
                border-radius: 50%;
            }

            .skeleton-rectangular {
                border-radius: 0;
            }

            .skeleton-rounded {
                border-radius: 8px;
            }

            .skeleton-no-animation {
                animation: none;
            }
        `,
    ],
})
export class SkeletonComponent {
    variant = input<SkeletonVariant>('text');
    width = input<string>('');
    height = input<string>('');
    animation = input<boolean>(true);

    getSkeletonClasses(): string {
        const classes = ['skeleton', `skeleton-${this.variant()}`];
        if (!this.animation()) classes.push('skeleton-no-animation');
        return classes.join(' ');
    }

    getStyles(): string {
        const styles: string[] = [];
        if (this.width()) styles.push(`width: ${this.width()}`);
        if (this.height()) styles.push(`height: ${this.height()}`);
        return styles.join('; ');
    }
}

@Component({
    selector: 'app-skeleton-card',
    standalone: true,
    imports: [CommonModule, SkeletonComponent],
    template: `
        <div class="skeleton-card">
            @if (showImage()) {
            <app-skeleton variant="rectangular" height="200px" />
            }
            <div class="skeleton-card-content">
                @if (showAvatar()) {
                <app-skeleton variant="circular" width="40px" height="40px" />
                }
                <div class="skeleton-card-text">
                    @for (line of getLineArray(); track $index) {
                    <app-skeleton
                        variant="text"
                        [width]="$index === lines() - 1 ? '60%' : '100%'"
                    />
                    }
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .skeleton-card {
                border: 1px solid var(--border);
                border-radius: 10px;
                overflow: hidden;
            }

            .skeleton-card-content {
                padding: 16px;
                display: flex;
                gap: 12px;
            }

            .skeleton-card-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
        `,
    ],
})
export class SkeletonCardComponent {
    lines = input<number>(3);
    showImage = input<boolean>(true);
    showAvatar = input<boolean>(true);

    getLineArray(): number[] {
        return Array.from({ length: this.lines() }, (_, i) => i);
    }
}
