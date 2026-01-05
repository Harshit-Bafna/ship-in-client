import { Component, signal } from '@angular/core';
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
    CardFooterComponent,
} from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { LinkComponent } from '../../../shared/components/link/link.component';

@Component({
    selector: 'app-login',
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
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal('');
    username = signal('');
    password = signal('');

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set('');

            setTimeout(() => {
                console.log('Login data:', this.loginForm.value);
                this.isLoading.set(false);
                // this.router.navigate(['/dashboard']);
            }, 1500);
        } else {
            this.markFormGroupTouched(this.loginForm);
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
        const control = this.loginForm.get(fieldName);
        if (control?.hasError('required') && control?.touched) {
            return `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } is required`;
        }
        if (control?.hasError('minlength') && control?.touched) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } must be at least ${minLength} characters`;
        }
        return '';
    }

    updateUsername(value: string): void {
        this.loginForm.patchValue({ username: value });
        this.loginForm.get('username')?.markAsTouched();
    }

    updatePassword(value: string): void {
        this.loginForm.patchValue({ password: value });
        this.loginForm.get('password')?.markAsTouched();
    }
}
