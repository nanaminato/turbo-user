import {ChatHistoryTitle} from "../../../models";

export function addWithMerge(
  origin: ChatHistoryTitle[],
  incoming: ChatHistoryTitle[]
): ChatHistoryTitle[] {
  const combined = [...origin];
  for (const httpItem of incoming) {
    const idx = combined.findIndex(
      d => d.dataId === httpItem.dataId && d.userId === httpItem.userId
    );
    if (idx !== -1) {
      combined.splice(idx, 1, httpItem); // 替换
    } else {
      combined.push(httpItem);
    }
  }

  // 排序逻辑
  const reverse = -1;
  combined.sort((a, b) => {
    if (a.userId !== undefined && b.userId !== undefined) {
      return (a.dataId - b.dataId) * reverse;
    } else if (a.userId === undefined && b.userId === undefined) {
      return (a.dataId - b.dataId) * reverse;
    } else {
      return (-1 + 2 * (a.userId === undefined ? 1 : 0)) * reverse;
    }
  });
  return combined;
}
