import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authentication-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authentication-section.component.html',
  styleUrl: './authentication-section.component.css',
})
export default class AuthenticationSectionComponent {
  currentUsername: string = '';
  isSignedIn: boolean = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUsername.subscribe((username) => {
      this.currentUsername = username;
    });
    this.authenticationService.isSignedIn.subscribe((isSignedIn) => {
      this.isSignedIn = isSignedIn;
    });
  }

  onSignIn() {
    this.router.navigate(['/sign-in']).then();
  }

  onRegister() {
    this.router.navigate(['/register']).then();
  }

  onLogout() {
    this.authenticationService.signOut();
  }
}
