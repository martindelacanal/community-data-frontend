import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/login/auth.service';
import { interval, } from 'rxjs';
import { delay, retryWhen, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdleService } from './services/login/idle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'community-data-frontend';

  isLogged = false;
  errorConnection = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
    private idleService: IdleService,
  ) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    translate.use(localStorage.getItem('language') || 'en');
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

    interval(6000)
      .pipe(
        switchMap(() => {
          const token = localStorage.getItem('token');
          if (token && !this.authService.isAuth()) {
            this.openSnackBar(this.translate.instant('connection_session_expired'));
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000); // retrasar la navegación 3 segundos
          } else {
            if (token && this.authService.isTokenNextToExpire()) {
              // si esta proximo a vencer, pedir renovacion de token, sino redirigir a login
              this.authService.refreshToken().subscribe(
                (res: any) => {
                  if (!res.token) { // error renovando token
                    this.openSnackBar(this.translate.instant('connection_session_expired'));
                    localStorage.removeItem('token');
                    setTimeout(() => {
                      this.router.navigate(['/login']);
                    }, 3000); // retrasar la navegación 3 segundos
                  } else {
                    localStorage.setItem('token', res.token);
                  }
                },
                (err) => {
                  console.error(err);
                  this.openSnackBar(this.translate.instant('connection_session_expired'));
                  localStorage.removeItem('token');
                  setTimeout(() => {
                    this.router.navigate(['/login']);
                  }, 3000); // retrasar la navegación 3 segundos
                }
              );
            }
          }
          return this.http.get(environment.url_api + '/ping').pipe(
            retryWhen(errors => errors.pipe(
              // Imprime el error en la consola
              tap(() => this.conexionError()),
              // Espera 6 segundos antes de reintentar
              delay(6000)
            ))
          );
        })
      )
      .subscribe(
        () => this.conexionExitosa(),
        () => this.conexionErrorInesperado()
      );

    // Detecta la inactividad del usuario (1 hora sin actividad)
    this.idleService.onIdle.subscribe(() => {
      const token = localStorage.getItem('token');
      if (token && this.authService.isAuth()) {
        this.openSnackBar(this.translate.instant('connection_session_expired'));
        localStorage.removeItem('token');
        setTimeout(() => {
          this.router.navigate(['/login']); // redirigir a /login
        }, 3000); // retrasar la navegación 3 segundos
      }
    });

    this.idleService.startWatching();
  }

  conexionExitosa() {
    if (this.errorConnection) {
      this.errorConnection = false;
      this.openSnackBar(this.translate.instant('connection_success'));
    }
  }

  conexionError() {
    if (!this.errorConnection) {
      this.errorConnection = true;
    }
    this.openSnackBar(this.translate.instant('connection_error'));
  }

  conexionErrorInesperado() {
    this.openSnackBarClose(this.translate.instant('connection_error_full'));
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  openSnackBarClose(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

}
