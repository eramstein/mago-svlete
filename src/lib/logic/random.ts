export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}
