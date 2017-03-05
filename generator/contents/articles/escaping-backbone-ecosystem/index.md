---
title: Escaping Backbone ecosystem
author: naugtur
date: 2017-03-05
template: article.jade
tags: English
---

> TL;DR [backbone-redux-migrator](https://github.com/naugtur/backbone-redux-migrator) lets you migrate away from Backbone without disrupting the product you're building

Here's some old news: [Backbone ecosystem is dead](https://benmccormick.org/2016/03/07/the-sad-state-of-the-backbone-ecosystem/).

<cut>

Backbone helped organize astounding number of web apps in its time. These products are still alive and well, with people maintaining the codebases and companies hiring new talent.

But with no more updates to core pieces of ecosystem, paradigm shift in front-end and community interests driven away, keeping a Backbone project productive and hiring new people to work on it becomes a serious challenge.

Some time in 2015 there was a very promising trend for using mixins to connect React as view layer for Backbone apps. Some time later it seemed like a dead end. I've been thinking about that again recently and when a colleague form work asked for help after getting himself in such a dead end, I happened to be in the right state of mind to find a way out.

I've built a tool: [backbone-redux-migrator](https://github.com/naugtur/backbone-redux-migrator)

It lets a Redux app exist inside of a Backbone project and slowly take over.
It's optimized for keeping total separation between codebases, so that they only exchange information via the migrator or `window.location`.

The main idea behind the tool is to let Redux codebase grow without creating dependencies on old code. Backbone architecture requires it to hold on to routing, so even when you use full Redux stack in a rewritten functionality, routing is still done by Backbone side. The great thing that backbone-redux-migrator is helping you achieve is complete functionality migration to Redux with all elements of the stack available. Once Redux app consumes all the functionalities necessary, all you need to do is remove Backbone and configure routing.

I've tested this solution on a real life project my colleague was maintaining and it became easy for him to start rewriting functionalities to Redux without breaking the app. He could decide which functionalities he's ready to rewrite and which need to stay in Backbone to not affect the release timeline. Also, it prevented him from trying to use events from Backbone in components etc.

Correct me if I'm wrong, but this seems like the only migration path freeing the project from its Backbone legacy without disruption that isn't introducing dependencies on Backbone to Redux logic.

I'm hoping this reaches everyone who's dealing with maintaining a Backbone project in 2017.

Feel free to contact me for advice if the readme isn't enough.
