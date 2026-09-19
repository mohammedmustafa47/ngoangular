import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: Auth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const expectedRoles: string[] = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}




// import { CanActivateFn } from '@angular/router';

// export const roleGuard: CanActivateFn = (route, state) => {
//   return true;
// };
