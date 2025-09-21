import {Injectable} from "@angular/core";
import {ChatModel, Configuration, ContentClip, Message, SystemRole, VisionMessage} from "../../models";
import {ShowType} from "../../models/enumerates";
import {ChatContext, SystemContext} from "../normal-services";

@Injectable({
  providedIn: "root",
})
export class ChatContextHandler{
  handler(back: number | undefined,
          configuration: Configuration,
          chatModels: ChatModel[],
          endPointer: number | undefined): Message[]|VisionMessage[]{
    let sessionLength = configuration?.chatConfiguration.historySessionLength!;
    let messages: Message[] | VisionMessage[] = [];
    const originalArray = [...chatModels]; // 创建 chatModels 的副本
    const reversedArray = originalArray.reverse();
    let vision = configuration.model.vision;
    for (let chatModel of reversedArray) {
      if (messages.length >= sessionLength) break;
      if(endPointer!==undefined && chatModel.dataId!>endPointer!){
        // 如果传递了 结束指针，就跳过结束指针之后的聊天模型对象
        continue;
      }
      if (chatModel.dataId! >= back!) {
        let content = chatModel.content;
        if(chatModel.fileList===undefined||chatModel.fileList.length===0){

        }else{
          for (let file of chatModel.fileList!.filter(f=>!f.fileType?.startsWith("image"))){
            content += `\n filename: ${file.fileName} \n parsed file content: ${file.parsedContent}\n`
              ;
          }
        }

        if(vision){
          let complexContent:ContentClip[] = [];
          complexContent.push({
            type: "text",
            text: content
          })
          if(chatModel.fileList!==undefined){
            let files = chatModel.fileList!.filter(f=>f.fileType?.startsWith("image"));
            for(let img of files){
              complexContent.push({
                type: "image_url",
                image_url: {
                  url: img.fileContent!,
                  detail: configuration.chatConfiguration.detail
                }
              })
            }
          }


          messages.splice(0,0,{
            role: chatModel.role,
            content: complexContent
          })
        }else{
          messages.splice(0, 0, {
            role: chatModel.role,
            content: content
          })
        }

      }
    }
    return messages;
  }

  handlerBefore(chatContext: ChatContext,
                chatModels: ChatModel[],
                messages: Message[] | VisionMessage[]) {
    let systemMs = chatContext.systems!;
    let ignores: SystemContext[] = systemMs;
    if(chatContext.pointer!==undefined){
      ignores = systemMs.filter(ms=>ms.id < chatContext.pointer! && ms.in);
    }
    for (let ms of ignores){
      let chatModel = chatModels.find(m=>m.dataId===ms.id);
      if(chatModel!==undefined){
        messages.splice(0,0,
          {
            role: SystemRole,
            content: chatModel.content,
          }
        );
      }
    }
  }
}
