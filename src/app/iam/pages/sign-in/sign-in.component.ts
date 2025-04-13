import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SignInRequest } from '../../model/sign-in.request';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export default class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = signal(false);
  loginError = signal(false);
  passwordFieldType = signal<'password' | 'text'>('password');

  constructor(
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      this.submitted.set(false);
      this.loginError.set(false);
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType.update((value) =>
      value === 'password' ? 'text' : 'password',
    );
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    const signInRequest = new SignInRequest(username, password);
    this.authenticationService.signIn(signInRequest);
    if (this.authenticationService.isSignedIn) {
      this.submitted.set(true);
      this.loginError.set(false);
    } else {
      this.loginError.set(true);
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  register() {
    this.router.navigate(['/sign-up']);
  }
}
