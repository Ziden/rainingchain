eval(loadDependency(['List','Quest'],[]));
var s = require('./../Quest_exports').init('v1.0','Qpvp',{
	name:"Pvp Free For All",
	showWindowComplete:false,
	dailyTask:false,
	reward:{exp:0.2,item:0.2,passive:{min:1,max:2,mod:10}},
});
var q = s.quest; var m = s.map; var b = s.boss;

/* STEPS TO COMPLETE QUEST
	play a 5 min game


*/

s.newVariable({
	killCount:0,
	killCountSum:0,	//used to know if enough kill to complete quest
	respawn:'s1',
	deathCount:0,
	timeJoin:0,	//in minutes
});

var SPOT = ['s1','s2','s3','s4','s5','s6','s7'];
var HINT = {};		
var WAITINGPLAYER = '';

s.newEvent('_hint',function(key){
	if(HINT[List.all[key].map]) return HINT[List.all[key].map];
	if(WAITINGPLAYER === key) return 'Wait until another player wants to battle...';
	return 'Click the signpost to select the PvP Mode.';
});
s.newEvent('_abandon',function(key){
	if(s.isInMap(key,'free'))
		s.teleport.town(key);
	s.pvpOff(key);
});
s.newEvent('_signIn',function(key){
	s.event('_abandon',key);
});
s.newEvent('itemLeave',function(key){
	s.abandonQuest(key);
});
s.newEvent('clickSign',function(key){
	Quest.start(key,q.id);	
	s.dialogue(key,'sign','intro');
});
s.newEvent('removeFromList',function(key){
	if(WAITINGPLAYER !== key)	return s.chat(key,'You are not in the waiting list.');
	
	WAITINGPLAYER = '';
	s.chat(key,'You are no longer in the waiting list.');
});
s.newEvent('signMain',function(key){		
	if(s.event('getPlayerInPvp',key) !== 0){
		return s.event('startPvp',key,'main');
	}
	
	if(!s.isOnline(WAITINGPLAYER)) WAITINGPLAYER = '';
	
	if(WAITINGPLAYER === key) return s.chat(key,'You are already in the waiting list.');
	if(!WAITINGPLAYER) return s.event('addWaitingList',key);
	
	var toolong = false;
	s.chat(key,'Asking player in waiting list if he wants to battle you... Please wait couple seconds.');
	s.setTimeout(key,'asking',25*15,function(key){
		s.chat(key,"He didn't respond...");
		toolong = true;
		if(!WAITINGPLAYER) s.event('addWaitingList',key);
	});
	
	s.question(WAITINGPLAYER,"Someone wants to battle. Teleport to PvP zone? (You have 10 seconds to answer.)",function(keyy){
		if(toolong){
			if(WAITINGPLAYER === keyy) WAITINGPLAYER = '';
			return s.chat(keyy,"You took too long to respond... You have been removed from the waiting list.");
		}
		if(!s.isOnline(key)) return s.chat(keyy,"The player who wanted to fight disconnected...");
		
		if(!s.testActive(keyy) && List.main[keyy].questActive){
			Quest.abandon(keyy,List.main[keyy].questActive);
			Quest.start(keyy,q.id);
		}
		s.event('startPvp',key,'main');
		s.event('startPvp',WAITINGPLAYER,'main');
		WAITINGPLAYER = '';
	});	
});
s.newEvent('addWaitingList',function(key){
	s.chat(key,'Nobody is in the PvP zone. ' +
		'You have been placed in a waiting list. ' +
		'You can go back to whatever you were doing. ' +
		'You will be teleported to the PvP Zone when another player will want to battle you.'
	);
	WAITINGPLAYER = key;	
});
s.newEvent('signTeam',function(key){
	s.event('startPvp',key,'party');
});
s.newEvent('startPvp',function(key,instance){
	Quest.start(key,q.id);			
	s.addItem(key,'leave');	//no big deal if not added
	s.popup(key,'Use the item "Leave" to leave PvP.<br>Play for 5 minutes and get 10 kills to complete the quest.');
	s.setRespawn(key,'free',SPOT.random(),instance,false);
	s.teleport(key,'free',SPOT.random(),instance);
	s.pvpOn(key);
});
s.newEvent('getPlayerInPvp',function(key){
	if(List.map['Qpvp-free@MAIN']) return Object.keys(List.map['Qpvp-free@MAIN'].list.player).length;
	return 0;
});
s.newEvent('clickSignLeave',function(key){
	s.question(key,"Would you like to leave?",function(key){
		s.abandonQuest(key);
	});
});
s.newEvent('_death',function(key,killers){
	s.setRespawn(key,'free',SPOT.random());
	s.add(key,'deathCount',1);
	
	var killer = killers[0];
	if(!killer) return;
	if(s.isOnline(killer) && s.testActive(killer)){
		s.add(killer,'killCount',1);
		s.add(killer,'killCountSum',1);
	}
});

s.newItem('leave','Leave','leaf.leaf',[	//{
	['itemLeave','Leave']	
]); //}

s.newDialogue('sign',null,{
	intro:{
		text:"Would you like to battle against other players?",
		option:[
			{text:"Yes (Anyone)",event:'signMain'},
			// {text:"Yes (Friends Only)!",event:'signTeam'},
			{text:"Remove me from waiting list.",event:'removeFromList'},
			{text:"No."},
		]
	},
});

s.newMap('free',{
	name:"Pvp Zone",
	tileset:"v1.2",
	grid:["000000000000000000000000000000000000000000000000000000000000000000000000000","000000000000000110000000000000000000000000000011000000000000000000000000000","000000000000000110000000000001111111111111111111000000000000000111100000000","000000000000000000000001111011111111111111111110000000000000000111100000000","000011111111111111111101111011111111100000000010000000000001100111100111100","000111111111111111111111111011111111100000000010000000111101100000000111100","000111110000000000000010000011111111100000000010000000111100000000000111100","000100000000000000000010000011111000000000000010000000111100111111100000000","000100000000000000000010000011111000000000000010000000000001111111110000000","000100000000000000000010110010000000000000000010000000000011111111111000000","000100000000000000000010110010000000000000000010111100000011111111111000000","000100000000000000000011000110000000000000000010111100000011111100011000000","000100000000000000000001101100000000000000000010111101111011111100011000000","000100000000000000000000111100000000000000000010000001111011111111111000000","000100000000000000000000011110000000000000000011000001111111000111111100110","000100000000000000000000011110000000000000000001100000001111000111111110110","000100000001111000000000011111100000000000000000111111111110000000001111000","000100000001111000000000000111100000000000000000111111111100000000000111100","000100000001111000000000000111111000000000000000111101111000000000000011100","000100000000000000000000000001111000000000000000111111110000000000000001100","000100000000000000000000000001111000000000000000111110000000000000000001100","000100000000000000000000000000000000000000000000000010000000000000000001100","000100000000000000000000000000000000000000000000000000000000000000000001100","000100000000000000000000000000000000000000000000000000000000000000000001100","000100000000000111100000000000000000000000000000000000000000000000000001100","000100000000000111100000000000000000000000000000000000000000000000000001100","000100000000000111100000000000000000000000000000110000000000000000000001100","110100000000000000000000000000000000000000000000111110000000000000000001100","110100000000000000000000000000000000000000000000111100000000000000000001100","000100000000000000000000000000000000000000001111111000000000000000000001100","000100000000000000000000000000000000000000011111110000000000000000011111100","000100000000000000000000000000000000000000110000000000000000000000011111100","000100000000000000000000000011111111111111100000000000000000000000011111100","000100000000000000000000000111111111111111000000000000000000000000011111000","000100000000000000000000000111110000000000000000000000000000000000111110000","000100000000000000000000000111110000000000000000000000000000000001100000000","000100000000000000000000000111110000000000000000000000000000000011000000000","000100000000000000000000000100000000000000000000000000000000000011000000000","000111110000000000000000000100000000000000000000000000000000000011001111000","000111110000000000000000001100000000000000000000000000000000000011001111000","000111110000000000000000011000000000000000000000000000000000000011001111000","110111111111100000001111110000000000000000000000000000000000000011000000000","110111111111100000001111100000000000000000000000000000000000000011000000000","000110000000000000000000000000000000000000000000000000000000000011000111000","000110000000000000000000000000000000000000000000000000000000000011001000100","000110000000000000000000000000000000000001111000000000000000111110001000100","000110000000000000000000000000000000000001111000000000000001111100001000100","000110000000000000000000000000000000000001111000000000000011000000001101100","000110000000000000000000000000000000000000000000000000000110000000001111100","000110000000000000000000000000000000000000000000000000000110000000000111000","000110000000000001111000000000000000000000000000000000000110011110000000000","000110000000000001111000000000000000000000000000000000000110011110000000000","000110000000000000000000000000000000000000000000000000000110011110000000000","000110000000000000000000000000000000000000000000000000000110000000000000000","000110000000000000000000000000000000000000000000000000000111000011000000000","000110000000000000000000000000000000000000000000000000000111100011001111000","000110000000000000000000000000001111110000000000000000000011111100001111000","000011000000000000000000000000011111111000000000000000000001111110001111000","000001100000000000000000000000110000001100000000000000000000111111000000000","000000110000000000000000000001100000000110000000000000000000111111000000000","000000011000000000000000000001100000000110000000000000000000111111000000000","011110001100000000000000000001100111100110000000000000000000111111000000000","011110001100000000000000000001100111100110000000000000000000111111000111100","011110001100000000000000000001100111100110000000000000000000000011000111100","000000000111111111111111111111000000000110000000000000000000000011000111100","000000000011111111111111111110011100000110000000000000000000000011000000000","000000000000000001100000000000111110000110000000000000000000000011000000000","000000111100110001100000000001100011000110000000000000000000000011000000000","000000111100110000000000000011000001100110000000000000000000000011011110000","000000111100000000000000000011000001100110000000000000000000000011011110000","000000000000111111111111111110111101100110000000000000000000000011011110000","000000000001111111111111111100111101100110000000000000000000000011000000000","000000000011000000000000000000111101100011111111111111111111111110110000000","000000000110000000000000000000111101100001111111111111111111111100110000000","000000000110000000000000000000000001100000000000000000000000000000000000000"],
	lvl:0,
},{
	spot:{"q1":{x:36*32,y:35*32},"s3":{"x":464,"y":368},"s2":{"x":1200,"y":400},"s1":{"x":2000,"y":816},"s4":{"x":560,"y":1104},"s7":{"x":1520,"y":1328},"s5":{"x":784,"y":1680},"s6":{"x":1680,"y":2032}},
	variable:{
		lastReset:0,
		timeMatch:5,	//in min
	},
	load:function(spot){
		m.spawnSignpost(spot.q1,s.event('clickSignLeave'));	
	}, 
	playerLeave:function(key){	//prevent memory leak
		if(m.getPlayerInMap(this.spot).$empty())
			delete HINT[this.spot.q1.map];
	},
	loop:function(spot){
		if(!s.interval(25*2)) return;
		
		//Hint
		var list = m.getPlayerInMap(spot);
		var sortedList = [];
		for(var i = 0 ; i < list.length; i++){
			var key = list[i];
			var kill = s.get(key,'killCount');
			var death = s.get(key,'deathCount');
			var pt = kill*2 - death;
			sortedList.push({
				name:List.all[key].name,
				kill:kill,
				death:death,
				point:pt
			});
		}
			
		sortedList.sort(function(a,b){
			return b.point - a.point;
		});
		var str = '';
		
		for(var i = 0 ; i < sortedList.length ; i++){
			str += sortedList[i].name + ': ' + sortedList[i].kill + 'K/' + sortedList[i].death + 'D<br>'; 
		}	
		
		HINT[spot.map] = str;	
		
		//increase time spent in game
		if(!s.interval(25*60)) return;
		for(var i = 0; i < list.length; i++){
			if(s.add(key,'timeJoin',1) >= 5 && s.get(key,'killCountSum') >= 10){
				s.completeQuest(key);
				s.startQuest(key,true);
			}	
		}
		
		
		//end match and start new one
		if(!s.interval(25*60*5)) return;
		var min = (new Date()).getMinutes();
		if(min % this.variable.timeMatch === 0 && this.variable.lastReset !== min){
			this.variable.lastReset = min;
			
			for(var i = 0; i < list.length; i++){
				var key = list[i];
				s.chat(key,'Congratz to ' + sortedList[0].name + ' for winning the game with ' + sortedList[0].kill + ' kill(s) and ' + sortedList[0].death + ' death(s)!');
				s.set(key,'killCount',0);
				s.set(key,'deathCount',0);
			}
		}
	},	
});
s.newMapAddon('QfirstTown-main',{
	spot:{"i":{"x":46*32,"y":54*32}},
	load:function(spot){
		m.spawnSignpost(spot.i,s.event('clickSign'));
	},
});


s.exports(exports);





