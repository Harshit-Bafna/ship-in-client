import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { OfficerLayoutComponent } from '../../../layout/main-layout/officer-layout/officer-layout.component';

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
    id: string;
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
export class OfficerBookParcelComponent {
    showSuccess = signal(false);
    errorMsg = signal('');
    processing = signal(false);
    bookingId = signal('');
    isNewCustomer = signal(false);

    customers: Customer[] = [
        {
            id: 'CUST-000001',
            name: 'John Doe',
            email: 'john@example.com',
            mobileNumber: '9876543210',
            houseNo: '123',
            addressLine1: 'MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001',
            country: 'India'
        },
        {
            id: 'CUST-000002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            mobileNumber: '9876543211',
            houseNo: '456',
            addressLine1: 'Park Street',
            city: 'Pune',
            state: 'Maharashtra',
            pinCode: '411001',
            country: 'India'
        }
    ];

    deliveryTypes = Object.values(EDeliveryType);
    packagingTypes = Object.values(EPackagingType);

    baseRate = 50;
    weightCharge = signal(0);
    deliveryCharge = signal(30);
    packingCharge = signal(10);
    taxRate = 0.05;
    totalCost = signal(0);

    bookingForm = new FormGroup({
        customerSelection: new FormControl('', Validators.required),

        newCustomerName: new FormControl(''),
        newCustomerEmail: new FormControl(''),
        newCustomerPassword: new FormControl(''),
        newCustomerMobileCountryCode: new FormControl('+91'),
        newCustomerMobileNumber: new FormControl(''),
        newCustomerAlternateMobileCountryCode: new FormControl('+91'),
        newCustomerAlternateMobileNumber: new FormControl(''),
        newCustomerHouseNo: new FormControl(''),
        newCustomerAddressLine1: new FormControl(''),
        newCustomerAddressLine2: new FormControl(''),
        newCustomerLandmark: new FormControl(''),
        newCustomerCity: new FormControl(''),
        newCustomerState: new FormControl(''),
        newCustomerPinCode: new FormControl(''),
        newCustomerCountry: new FormControl('India'),

        name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        houseNo: new FormControl('', Validators.required),
        addressLine1: new FormControl('', Validators.required),
        addressLine2: new FormControl(''),
        landmark: new FormControl(''),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        pincode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
        country: new FormControl('India', Validators.required),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
        alternatePhoneNumber: new FormControl('', Validators.pattern(/^\d{10}$/)),
        email: new FormControl('', [Validators.required, Validators.email]),

        parcelWeightInGram: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
            Validators.max(50000)
        ]),
        parcelContentsDescription: new FormControl('', [
            Validators.required,
            Validators.minLength(10)
        ]),
        packagingType: new FormControl<EPackagingType>(EPackagingType.BASIC, Validators.required),
        deliveryType: new FormControl<EDeliveryType>(EDeliveryType.STANDARD, Validators.required),
        parcelPickupTime: new FormControl('', Validators.required),
        parcelDropoffTime: new FormControl('', Validators.required),
    });

    constructor(private router: Router) {
        this.bookingForm.valueChanges.subscribe(() => {
            this.calculateCost();
        });
        this.calculateCost();

        this.bookingForm.get('customerSelection')?.valueChanges.subscribe(value => {
            this.onCustomerChange(value || '');
        });
    }

    onCustomerChange(value: string) {
        if (value === 'NEW') {
            this.isNewCustomer.set(true);
            this.setNewCustomerValidators();
        } else {
            this.isNewCustomer.set(false);
            this.clearNewCustomerValidators();
            
            if (value) {
                const customer = this.customers.find(c => c.id === value);
                if (customer) {
                    this.populateReceiverDetails(customer);
                }
            }
        }
    }

    setNewCustomerValidators() {
        this.bookingForm.get('newCustomerName')?.setValidators([Validators.required, Validators.minLength(2)]);
        this.bookingForm.get('newCustomerEmail')?.setValidators([Validators.required, Validators.email]);
        this.bookingForm.get('newCustomerPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.bookingForm.get('newCustomerMobileNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
        this.bookingForm.get('newCustomerAlternateMobileNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
        this.bookingForm.get('newCustomerHouseNo')?.setValidators(Validators.required);
        this.bookingForm.get('newCustomerAddressLine1')?.setValidators(Validators.required);
        this.bookingForm.get('newCustomerCity')?.setValidators(Validators.required);
        this.bookingForm.get('newCustomerState')?.setValidators(Validators.required);
        this.bookingForm.get('newCustomerPinCode')?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
        this.bookingForm.get('newCustomerCountry')?.setValidators(Validators.required);
        
        Object.keys(this.bookingForm.controls).forEach(key => {
            if (key.startsWith('newCustomer')) {
                this.bookingForm.get(key)?.updateValueAndValidity();
            }
        });
    }

    clearNewCustomerValidators() {
        Object.keys(this.bookingForm.controls).forEach(key => {
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
            country: customer.country
        });
    }

    calculateCost() {
        const weight = this.bookingForm.value.parcelWeightInGram || 0;
        const deliveryType = this.bookingForm.value.deliveryType || EDeliveryType.STANDARD;
        const packagingType = this.bookingForm.value.packagingType || EPackagingType.BASIC;

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

        const subtotal = this.baseRate + this.weightCharge() + this.deliveryCharge() + this.packingCharge();
        this.totalCost.set(Math.round(subtotal * (1 + this.taxRate) * 100) / 100);
    }

    getError(field: string): string {
        const control = this.bookingForm.get(field);
        if (!control?.touched || !control?.errors) return '';

        const errors = control.errors;
        if (errors['required']) return `${this.getLabel(field)} is required`;
        if (errors['email']) return 'Invalid email format';
        if (errors['minlength']) {
            if (field === 'newCustomerPassword') return 'Password must be at least 6 characters';
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
        if (field === 'pincode' || field === 'newCustomerPinCode') return 'Pincode must be 6 digits';
        if (field === 'phoneNumber' || field === 'alternatePhoneNumber' || 
            field === 'newCustomerMobileNumber' || field === 'newCustomerAlternateMobileNumber') {
            return 'Must be 10 digits';
        }
        return 'Invalid format';
    }

    onSubmit() {
        this.errorMsg.set('');

        Object.keys(this.bookingForm.controls).forEach(key => {
            this.bookingForm.get(key)?.markAsTouched();
        });

        if (this.bookingForm.invalid) {
            this.errorMsg.set('Please fix all errors before submitting');
            return;
        }

        if (this.isNewCustomer() && this.bookingForm.value.customerSelection === 'NEW') {
            const newCustomerValid = this.validateNewCustomerFields();
            if (!newCustomerValid) {
                this.errorMsg.set('Please fill all new customer details');
                return;
            }
        }

        const pickupTime = new Date(this.bookingForm.value.parcelPickupTime || '');
        const dropoffTime = new Date(this.bookingForm.value.parcelDropoffTime || '');
        
        if (pickupTime >= dropoffTime) {
            this.errorMsg.set('Pickup time must be before dropoff time');
            return;
        }

        this.processing.set(true);

        setTimeout(() => {
            const bookingData = this.prepareBookingData();
            console.log('Booking Data:', bookingData);

            const now = new Date();
            this.bookingId.set(`BK-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`);

            this.processing.set(false);
            this.showSuccess.set(true);
        }, 1500);
    }

    validateNewCustomerFields(): boolean {
        const fields = [
            'newCustomerName', 'newCustomerEmail', 'newCustomerPassword',
            'newCustomerMobileNumber', 'newCustomerAlternateMobileNumber',
            'newCustomerHouseNo', 'newCustomerAddressLine1', 'newCustomerCity',
            'newCustomerState', 'newCustomerPinCode', 'newCustomerCountry'
        ];
        
        return fields.every(field => {
            const control = this.bookingForm.get(field);
            return control?.valid;
        });
    }

    prepareBookingData() {
        const formValue = this.bookingForm.value;
        
        const bookingData: any = {
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

        if (this.isNewCustomer() && formValue.customerSelection === 'NEW') {
            bookingData.newCustomer = {
                name: formValue.newCustomerName,
                email: formValue.newCustomerEmail,
                password: formValue.newCustomerPassword,
                mobileCountryCode: formValue.newCustomerMobileCountryCode,
                mobileNumber: formValue.newCustomerMobileNumber,
                alternateMobileCountryCode: formValue.newCustomerAlternateMobileCountryCode,
                alternateMobileNumber: formValue.newCustomerAlternateMobileNumber,
                houseNo: formValue.newCustomerHouseNo,
                addressLine1: formValue.newCustomerAddressLine1,
                addressLine2: formValue.newCustomerAddressLine2,
                landmark: formValue.newCustomerLandmark,
                city: formValue.newCustomerCity,
                state: formValue.newCustomerState,
                pinCode: formValue.newCustomerPinCode,
                country: formValue.newCustomerCountry,
            };
        } else {
            bookingData.customerId = formValue.customerSelection;
        }

        return bookingData;
    }

    goToPayment() {
        this.router.navigate(['/pay-bill'], {
            state: {
                bookingId: this.bookingId(),
                amount: this.totalCost()
            }
        });
    }

    goToDashboard() {
        this.router.navigate(['/customer']);
    }

    formatDeliveryType(type: string): string {
        return type.replace('_', ' ');
    }
}