import {Role} from "./role";


export interface User{
  nickname?: string;
  id: number;
  name: string;
  roles?: Role[];
}
