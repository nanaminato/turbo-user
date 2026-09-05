import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Account, Role} from "../models/accounts";
import {ServiceProvider} from "../roots";
@Injectable(
  {
    providedIn: "root"
  }
)
export class AccountCallService {
  constructor(private http: HttpClient, private provider: ServiceProvider
  ) {

  }
  login(body: any){
    return this.http.post<any>(`${this.provider.apiUrl}api/auth/login`, body);
  }
  getRolesWithUserId(userId?: number){
    if(userId===undefined){
      return this.http.get<Role[]>(`${this.provider.apiUrl}api/role`);
    }
    return this.http.get<Role[]>(`${this.provider.apiUrl}api/role?userId=${userId}`);
  }
  getAccountsWithRole(roleId?: number) {
    if(roleId===undefined){
      return this.http.get<Account[]>(`${this.provider.apiUrl}api/account`);
    }
    return this.http.get<Account[]>(`${this.provider.apiUrl}api/account?roleId=${roleId}`);
  }
  getAccountById(id: number){
    return this.http.get<Account>(`${this.provider.apiUrl}api/account/${id}`);
  }
  deleteAccountById(id: number){
    return this.http.delete<any>(`${this.provider.apiUrl}api/account/${id}`);
  }
  addRole(name: string){
    return this.http.post<any>(`${this.provider.apiUrl}api/role`, {name: name})
  }
  deleteRoleById(id: number){
    return this.http.delete(`${this.provider.apiUrl}api/role/${id}`);
  }
  updateRole(role: Role){
    return this.http.put(`${this.provider.apiUrl}api/role/${role.roleId}`,role);
  }

  addAccount(account: Account) {
    return this.http.post<any>(`${this.provider.apiUrl}api/account`, account)
  }
  updateAccount(account: Account){
    return this.http.put(`${this.provider.apiUrl}api/account/${account.accountId}`,account);
  }
}
