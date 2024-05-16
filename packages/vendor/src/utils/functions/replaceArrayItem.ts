interface ReplaceArrayItemArgs<T> {
  array: Array<T>;
  index: number;
  replaceTo: T;
}
export const replaceArrayItem = <T>(
  args: ReplaceArrayItemArgs<T>
): Array<T> => {
  const { array, index, replaceTo } = args;

  // 配列が空またはindexが不正
  if (array.length === 0 || index < 0 || index >= array.length) return array;

  // 配列長が1
  if (array.length === 1) {
    return [replaceTo];
  }

  // 最初を置換
  if (index === 0) {
    return [replaceTo, ...array.slice(1, array.length)];
  }

  // 最後を置換
  if (index >= array.length - 1) {
    return [...array.slice(0, array.length - 1), replaceTo];
  }

  // 最初と最後以外のどこかを置換
  return [
    ...array.slice(0, index),
    replaceTo,
    ...array.slice(index + 1, array.length)
  ];
};