import { Component, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

interface CountryCode {
    code: string;
    name: string;
    flag: string;
}

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');

    countryCodes: CountryCode[] = [
        { code: '+91', name: 'India', flag: '🇮🇳' },
        { code: '+1', name: 'USA', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' },
        { code: '+61', name: 'Australia', flag: '🇦🇺' },
        { code: '+86', name: 'China', flag: '🇨🇳' },
        { code: '+81', name: 'Japan', flag: '🇯🇵' },
        { code: '+49', name: 'Germany', flag: '🇩🇪' },
        { code: '+33', name: 'France', flag: '🇫🇷' },
        { code: '+971', name: 'UAE', flag: '🇦🇪' },
        { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    ];

    countries: string[] = [
        'India',
        'USA',
        'UK',
        'Australia',
        'China',
        'Japan',
        'Germany',
        'France',
        'UAE',
        'Singapore',
        'Canada',
        'Other',
    ];

    private passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;

    signupForm = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(this.passwordPattern),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        mobileCountryCode: new FormControl('+91', [Validators.required]),
        mobileNumber: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/),
            Validators.minLength(10),
            Validators.maxLength(10),
        ]),
        alternateMobileCountryCode: new FormControl('+91'),
        alternateMobileNumber: new FormControl('', [
            Validators.pattern(/^[0-9]{10}$/),
            Validators.minLength(10),
            Validators.maxLength(10),
        ]),
        houseNo: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9\s\-\/]+$/),
        ]),
        addressLine1: new FormControl('', [Validators.required]),
        addressLine2: new FormControl(''),
        landmark: new FormControl(''),
        city: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        state: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-zA-Z\s]+$/),
        ]),
        pinCode: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[0-9]{6}$/),
            Validators.minLength(6),
            Validators.maxLength(6),
        ]),
        country: new FormControl('India', [Validators.required]),
        allowNotifications: new FormControl(false),
    });

    constructor(private router: Router, private authService: AuthService) {}

    onSubmit(): void {
        if (this.signupForm.valid) {
            const password = this.signupForm.value.password!;
            const confirmPassword = this.signupForm.value.confirmPassword!;

            if (password !== confirmPassword) {
                this.errorMessage.set('Passwords do not match');
                return;
            }

            this.isLoading.set(true);
            this.errorMessage.set('');
            this.successMessage.set('');

            const response = this.authService.registerCustomer({
                name: this.signupForm.value.name!,
                email: this.signupForm.value.email!,
                password: password,
                mobileCountryCode: this.signupForm.value.mobileCountryCode!,
                mobileNumber: this.signupForm.value.mobileNumber!,
                alternateMobileCountryCode:
                    this.signupForm.value.alternateMobileCountryCode || '',
                alternateMobileNumber:
                    this.signupForm.value.alternateMobileNumber || '',
                houseNo: this.signupForm.value.houseNo!,
                addressLine1: this.signupForm.value.addressLine1!,
                addressLine2: this.signupForm.value.addressLine2 || '',
                landmark: this.signupForm.value.landmark || '',
                city: this.signupForm.value.city!,
                state: this.signupForm.value.state!,
                pinCode: this.signupForm.value.pinCode!,
                country: this.signupForm.value.country!,
                allowNotifications:
                    this.signupForm.value.allowNotifications || false,
            });

            setTimeout(() => {
                if (response.success) {
                    this.successMessage.set('Account created successfully!');
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 1000);
                } else {
                    this.errorMessage.set(response.message);
                }
                this.isLoading.set(false);
            }, 1500);
        } else {
            Object.keys(this.signupForm.controls).forEach((key) => {
                this.signupForm.get(key)?.markAsTouched();
            });
            this.errorMessage.set(
                'Please fill in all required fields correctly.'
            );
        }
    }

    getFieldError(fieldName: string): string {
        const control = this.signupForm.get(fieldName);

        if (!control || !control.touched) return '';

        if (control.hasError('required')) {
            switch (fieldName) {
                case 'name':
                    return 'Name is required';
                case 'email':
                    return 'Email is required';
                case 'password':
                    return 'Password is required';
                case 'confirmPassword':
                    return 'Confirm Password is required';
                case 'mobileCountryCode':
                    return 'Country code is required';
                case 'mobileNumber':
                    return 'Mobile number is required';
                case 'houseNo':
                    return 'House/Flat number is required';
                case 'addressLine1':
                    return 'Address Line 1 is required';
                case 'city':
                    return 'City is required';
                case 'state':
                    return 'State is required';
                case 'pinCode':
                    return 'PIN code is required';
                case 'country':
                    return 'Country is required';
                default:
                    return 'This field is required';
            }
        }

        if (control.hasError('email')) {
            return 'Please enter a valid email address';
        }

        if (control.hasError('minlength')) {
            const min = control.errors?.['minlength']?.requiredLength;
            return `Must be at least ${min} characters`;
        }

        if (control.hasError('maxlength')) {
            const max = control.errors?.['maxlength']?.requiredLength;
            return `Must not exceed ${max} characters`;
        }

        if (control.hasError('pattern')) {
            switch (fieldName) {
                case 'password':
                    return 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character';
                case 'mobileNumber':
                case 'alternateMobileNumber':
                    return 'Mobile number must be exactly 10 digits';
                case 'pinCode':
                    return 'PIN code must be exactly 6 digits';
                case 'name':
                case 'city':
                case 'state':
                    return 'Only letters are allowed';
                case 'houseNo':
                    return 'Only letters, numbers, spaces, hyphens, and slashes are allowed';
                default:
                    return 'Invalid value';
            }
        }

        return '';
    }
}
