import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {}
