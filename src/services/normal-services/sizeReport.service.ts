import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SizeReportService{
  width: number | undefined;
  height: number | undefined;
  menuVisible: boolean = true;
  public miniPhoneView() {
    if(!this.width) return false;
    return this.width < 1400;
    // return this.width <= 606;
  }
  public superMiniView(){
    if(!this.width) return false;
    return this.width <= 300;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  hideMenu() {
    this.menuVisible = false;
  }

  showMenu() {
    this.menuVisible = true;
  }
}
