import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerLayoutComponent } from '../../../layout/main-layout/customer-layout/customer-layout.component';
import { EDeliveryType } from '../../../core/enums/EDeliveryType';
import { EPackagingType } from '../../../core/enums/EPackagingType';
import { BookingParcelRequest } from '../../../core/interfaces/request/bookingParcelRequest';
import { AuthService } from '../../../core/service/auth.service';
import { BookingService } from '../../../core/service/booking.service';

@Component({
    selector: 'app-book-parcel',
    standalone: true,
    imports: [CustomerLayoutComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './book-parcel.component.html',
    styleUrls: ['./book-parcel.component.css'],
})
export class BookParcelComponent {
    showSuccess = signal(false);
    errorMsg = signal('');
    processing = signal(false);
    bookingId = signal('');

    deliveryTypes = Object.values(EDeliveryType);
    packagingTypes = Object.values(EPackagingType);

    baseRate = 50;
    weightCharge = signal(0);
    deliveryCharge = signal(30);
    packingCharge = signal(10);
    taxRate = 0.05;
    totalCost = signal(0);

    bookingForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
        ]),
        houseNo: new FormControl('', Validators.required),
        addressLine1: new FormControl('', Validators.required),
        addressLine2: new FormControl(''),
        landmark: new FormControl(''),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        pincode: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d{6}$/),
        ]),
        country: new FormControl('India', Validators.required),
        phoneNumber: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d{10}$/),
        ]),
        alternatePhoneNumber: new FormControl(
            '',
            Validators.pattern(/^$|^\d{10}$/)
        ),
        email: new FormControl('', [Validators.required, Validators.email]),

        parcelWeightInGram: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
            Validators.max(50000),
        ]),
        parcelContentsDescription: new FormControl('', [
            Validators.required,
            Validators.minLength(10),
        ]),
        packagingType: new FormControl<EPackagingType>(
            EPackagingType.BASIC,
            Validators.required
        ),
        deliveryType: new FormControl<EDeliveryType>(
            EDeliveryType.STANDARD,
            Validators.required
        ),
        parcelPickupTime: new FormControl('', Validators.required),
        parcelDropoffTime: new FormControl('', Validators.required),
    });

    constructor(
        private router: Router,
        private authService: AuthService,
        private bookingService: BookingService
    ) {
        this.bookingForm.valueChanges.subscribe(() => {
            this.calculateCost();
        });
        this.calculateCost();
    }

    calculateCost() {
        const weight = this.bookingForm.value.parcelWeightInGram || 0;
        const deliveryType =
            this.bookingForm.value.deliveryType || EDeliveryType.STANDARD;
        const packagingType =
            this.bookingForm.value.packagingType || EPackagingType.BASIC;

        this.weightCharge.set(weight * 0.02);

        const deliveryCharges = {
            [EDeliveryType.STANDARD]: 30,
            [EDeliveryType.EXPRESS]: 80,
            [EDeliveryType.SAME_DAY]: 150,
        };
        this.deliveryCharge.set(deliveryCharges[deliveryType]);

        const packingCharges = {
            [EPackagingType.BASIC]: 10,
            [EPackagingType.PREMIUM]: 30,
        };
        this.packingCharge.set(packingCharges[packagingType]);

        const subtotal =
            this.baseRate +
            this.weightCharge() +
            this.deliveryCharge() +
            this.packingCharge();
        this.totalCost.set(
            Math.round(subtotal * (1 + this.taxRate) * 100) / 100
        );
    }

    getError(field: string): string {
        const control = this.bookingForm.get(field);
        if (!control?.touched || !control?.errors) return '';

        const errors = control.errors;
        if (errors['required']) return `${this.getLabel(field)} is required`;
        if (errors['email']) return 'Invalid email format';
        if (errors['minlength'])
            return `Minimum ${errors['minlength'].requiredLength} characters`;
        if (errors['pattern']) return this.getPatternError(field);
        if (errors['min']) return `Minimum value is ${errors['min'].min}`;
        if (errors['max']) return `Maximum value is ${errors['max'].max}`;
        return '';
    }

    getLabel(field: string): string {
        const labels: any = {
            name: 'Name',
            houseNo: 'House/Flat No',
            addressLine1: 'Address',
            city: 'City',
            state: 'State',
            pincode: 'Pincode',
            country: 'Country',
            phoneNumber: 'Phone Number',
            alternatePhoneNumber: 'Alternate Phone',
            email: 'Email',
            parcelWeightInGram: 'Parcel Weight',
            parcelContentsDescription: 'Contents Description',
            packagingType: 'Packaging Type',
            deliveryType: 'Delivery Type',
            parcelPickupTime: 'Pickup Time',
            parcelDropoffTime: 'Dropoff Time',
        };
        return labels[field] || field;
    }

    getPatternError(field: string): string {
        if (field === 'pincode') return 'Pincode must be 6 digits';
        if (field === 'phoneNumber' || field === 'alternatePhoneNumber')
            return 'Must be 10 digits';
        return 'Invalid format';
    }

    onSubmit() {
        this.errorMsg.set('');

        if (this.bookingForm.invalid) {
            Object.keys(this.bookingForm.controls).forEach((key) => {
                this.bookingForm.get(key)?.markAsTouched();
            });
            this.errorMsg.set('Please fix all errors before submitting');
            return;
        }

        const pickupTime = new Date(
            this.bookingForm.value.parcelPickupTime || ''
        );
        const dropoffTime = new Date(
            this.bookingForm.value.parcelDropoffTime || ''
        );

        if (pickupTime >= dropoffTime) {
            this.errorMsg.set('Pickup time must be before dropoff time');
            return;
        }

        this.processing.set(true);

        const bookingData = this.prepareBookingData();
        console.log('Sending Booking Data:', bookingData);

        // We need to fetch customerId from AuthService
        const userDetails = this.authService.getUserDetails();
        const customerId = (userDetails.data as any)?.id || 0;

        // Calculate tax amount
        const subtotal = this.baseRate + this.weightCharge() + this.deliveryCharge() + this.packingCharge();
        const taxAmount = Math.round(subtotal * this.taxRate * 100) / 100;

        // Construct BookingParcelRequest object matching backend DTO
        const requestPayload: BookingParcelRequest = {
            customerId: customerId,
            parcel: {
                weightInGrams: bookingData.parcelRequest.parcelWeightInGram!,
                description: bookingData.parcelRequest.parcelContentsDescription!,
                expectedPickupTime: bookingData.parcelRequest.parcelPickupTime!,
                expectedDropofTime: bookingData.parcelRequest.parcelDropoffTime!,
                baseRate: this.baseRate,
                packagingRate: this.packingCharge(),
                adminFee: 0, // Default to 0 as not calculated in frontend
                weightCharge: this.weightCharge(),
                deliveryCharge: this.deliveryCharge(),
                taxAmount: taxAmount,
                totalCost: this.totalCost()
            },
            receiverDetails: {
                name: bookingData.receiverDetails.name!,
                email: bookingData.receiverDetails.email!, // Added email
                mobileCountryCode: '+91', // Hardcoded for now
                mobileNumber: bookingData.receiverDetails.phoneNumber!,
                alternateMobileCountryCode: '+91', // Hardcoded
                alternateNumber: bookingData.receiverDetails.alternatePhoneNumber || undefined,
                houseNo: bookingData.receiverDetails.houseNo!, // Added houseNo
                addressLine1: bookingData.receiverDetails.addressLine1!,
                addressLine2: bookingData.receiverDetails.addressLine2,
                landmark: bookingData.receiverDetails.landmark,
                city: bookingData.receiverDetails.city!,
                state: bookingData.receiverDetails.state!,
                pinCode: bookingData.receiverDetails.pincode!,
                country: bookingData.receiverDetails.country!
            },
            packagingType: bookingData.parcelRequest.packagingType!,
            deliveryType: bookingData.parcelRequest.deliveryType!,
            deliveryInstruction: ''
        };

        this.bookingService.createBooking(requestPayload).subscribe({
            next: (response) => {
                console.log('Booking successful:', response);
                const responseData = response.data as any;
                if (responseData && responseData.bookingId) {
                    this.bookingId.set(responseData.bookingId);
                }
                this.processing.set(false);
                this.showSuccess.set(true);
            },
            error: (err) => {
                console.error('Booking failed:', err);
                this.errorMsg.set('Booking failed: ' + (err.error?.message || err.error || err.message));
                this.processing.set(false);
            }
        });
    }

    prepareBookingData() {
        const formValue = this.bookingForm.value;
        return {
            receiverDetails: {
                name: formValue.name,
                houseNo: formValue.houseNo,
                addressLine1: formValue.addressLine1,
                addressLine2: formValue.addressLine2 || undefined,
                landmark: formValue.landmark || undefined,
                city: formValue.city,
                state: formValue.state,
                pincode: formValue.pincode,
                country: formValue.country,
                phoneNumber: formValue.phoneNumber,
                alternatePhoneNumber: formValue.alternatePhoneNumber,
                email: formValue.email,
            },
            parcelRequest: {
                parcelWeightInGram: formValue.parcelWeightInGram,
                parcelContentsDescription: formValue.parcelContentsDescription,
                packagingType: formValue.packagingType,
                deliveryType: formValue.deliveryType,
                parcelPickupTime: formValue.parcelPickupTime,
                parcelDropoffTime: formValue.parcelDropoffTime,
            },
            calculatedCost: this.totalCost(),
        };
    }

    goToPayment() {
        this.router.navigate(['/customer/pay-bill'], {
            state: {
                bookingId: this.bookingId(),
                amount: this.totalCost(),
            },
        });
    }

    goToDashboard() {
        this.router.navigate(['/customer']);
    }

    formatDeliveryType(type: string): string {
        return type.replace('_', ' ');
    }
}
