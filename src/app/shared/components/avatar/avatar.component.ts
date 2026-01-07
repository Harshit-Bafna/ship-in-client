import { Component, input, signal } from '@angular/core';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.css',
})
export class AvatarComponent {
    src = input<string>('');
    alt = input<string>('Avatar');
    initials = input<string>('');
    size = input<AvatarSize>('md');
    shape = input<AvatarShape>('circle');
    status = input<'online' | 'offline' | 'busy' | 'away' | ''>('');

    getAvatarClasses(): string {
        return `avatar-base avatar-${this.shape()} avatar-${this.size()}`;
    }

    getStatusClasses(): string {
        return `avatar-status status-${this.status()}`;
    }
}
