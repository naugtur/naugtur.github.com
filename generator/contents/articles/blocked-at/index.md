---
title: Finding blocking operations with Async Hooks
author: naugtur
date: 2017-09-01
template: article.jade
tags: English
---

Node.js introduced Async Hooks in version 8 and I could finally do what I always wanted - make a tool to tell me what is blocking the event loop.

<cut>

Let's start with stating the obvious - Node.js programs are asynchronous and it's for a reason. That reason is called *event loop* and if it's not a familiar word yet, read up on single threaded asynchronous nature of Node.js - it's great.

I'll continue with the assumption that running long synchronous operations in Node.js is something you want to avoid.

## Detecting blocked state

In early days of Node, the only way to detect a function blocking the event loop was to notice your server stops accepting new requests for a while. Or use the [`blocked`](https://www.npmjs.com/package/blocked) package, which uses a neat hack for detecting blockage by (and I'm simplifying) measuring how late a `setTimeout` callback is compared to when it should have been called.

There's other ways to determine where a lot of CPU cycles are spent. You can use flame grapths but if your code blocks very rarely, the technique might not be helpful unless you know how to reproduce the issue in a narrow window of time.

Here's where [Async Hooks](https://nodejs.org/api/async_hooks.html) come in.

## Async Hooks - new possibilities

Their main purpose is to allow diagnosing asynchronous workflows in general and their first use case was creating an asynchronous stack trace. With `before` and `after` hooks I was able to measure the time taken and the `init` hook is where a stack trace can be saved. That's effectively the whole idea behind [`blocked-at`](https://www.npmjs.com/package/blocked-at) package.

I made sure it's similar to the original one, so it's easy to switch.
Once you run it, you'll want to analyze the stack traces it collects.

## Finding the bug

Let's look at an example.

```
at Promise.then (<anonymous>)
  at Immediate.start (/.../blocked-at/test/cases/promise.js:8:6)
  at runCallback (timers.js:781:20)
  at tryOnImmediate (timers.js:743:5)
  at processImmediate [as _immediateCallback] (timers.js:714:5)
```
It's a stack trace from a test case in the unit tests for `blocked-at`. It demonstrates what you'll get if you're using promises and a `.then` handler is synchronously running a long operation.

Now compare with the code which produced this stack trace.
```js
'use strict'
const slow = require('../slowfunc')

module.exports = function start () {
  Promise.resolve(1)
    .then(a => a++)
    .then(a => [a])
    .then(a => {
      a[0] = 1
      slow()
      return a
    })
    .catch(console.error)
}
```
Note how `blocked-at` told us that the offending line is `.then(a => {`. It's the beginning of the function containing the actual blocking operation somewhere inside `slow()` function call.

To successfully debug your eventloop blocking code you need to start in the reported line and review all synchronous operations going through function execution while ignoring anything that's in a callback or .then etc.

## When stack trace is not enough

Sometimes your code is in a callback you pass somewhere to be called synchronously.
Here's what `blocked-at` would report if slow operation happened in a http handler.
```
at Server.connectionListener (_http_server.js:307:10)
  at emitOne (events.js:115:13)
  at Server.emit (events.js:210:7)
  at TCP.onconnection (net.js:1560:8)
```

If you see a case like that, all hope is not lost. You have a hint about what kind of asynchronous beginning there was. You can now wrap contents of your handler function in a `setImmediate` to get a stack trace from within your codebase.

## Share your stack trace!

I'm hoping to collect more real-life examples of stack traces and build a knowledge base of the less obvious ones.

---

> Share your stack traces from blocked-at in [this github issue](https://github.com/naugtur/blocked-at/issues/5)

---
