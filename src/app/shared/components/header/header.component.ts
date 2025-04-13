import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FarmerService } from '../../../profile/services/farmer.service';
import { Subscription } from 'rxjs';
import { UserStateService } from '../../services/user-state.service';
import { AuthenticationService } from '../../../iam/services/authentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
 

  @Output() menuClicked = new EventEmitter<void>();
  userName: string = 'Usuario';
  userImage?: string;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public userState: UserStateService, private authenticationService: AuthenticationService
  ) {
    
   
  }

  ngOnInit(): void {
    this.authenticationService.currentUserId.subscribe((id: number) => {
      this.userState.loadUserData(id);
    });
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleSidebar() {
    this.menuClicked.emit();
  }

  onNotificationsClick() {}

  onSettingsClick() {}

  onProfileClick() {}
}