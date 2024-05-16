interface DeleteArrayItemArgs<T> {
  array: Array<T>;
  index: number;
}
export const deleteArrayItem = <T>(args: DeleteArrayItemArgs<T>): Array<T> => {
  const { array, index } = args;

  // 配列が空またはindexが不正
  if (array.length === 0 || index < 0 || index >= array.length) return array;

  // 配列長が1
  if (array.length === 1) return [];

  // 最初を削除
  if (index === 0) return array.slice(1, array.length);

  // 最後を削除
  if (index >= array.length - 1) array.slice(0, array.length - 1);

  // 最初と最後以外のどこかを削除
  return [...array.slice(0, index), ...array.slice(index + 1, array.length)];
};