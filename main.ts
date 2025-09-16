// let counter = 0;

// async function incrementCounter() {
//   const current = counter;
//   await new Promise(res => setTimeout(res, Math.random() * 50));
// // simulate async delay
//   counter = current + 1;
// }

// async function main() {
//   await Promise.all([incrementCounter(), incrementCounter(), incrementCounter()]);
//   console.log(`Counter value: ${counter}`);
// }

import { all, main, sleep } from "effection";
import { createNumberSignal, type NumberSignal } from "./number.ts";

export function* incrementCounter(counter: NumberSignal) {
  const random = Math.random() * 50;

  console.log(`Waiting ${random} seconds`);
  yield* sleep(random);
  
  console.log(`Incrementing after ${random} seconds`);
  counter.update((n) => n + 1);
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await main(function* () {
    const counter = yield* createNumberSignal(0);

    yield* all([
      incrementCounter(counter),
      incrementCounter(counter),
      incrementCounter(counter),
    ]);

    console.log(`Final value: ${counter.valueOf()}`)
  });
}
