import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { NgIf } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HttpClientModule,
    FormsModule,
    ButtonModule,
    TabsModule,
    DatePickerModule,
    FloatLabel,
    NgIf,
    RouterOutlet,
  ],
  providers: [UserService],
})
export class AppComponent implements OnInit {
  authenticated: boolean = false;
  userBudget: number = 0;
  monthlyDate: any;
  weeklyDate: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.monthlyDate = new Date();
    this.weeklyDate = new Date();
  }

  ngOnInit() {
    // Check if user is authenticated from query params
    this.route.queryParams.subscribe(params => {
      if (params['authenticated'] === 'true') {
        this.authenticated = true;
        this.loadUserData();
      }
    });

    // Check if token exists in localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        this.authenticated = true;
        this.loadUserData();
      } else {
        // If no token, ensure we're not authenticated
        this.authenticated = false;
        // Navigate to login if we're on dashboard without auth
        if (this.router.url.includes('dashboard')) {
          this.router.navigate(['/login']);
        }
      }
    }
  }

  loadUserData() {
    // Get user profile data
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response.data) {
          console.log('User profile loaded:', response.data);
        } else if (response.error) {
          console.error('Error loading profile:', response.error);
        }
      }
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
    }
    this.authenticated = false;
    this.router.navigate(['/login']);
  }
}
