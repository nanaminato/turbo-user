import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MenuAbleService{
  public imageDisable = true;
  public chatDisable = false;
  videoDisable: boolean = true;
  disableAll(){
    this.chatDisable = true;
    this.imageDisable = true;
    this.videoDisable = true;
  }
  ableAll(){
    this.chatDisable = false;
    this.imageDisable = false;
    this.videoDisable = false;
  }
  enableChat(){
    this.chatDisable = false;
    this.imageDisable = true;
    this.videoDisable = true;
  }
  enableImage(){
    this.chatDisable = true;
    this.imageDisable = false;
    this.videoDisable = true;
  }
  enableVideo(){
    this.chatDisable = true;
    this.imageDisable = true;
    this.videoDisable = false;
  }
}
