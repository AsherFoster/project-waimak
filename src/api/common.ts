export function randomDate() {
  return new Date(Date.now() - (Math.random() * 1e6));
}

export class NotImplementedError extends Error {}
