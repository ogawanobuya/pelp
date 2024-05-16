const batchLimit = 500;

/** see: https://yucatio.hatenablog.com/entry/2019/12/10/222311 */
export const sliceIntoBatchSize = <T>(
  array: Array<T>,
  limit: number = batchLimit
): Array<Array<T>> => {
  const length = Math.ceil(array.length / limit);
  const slicedArray = new Array(length)
    .fill(undefined)
    .map((_, i) => array.slice(i * limit, (i + 1) * limit));
  return slicedArray;
};