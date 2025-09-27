import {inject, Injectable} from "@angular/core";
import {AuthService, RequestManagerService} from "../../../auth_module";
import {Store} from "@ngrx/store";
import {ChatDataService} from "../../../services/db-services";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {chatHistoryActions} from "./chat-history.actions";
import {map, switchMap} from "rxjs";
import {ChatHistoryModel, ChatInterface, ChatListModel, ChatModel} from "../../../models";

@Injectable()
export class ChatHistoryEffects {
  private chatDataService = inject(ChatDataService);
  private requestManagerService = inject(RequestManagerService);
  private auth = inject(AuthService);
  private actions$ = inject(Actions);
  private store = inject(Store);

  loadSession$ = createEffect(() => this.actions$.pipe(
    ofType(chatHistoryActions.loadSession),
    map(({ sessionId }) => chatHistoryActions.loadFromDb({ sessionId })),
  ));

  loadFromDb$ = createEffect(() => this.actions$.pipe(
    ofType(chatHistoryActions.loadFromDb),
    switchMap(({ sessionId }) =>
      this.chatDataService.getChatHistory(sessionId).then(historyModel => {
        if (historyModel) {
          return chatHistoryActions.loadFromDbSuccess({ historyModel });
        } else {
          const emptyHistory = new ChatHistoryModel('', undefined, sessionId, this.auth.user?.id);
          return chatHistoryActions.loadFromDbSuccess({ historyModel: emptyHistory,  });
        }
      }).catch(() => chatHistoryActions.loadFromDbFailure())
    )
  ));

  afterLoadFromDb$ = createEffect(() => this.actions$.pipe(
    ofType(chatHistoryActions.loadFromDbSuccess),
    map(({ historyModel }) => {
      const chatList = historyModel.chatList ?? new ChatListModel(historyModel.dataId!,[]);
      return chatHistoryActions.loadFromHttp({ dataId: historyModel.dataId!, existingChatList: chatList });
    })
  ));


  loadFromHttp$ = createEffect(() => this.actions$.pipe(
    ofType(chatHistoryActions.loadFromHttp),
    switchMap(async ({ dataId, existingChatList }) => {
      try {
        const messageIds = existingChatList?.chatModel?.map(m => m.dataId!) ?? [];
        const messages = await this.requestManagerService.fetchMessage(dataId, messageIds);
        let mergedChatList: ChatListModel;

        if (messages) {
          let ch = messages.map((m: ChatInterface) => {
            return new ChatModel(
              m.role,
              m.content,
              m.fileList,
              m.dataId,
              true,
              m.model
            )}
          )
          mergedChatList = mergeChatLists(existingChatList, new ChatListModel(dataId, ch));
        } else {
          mergedChatList = existingChatList;
        }
        return chatHistoryActions.loadFromHttpSuccess({ mergedChatList });
      } catch (error) {
        return chatHistoryActions.loadFromHttpFailure();
      }
    })
  ));

}

function mergeChatLists(existing: ChatListModel, remote: ChatListModel): ChatListModel {
  if (!existing) return remote;
  if (!remote) return existing;
  const merged = new ChatListModel(existing.dateId,[]);
  const map = new Map<number, any>();
  existing.chatModel?.forEach(m => { if (m.dataId) map.set(m.dataId, m); });
  remote.chatModel?.forEach(m => { if (m.dataId && !map.has(m.dataId)) map.set(m.dataId, m); });
  merged.chatModel = Array.from(map.values());
  return merged;
}
