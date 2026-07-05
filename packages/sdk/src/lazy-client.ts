type BoundMethod = (...args: never[]) => unknown;

function readClientProperty<T extends object>(client: T, property: string): T[keyof T] | undefined {
  if (!(property in client)) {
    return undefined;
  }

  return client[property as keyof T];
}

/** Defers SDK client construction until first use (reads API URL at call time). */
export function createLazyClient<T extends object>(getClient: () => T): T {
  let instance: T | undefined;

  return new Proxy({} as T, {
    get(_target, property: string | symbol): T[keyof T] | undefined {
      if (typeof property !== 'string') {
        return undefined;
      }

      instance ??= getClient();
      const value = readClientProperty(instance, property);

      if (typeof value === 'function') {
        return (value as BoundMethod).bind(instance) as T[keyof T];
      }

      return value;
    },
  });
}
