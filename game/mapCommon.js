(function(undefined){


	  	
	var listen=function(d,e,f){d=(d)?d:document;d.addEventListener(e,f,false)};
//=============================================================================================== 
 	//deprecated
  //funkcja do przetestowania
	window.test=function(){
		
		
		var scores=[];
		var x=20,y=30;
		var dirx=1,diry=1;
		var v=200;
		for(var i=0;i<90;i+=1){
		//dirx=(Math.random()>0.5)?1:-1;
		//diry=(Math.random()>0.5)?1:-1;
		//dirx=Math.round(Math.random()*2-1);
		//diry=Math.round(Math.random()*2-1);
				for(var j=0;j<60;j+=1){
				//x=(x+dirx*(Math.round(Math.random()+Math.random())*5))%500;
				//y=(y+diry*(Math.round(Math.random()+Math.random())*5))%500;
				x=i;//Math.round(Math.random()*i);//(x+dirx*(Math.round(Math.random()+Math.random())*5))%500;
				y=j;//Math.round(Math.random()*j);//(y+diry*(Math.round(Math.random()+Math.random())*5))%500;
				v=Math.min(Math.max(0,v+((Math.random()*10)-7)),200);
				scores.push({x:x,y:y,v:v});
				}
			v=200;
			}		
			var d1=new Date();
			Heatmap.draw(scores,10);
			var d2=new Date();
			
			////
			
			return "test done";
		}		
		
		
		
		
		
	//=============================================================================================== 
	var Overlord=(function(){
	 
		//PUB / SUB  
		var subscriptions={}

		//subscribes a function to a topic
		function subscribe(to,func){
			if(!subscriptions[to]){
				subscriptions[to]=[];
				}
			subscriptions[to].push(func);
		
			}
		
		//publishes in topic
		function publish(what,args){
			if(subscriptions[what]){
				for(var i=0,l=subscriptions[what].length;i<l;i+=1){
				  try{
				    subscriptions[what][i].apply(null,args);
				    }catch(e){
				      //error in subscriber
				      }
				  }
				}
		
			}

		return{
			publish:publish,
			subscribe:subscribe
			}

		})()
	
 
  
  
var D = document;
		
		//=============================================================================================== 
		// moduł do pracy z canvasem
		var MyCanv=(function(){
		
			var buffer=false,canv={},d=false,documentHeight;
			
			
			function init(w,h){
		
				//----wstawienie elementu wrappera
				d=document.createElement( "div" );
				d.id="cogIsionCNV";
  			d.style.position='absolute';
  			d.style.zIndex=9999998;
				d.style.top=0;
				d.style.left=0;
				document.body.insertBefore( d, document.body.firstChild );
				
				buffer=document.createElement( "canvas" );
				buffer.style.background="#000000";
		
		    var style = buffer.style;
				
				style.background="none";
				/*
				style.position='absolute';
  			style.zIndex=9999997; 
				style.top=y+'px';
				style.left=x+'px';
				*/
				buffer.width=w;
				buffer.height=h;
				
				d.insertBefore( buffer, d.firstChild );
				}
		
				
		// Derived from Pixastic fastBlur
		// wickid, wickid 
			function smooth(amount){
				amount = Math.max(0,Math.min(5,amount));
					var ctx = buffer.getContext("2d");
					ctx.save();
					ctx.beginPath();
					ctx.rect(0, 0, buffer.width, buffer.height);
					ctx.clip();
			
					var smallWidth = ~~(buffer.width)>>1;//Math.round(canv.width / 2);
					var smallHeight = ~~(buffer.height)>>1;//Math.round(canv.height / 2);

					var copy = document.createElement("canvas");
					copy.width = smallWidth;
					copy.height = smallHeight;

					var clear = false;
					var steps = Math.round(amount * 20);

					var copyCtx = copy.getContext("2d");
					for (var i=0;i<steps;i++) {
						var scaledWidth = Math.max(1,Math.round(smallWidth - i));
						var scaledHeight = Math.max(1,Math.round(smallHeight - i));
	
						copyCtx.clearRect(0,0,smallWidth,smallHeight);
						copyCtx.drawImage(buffer,0,0,buffer.width,buffer.height,0,0,scaledWidth,scaledHeight);
						ctx.clearRect(0, 0, buffer.width, buffer.height); //ten był opcjonalny. pewnie wpływa na wygląd blura jak są dziury w kolorze
						ctx.drawImage(copy,0,0,scaledWidth,scaledHeight,0,0,buffer.width,buffer.height);
					}

					ctx.restore();
				}
			
			
			function fillAll(){
				var context = buffer.getContext("2d");
		  	//czarne tło
		  	context.clearRect(0,0, buffer.width, buffer.height);
		  	context.fillStyle = "rgb(0,0,0)";
		  	context.fillRect(0,0, buffer.width, buffer.height);
		  	//
				}
				
				
				
				
			//--------------------------------------------------------------- RETURN MyCanv
			return {
				init:init,
				getBuff:function(w,h){
					if(!buffer){
					  init(w,h); 
					  }
					
					return buffer;
					},
				getWrapper:function(){
					return d;
					},
				
				smoothBuff:smooth,
				fillBuff:fillAll
				
				}
		
		})();///myCanv
		
		var mainGo=function(difficultyMod){
		
		var colorF=function(v){
					return "hsl("+(~~((1 - (Math.sin(1.9*(v+0.08))*v*1.128)) * 240))+", 95%, "+(~~(1.4*Math.sin(v*2.6)*v * 50)+22)+"%)" 
					}
		
		//workables
		var foodNode=document.getElementById('food'),
		    player={
		    x:300,
		    y:200,
		    vector:{
		      x:1,
		      y:1
		      },
		    speed:1
		    },
		    points=1000*difficultyMod,
		    food=[],
		    runSpeed=100,
		    boost=~~((1000/runSpeed)*3),
		    board={
		      w:window.innerWidth-10,
		      h:window.innerHeight-10
		      },
		    time=0,dead=false;
		
		
		
		
		//init
		MyCanv.getBuff(board.w,board.h);
		//MyCanv.fillBuff();
		
		/*
		  function mkX(N,color){
		  console.log(color);
				var x=MyCanv.getBuff();//document.createElement( "canvas" );
				x.width=N;
				x.height=N;
				var c=x.getContext("2d");
				c.fillStyle=color;
				c.beginPath();
        c.arc(0, 0, N, 0, Math.PI*1.7, true); 
        c.closePath();
        c.fill();
				return x;
				}
		*/
		function mkO(N,color){
		var x=document.createElement( "canvas" );
				x.width=2*N;
				x.height=2*N;
				var c=x.getContext("2d");
				
				/**/
				c.fillStyle = color;
        c.beginPath();
        c.arc(N, N, N, 0, Math.PI*2, true);
        c.closePath();
        c.fill();
				/*
        c.beginPath();
				c.moveTo(2,2);
				c.lineTo(N,N);
				c.moveTo(N,2);
				c.lineTo(2,N);
				c.strokeStyle = color;
				c.stroke(); 
				c.closePath();
								
				/**/
				return x;
		  }
		  
		function mkX(N,color){
		var x=document.createElement( "canvas" );
				x.width=N;
				x.height=N;
				var c=x.getContext("2d");
				
				
        c.beginPath();
				c.moveTo(2,2);
				c.lineTo(N,N);
				c.moveTo(N,2);
				c.lineTo(2,N);
				c.strokeStyle = color;
				c.stroke(); 
				c.closePath();
								
				/**/
				return x;
		  }
		  

		var addFood=function(){
		  food.shift();
		  food.push({x:~~(Math.random()*board.w),y:~~(Math.random()*board.h),status:1})
		  }
		var initFood=function(){
		  for(var i=0;i<difficultyMod;i+=1){
  		  food.push({x:~~(Math.random()*board.w),y:~~(Math.random()*board.h),status:1})
  		  }
		  }

		  
		//====================================counting
		var counting=function(){
		  if(dead){return}
		
		  //move stuff
		  player.x=player.x+player.vector.x*player.speed;
		  player.y=player.y+player.vector.y*player.speed;
		  player.speed=~~(player.speed*0.99);
		  points-=player.speed+1; //moving costs
		  time++; //count time
		  
		   for(var i=0,l=food.length;i<l;i+=1){
		    if(food[i].status){
		      //collision
		      if(Math.abs(food[i].x-player.x)<20 && Math.abs(food[i].y-player.y)<20){
		        food[i].status=0;
		        Overlord.publish('food');
		        }
		      }
		    }
		  
		  
		  
		  }
		  
		//drawing
		var drawing=function(){
		  if(dead){return}
		  
		  var canv=MyCanv.getBuff();
		  var context = canv.getContext("2d");
		  //console.log(['col',(player.speed/boost),colorF((player.speed/boost))]);
		  var dude=mkO(10,colorF((player.speed/boost))),
		    point=mkX(10,'#FFFFFF');
		  
		  MyCanv.smoothBuff(1);
		  context.drawImage(dude,player.x,player.y);
		  
		  for(var i=0,l=food.length;i<l;i+=1){
		    if(food[i].status){
		      context.drawImage(point,food[i].x,food[i].y);
		      }
		    }
		  }
		var drawPoints=function(){
		   if(dead){return}
		//points
		  if(points>=0){
		    foodNode.innerHTML=points;
		    foodNode.style.width=~~(points/10)+'px';
		    }else{
		    Overlord.publish('dead');
		    }
		  }
		  
		//actions
		listen(false,'click',function(e){
		var x=e.pageX-player.x,
			y=e.pageY-player.y;
			
			//jednostkowy
			var l=Math.sqrt(x*x+y*y);
			x=x/l;
			y=y/l;
		  
		  player.vector={x:x,y:y}
		  player.speed=boost;
		  
		  });
		  
		Overlord.subscribe('food',function(){
		  points+=100*(difficultyMod*3);
		  
		  });
		  
		Overlord.subscribe('dead',function(){
		  dead=true;
		  foodNode.innerHTML="<h2>You are no more.<br> You have survived "+time+" thousand years.</h2>";
		  });
		
		 
		initFood();
		setInterval(addFood,runSpeed*100);
		
		setInterval(drawing,runSpeed);
		setInterval(drawPoints,500);
		  
		setInterval(counting,runSpeed);
  
  } //mainGo
  
  listen(document.getElementById('startEasy'),'click',function(){
    document.getElementById('starters').style.display='none';
    mainGo(3);
    });
  listen(document.getElementById('startHard'),'click',function(){
    document.getElementById('starters').style.display='none';
    mainGo(1);
    });
})()  
