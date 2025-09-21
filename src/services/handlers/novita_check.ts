import {Injectable} from "@angular/core";
import {NovitaModel} from "../../models/media";
import {FramePrompt} from "../../models/videos";

@Injectable({
  providedIn: "root"
})
export class NovitaCheck{
  preCheck(modelList: { model_name?: string }[] | undefined){
    if(modelList===undefined) return 0;//success
    let len1 = modelList.length;
    let out = modelList.filter(m=>m.model_name!=='');
    let len2 = out.length;
    let res = 0;
    len1 == len2?res: res++;
    return len2>5?res+=2:res;// 0 total 1 存在空值 3 存在空值和非空值大于5条 2 非空值大于5条
  }
  filter(modelList: { model_name?: string }[] | undefined){
    if(modelList===undefined) return [];
    let out = modelList.filter(m=>m.model_name!=='');
    if(out.length>5){
      return out.slice(0,5);
    }
    return out;
  }
  filterVideoPrompts(framePrompts: FramePrompt[] | undefined): FramePrompt[]|undefined{
    if(framePrompts===undefined) return undefined;
    let out = framePrompts.filter(m=>m.prompt!=='');
    let res: FramePrompt[] = [];
    let frames = 0;
    for (let i = 0; i < out.length; i++) {
      const p = out[i];
      frames += p.frames;
      if (frames <= 128) {
        res.push(p);
      } else {
        break; // 使用break语句跳出循环
      }
    }
    return res;
  }
}
