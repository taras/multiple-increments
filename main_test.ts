import { expect } from "@std/expect";
import { all, run } from "effection";
import { createNumberSignal } from "./number.ts";
import { incrementCounter } from "./main.ts";

Deno.test({
  name: "3 incrementers always return 3",
  fn: () =>
    run(function* () {
      const counter = yield* createNumberSignal(0);

      yield* all([
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
      ]);

      expect(counter.valueOf()).toBe(3);
    }),
});

Deno.test({
  name: "10 incrementers always return 10",
  fn: () =>
    run(function* () {
      const counter = yield* createNumberSignal(0);

      yield* all([
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
        incrementCounter(counter),
      ]);

      expect(counter.valueOf()).toBe(10);
    }),
});
