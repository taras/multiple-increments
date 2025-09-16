# multiple increments example

This example shows how you can apply the concept of an immutable state container
with [Effection structured concurrency library](https://frontside.com/effection/) to
implement what is otherwise tricky to do with async/await.

I used the original example provided by Sansenbaker in a [reddit comment](https://www.reddit.com/r/javascript/comments/1nhhdml/comment/nebloil/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

```js
let counter = 0;

async function incrementCounter() {
  const current = counter;
  await new Promise(res => setTimeout(res, Math.random() * 50));
// simulate async delay
  counter = current + 1;
}

async function main() {
  await Promise.all([incrementCounter(), incrementCounter(), incrementCounter()]);
  console.log(`Counter value: ${counter}`);
}
```

The implementation using Effection looks very similar with the exception of the `createNumberSignal`

```ts
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
```

`createNumberSignal` is imported from [./number.ts](./number.ts). It's an implementation of a ValueSignal
which is an immutable state container using a simplified version of the Flux pattern which is pretty much
ubiqutious in frontend development, but is less known in backend development. It's very useful when working
with shared state in complex asyncrony because it provides a convenient way to invoke state changes from
multiple asyncronous operations while allowing all consumers to use final state when it's needed. 
This is very common in frontend development because UI is organized into components which often require shared
state. It's very helpful to think about asyncrony as components of asyncronously executed code organized into 
functions. When thinking about async this way, the patterns that help on UI become applicable to backend
development. The NumberSignal was pretty much copied from https://frontside.com/effection/x/signals/ which 
includes other more complex state containers. 
