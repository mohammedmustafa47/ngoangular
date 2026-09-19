import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../services/auth.service';

// Endpoints that don't require (and must not receive) a bearer token — the backend runs
// JWTAuthentication globally, so an expired/invalid token attached here gets the whole
// request rejected with 401 before it ever reaches the view, even for a fresh login attempt.
const PUBLIC_ENDPOINTS = [
  'auth_login',
  'auth_register',
  'auth_verify_email',
  'auth_resend_otp',
  'auth_password_reset/',
  '/api/token/refresh/',
];

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (PUBLIC_ENDPOINTS.some(endpoint => req.url.includes(endpoint))) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();
    const authReq = accessToken ? this.withToken(req, accessToken) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.access);
          return next.handle(this.withToken(req, res.access));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }

    // A refresh is already in flight — wait for it instead of firing a second one.
    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token => next.handle(this.withToken(req, token)))
    );
  }

  private withToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
}
