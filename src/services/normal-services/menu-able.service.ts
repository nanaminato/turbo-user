import {Injectable} from "@angular/core";
import {fastFood} from "ionicons/icons";

@Injectable({
  providedIn: "root"
})
export class MenuAbleService{
  public imageDisable = true;
  public chatDisable = false;
  public videoDisable: boolean = true;
  public mediaDisable: boolean = true;
  disableAll(){
    this.chatDisable = true;
    this.imageDisable = true;
    this.videoDisable = true;
    this.mediaDisable = true;
  }
  ableAll(){
    this.chatDisable = false;
    this.imageDisable = false;
    this.videoDisable = false;
    this.mediaDisable = false;
  }
  enableChat(){
    this.chatDisable = false;
    this.imageDisable = true;
    this.videoDisable = true;
    this.mediaDisable = true;
  }
  enableImage(){
    this.chatDisable = true;
    this.imageDisable = false;
    this.videoDisable = true;
    this.mediaDisable = true;
  }
  enableVideo(){
    this.chatDisable = true;
    this.imageDisable = true;
    this.videoDisable = false;
    this.mediaDisable = true;
  }
  enableMedia(){
    this.chatDisable = true;
    this.imageDisable = true;
    this.videoDisable = true;
    this.mediaDisable = false;
  }
}
