//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Init','Tk'],['Map']));

//Map
Init.db.map = function(){
    Db.map = {};
	
	//[amount of sub-map in X, amount of sub-maps in Y]	(Check last image)
    Init.db.map.list = {
		/*
		'tutorial':[1,5],
		'goblinLand':[4,8],
		'goblinUnderground':[1,2],
		'tinyTown':[1,2],
		'bobHouse':[1,2],
		'dragonLair':[1,3],
		'QpuzzleBlock':[0,1],
		
		*/
		
		'QfirstTown':{
			'main':[2,4],
			'east':[2,2],
			'eastCave':[1,3],
			'south':[2,4],
			'north':[2,4],
			'south':[2,4],
			'nwLong':[0,2],
			'high':[0,1],
			'simpleMap':[1,2],
		},
		'QtowerDefence':{
			'main':[0,2],
		},
		'QlureKill':{
			'main':[1,2],
		},
		'QcollectFight':{
			'fight':[1,2],
		},
		
		
		'QpuzzleBridge':{
			'g0':[0,1],
			'g1':[1,2],
			'g2':[1,2],
			'g3':[1,2],
			'g4':[1,2],
			'w0':[0,1],
			'w1':[1,2],
			'w2':[1,2],
			'w3':[1,2],
			'w4':[1,2],
		},
		'Qtutorial':{
			'main':[2,4],
		},
		'Qdarkness':{
			'well':[0,1],
			'ghost':[1,2],
		},
		'Qbtt000':{
			'main':[1,1],
		},
		'Qpvp':{
			'free':[1,3],
		},
		'QbaseDefence':{
			'base':[1,2],
		},
		'Qminesweeper':{
			'field':[0,1],
		},
		'Qfifteen':{
			'field':[0,0],
		},
	}
}
//DONT TOUCH BELOW
//map are loaded when needed. check Loop.actor
var Map = exports.Map = {};
Map.creation = function(name){
	var folder = name.split('-')[0];
	var file = name.split('-')[1];
	var m = {};
	m.name = name;
	m.img = {'a':[],'b':[],m:null};	//a: above, b:below
	
	var info = Init.db.map.list[folder][file];
	//layer
	var path = "img/map/" + folder + "/" + file + "/";
	for(var layer in {a:1,b:1}){
		for(var i = 0 ; i <= info[0]; i++){
			m.img[layer][i] = [];
			for(var j = 0 ; j <= info[1]; j++){
				var str =  path + file + layer.capitalize() + '_(' + i + ',' + j + ')' + '.png';
				var im = Tk.newImage(str);
				Img.preloader.push(str);
				m.img[layer][i].push(im);
			}
		}
	}
	//minimap
	var str = path + file + 'M.png';
	var im = Tk.newImage(str);
	Img.preloader.push(str);
	m.img.m = im;		// 8 times smaller than regular map generated by tiled
	
	Db.map[name] = m;
}


Map.getMap = function(){
	return Db.map[Db.mapNameConvert[player.map].graphic];
}
Map.getName = function(){
	return Db.mapNameConvert[player.map].name;
}
Map.getGraphic = function(){
	return Db.mapNameConvert[player.map].graphic;
}
//var image = Tk.newImage("img/map/goblinLand/goblinLandB.png");
















