import { createSignal, type Operation, resource, type Stream } from "effection";;

/**
 * @source: https://github.com/thefrontside/effectionx/blob/main/signals/types.ts
 * 
 * A signal is a stream with set, update, and valueOf methods.
 * Subscribing to a signal will yield the current value of the signal.
 */
export interface ValueSignal<T> extends Stream<T, void> {
  /**
   * Set the value of the signal.
   * @param value - The value to set the signal to.
   * @returns The value of the signal.
   */
  set(value: T): T;
  /**
   * Update the value of the signal.
   * @param updater - The updater function.
   * @returns The value of the signal.
   */
  update(updater: (value: T) => T): T;
  /**
   * Get the current value of the signal.
   * @returns The current value of the signal.
   */
  valueOf(): Readonly<T>;
}

export interface NumberSignal extends ValueSignal<number> {}

/**
 * This is an implementation of an immutable state container in
 * spirit of https://github.com/facebookarchive/flux but in a much simpler
 * form using Effection streams.
 * 
 * We didn't have a Number signal in https://frontside.com/effection/x/signals/
 * So I created this for an example. In a real scenario, a state container 
 * would have a much more complex state. A more generic state container can be
 * implemented using the ValueSignal interface.
 * @param initial 
 * @returns 
 */
export function createNumberSignal(
  initial: number = 0,
): Operation<NumberSignal> {
  return resource(function* (provide) {
    const signal = createSignal<number, void>();

    const ref = { current: initial };

    function set(value: number) {
      if (value !== ref.current) {
        ref.current = value;

        signal.send(ref.current);
      }

      return ref.current;
    }

    try {
      yield* provide({
        [Symbol.iterator]: signal[Symbol.iterator],
        set,
        update(updater) {
          return set(updater(ref.current));
        },
        valueOf() {
          return ref.current;
        },
      });
    } finally {
      signal.close();
    }
  });
}