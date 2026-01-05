import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from "./features/customer/signup/signup.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SignupComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'ship-in';
}
