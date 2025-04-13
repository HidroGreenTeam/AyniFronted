import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { SignUpRequest } from '../../model/sign-up.request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export default class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitted = signal(false);
  registrationError = signal(false);
  passwordFieldType = signal<'password' | 'text'>('password');

  constructor(
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    });

    this.form.valueChanges.subscribe(() => {
      this.submitted.set(false);
      this.registrationError.set(false);
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType.update((value) =>
      value === 'password' ? 'text' : 'password',
    );
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { fullname, email, password } = this.form.value;
    const signUpRequest = new SignUpRequest(fullname, email, password);

    this.authenticationService.signUp(signUpRequest);
    if (this.authenticationService) {
      this.submitted.set(true);
      this.registrationError.set(false);
    } else {
      this.registrationError.set(true);
    }
  }

  signIn(): void {
    this.router.navigate(['/sign-in']);
  }
}
