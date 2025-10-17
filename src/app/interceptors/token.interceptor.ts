import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(private authService: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    let authReq = req;

    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.authService.refreshToken().pipe(
            switchMap((res: any) => {
              this.isRefreshing = false;
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access}` }
              });
              return next.handle(newReq);
            }),
            catchError(err => {
              this.isRefreshing = false;
              this.authService.logout();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}



// import { HttpInterceptorFn } from '@angular/common/http';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
