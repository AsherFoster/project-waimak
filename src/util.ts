export function debounce(func: (...args: any[]) => any, wait: number) {
  let timeout: NodeJS.Timer;
  return function debounced(...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(func, wait, ...args);
  };
}
