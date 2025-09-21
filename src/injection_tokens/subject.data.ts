import {InjectionToken} from "@angular/core";

export const chatSessionSubject = new InjectionToken("chat-session-subject");
export const backChatHistorySubject = new InjectionToken("back-chat-history-subject");
export const configurationChangeSubject = new InjectionToken("configuration-change");
export const systemPromptChangeSubject = new InjectionToken("system-prompt");
export const loginSubject = new InjectionToken("login");// 这个用于新引入的分用户消息
export const historyChangeSubject = new InjectionToken("history-change");
