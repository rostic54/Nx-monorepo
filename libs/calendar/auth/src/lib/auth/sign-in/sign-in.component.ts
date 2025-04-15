import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@angular-monorepo/services-calendar';
import { ILoginResponse } from '@angular-monorepo/types-calendar';

@Component({
  selector: 'lib-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });

    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      if (email) {
        this.form.get('email')?.setValue(email);
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const formValues = this.form.value;
      this.authService.login(formValues).subscribe({
        next: (response: ILoginResponse) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Sign-in error:', error);
          // Handle sign-in error, e.g., show error message
        },
      });
      // Perform sign-in logic here
    }
  }
}
