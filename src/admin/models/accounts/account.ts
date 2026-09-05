import {Role} from "./role";


export interface Account{
  accountId: number;
  username: string;
  password: string;
  email?: string;
  userRoles? : Role[];
}
