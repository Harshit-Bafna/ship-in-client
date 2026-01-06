import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getAvatarClasses()">
            @if (src() && !imageError()) {
            <img
                [src]="src()"
                [alt]="alt()"
                class="avatar-image"
                (error)="handleImageError()"
            />
            } @else if (initials()) {
            <span class="avatar-initials">{{ initials() }}</span>
            } @else {
            <svg
                class="avatar-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
            } @if (status()) {
            <span [class]="getStatusClasses()"></span>
            }
        </div>
    `,
    styles: [
        `
            .avatar-base {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: var(--muted);
                color: var(--foreground);
                overflow: hidden;
                flex-shrink: 0;
            }

            .avatar-circle {
                border-radius: 50%;
            }

            .avatar-square {
                border-radius: 8px;
            }

            .avatar-xs {
                width: 24px;
                height: 24px;
            }

            .avatar-sm {
                width: 32px;
                height: 32px;
            }

            .avatar-md {
                width: 40px;
                height: 40px;
            }

            .avatar-lg {
                width: 48px;
                height: 48px;
            }

            .avatar-xl {
                width: 64px;
                height: 64px;
            }

            .avatar-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .avatar-initials {
                font-weight: 600;
                text-transform: uppercase;
            }

            .avatar-xs .avatar-initials {
                font-size: 10px;
            }

            .avatar-sm .avatar-initials {
                font-size: 12px;
            }

            .avatar-md .avatar-initials {
                font-size: 14px;
            }

            .avatar-lg .avatar-initials {
                font-size: 16px;
            }

            .avatar-xl .avatar-initials {
                font-size: 20px;
            }

            .avatar-icon {
                width: 60%;
                height: 60%;
                color: var(--muted-foreground);
            }

            .avatar-status {
                position: absolute;
                border: 2px solid var(--background);
                border-radius: 50%;
            }

            .avatar-xs .avatar-status {
                width: 8px;
                height: 8px;
                bottom: -1px;
                right: -1px;
            }

            .avatar-sm .avatar-status,
            .avatar-md .avatar-status {
                width: 10px;
                height: 10px;
                bottom: 0;
                right: 0;
            }

            .avatar-lg .avatar-status,
            .avatar-xl .avatar-status {
                width: 12px;
                height: 12px;
                bottom: 2px;
                right: 2px;
            }

            .status-online {
                background: var(--success);
            }

            .status-offline {
                background: var(--muted-foreground);
            }

            .status-busy {
                background: var(--destructive);
            }

            .status-away {
                background: var(--warning);
            }
        `,
    ],
})
export class AvatarComponent {
    src = input<string>('');
    alt = input<string>('Avatar');
    initials = input<string>('');
    size = input<AvatarSize>('md');
    shape = input<AvatarShape>('circle');
    status = input<'online' | 'offline' | 'busy' | 'away' | ''>('');

    imageError = signal(false);

    getAvatarClasses(): string {
        return `avatar-base avatar-${this.shape()} avatar-${this.size()}`;
    }

    getStatusClasses(): string {
        return `avatar-status status-${this.status()}`;
    }

    handleImageError(): void {
        this.imageError.set(true);
    }
}

@Component({
    selector: 'app-avatar-group',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="getGroupClasses()">
            <ng-content></ng-content>
            @if (max() && excess() > 0) {
            <div [class]="getExcessClasses()">
                <span>+{{ excess() }}</span>
            </div>
            }
        </div>
    `,
    styles: [
        `
            .avatar-group {
                display: inline-flex;
                align-items: center;
            }

            .avatar-group ::ng-deep .avatar-base {
                border: 2px solid var(--background);
                margin-left: -8px;
                transition: transform 200ms ease;
            }

            .avatar-group ::ng-deep .avatar-base:first-child {
                margin-left: 0;
            }

            .avatar-group ::ng-deep .avatar-base:hover {
                transform: translateY(-2px);
                z-index: 10;
            }

            .avatar-excess {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: var(--muted);
                border: 2px solid var(--background);
                border-radius: 50%;
                margin-left: -8px;
                font-size: 12px;
                font-weight: 600;
                color: var(--foreground);
            }

            .avatar-group-xs .avatar-excess {
                width: 24px;
                height: 24px;
                font-size: 9px;
            }

            .avatar-group-sm .avatar-excess {
                width: 32px;
                height: 32px;
                font-size: 11px;
            }

            .avatar-group-md .avatar-excess {
                width: 40px;
                height: 40px;
                font-size: 12px;
            }

            .avatar-group-lg .avatar-excess {
                width: 48px;
                height: 48px;
                font-size: 14px;
            }

            .avatar-group-xl .avatar-excess {
                width: 64px;
                height: 64px;
                font-size: 16px;
            }
        `,
    ],
})
export class AvatarGroupComponent {
    max = input<number>(0);
    size = input<AvatarSize>('md');
    excess = input<number>(0);

    getGroupClasses(): string {
        return `avatar-group avatar-group-${this.size()}`;
    }

    getExcessClasses(): string {
        return `avatar-excess`;
    }
}
