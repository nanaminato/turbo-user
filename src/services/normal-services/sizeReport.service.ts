import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SizeReportService{
  width: number | undefined;
  height: number | undefined;
  menuVisible: boolean = true;

  /**
   * Keep the compact layout for phones and small tablets only.  The previous
   * 1400px threshold made most laptop screens behave like a phone layout.
   */
  private readonly compactBreakpoint = 900;
  private readonly superCompactBreakpoint = 360;

  updateViewport(width: number, height: number) {
    const wasCompact = this.miniPhoneView();
    this.width = width;
    this.height = height;

    // Do not undo a user's menu choice while they resize within the same
    // layout.  Only choose a sensible default when crossing a breakpoint.
    if (wasCompact !== this.miniPhoneView()) {
      this.menuVisible = !this.miniPhoneView();
    }
  }

  public miniPhoneView() {
    if(!this.width) return false;
    return this.width <= this.compactBreakpoint;
  }
  public superMiniView(){
    if(!this.width) return false;
    return this.width <= this.superCompactBreakpoint;
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
