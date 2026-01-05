import {
    Component,
    input,
    output,
    signal,
    contentChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type TabVariant = 'default' | 'pills' | 'underline';

@Component({
    selector: 'app-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (active()) {
        <div class="tab-content">
            <ng-content></ng-content>
        </div>
        }
    `,
    styles: [
        `
            .tab-content {
                animation: fadeIn 300ms ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `,
    ],
})
export class TabComponent {
    label = input.required<string>();
    value = input.required<string>();
    disabled = input<boolean>(false);
    icon = input<string>('');
    active = signal(false);

    setActive(isActive: boolean): void {
        this.active.set(isActive);
    }
}

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="tabs-wrapper">
            <div [class]="getTabListClasses()">
                @for (tab of tabs(); track tab.value()) {
                <button
                    [class]="getTabButtonClasses(tab)"
                    [disabled]="tab.disabled()"
                    (click)="selectTab(tab.value())"
                    type="button"
                >
                    @if (tab.icon()) {
                    <svg
                        class="tab-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            [attr.d]="tab.icon()"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        />
                    </svg>
                    }
                    {{ tab.label() }}
                </button>
                }
            </div>
            <div class="tabs-content">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styles: [
        `
            .tabs-wrapper {
                width: 100%;
            }

            .tabs-list {
                display: flex;
                gap: 4px;
                border-bottom: 2px solid var(--border);
                margin-bottom: 20px;
            }

            .tabs-list-pills {
                border-bottom: none;
                background: var(--muted);
                padding: 4px;
                border-radius: 10px;
            }

            .tabs-list-underline {
                gap: 24px;
            }

            .tab-button {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 12px 16px;
                font-size: 14px;
                font-weight: 600;
                color: var(--muted-foreground);
                background: transparent;
                border: none;
                cursor: pointer;
                transition: all 200ms ease;
                border-radius: 8px;
                white-space: nowrap;
            }

            .tab-button:hover:not(:disabled) {
                color: var(--foreground);
                background: var(--muted);
            }

            .tab-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .tab-button-active {
                color: var(--primary);
                background: transparent;
            }

            .tabs-list-pills .tab-button-active {
                background: var(--background);
                box-shadow: var(--shadow-sm);
            }

            .tabs-list-underline .tab-button {
                border-bottom: 2px solid transparent;
                border-radius: 0;
                margin-bottom: -2px;
            }

            .tabs-list-underline .tab-button:hover:not(:disabled) {
                background: transparent;
                border-bottom-color: var(--border);
            }

            .tabs-list-underline .tab-button-active {
                border-bottom-color: var(--primary);
                background: transparent;
            }

            .tab-icon {
                width: 18px;
                height: 18px;
            }

            .tabs-content {
                width: 100%;
            }
        `,
    ],
})
export class TabsComponent {
    variant = input<TabVariant>('default');
    activeTab = signal<string>('');

    tabs = contentChildren(TabComponent);
    tabChanged = output<string>();

    ngAfterViewInit(): void {
        const tabsArray = this.tabs();
        if (tabsArray.length > 0 && !this.activeTab()) {
            const firstTab = tabsArray[0];
            this.selectTab(firstTab.value());
        }
    }

    selectTab(value: string): void {
        this.activeTab.set(value);
        this.tabs().forEach((tab) => {
            tab.setActive(tab.value() === value);
        });
        this.tabChanged.emit(value);
    }

    getTabListClasses(): string {
        const classes = ['tabs-list'];
        if (this.variant() === 'pills') classes.push('tabs-list-pills');
        if (this.variant() === 'underline') classes.push('tabs-list-underline');
        return classes.join(' ');
    }

    getTabButtonClasses(tab: TabComponent): string {
        const classes = ['tab-button'];
        if (tab.active()) classes.push('tab-button-active');
        return classes.join(' ');
    }
}
