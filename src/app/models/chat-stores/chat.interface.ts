export interface ChatHistory{
  title: string,
  dataId: number;
  userId?: number;
  chatList: number[];
}

export interface ChatHistoryTitle{
  title: string,
  userId?: number;
  dataId: number;
}
/// 与此关联的是, 新插入的消息回话题目需要合适的添加 userId属性，在过去的设计思想中，不包含这个

