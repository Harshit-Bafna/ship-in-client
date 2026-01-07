import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
} from '../../shared/components/card/card.component';
import { DividerComponent } from '../../shared/components/divider/divider.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { LinkComponent } from '../../shared/components/link/link.component';
import { ProgressComponent } from '../../shared/components/progress/progress.component';
import {
    SelectComponent,
    SelectOption,
} from '../../shared/components/select/select.component';
import {
    SkeletonComponent,
    SkeletonCardComponent,
} from '../../shared/components/skeleton/skeleton.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import {
    TableComponent,
    TableColumn,
} from '../../shared/components/table/table.component';
import {
    TabsComponent,
    TabComponent,
} from '../../shared/components/tabs/tabs.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        InputComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardDescriptionComponent,
        CardContentComponent,
        CardFooterComponent,
        LinkComponent,
        AlertComponent,
        BadgeComponent,
        SpinnerComponent,
        DividerComponent,
        AvatarComponent,
        TextareaComponent,
        SelectComponent,
        ProgressComponent,
        TabsComponent,
        TabComponent,
        SkeletonComponent,
        SkeletonCardComponent,
        TableComponent,
    ],
    templateUrl: './component-testing.component.html',
    styleUrls: ['./component-testing.component.css'],
})
export class ComponentTestingComponent {
    username = signal('');
    password = signal('');
    email = signal('');
    message = signal('');
    comment = signal('');
    isLoading = signal(false);
    progress = signal(45);
    isModalOpen = signal(false);
    selectedCountry = signal('');
    checkboxValue = signal(false);
    switchValue = signal(false);
    radioValue = signal('option1');
    activeTab = signal('tab1');

    countryOptions: SelectOption[] = [
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Canada', value: 'ca' },
        { label: 'Australia', value: 'au' },
        { label: 'India', value: 'in' },
    ];

    tableColumns: TableColumn[] = [
        { key: 'id', label: 'ID', sortable: true, width: '80px' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: false },
        { key: 'status', label: 'Status', sortable: true },
    ];

    tableData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 'Active',
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Editor',
            status: 'Active',
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'Viewer',
            status: 'Inactive',
        },
        {
            id: 4,
            name: 'Alice Williams',
            email: 'alice@example.com',
            role: 'Editor',
            status: 'Active',
        },
        {
            id: 5,
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Admin',
            status: 'Active',
        },
        {
            id: 6,
            name: 'Diana Prince',
            email: 'diana@example.com',
            role: 'Editor',
            status: 'Active',
        },
        {
            id: 7,
            name: 'Ethan Hunt',
            email: 'ethan@example.com',
            role: 'Viewer',
            status: 'Inactive',
        },
        {
            id: 8,
            name: 'Fiona Green',
            email: 'fiona@example.com',
            role: 'Admin',
            status: 'Active',
        },
        {
            id: 9,
            name: 'George Martin',
            email: 'george@example.com',
            role: 'Editor',
            status: 'Active',
        },
        {
            id: 10,
            name: 'Hannah Lee',
            email: 'hannah@example.com',
            role: 'Viewer',
            status: 'Active',
        },
        {
            id: 11,
            name: 'Ian Wright',
            email: 'ian@example.com',
            role: 'Admin',
            status: 'Inactive',
        },
        {
            id: 12,
            name: 'Julia Roberts',
            email: 'julia@example.com',
            role: 'Editor',
            status: 'Active',
        },
    ];

    handleButtonClick(): void {
        this.isLoading.set(true);
        setTimeout(() => {
            this.isLoading.set(false);
        }, 2000);
    }

    openModal(): void {
        this.isModalOpen.set(true);
    }

    closeModal(): void {
        this.isModalOpen.set(false);
    }

    handleSubmit(): void {
        console.log('Form submitted');
    }

    onTabChange(tab: string): void {
        this.activeTab.set(tab);
    }

    handleTableRowClick(row: any): void {
        console.log('Row clicked:', row);
    }
}
