import {Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {ChatHistoryTitle} from "../../models";

@Injectable({
  providedIn: "root"
})
export class HistoryTitleService{
  constructor(private dbService: DbService) {

  }
  async getHistoryTitles(id?: number){
    let histories = await this.dbService.getHistoryTitles();
    if(histories===undefined) return histories;
    if (id) {
      return histories
        .filter(history => history.userId === undefined || history.userId === id);
    } else {
      return histories
        .filter(history => history.userId === undefined);
    }

  }
  async putHistoryTitles(historyTitle: ChatHistoryTitle){
    return await this.dbService.addOrUpdateHistoryTitles(historyTitle);
  }
  async deleteHistoryTitle(historyTitle: ChatHistoryTitle){
    return await this.dbService.deleteHistoryTitles(historyTitle.dataId);
  }
}
