---
title: Everything is an array index
author: naugtur
date: 2015-05-13
template: article.jade
tags: English
---


Javascript engines never cease to amuse me.
Let’s look at our good old `Array.prototype.splice`

```javascript
[1,2,3].splice(0,1) //returns [1]
[1,2,3].splice(1,1) //returns [2]
[1,2,3].splice(undefined,1) // 1
[1,2,3].splice(false,1) // 1
[1,2,3].splice(true,1) // 2!
```

Ok, so splice is accepting non-numbers and it’s casting them to booleans and then to numbers, right? Wrong.

```javascript
[1,2,3].splice({},1) // 1
[1,2,3].splice("",1) // 1
[1,2,3].splice("one",1) // 1
```

Confused? That’s still pretty consistent!
Check this out:

```javascript
[1,2,3].splice([],1) //1
[1,2,3].splice([1],1) //2
[1,2,3].splice([2],1) //3
[1,2,3].splice([1,2],1) //1
```

Go home javascript, you’re drunk.

---

### Let’s figure this out anyway.

First:

```javascript
[1,2,3].splice({toString:function(){return 2;}},1) // 3
[1,2,3].splice({toString:function(){return "2one";}},1) // 1
[1,2,3].splice({toString:function(){return "2";}},1) // 3
```

Ok, that’s something. Looks like it casts stuff to string and expects it to be a number, then if NaN, assumes 0.

```javascript
var a=[];
[1,2,3].splice(a,1)  //returns [ 1 ]
a.toString=function(){return 2;}
[1,2,3].splice(a,1)  //returns [ 3 ]
```

Confirmed.
But what about true ?

Well, it turns out there’s one more step:

```javascript
Number(true) === 1
Number({toString:function(){return 9;}}) === 9
Number({}) //is NaN
  ```

So, finally, the closest thing to what `Array.prototype.splice` does to its arguments is:

```javascript
~~Number(arg)
```

1. Cast to number
1. If input is not a primitive type, `Number()` will call `.toString()`
1. Force-cast to integer (emulated here by `~~`) so all `NaN` results become `0`

Now if that’s not a work of art, I don’t know what is. :)

All return values come from V8 as present in node v0.10.37
