import { Component, signal, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';
import { BookingService } from '../../../core/service/booking.service';
import { ApplicationService } from '../../../core/service/application.service';

enum EDeliveryType {
    STANDARD = 'STANDARD',
    EXPRESS = 'EXPRESS',
    SAME_DAY = 'SAME_DAY',
}

enum EPackagingType {
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
}

interface Customer {
    id: number | string;
    name: string;
    email: string;
    mobileNumber: string;
    houseNo: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
}

@Component({
    selector: 'app-book-parcel',
    standalone: true,
    imports: [OfficerLayoutComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './book-parcel.component.html',
    styleUrls: ['./book-parcel.component.css'],
})
export class OfficerBookParcelComponent implements OnInit {
    private computeLocalNowForDatetimeLocal(): string {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const yyyy = now.getFullYear();
        const MM = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const hh = pad(now.getHours());
        const mm = pad(now.getMinutes());
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    }

    minDateTime = this.computeLocalNowForDatetimeLocal();

    showSuccess = signal(false);
    errorMsg = signal('');
    processing = signal(false);
    bookingId = signal('');
    isNewCustomer = signal(false);

    private bookingService = inject(BookingService);
    private applicationService = inject(ApplicationService);

    customers: Customer[] = [
        {
            id: 7,
            name: 'John Doe',
            email: 'john@example.com',
            mobileNumber: '9876543210',
            houseNo: '123',
            addressLine1: 'MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001',
            country: 'India',
        },
        {
            id: 1,
            name: 'Jane Smith',
            email: 'jane@example.com',
            mobileNumber: '9876543211',
            houseNo: '456',
            addressLine1: 'Park Street',
            city: 'Pune',
            state: 'Maharashtra',
            pinCode: '411001',
            country: 'India',
        },
    ];

    deliveryTypes = Object.values(EDeliveryType);
    packagingTypes = Object.values(EPackagingType);

    baseRate = 50;
    weightCharge = signal(0);
    deliveryCharge = signal(30);
    packingCharge = signal(10);
    taxRate = 0.05;
    totalCost = signal(0);

    ngOnInit() {
        this.getCustomerData();
    }

    getCustomerData() {
        // this.applicationService.getAllCustomers().forEach((a) => {
        //     this.customers.push(a);
        // } );
    }

    bookingForm = new FormGroup({
        customerSelection: new FormControl('', Validators.required),

        newCustomerName: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        newCustomerEmail: new FormControl('', [
            Validators.pattern(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
            ),
        ]),
        newCustomerPassword: new FormControl(''),
        newCustomerMobileCountryCode: new FormControl('+91'),
        newCustomerMobileNumber: new FormControl('', [
            Validators.pattern(/^\d{10}$/),
        ]),
        newCustomerAlternateMobileCountryCode: new FormControl('+91'),
        newCustomerAlternateMobileNumber: new FormControl('', [
            Validators.pattern(/^\d{10}$/),
        ]),
        newCustomerHouseNo: new FormControl(''),
        newCustomerAddressLine1: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        newCustomerAddressLine2: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        newCustomerLandmark: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        newCustomerCity: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        newCustomerState: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        newCustomerPinCode: new FormControl('', [
            Validators.pattern(/^\d{6}$/),
        ]),
        newCustomerCountry: new FormControl('India', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),

        name: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        houseNo: new FormControl('', Validators.required),
        addressLine1: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        addressLine2: new FormControl('', [
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        landmark: new FormControl('', [Validators.pattern(/^[a-zA-Z\s]+$/)]),
        city: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        state: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        pincode: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d{6}$/),
        ]),
        country: new FormControl('India', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        phoneNumber: new FormControl('', [
            Validators.required,
            Validators.pattern(/^\d{10}$/),
        ]),
        alternatePhoneNumber: new FormControl(
            '',
            Validators.pattern(/^\d{10}$/)
        ),
        email: new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.pattern(
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
            ),
        ]),

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

    constructor(private router: Router) {
        this.bookingForm.valueChanges.subscribe(() => {
            this.calculateCost();
        });
        this.calculateCost();

        this.bookingForm
            .get('customerSelection')
            ?.valueChanges.subscribe((value) => {
                this.onCustomerChange(value || '');
            });
    }

    onCustomerChange(value: string | number) {
        if (value === 'NEW') {
            this.isNewCustomer.set(true);
            this.setNewCustomerValidators();
        } else {
            this.isNewCustomer.set(false);
            this.clearNewCustomerValidators();

            if (value) {
                // Use loose equality to match string from form with number from object if needed
                const customer = this.customers.find((c) => c.id == value);
                if (customer) {
                    this.populateReceiverDetails(customer);
                }
            }
        }
    }

    setNewCustomerValidators() {
        this.bookingForm
            .get('newCustomerName')
            ?.setValidators([Validators.required, Validators.minLength(2)]);
        this.bookingForm
            .get('newCustomerEmail')
            ?.setValidators([Validators.required, Validators.email]);
        this.bookingForm
            .get('newCustomerPassword')
            ?.setValidators([Validators.required, Validators.minLength(6)]);
        this.bookingForm
            .get('newCustomerMobileNumber')
            ?.setValidators([
                Validators.required,
                Validators.pattern(/^\d{10}$/),
            ]);
        this.bookingForm
            .get('newCustomerAlternateMobileNumber')
            ?.setValidators([
                Validators.required,
                Validators.pattern(/^\d{10}$/),
            ]);
        this.bookingForm
            .get('newCustomerHouseNo')
            ?.setValidators(Validators.required);
        this.bookingForm
            .get('newCustomerAddressLine1')
            ?.setValidators(Validators.required);
        this.bookingForm
            .get('newCustomerCity')
            ?.setValidators(Validators.required);
        this.bookingForm
            .get('newCustomerState')
            ?.setValidators(Validators.required);
        this.bookingForm
            .get('newCustomerPinCode')
            ?.setValidators([
                Validators.required,
                Validators.pattern(/^\d{6}$/),
            ]);
        this.bookingForm
            .get('newCustomerCountry')
            ?.setValidators(Validators.required);

        Object.keys(this.bookingForm.controls).forEach((key) => {
            if (key.startsWith('newCustomer')) {
                this.bookingForm.get(key)?.updateValueAndValidity();
            }
        });
    }

    clearNewCustomerValidators() {
        Object.keys(this.bookingForm.controls).forEach((key) => {
            if (key.startsWith('newCustomer')) {
                this.bookingForm.get(key)?.clearValidators();
                this.bookingForm.get(key)?.updateValueAndValidity();
            }
        });
    }

    populateReceiverDetails(customer: Customer) {
        this.bookingForm.patchValue({
            name: customer.name,
            email: customer.email,
            phoneNumber: customer.mobileNumber,
            houseNo: customer.houseNo,
            addressLine1: customer.addressLine1,
            addressLine2: customer.addressLine2 || '',
            landmark: customer.landmark || '',
            city: customer.city,
            state: customer.state,
            pincode: customer.pinCode,
            country: customer.country,
        });
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
        if (errors['minlength']) {
            if (field === 'newCustomerPassword')
                return 'Password must be at least 6 characters';
            return `Minimum ${errors['minlength'].requiredLength} characters`;
        }
        if (errors['pattern']) return this.getPatternError(field);
        if (errors['min']) return `Minimum value is ${errors['min'].min}`;
        if (errors['max']) return `Maximum value is ${errors['max'].max}`;
        return '';
    }

    getLabel(field: string): string {
        const labels: any = {
            customerSelection: 'Customer',
            newCustomerName: 'Name',
            newCustomerEmail: 'Email',
            newCustomerPassword: 'Password',
            newCustomerMobileNumber: 'Mobile Number',
            newCustomerAlternateMobileNumber: 'Alternate Mobile',
            newCustomerHouseNo: 'House/Flat No',
            newCustomerAddressLine1: 'Address Line 1',
            newCustomerCity: 'City',
            newCustomerState: 'State',
            newCustomerPinCode: 'Pincode',
            newCustomerCountry: 'Country',
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
        if (field === 'pincode' || field === 'newCustomerPinCode')
            return 'Pincode must be 6 digits';
        if (
            field === 'phoneNumber' ||
            field === 'alternatePhoneNumber' ||
            field === 'newCustomerMobileNumber' ||
            field === 'newCustomerAlternateMobileNumber'
        ) {
            return 'Invalid phone number';
        }
        if (
            field == 'name' ||
            field == 'addressLine1' ||
            field == 'addressLine2' ||
            field == 'landmark' ||
            field == 'city' ||
            field == 'state'
        ) {
            return `Only string is allowed`;
        }
        if (field == 'email') {
            return 'Invalid email address';
        }
        return 'Invalid format';
    }

    private authService = inject(AuthService); // Inject AuthService

    onSubmit() {
        this.errorMsg.set('');

        Object.keys(this.bookingForm.controls).forEach((key) => {
            this.bookingForm.get(key)?.markAsTouched();
        });

        if (this.bookingForm.invalid) {
            this.errorMsg.set('Please fix all errors before submitting');
            return;
        }

        this.processing.set(true);

        if (
            this.isNewCustomer() &&
            this.bookingForm.value.customerSelection === 'NEW'
        ) {
            this.registerNewCustomer();
        } else {
            this.createBooking();
        }
    }

    registerNewCustomer() {
        const formValue = this.bookingForm.value;
        const registerData: any = {
            name: formValue.newCustomerName,
            email: formValue.newCustomerEmail,
            identifier: formValue.newCustomerEmail,
            password: formValue.newCustomerPassword,
            role: 'CUSTOMER',
            mobileCountryCode: formValue.newCustomerMobileCountryCode,
            mobileNumber: formValue.newCustomerMobileNumber,
            alternateMobileCountryCode:
                formValue.newCustomerAlternateMobileCountryCode,
            alternateNumber: formValue.newCustomerAlternateMobileNumber || null,
            houseNo: formValue.newCustomerHouseNo,
            addressLine1: formValue.newCustomerAddressLine1,
            addressLine2: formValue.newCustomerAddressLine2 || undefined,
            landmark: formValue.newCustomerLandmark || undefined,
            city: formValue.newCustomerCity,
            state: formValue.newCustomerState,
            pinCode: formValue.newCustomerPinCode,
            country: formValue.newCustomerCountry,
            allowNotifications: true,
        };

        this.authService.registerCustomer(registerData).subscribe({
            next: (response: any) => {
                if (response.success && response.data) {
                    // Update form with new customer ID and clear NEW flag
                    this.bookingForm.patchValue({
                        customerSelection: response.data.id,
                    });
                    this.isNewCustomer.set(false);
                    this.createBooking();
                } else {
                    this.errorMsg.set(
                        response.message || 'Customer registration failed'
                    );
                    this.processing.set(false);
                }
            },
            error: (err: any) => {
                console.error('Registration Error:', err);
                this.errorMsg.set(
                    err.error?.message ||
                        'Customer registration failed. Please try again.'
                );
                this.processing.set(false);
            },
        });
    }

    createBooking() {
        const bookingData = this.prepareBookingData();
        console.log('Sending Booking Data:', bookingData);

        this.bookingService.createBooking(bookingData).subscribe({
            next: (response: any) => {
                if (response.success) {
                    this.bookingId.set(
                        response.data.trakingId || response.data.bookingId
                    );
                    this.showSuccess.set(true);
                    this.processing.set(false);
                } else {
                    this.errorMsg.set(response.message || 'Booking failed');
                    this.processing.set(false);
                }
            },
            error: (err: any) => {
                console.error('Booking Error:', err);
                const backendMsg = err.error?.message || err.error?.error;
                this.errorMsg.set(
                    backendMsg || 'Booking failed. Please try again.'
                );
                this.processing.set(false);
            },
        });
    }

    prepareBookingData() {
        const formValue = this.bookingForm.value;

        // Map to BookingParcelRequest interface
        const bookingData: any = {
            customerId: Number(formValue.customerSelection), // Ensure number
            receiverDetails: {
                name: formValue.name,
                houseNo: formValue.houseNo,
                addressLine1: formValue.addressLine1,
                addressLine2: formValue.addressLine2 || undefined,
                landmark: formValue.landmark || undefined,
                city: formValue.city,
                state: formValue.state,
                country: formValue.country,
                pinCode: formValue.pincode,
                mobileCountryCode: '+91',
                mobileNumber: formValue.phoneNumber,
                alternateMobileCountryCode: '+91',
                alternateNumber: formValue.alternatePhoneNumber || null, // Send null if empty
                email: formValue.email,
            },
            parcel: {
                weightInGrams: formValue.parcelWeightInGram,
                description: formValue.parcelContentsDescription,
                packagingRate: this.packingCharge(),
                baseRate: this.baseRate,
                adminFee: 0,
                weightCharge: this.weightCharge(),
                deliveryCharge: this.deliveryCharge(),
                taxAmount: (
                    this.totalCost() -
                    (this.baseRate +
                        this.weightCharge() +
                        this.deliveryCharge() +
                        this.packingCharge())
                ).toFixed(2),
                totalCost: this.totalCost(),
                expectedPickupTime: new Date(
                    formValue.parcelPickupTime || ''
                ).toISOString(),
                expectedDropofTime: new Date(
                    formValue.parcelDropoffTime || ''
                ).toISOString(),
            },
            packagingType: formValue.packagingType,
            deliveryType: formValue.deliveryType,
            deliveryInstruction: 'Created by Officer',
        };

        return bookingData;
    }

    goToPayment() {
        alert(
            'Payment feature for Officer is not yet implemented. Please collect payment manually.'
        );
        this.router.navigate(['/officer']);
    }

    goToDashboard() {
        this.router.navigate(['/officer']);
    }

    formatDeliveryType(type: string): string {
        return type.replace('_', ' ');
    }
}
