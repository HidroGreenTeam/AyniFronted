import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../../iam/services/authentication.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private authService: AuthenticationService) {}

  @Output() menuClicked = new EventEmitter<void>();
  @Input() isVisible = false;

  logout(): void {
    this.authService.signOut();
  }

  closeSidebar() {
    this.menuClicked.emit();
  }
}
