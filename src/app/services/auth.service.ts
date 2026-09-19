import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, from, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = environment.apiUrl;
  private loginUrl = this.baseUrl + 'auth_login';  // No trailing slash to match Django
  private registerUrl = this.baseUrl + 'auth_register';  // No trailing slash to match Django
  private refreshUrl = environment.local_url + '/api/token/refresh/';  // Root-mounted, not under /authapi/

  constructor(private http: HttpClient, private router: Router) {}

  /** 🔑 LOGIN */
  login(email: string, password: string): Observable<any> {
  return this.http.post(this.loginUrl, { email, password }).pipe(
    tap((res: any) => {
      if (res.access) {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('user_role',res.user.role);
      }
    })
  );
}

  /** 🧾 REGISTER */
  register(username: string, password: string, email: string, pincode: string, role: string): Observable<any> {
    const payload = { username, password, email, pincode, role };
    return this.http.post(this.registerUrl, payload);
  }

  /** ✅ VERIFY EMAIL OTP */
  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth_verify_email', { email, otp });
  }

  /** 🔁 RESEND VERIFICATION OTP */
  resendOtp(email: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth_resend_otp', { email });
  }

  /** 🔐 FORGOT PASSWORD - STEP 1: request reset code */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth_password_reset/request', { email });
  }

  /** 🔐 FORGOT PASSWORD - STEP 2: verify OTP */
  verifyPasswordResetOtp(email: string, otp: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth_password_reset/verify-otp', { email, otp });
  }

  /** 🔐 FORGOT PASSWORD - STEP 3: set new password */
  confirmPasswordReset(email: string, otp: string, new_password: string, confirm_password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth_password_reset/confirm', { email, otp, new_password, confirm_password });
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

  /** 👤 PROFILE */
  getProfile(): Observable<any> {
    return this.http.get(this.baseUrl + 'auth_profile');
  }

  /** 🏠 DASHBOARD */
  getDashboard(): Observable<any> {
    return this.http.get(this.baseUrl + 'auth_dashboard');
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

  /** 📝 GET LIST - Retrieve a list of records by type
   * DRF paginates list endpoints as { count, next, previous, results }.
   * Unwrap to the plain array so callers can treat this as one always.
   * Follows `next` across every page so a list beyond the first 10 items isn't silently truncated.
   */
  getList(record_type: string): Promise<any> {
    return this.fetchAllPages(this.baseUrl + record_type + '/');
  }

  /** Follows DRF's `next` pagination link until exhausted, returning every page's `results` flattened into one array. */
  private fetchAllPages(url: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const fetchPage = (pageUrl: string) => {
        this.http.get(pageUrl).toPromise().then((result: any) => {
          if (Array.isArray(result)) {
            resolve(result);
            return;
          }
          results.push(...(result?.results ?? []));
          if (result?.next) {
            fetchPage(result.next);
          } else {
            resolve(results);
          }
        }).catch(reject);
      };
      fetchPage(url);
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

  /** 🗑️ DELETE RECORD - Delete a record by type + id, e.g. deleteRecord('donations', 12) */
  deleteRecord(record_type: string, id: number | string): Promise<any> {
    const url = this.baseUrl + record_type + '/' + id + '/';
    return this.http.delete(url).toPromise();
  }

  /** 🚀 POST ACTION - Call an endpoint action, e.g. donations/{id}/pick_donation/ */
  postAction(endpoint: string, body: any = {}): Observable<any> {
    const url = this.baseUrl + endpoint;
    return this.http.post(url, body);
  }

  /** 📊 ANALYTICS */
  getSuperAdminAnalytics(): Observable<any> {
    return this.http.get(this.baseUrl + 'analytics/super-admin');
  }

  getAreaAdminAnalytics(areaId?: number | string): Observable<any> {
    const params = areaId != null ? `?area_id=${areaId}` : '';
    return this.http.get(this.baseUrl + 'analytics/area-admin' + params);
  }

  getDonorAnalytics(): Observable<any> {
    return this.http.get(this.baseUrl + 'analytics/donor');
  }

  getVolunteerAnalytics(): Observable<any> {
    return this.http.get(this.baseUrl + 'analytics/volunteer');
  }

  /** 🗺️ AREAS - any authenticated user can read, only Super Admin can write */
  getAreas(): Observable<any> {
    return from(this.fetchAllPages(this.baseUrl + 'areas/'));
  }

  getArea(id: number | string): Observable<any> {
    return this.http.get(this.baseUrl + 'areas/' + id + '/');
  }

  createArea(data: { name: string; pincodes: string[]; is_active?: boolean }): Observable<any> {
    return this.http.post(this.baseUrl + 'areas/', data);
  }

  updateArea(id: number | string, data: Partial<{ name: string; pincodes: string[]; is_active: boolean }>): Observable<any> {
    return this.http.patch(this.baseUrl + 'areas/' + id + '/', data);
  }

  deleteArea(id: number | string): Observable<any> {
    return this.http.delete(this.baseUrl + 'areas/' + id + '/');
  }

  /** 🕒 PENDING SIGNUPS & ASSIGNMENT - Super Admin only */
  getPendingAreaUsers(): Observable<any> {
    return from(this.fetchAllPages(this.baseUrl + 'pending-area-users'));
  }

  assignArea(userId: number, areaId: number): Observable<any> {
    return this.http.post(this.baseUrl + 'assign-area', { user_id: userId, area_id: areaId });
  }

  /** UNATTENDED DONATIONS - Super Admin only. Pending donations in areas with no active Area Admin. */
  getUnattendedDonations(): Observable<any> {
    return from(this.fetchAllPages(this.baseUrl + 'unattended-donations'));
  }

  /** 🧑‍💼 CREATE AREA ADMIN - Super Admin only. Account is active + verified immediately, no OTP. */
  createAreaAdmin(data: { username: string; email: string; password: string; area_id: number }): Observable<any> {
    return this.http.post(this.baseUrl + 'create-area-admin', data);
  }

  /** 💼 SAVE RECORD - Create or update a record based on whether it has an ID */
  saveRecord(record_type: any, record_data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      record_data['updated_by'] = 1;
      let end_point = record_type + '/';
      if (record_data.id != undefined) {
        end_point += record_data.id + '/';
        this.patchData(end_point, record_data).then(resolve).catch(reject);
      }
      else {
        this.saveList(record_type, record_data).then(resolve).catch(reject);
      }
    });
  }
}
