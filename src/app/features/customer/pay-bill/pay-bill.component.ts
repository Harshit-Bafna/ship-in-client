import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-pay-bill',
    standalone: true,
    imports: [CustomerLayoutComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './pay-bill.component.html',
    styleUrls: ['./pay-bill.component.css'],
})
export class PayBillComponent implements OnInit {
    amount = 0;
    bookingId = '';
    showConfirm = signal(false);
    showSuccess = signal(false);
    errorMsg = signal('');
    processing = signal(false);

    paymentResult: any = null;

    paymentForm = new FormGroup({
        cardNumber: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d{16}$/),
        ]),
        expiry: new FormControl('', [Validators.required, this.validateExpiry]),
        cvv: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d{3,4}$/),
        ]),
        cardholderName: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
        ]),
    });

    constructor(private router: Router) {}

    ngOnInit() {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras?.state || history.state;

        if (state?.bookingId && state?.amount) {
            this.bookingId = state.bookingId;
            this.amount = state.amount;
        } else {
            this.router.navigate(['/customer']);
        }
    }

    validateExpiry(control: AbstractControl): any {
        const value = (control?.value || '').trim();
        const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

        if (!match) return { invalidFormat: true };

        const month = parseInt(match[1], 10);
        const year = 2000 + parseInt(match[2], 10);
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
        ) {
            return { expired: true };
        }
        return null;
    }

    getError(field: string): string {
        const control = this.paymentForm.get(field);
        if (!control?.touched || !control?.errors) return '';

        if (control.errors['required'])
            return `${this.getFieldLabel(field)} is required`;
        if (control.errors['pattern']) return this.getPatternError(field);
        if (control.errors['invalidFormat']) return 'Use MM/YY format';
        if (control.errors['expired']) return 'Card has expired';
        if (control.errors['minlength']) return 'Name too short (min 2 chars)';
        return '';
    }

    getFieldLabel(field: string): string {
        const labels: any = {
            cardNumber: 'Card number',
            expiry: 'Expiry date',
            cvv: 'CVV',
            cardholderName: 'Cardholder name',
        };
        return labels[field] || field;
    }

    getPatternError(field: string): string {
        if (field === 'cardNumber') return 'Must be 16 digits';
        if (field === 'cvv') return 'Must be 3 or 4 digits';
        return 'Invalid format';
    }

    onSubmit() {
        this.errorMsg.set('');

        if (this.paymentForm.invalid) {
            Object.keys(this.paymentForm.controls).forEach((key) => {
                this.paymentForm.get(key)?.markAsTouched();
            });
            this.errorMsg.set('Please fix all errors before proceeding');
            return;
        }

        this.showConfirm.set(true);
    }

    cancelPayment() {
        this.showConfirm.set(false);
    }

    processPayment() {
        this.showConfirm.set(false);
        this.processing.set(true);
        this.errorMsg.set('');

        setTimeout(() => {
            if (this.paymentForm.value.cvv === '000') {
                this.errorMsg.set('Payment declined: Invalid CVV');
                this.processing.set(false);
                return;
            }

            const now = new Date();
            this.paymentResult = {
                paymentId: `PAY-${now.getFullYear()}-${now.getTime()}`,
                transactionId: `TXN-${Math.floor(
                    100000000 + Math.random() * 900000000
                )}`,
                transactionDate: now.toLocaleString('en-IN'),
                bookingId: this.bookingId,
                amount: this.amount,
                cardholderName: this.paymentForm.value.cardholderName,
                maskedCard: this.getMaskedCard(),
            };

            this.processing.set(false);
            this.showSuccess.set(true);
        }, 1500);
    }

    getMaskedCard(): string {
        const cardNum = this.paymentForm.value.cardNumber || '';
        if (cardNum.length < 4) return '•••• •••• •••• ••••';
        return `•••• •••• •••• ${cardNum.slice(-4)}`;
    }

    downloadPDF() {
        if (!this.paymentResult) return;

        const doc = new jsPDF();
        const r = this.paymentResult;

        doc.setFontSize(20);
        doc.text('Payment Receipt', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        let y = 40;
        const addLine = (label: string, value: string) => {
            doc.text(`${label}:`, 20, y);
            doc.text(value, 80, y);
            y += 10;
        };

        addLine('Payment ID', r.paymentId);
        addLine('Transaction ID', r.transactionId);
        addLine('Date', r.transactionDate);
        addLine('Booking ID', r.bookingId);
        addLine('Amount', `₹${r.amount}`);
        addLine('Cardholder', r.cardholderName);
        addLine('Card', r.maskedCard);
        addLine('Status', 'SUCCESS');

        doc.save(`receipt-${r.transactionId}.pdf`);
    }

    goBack() {
        this.router.navigate(['/customer']);
    }
}
