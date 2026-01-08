import { Component, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, IUserDetails } from '../../../core/service/auth.service';
import { EUserRole } from '../../../core/enums/EUserRole';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    isLoading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');

    private passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;

    loginForm = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(this.passwordPattern),
        ]),
    });

    constructor(private router: Router, private authService: AuthService) {}

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');

            const response = this.authService.login(
                this.loginForm.value.username!,
                this.loginForm.value.password!
            );

            if (response.success) {
                const responseData: IUserDetails =
                    response.data as IUserDetails;

                if (responseData.role === EUserRole.CUSTOMER) {
                    this.successMessage.set(response.message);
                    this.router.navigateByUrl('/customer');
                } else if (responseData.role === EUserRole.OFFICER) {
                    this.router.navigateByUrl('/officer');
                }
            } else {
                this.errorMessage.set(response.message);
            }

            this.isLoading.set(false);
        } else {
            Object.keys(this.loginForm.controls).forEach((key) => {
                this.loginForm.get(key)?.markAsTouched();
            });
            this.errorMessage.set(
                'Please fill in all required fields correctly.'
            );
        }
    }

    getFieldError(fieldName: string): string {
        const control = this.loginForm.get(fieldName);

        if (!control?.touched) return '';

        if (control.hasError('required')) {
            return `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } is required`;
        }

        if (control.hasError('minlength')) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } must be at least ${minLength} characters`;
        }

        if (control.hasError('pattern') && fieldName === 'password') {
            return 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character';
        }

        return '';
    }
}
