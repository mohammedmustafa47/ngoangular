import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://127.0.0.1:8000/authapi/';
  private loginUrl = this.baseUrl + 'auth_login';  // No trailing slash to match Django
  private registerUrl = this.baseUrl + 'auth_register';  // No trailing slash to match Django
  private refreshUrl = this.baseUrl + 'token/refresh/';

  constructor(private http: HttpClient, private router: Router) {}

  /** 🔑 LOGIN */
  login(username: string, password: string): Observable<any> {
  return this.http.post(this.loginUrl, { username, password }).pipe(
    tap((res: any) => {
      if (res.access) {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('user_role',res.user.role);
      }
    })
  );
}

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post('http://127.0.0.1:8000/authapi/auth_login/', { username, password }).pipe(
  //     tap((res: any) => {
  //       if (res.result) {
  //         localStorage.setItem('access_token', res.access);
  //         localStorage.setItem('refresh_token', res.refresh);
  //         localStorage.setItem('user_role', res.role);
  //       }
  //     })
  //   );
  // }

  /** 🧾 REGISTER */
  register(username: string, password: string, email: string, role: string): Observable<any> {
    const payload = { username, password, email, role };
    return this.http.post(this.registerUrl, payload);
  }

  /** 🚪 LOGOUT */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /** 🧠 TOKEN HELPERS */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  /** 🔄 REFRESH TOKEN */
  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    if (!refresh) return throwError(() => 'No refresh token found');
    return this.http.post(this.refreshUrl, { refresh }).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access);
      })
    );
  }

  /** 📋 GET DATA - Generic method to retrieve data from backend */
  getData(endpoint: string, params: string): Promise<any> {
    const url = this.baseUrl + endpoint + params;
    return this.http.get(url).toPromise();
  }

  /** 📝 GET LIST - Retrieve a list of records by type */
  getList(record_type: string): Promise<any> {
    return new Promise(async (resolve) => {
      this.getData(record_type + '/', '').then((result) => {
        resolve(result);
      });
    });
  }

  /** 💾 SAVE LIST - Create a new record */
  saveList(record_type: string, record_data: any): Promise<any> {
    const url = this.baseUrl + record_type + '/';
    return this.http.post(url, record_data).toPromise();
  }

  /** ✏️ PATCH DATA - Update an existing record */
  patchData(endpoint: string, record_data: any): Promise<any> {
    const url = this.baseUrl + endpoint;
    return this.http.patch(url, record_data).toPromise();
  }

  /** 💼 SAVE RECORD - Create or update a record based on whether it has an ID */
  saveRecord(record_type: any, record_data: any): Promise<any> {
    return new Promise(async (resolve) => {
      record_data['updated_by'] = 1;
      let end_point = record_type + '/';
      if (record_data.id != undefined) {
        end_point += record_data.id + '/';
        this.patchData(end_point, record_data).then(result => {
          resolve(result);
        });
      }
      else {
        this.saveList(record_type, record_data).then(result => {
          resolve(result);
        });
      }
    });
  }
}




// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class Auth {
 
  


// }
