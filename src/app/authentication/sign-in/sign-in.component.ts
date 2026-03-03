import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { AuthAdminService } from '../../services/auth-admin.service';
import { Login } from '../../interfaces/Login';
import { AdministratorService } from '../../services/administrator.service';
import { administrator } from '../../interfaces/administrator';

@Component({
    selector: 'app-sign-in',
    imports: [MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
    standalone: true
})
export class SignInComponent {
    isError: boolean = false;
    

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authAdminService: AuthAdminService,
        private sessionService: SessionService,
        private adminService: AdministratorService
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;
    onSubmit() {
        if (this.authForm.valid) {
            let login:Login = {
                "email": this.authForm.value["email"],
                "password" : this.authForm.value["password"]
            };
            
            this.adminService.login(login).subscribe((data: administrator) => {
                if(data == null)
                    this.isError = true;
                else
                {
                    this.authAdminService.login(data);
                    this.router.navigate(['/home']);
                }
            });;
            
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }


    ngOnInit(){
        if (this.sessionService.getAdmin()) {
            this.router.navigate(['/home']);
        }
    }
   
}