import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ServiceProvider{
  public readonly apiUrl = environment.apiUrl;
}
