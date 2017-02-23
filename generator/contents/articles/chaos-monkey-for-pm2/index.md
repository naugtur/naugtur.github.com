---
title: Chaos Monkey for PM2
author: naugtur
date: 2017-02-23
template: article.jade
tags: English
---

The term Chaos Monkey was coined by Netflix - it's a tool that kills your production machines at random.

<cut>

[See their repo](https://github.com/netflix/chaosmonkey)

Surprised? Well, that's how they got developers to think about making the services available no matter what happens.
You can't dismiss any failure as unlikely anymore. There's a monkey in your server room. Even if it's entirely virtual.

I needed this concept recently for testing failover of workers running as processes on [PM2](http://pm2.keymetrics.io/)

Here's a tiny script I came up with

### Minimum Viable Chaos Monkey

Just give it the name of your app as `$APP`

```bash
#!/bin/bash
while true
do
  #choose one of the delays randomly and wait
  shuf -n1 -e 30 60 120 | xargs sleep
  echo "chaos monkey strikes!"
  #choose one random app process and restart it
  pm2 id $APP | egrep -o "[0-9]+" | xargs shuf -n1 -e | xargs pm2 restart
done
```

Cute, huh?
