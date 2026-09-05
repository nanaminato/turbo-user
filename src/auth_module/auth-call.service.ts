import {ServiceProvider} from "../roots";
import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {Role} from "../models/accounts";
import type {AuthTokenResponse} from "./auth.service";

@Injectable(
  {
    providedIn: "root"
  }
)
export class AuthCallService {
  http = inject(HttpClient);
  provider = inject(ServiceProvider);

  login(body: { username: string; password: string; deviceName: string }) {
    return this.http.post<AuthTokenResponse>(`${this.provider.apiUrl}api/auth/login`, body);
  }

  refresh(body: { refreshToken: string; deviceName: string }) {
    return this.http.post<AuthTokenResponse>(`${this.provider.apiUrl}api/auth/refresh`, body);
  }

  logout(body: { refreshToken: string }) {
    return this.http.post(`${this.provider.apiUrl}api/auth/logout`, body);
  }

  register(body: any) {
    return this.http.post(`${this.provider.apiUrl}api/auth/register`,body);
  }
  check_token(){
    return this.http.get<any>(`${this.provider.apiUrl}api/verification/check-token`);
  }
  generateVerificationCode(){
    return this.http.get(`${this.provider.apiUrl}api/verification/generate`);
  }
  getRolesWithUserId(userId?: number){
    if(userId===undefined){
      return this.http.get<Role[]>(`${this.provider.apiUrl}api/role`);
    }
    return this.http.get<Role[]>(`${this.provider.apiUrl}api/role?userId=${userId}`);
  }
}
