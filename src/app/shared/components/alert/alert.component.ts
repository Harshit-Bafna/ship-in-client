import { Component, input, output, signal } from '@angular/core';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.css',
})
export class AlertComponent {
    variant = input<AlertVariant>('info');
    title = input<string>('');
    dismissible = input<boolean>(false);

    dismissed = output<void>();

    isDismissed = signal(false);

    getAlertClasses(): string {
        return `alert-base alert-${this.variant()}`;
    }

    handleDismiss(): void {
        this.isDismissed.set(true);
        this.dismissed.emit();
    }
}
