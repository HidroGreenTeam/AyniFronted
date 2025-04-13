import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SignUpRequest } from '../model/sign-up.request';
import { SignUpResponse } from '../model/sign-up.response';
import { SignInRequest } from '../model/sign-in.request';
import { SignInResponse } from '../model/sign-in.response';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  basePath: string = `${environment.serverBasePath}`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(
    0,
  );
  private signedInUsername: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  signUp(signUpRequest: SignUpRequest) {
    return this.http
      .post<SignUpResponse>(
        `${this.basePath}/auth/sign-up`,
        signUpRequest,
        this.httpOptions,
      )
      .subscribe({
        next: (response) => {
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
          this.router.navigate(['/sign-up']).then();
        },
      });
  }

  signIn(signInRequest: SignInRequest) {
    return this.http
      .post<SignInResponse>(
        `${this.basePath}/auth/sign-in`,
        signInRequest,
        this.httpOptions,
      )
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.email);
          localStorage.setItem('token', response.token);
          console.log(`Signed in as with token ${response.token}`);
          this.router.navigate(['/dashboard']).then();
        },
        error: (error) => {
          console.error(`Error while signing in: ${error}`);
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInUsername.next('');
          localStorage.removeItem('token');
          this.router.navigate(['/sign-in']).then();
        },
      });
  }

  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']).then();
  }
}
