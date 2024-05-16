/** see: https://zenn.dev/sora_kumo/articles/612ca66c68ff52 */
export const sequentialExcution = <T>(
  array: Array<T>,
  f: (value: T) => void | PromiseLike<void>,
  waitFor: number = 0
) =>
  array.reduce(
    (promise, item) =>
      promise.then(async () => {
        await f(item);
        if (waitFor <= 0) return;
        await new Promise<void>((resolve) => {
          setTimeout(resolve, waitFor);
        });
      }),
    Promise.resolve()
  );