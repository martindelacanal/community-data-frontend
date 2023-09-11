import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'community-data-frontend';

  isLogged = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.isAuthObservable().subscribe((res) => {
      this.isLogged = res;
    });
  }

  ngOnInit() {
    this.authService.getIsAuthenticated().subscribe(isAuthenticated => {
      this.isLogged = isAuthenticated;
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }
}
