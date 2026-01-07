import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/service/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.handleInitialNavigation();
    }

    handleInitialNavigation() {
        if (this.authService.isLoggedIn()) {
            const route = this.authService.getRedirectRouteByRole();
            this.router.navigateByUrl(route);
        } else {
            this.router.navigateByUrl('/login');
        }
    }
}
