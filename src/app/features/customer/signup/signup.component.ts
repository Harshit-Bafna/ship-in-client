import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
} from '../../../shared/components/card/card.component';
import { DividerComponent } from '../../../shared/components/divider/divider.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { LinkComponent } from '../../../shared/components/link/link.component';
import {
    SelectComponent,
    SelectOption,
} from '../../../shared/components/select/select.component';
import { AuthService } from '../../../core/service/auth.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardComponent,
        CardHeaderComponent,
        CardContentComponent,
        InputComponent,
        ButtonComponent,
        AlertComponent,
        LinkComponent,
        SelectComponent,
        DividerComponent,
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
    signupForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');

    name = signal('');
    email = signal('');
    password = signal('');
    confirmPassword = signal('');
    mobileCountryCode = signal('91');
    mobileNumber = signal('');
    houseNo = signal('');
    addressLine1 = signal('');
    addressLine2 = signal('');
    landmark = signal('');
    city = signal('');
    state = signal('');
    pinCode = signal('');
    country = signal('India');

    countryCodeOptions = signal<SelectOption[]>([
        { label: '+91 (India)', value: '91' },
    ]);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.signupForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
            mobileCountryCode: ['91', [Validators.required]],
            mobileNumber: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]{10}$/),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            houseNo: ['', [Validators.required]],
            addressLine1: ['', [Validators.required]],
            addressLine2: [''],
            landmark: [''],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            pinCode: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]{6}$/),
                    Validators.minLength(6),
                    Validators.maxLength(6),
                ],
            ],
            country: ['India', [Validators.required]],
        });
    }

    onSubmit(): void {
        if (this.signupForm.valid) {
            const password = this.signupForm.get('password')?.value;
            const confirmPassword =
                this.signupForm.get('confirmPassword')?.value;

            if (password !== confirmPassword) {
                this.errorMessage.set('Passwords do not match');
                return;
            }

            this.isLoading.set(true);
            this.errorMessage.set('');
            this.successMessage.set('');

            const response = this.authService.registerCustomer({
                name: this.name(),
                email: this.email(),
                password: this.password(),
                mobileCountryCode: this.mobileCountryCode(),
                mobileNumber: this.mobileNumber(),
                houseNo: this.houseNo(),
                addressLine1: this.addressLine2(),
                addressLine2: this.addressLine2(),
                landmark: this.landmark(),
                city: this.city(),
                state: this.state(),
                pinCode: this.pinCode(),
                country: this.country(),
            });

            setTimeout(() => {
                if (response.success) {
                    this.router.navigate(['']);
                } else {
                    this.errorMessage.set(response.message);
                }

                this.isLoading.set(false);
                this.successMessage.set('Account created successfully!');

                this.router.navigate(['/login']);
            }, 2000);
        } else {
            this.markFormGroupTouched(this.signupForm);
            this.errorMessage.set(
                'Please fill in all required fields correctly.'
            );
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    getFieldError(fieldName: string): string {
        const control = this.signupForm.get(fieldName);
        if (control?.hasError('required') && control?.touched) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }
        if (control?.hasError('email') && control?.touched) {
            return 'Please enter a valid email address';
        }
        if (control?.hasError('minlength') && control?.touched) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `${this.getFieldLabel(
                fieldName
            )} must be at least ${minLength} characters`;
        }
        if (control?.hasError('maxlength') && control?.touched) {
            const maxLength = control.errors?.['maxlength'].requiredLength;
            return `${this.getFieldLabel(
                fieldName
            )} must not exceed ${maxLength} characters`;
        }
        if (control?.hasError('pattern') && control?.touched) {
            if (fieldName === 'mobileNumber') {
                return 'Mobile number must be 10 digits';
            }
            if (fieldName === 'pinCode') {
                return 'PIN code must be 6 digits';
            }
            return `Invalid ${this.getFieldLabel(fieldName).toLowerCase()}`;
        }
        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            name: 'Name',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            mobileCountryCode: 'Country Code',
            mobileNumber: 'Mobile Number',
            houseNo: 'House/Flat No',
            addressLine1: 'Address Line 1',
            addressLine2: 'Address Line 2',
            landmark: 'Landmark',
            city: 'City',
            state: 'State',
            pinCode: 'PIN Code',
            country: 'Country',
        };
        return labels[fieldName] || fieldName;
    }

    updateField(fieldName: string, value: string): void {
        this.signupForm.patchValue({ [fieldName]: value });
        this.signupForm.get(fieldName)?.markAsTouched();
    }

    onCountryCodeChange(value: string): void {
        this.mobileCountryCode.set(value);
        this.updateField('mobileCountryCode', value);
        if (value === '91') {
            this.country.set('India');
            this.updateField('country', 'India');
        }
    }
}
