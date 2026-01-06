import {
    Component,
    input,
    output,
    model,
    signal,
    computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
}

export interface TableConfig {
    striped?: boolean;
    hoverable?: boolean;
    bordered?: boolean;
    compact?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="table-wrapper">
            @if (searchable()) {
            <div class="table-search">
                <svg
                    class="search-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="handleSearch()"
                    placeholder="Search..."
                    class="search-input"
                />
            </div>
            }
            <div class="table-container">
                <table [class]="getTableClasses()">
                    <thead class="table-header">
                        <tr>
                            @for (column of columns(); track column.key) {
                            <th
                                [class]="getHeaderCellClasses(column)"
                                [style.width]="column.width || 'auto'"
                                (click)="
                                    column.sortable
                                        ? handleSort(column.key)
                                        : null
                                "
                            >
                                <div class="header-content">
                                    <span>{{ column.label }}</span>
                                    @if (column.sortable) {
                                    <svg
                                        class="sort-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        @if (sortColumn() === column.key &&
                                        sortDirection() === 'asc') {
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 15l7-7 7 7"
                                        />
                                        } @else if (sortColumn() === column.key
                                        && sortDirection() === 'desc') {
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                        } @else {
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                        />
                                        }
                                    </svg>
                                    }
                                </div>
                            </th>
                            }
                        </tr>
                    </thead>
                    <tbody class="table-body">
                        @for (row of paginatedData(); track $index) {
                        <tr (click)="handleRowClick(row)">
                            @for (column of columns(); track column.key) {
                            <td>{{ row[column.key] }}</td>
                            }
                        </tr>
                        } @empty {
                        <tr>
                            <td
                                [attr.colspan]="columns().length"
                                class="empty-state"
                            >
                                <svg
                                    class="empty-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                                <p>No data available</p>
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
            @if (paginated() && filteredData().length > 0) {
            <div class="table-pagination">
                <div class="pagination-info">
                    Showing {{ getStartIndex() }} to {{ getEndIndex() }} of
                    {{ filteredData().length }} entries
                </div>
                <div class="pagination-controls">
                    <button
                        class="pagination-button"
                        [disabled]="currentPage() === 1"
                        (click)="goToPage(1)"
                    >
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        class="pagination-button"
                        [disabled]="currentPage() === 1"
                        (click)="previousPage()"
                    >
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    @for (page of getPageNumbers(); track page) { @if (page ===
                    '...') {
                    <span class="pagination-ellipsis">...</span>
                    } @else {
                    <button
                        [class]="getPageButtonClasses(page)"
                        (click)="goToPage(page)"
                    >
                        {{ page }}
                    </button>
                    } }
                    <button
                        class="pagination-button"
                        [disabled]="currentPage() === totalPages()"
                        (click)="nextPage()"
                    >
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <button
                        class="pagination-button"
                        [disabled]="currentPage() === totalPages()"
                        (click)="goToPage(totalPages())"
                    >
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            }
        </div>
    `,
    styles: [
        `
            .table-wrapper {
                width: 100%;
                border: 1px solid var(--border);
                border-radius: 10px;
                overflow: hidden;
                background: var(--card);
            }

            .table-search {
                padding: 16px;
                border-bottom: 1px solid var(--border);
                position: relative;
            }

            .search-icon {
                position: absolute;
                left: 28px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                color: var(--muted-foreground);
                pointer-events: none;
            }

            .search-input {
                width: 100%;
                padding: 10px 16px 10px 44px;
                font-size: 14px;
                color: var(--foreground);
                background: var(--muted);
                border: 2px solid var(--border);
                border-radius: 8px;
                outline: none;
                transition: all 200ms ease;
                font-family: inherit;
            }

            .search-input:focus {
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(12, 141, 77, 0.1);
            }

            .table-container {
                overflow-x: auto;
            }

            .table {
                width: 100%;
                border-collapse: collapse;
            }

            .table-header {
                background: var(--muted);
            }

            .table-header th {
                padding: 14px 16px;
                text-align: left;
                font-size: 13px;
                font-weight: 700;
                color: var(--foreground);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid var(--border);
            }

            .header-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .header-sortable {
                cursor: pointer;
                user-select: none;
            }

            .header-sortable:hover {
                color: var(--primary);
            }

            .sort-icon {
                width: 16px;
                height: 16px;
                color: var(--muted-foreground);
            }

            .header-sortable:hover .sort-icon {
                color: var(--primary);
            }

            .table-body tr {
                border-bottom: 1px solid var(--border);
                transition: background 200ms ease;
            }

            .table-body tr:last-child {
                border-bottom: none;
            }

            .table-body td {
                padding: 14px 16px;
                font-size: 14px;
                color: var(--foreground);
            }

            .table-striped tbody tr:nth-child(even) {
                background: var(--muted);
            }

            .table-hoverable tbody tr {
                cursor: pointer;
            }

            .table-hoverable tbody tr:hover {
                background: var(--muted);
            }

            .table-bordered {
                border: 1px solid var(--border);
            }

            .table-bordered th,
            .table-bordered td {
                border: 1px solid var(--border);
            }

            .table-compact th,
            .table-compact td {
                padding: 8px 12px;
            }

            .empty-state {
                text-align: center;
                padding: 48px 24px !important;
            }

            .empty-icon {
                width: 48px;
                height: 48px;
                color: var(--muted-foreground);
                margin: 0 auto 12px;
            }

            .empty-state p {
                font-size: 14px;
                color: var(--muted-foreground);
                margin: 0;
            }

            .table-pagination {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                border-top: 1px solid var(--border);
            }

            .pagination-info {
                font-size: 13px;
                color: var(--muted-foreground);
            }

            .pagination-controls {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .pagination-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                background: transparent;
                border: 1px solid var(--border);
                border-radius: 6px;
                color: var(--foreground);
                cursor: pointer;
                transition: all 200ms ease;
            }

            .pagination-button:hover:not(:disabled) {
                background: var(--muted);
                border-color: var(--primary);
            }

            .pagination-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .pagination-button svg {
                width: 16px;
                height: 16px;
            }

            .pagination-button-active {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }

            .pagination-ellipsis {
                padding: 0 8px;
                color: var(--muted-foreground);
            }
        `,
    ],
})
export class TableComponent {
    columns = input.required<TableColumn[]>();
    data = input.required<any[]>();
    config = input<TableConfig>({});
    searchable = input<boolean>(false);
    paginated = input<boolean>(false);
    pageSize = input<number>(10);

    rowClicked = output<any>();

    searchQuery = model<string>('');
    currentPage = signal(1);
    sortColumn = signal<string | null>(null);
    sortDirection = signal<SortDirection>(null);

    filteredData = computed(() => {
        let result = [...this.data()];

        if (this.searchQuery()) {
            const query = this.searchQuery().toLowerCase();
            result = result.filter((row) => {
                return this.columns().some((col) => {
                    const value = row[col.key];
                    return value?.toString().toLowerCase().includes(query);
                });
            });
        }

        if (this.sortColumn() && this.sortDirection()) {
            result.sort((a, b) => {
                const aVal = a[this.sortColumn()!];
                const bVal = b[this.sortColumn()!];
                const direction = this.sortDirection() === 'asc' ? 1 : -1;

                if (aVal < bVal) return -1 * direction;
                if (aVal > bVal) return 1 * direction;
                return 0;
            });
        }

        return result;
    });

    totalPages = computed(() => {
        if (!this.paginated()) return 1;
        return Math.ceil(this.filteredData().length / this.pageSize());
    });

    paginatedData = computed(() => {
        if (!this.paginated()) return this.filteredData();

        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredData().slice(start, end);
    });

    getTableClasses(): string {
        const classes = ['table'];
        if (this.config().striped) classes.push('table-striped');
        if (this.config().hoverable) classes.push('table-hoverable');
        if (this.config().bordered) classes.push('table-bordered');
        if (this.config().compact) classes.push('table-compact');
        return classes.join(' ');
    }

    getHeaderCellClasses(column: TableColumn): string {
        const classes = [];
        if (column.sortable) classes.push('header-sortable');
        return classes.join(' ');
    }

    handleSort(key: string): void {
        if (this.sortColumn() === key) {
            if (this.sortDirection() === 'asc') {
                this.sortDirection.set('desc');
            } else if (this.sortDirection() === 'desc') {
                this.sortColumn.set(null);
                this.sortDirection.set(null);
            }
        } else {
            this.sortColumn.set(key);
            this.sortDirection.set('asc');
        }
    }

    handleSearch(): void {
        this.currentPage.set(1);
    }

    handleRowClick(row: any): void {
        this.rowClicked.emit(row);
    }

    goToPage(page: number | string): void {
        if (typeof page === 'number') {
            this.currentPage.set(page);
        }
    }

    previousPage(): void {
        if (this.currentPage() > 1) {
            this.currentPage.update((p) => p - 1);
        }
    }

    nextPage(): void {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update((p) => p + 1);
        }
    }

    getStartIndex(): number {
        return (this.currentPage() - 1) * this.pageSize() + 1;
    }

    getEndIndex(): number {
        return Math.min(
            this.currentPage() * this.pageSize(),
            this.filteredData().length
        );
    }

    getPageNumbers(): (number | string)[] {
        const total = this.totalPages();
        const current = this.currentPage();
        const pages: (number | string)[] = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (current > 3) {
                pages.push('...');
            }

            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (current < total - 2) {
                pages.push('...');
            }

            pages.push(total);
        }

        return pages;
    }

    getPageButtonClasses(page: number | string): string {
        const classes = ['pagination-button'];
        if (page === this.currentPage())
            classes.push('pagination-button-active');
        return classes.join(' ');
    }
}
