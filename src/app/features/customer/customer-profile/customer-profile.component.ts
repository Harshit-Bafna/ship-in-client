import { Component, OnInit, inject } from '@angular/core';
import { AuthService, IUserDetails } from '../../../core/service/auth.service';
import { CustomerService } from '../../../core/service/customer.service';
import { ICustomerProfileDetailsResponse } from '../../../core/interfaces/response/customerProfileDetails';
import { CustomerLayoutComponent } from "../../../layout/main-layout/customer-layout/customer-layout.component";

@Component({
    selector: 'app-customer-profile',
    standalone: true,
    imports: [CustomerLayoutComponent],
    templateUrl: './customer-profile.component.html',
    styleUrls: ['./customer-profile.component.css'],
})
export class CustomerProfileComponent implements OnInit {
    user: ICustomerProfileDetailsResponse | null = null;

    constructor(
        private customerService: CustomerService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        const user = this.authService.getUserDetails().data as IUserDetails;

        const customerDetails = this.customerService.getCustomerDetails(
            user.id
        );
        if (customerDetails.success && customerDetails.data) {
            this.user = customerDetails.data as ICustomerProfileDetailsResponse;
        }
    }
}
