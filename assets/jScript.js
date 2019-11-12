/*

JS/JQ File

DISCLAIMER - The audio used in this lab is copyrighted and owned by the Lego Company and its composer Juston Scharvona. This audio was used for academic purposes
All other audio was recorded from open source or sampled from games owned by the Lego Company and heavily modified.
Credited artists and owners: The Lego Company, Justin Scharvona, Open Source Artists
Cited Webpages-
http://biomediaproject.com/bmp/music/
https://www.zapsplat.com/sound-effect-categories/

*/


//randomly chosen attacker
var attacker = Math.floor(Math.random() * 4);
function getAttacker(){
	if(attacker == 0){
		return "Tempest";
	}
	else if(attacker == 1){
		return "Arachnax";
	}
	else if(attacker == 2){
		return "Electrax";
	}
	else{
		return "Phantax";
	}
}

//randomly chosen ship attacker
var shipAttacker = Math.floor(Math.random() * 4);
function getShipAttacker(){
	if(shipAttacker == 0){
		return "Tempest";
	}
	else if(shipAttacker == 1){
		return "Arachnax";
	}
	else if(shipAttacker == 2){
		return "Electrax";
	}
	else{
		return "Phantax";
	}
}

//randomly generates a ship malfunction
var playerDamageRandom = Math.floor(Math.random() * 4);
function getPlayerDamageRandom(){
	if(playerDamageRandom == 0){
		return "ERROR SPEC: [DAMAGE TO MANIFOLD]";
	}
	else if(playerDamageRandom == 1){
		return "ERROR SPEC: [DAMAGE TO ENGINES]";
	}
	else if(playerDamageRandom == 2){
		return "ERROR SPEC: [DAMAGE TO HULL]";
	}
	else{
		return "ERROR SPEC: [DAMAGE TO BLASTCORE]";
	}
}

//generate random code, if code is even, repair is made
var playerDamageRandomCode = Math.floor(Math.random() * 9999);
var damageRepaired = Math.floor(Math.random() * 500); //repairs up to 50% of health
var hasRepaired = false;//can only repair once

//debug 
console.log(attacker);
console.log(shipAttacker);
console.log(playerDamageRandomCode);
console.log(damageRepaired);

	//display opening modal
    $(window).on('load',function(){
        $('#myModal').modal('show');
	});


var lock = false;//lock the spacebar to avoid acceleration	
var lock2 = false;
var lock3 = false;
var lock4 = false;
var infiniteHealth = false;
var playInfiniteHealthSound = true;
var playShipDamageAudio = true;
var hasShield = false;
var usedShield = false;
var hasPlayedShieldShound = false;
/*
 *
 * main function, initialized when the page opens
 *
 */

function startGame(){

var spacePressed = document.getElementById("removeOnStart");//remove backup directions
var spacePressedModal = document.getElementById("removeOnGameStart");//remove backup directions

var mainGame = document.getElementById("mainBody");
var newScoreBoxProperty = document.getElementById("scoreBox");//load score box externally

//load main menu music, not all browsers support this feature
var getmainMenuMusic = document.getElementById("mainMenuMusic");
getmainMenuMusic.play();


$(document).on('keypress',function(e) {
    if(e.which == 32) {
		getmainMenuMusic.pause();
		music.play();
		spacePressed.remove(); //if there is a formatting error with the modal, there is a <p> in the body that tells the user to press space to start the game, that <p> is then removed 
		$('#myModal').modal('hide');//hide modal
		
		//keep user from accelerating the game speed
		if(lock == false){
			initSetup();
			lock = true;
		}
	}
});

//set up default values and get sounds variables
var music = document.getElementById("myAudio");
var lowShipHealthAlarm = document.getElementById("myAudioDamage");
var bonusTimeSoundEffect = document.getElementById("bonusTimeMusic");
var getEnemyHit = document.getElementById("enemyHit");
var getfuelPickup = document.getElementById("fuelPickup");
var getfuelDropOff = document.getElementById("fuelDropOff");
var getlowPlayerHealth = document.getElementById("lowPlayerHealth");
var getplayerHealthRestored = document.getElementById("playerHealthRestored");
var getplayerInfiniteHealth = document.getElementById("infiniteHealthSound");
var getInfiniteMusic = document.getElementById("infiniteMusic");
var getShieldHit = document.getElementById("sHit");
var getShieldActive = document.getElementById("sActive");
var getShieldReady = document.getElementById("sReady");
var getShieldNotReady = document.getElementById("sNotReady");
var score = 0;
var fuel = 0;
var maxTime = 60;
var fuelCollected = 0;
var health = 1000;
var defaultShipHealth = 1000;
var shipHealth = parseFloat(defaultShipHealth);
var healthBelowHalf = false;
var playerHasLowHealth = false;
var playerHasExtraLowHealth = false;
var attacker1Found = false;
var attacker2Found = false;
var attacker3Found = false;
var attacker4Found = false;
var locatorOff = true;
var defBack = document.getElementById("defaultBackground");
var setPlayerShield = document.getElementById("missle");
var shieldTimer = 10;

function setBossBackground(){
	defBack.src = "assets/images/backgroundGore.png"	
}
function removeDefaultBackground(){
	defBack.src = "assets/images/backgroundGoreNoLich.png"
}
function setDefaultBackground(){
	defBack.src = "assets/images/background.png";
}

//if player scores over 5,000 points they get an overshield
function deployShield(){
	
	if(score >=5000){
		hasShield = true;
		getShieldActive.play();
	}
	else{
		getShieldNotReady.play();
		console.log("NEGATIVE");	
	}
}

//game timer
var gameTime = function(){
	syncTime();
}

//keeps track of the timer
function syncTime(){
	
	maxTime--;	
	
			//radar animation happens every second
			if(locatorOff == true){
				if(maxTime % 2 ==0){
				document.getElementById("enemyLocationOffRed").innerHTML = "[ MTI ]";
				}else{
			
				document.getElementById("enemyLocationOffRed").innerHTML = "[ WAIT ]";
				}
			}else{
				
				if(maxTime % 2 ==0){
				document.getElementById("enemyLocation").innerHTML = "[ONLINE]";
				}else{
			
				document.getElementById("enemyLocation").innerHTML = "[FM-CW]";
				}
			}
			
			//activate shield
			if(hasShield == true){
				shieldTimer--;
				console.log("shield time remaining: " + shieldTimer);
				setPlayerShield.src = "assets/images/p1DefaultShield.png";
				if(shieldTimer >= 3 && shieldTimer <= 5){
					setPlayerShield.src = "assets/images/p1DefaultLowShield1.png";
				}
				if(shieldTimer <=2){
					setPlayerShield.src = "assets/images/p1DefaultLowShield.png";
				}
				if(shieldTimer <= 0){
					getShieldNotReady.play();
					setPlayerShield.src = "assets/images/p1Default.png";
					hasShield = false;
					usedShield = true;
					document.getElementById("displayShield").innerHTML = "";
				}
			
			}
	document.getElementById("timerBox").innerHTML = maxTime;
	if(maxTime == 0){
		endGame();
		if(maxTime < 0){
			maxTime = 0;
		}
	}
	if(maxTime < 0){
		maxTime = 0;
	}	

}

//timer to detect collision every .01 seconds
var gameTimeSet;

var timeStart = function(){
	
	var timerFunction = function(){	
		detectCollision();

	}

	var timer = setInterval(timerFunction, 10);
	
}
var timer = setInterval(timeStart, 2000);

//removes all entities from table and calls a modal with after games stats
function endGame(){
	setBossBackground();
	var myGameOverMusic = document.getElementById("gameOverMusic");
	music.pause();//pause main music
	getInfiniteMusic.pause();
	myGameOverMusic.play();//play ending music
	$("div").remove(".player");
	$("div").remove(".enemy1");
	$("div").remove(".enemy2");
	$("div").remove(".enemy3");
	$("div").remove(".enemy4");
	$("div").remove(".fuel1");
	$("div").remove(".stationMain");
	$("div").remove(".backDrop");
	document.getElementById("showScore").innerHTML = "Score: " + score;
	document.getElementById("showFuelCollected").innerHTML = "Fuel Collected: " + fuelCollected;
	//document.getElementById("showFuelSaved").innerHTML = "Fuel Saved: " + score;
	document.getElementById("showFuelLost").innerHTML = "Fuel Lost: " + (fuelCollected - score);
	
	if(health < 0){
		document.getElementById("showHealthRemaining").innerHTML = "Health Remaining: 0%";
	}else{
		document.getElementById("showHealthRemaining").innerHTML = "Health Remaining: " + (health*.1).toFixed(2) + "%";
	}
	//document.getElementById("showHealthLost").innerHTML = "Health Lost: " + ((1000-health)*.1).toFixed(2) + "%";	
	document.getElementById("showAttacker").innerHTML = "Attacker: " + getAttacker();
	document.getElementById("showShipAttacker").innerHTML = "Fuel Station Attacker: " + getShipAttacker();
	
	if(hasRepaired == true){
		document.getElementById("shipRepaired").innerHTML = "Performed Repair: Yes";
	}else{
		document.getElementById("shipRepaired").innerHTML = "Performed Repair: No";
	}
	//show reason for game over in the header of closing modal
	if(shipHealth <= 0){
		if(health <= 0 && shipHealth <= 0){
			document.getElementById("showDeathReason").innerHTML = "You Were Killed Along With The Fuel Station";
		}
		else{
			document.getElementById("showDeathReason").innerHTML = "The Fuel Station Was Destroyed";
		}
	}
	else if(health <= 0){
		document.getElementById("showDeathReason").innerHTML = "You Were Killed";
	}
	else{
		document.getElementById("showDeathReason").innerHTML = "Out Of Time";
	}
	
	$('#gameOverModal').modal('show');
}


//runs every .01 seconds
function detectCollision(){

	function getPlayerDamageRandomCode(){
	
		var x = playerDamageRandomCode.toString();
		return ("ERROR CODE: " + x)
	
	}

	
	
	//error code defuse, if true it will give the ship extra health, else health will stay the same
	function checkErrorCode(){
		var x = playerDamageRandomCode % 2;
		console.log(x);
		if(x == 0){
			return true;
			
		}
		else{
			return false;
		}
	}
	
	//set shield indicator
	if(score >= 5000){
		if(usedShield == false){
			document.getElementById("displayShield").innerHTML = "+S";
			if(hasPlayedShieldShound == false){
				getShieldReady.play()
				hasPlayedShieldShound = true;
			}
		}
	}
	//hot fix for the fuel going below 0
	if(fuel < 0){
		fuel = 0;
	}
	
	//play if player health is below 50%
	if(health <= 500){
		if(health <= 250)
			if(playerHasExtraLowHealth == false){
				setBossBackground();	
				playerHasExtraLowHealth = true;
		}
	
		
		if(playerHasLowHealth == false){	
			getlowPlayerHealth.play();
			removeDefaultBackground();
			document.getElementById("negativeOK").innerHTML = "OK";
			document.getElementById("playerHealthIndicator").innerHTML = "[WARNING MECHANICAL FAILURE]";
			document.getElementById("randomDamageLabel").innerHTML = getPlayerDamageRandom();
			document.getElementById("randomDamageCode").innerHTML = getPlayerDamageRandomCode();
			
			//adds 15 health and only repairs once
			if(hasRepaired == false){
				if(checkErrorCode() == true){
					health = health+damageRepaired;
					document.getElementById("healthGivenBack").innerHTML = "(@)";
					document.getElementById("displayRepair").innerHTML = "RPЯ";
					document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
					hasRepaired = true;
				}
			}
			playerHasLowHealth = true;
		}
	}
	//change background to near death

	//return values to default and turn off error codes
	else{
		//document.getElementById("displayRepair").innerHTML = "";
		setDefaultBackground();
		document.getElementById("healthGivenBack").innerHTML = "";
		document.getElementById("negativeOK").innerHTML = "";
		document.getElementById("playerHealthIndicator").innerHTML = "";
		document.getElementById("randomDamageLabel").innerHTML = "";
		document.getElementById("randomDamageCode").innerHTML = "";
		document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
		playerHasLowHealth = false;
		playerHasExtraLowHealth = false;
	}
	
	
	//ends the game if player health reaches 0
	if(health <= 0){
		maxTime = 0;
		endGame();
	}
	
	//ends the game if ship health reaches 0 
	if(shipHealth <= 0){
		maxTime = 0;
		endGame();
	}

	//restores player health and clears error codes
	if(score >= 10000){
		if(lock3 == false){	
		getplayerHealthRestored.play();
		
		if(health < 1000){//due to the repair feature, its possible to go over 100% of the default health. Therefore if theyre already over default, we cant drop it back to default
			health = 1000;
		}
		document.getElementById("playerHealthIndicator").innerHTML = "";
		document.getElementById("randomDamageLabel").innerHTML = "";
		document.getElementById("randomDamageCode").innerHTML = "";
		document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
		console.log("Player Health Restored");
		lock3 = true;
		}
	}

	//If the player reaches a score of 30000, they are rewarded with infinite health
	if(score >= 30000){
		if(infiniteHealth == true){
			
			health = 100;
			
			shipHealth = 2000;
			
			music.pause()
					document.getElementById("playerHealthIndicator").innerHTML = "[INFINITE HEALTH]";
					document.getElementById("randomDamageLabel").innerHTML = "[INFINITE HEALTH]";
					document.getElementById("randomDamageCode").innerHTML = "[INFINITE HEALTH]";
					document.getElementById("shipHealthIndicator").innerHTML = "[INFINITE HEALTH]";
					document.getElementById("healthBox").innerHTML = "INFINITE";
			
			if(playInfiniteHealthSound == true){
					//getplayerInfiniteHealth.play();
					getInfiniteMusic.play();
					playInfiniteHealthSound = false;
			}
		}
		
		if(lock4 == false){	
		getplayerHealthRestored.play();
		//health = 1000000;
		document.getElementById("healthBox").innerHTML = "INFINITE";
		console.log("Player Health Infinite");
		infiniteHealth = true;
		lock4 = true;
		}
	}
	
	//anti cheat, we'll let them play, but on 1% health and the fuel station will be removed
	if(score >= 100000){
		infiniteHealth = false;
		health = 10;
		document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
		$("div").remove(".stationMain");
	}
	
	//If the player manages to rack up over 2500 score within the default time limit, they are granted 1 minute of bonus time. This will also display the attackers in the radar
	if(lock2 == false){
		if(score >= 2500){
			
			document.getElementById("bonusTime").innerHTML = "[BONUS TIME ADDED]";
			
			locatorOff = false;
			
			document.getElementById("enemyLocationOffRed").innerHTML = "";
			
			maxTime += 60;
			
			bonusTimeSoundEffect.play();
			
			//reveal names on radar, clears the distance numbers and replaces with name
			if(attacker== 0){
				attacker1Found = true;
				document.getElementById("revealAttackers1").innerHTML = "+[TEMPEST]";
				document.getElementById("revealAttackersBlank1").innerHTML = "";
			}
			if(attacker== 1){
				attacker2Found = true;
				document.getElementById("revealAttackers2").innerHTML = "+[ARACHNAX]";
				document.getElementById("revealAttackersBlank2").innerHTML = "";
			}
			if(attacker== 2){
				attacker3Found = true;
				document.getElementById("revealAttackers3").innerHTML = "+[ELECTRAX]";
				document.getElementById("revealAttackersBlank3").innerHTML = "";
			}
			if(attacker== 3){
				attacker4Found = true;
				document.getElementById("revealAttackers4").innerHTML = "+[PHANTAX]";			
				document.getElementById("revealAttackersBlank4").innerHTML = "";
			}
			if(shipAttacker== 0){
				attacker1Found = true;
				document.getElementById("revealAttackers1").innerHTML = ">[TEMPEST]";
				document.getElementById("revealAttackersBlank1").innerHTML = "";
			}
			if(shipAttacker== 1){
				attacker2Found = true;
				document.getElementById("revealAttackers2").innerHTML = ">[ARACHNAX]";
				document.getElementById("revealAttackersBlank2").innerHTML = "";
			}
			if(shipAttacker== 2){
				attacker3Found = true;
				document.getElementById("revealAttackers3").innerHTML = ">[ELECTRAX]";
				document.getElementById("revealAttackersBlank3").innerHTML = "";
			}
			if(shipAttacker== 3){
				attacker4Found = true;
				document.getElementById("revealAttackers4").innerHTML = ">[PHANTAX]";
				document.getElementById("revealAttackersBlank4").innerHTML = "";
			}
			lock2 = true;
		}
	}
	
	//play audio and turn on ship damage warning light
	if(shipHealth < 500){
		document.getElementById("shipHealthIndicator").innerHTML = "[WARNING DANGER TO FUEL SHIP]";
		if(playShipDamageAudio == true){
			lowShipHealthAlarm.play();
			playShipDamageAudio = false;
		}
	}
	
	//get IDs
	var bug1 = document.getElementById("ball");
	var bug2 = document.getElementById("bug2");
	var bug3 = document.getElementById("bug3");
	var bug4 = document.getElementById("bug4");
	var player = document.getElementById("missle");
	var tank = document.getElementById("fuelCell");
	var ship = document.getElementById("station");
	
	//get pixel locations
	var stationX = ship.style.left;
	var stationY = ship.style.top;
	
	
	var fuelX = tank.style.left;
	var fuelY = tank.style.top;
	
	var playerX = player.style.left;
	var playerY = player.style.top;

	
	var bug1X = bug1.style.left;
	var bug1Y = bug1.style.top;

	var bug2X = bug2.style.left;
	var bug2Y = bug2.style.top;
	
	var bug3X = bug3.style.left;
	var bug3Y = bug3.style.top;
	
	var bug4X = bug4.style.left;
	var bug4Y = bug4.style.top;
	
	//change pixels to numbers
	var distance1StationX = parseFloat(stationX);
	var distance1StationY = parseFloat(stationY);
	
	
	var distance1tankX = parseFloat(fuelX);
	var distance1tankY = parseFloat(fuelY);
	
	var distance1a = parseFloat(playerX);
	var distance1b = parseFloat(playerY);
	
	var distance1c = parseFloat(bug1X);
	var distance1d = parseFloat(bug1Y);
	
	var distance2a = parseFloat(bug2X);
	var distance2b = parseFloat(bug2Y);
	
	var distance3a = parseFloat(bug3X);
	var distance3b = parseFloat(bug3Y);
	
	var distance4a = parseFloat(bug4X);
	var distance4b = parseFloat(bug4Y);
	
	//Distance Formulas
	var distStationX = distance1StationX - distance1a;
	var distStationY = distance1StationY - distance1b;
	
	var distTankX = distance1tankX - distance1a;
	var distTankY = distance1tankY - distance1b;
	
	var dist1e = distance1c - distance1a;
	var dist1f = distance1d - distance1b;
	
	var dist2e = distance2a - distance1a;
	var dist2f = distance2b - distance1b;
	
	var dist3e = distance3a - distance1a;
	var dist3f = distance3b - distance1b;
	
	var dist4e = distance4a - distance1a;
	var dist4f = distance4b - distance1b;
		
	//calculate distance
	var finalDistance1 = Math.sqrt(dist1e*dist1e + dist1f*dist1f);
	var finalDistance2 = Math.sqrt(dist2e*dist2e + dist2f*dist2f);
	var finalDistance3 = Math.sqrt(dist3e*dist3e + dist3f*dist3f);
	var finalDistance4 = Math.sqrt(dist4e*dist4e + dist4f*dist4f);
	var finalDistance5 = Math.sqrt(distTankX*distTankX + distTankY*distTankY);
	var finalDistance6 = Math.sqrt(distStationX*distStationX + distStationY*distStationY);

	//use distance to display on offline radar
	var fD1 = parseFloat(Math.round(finalDistance1 * 100000));
	var fD2 = parseFloat(Math.round(finalDistance2 * 100000));
	var fD3 = parseFloat(Math.round(finalDistance3 * 100000));
	var fD4 = parseFloat(Math.round(finalDistance4 * 100000));
	
	//if the attackers have been found, we dont want to double layer the text with the name and the coords, so we turn the coords off
	if(attacker1Found == false){
		document.getElementById("revealAttackersBlank1").innerHTML = fD1;
	}
	
	if(attacker2Found == false){
		document.getElementById("revealAttackersBlank2").innerHTML = fD2;
	}
	
	if(attacker3Found == false){
		document.getElementById("revealAttackersBlank3").innerHTML = fD3;
	}
	
	if(attacker4Found == false){
		document.getElementById("revealAttackersBlank4").innerHTML = fD4;
	}
	
	
	//bug 1 takes 1 units of fuel at a time
	if(finalDistance1 < 100){
		if(hasShield == false){
			getEnemyHit.play();
			if(attacker == 0){
				health = health - .75;
					document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
			}
			if(shipAttacker == 0){
				shipHealth--;
							//document.getElementById("shipHealthBox").innerHTML = shipHealth;
			}
			if(fuel >= 0){
				fuel --;
				document.getElementById("fuelBox").innerHTML = fuel;
			}
		}else{
			
			//play shield hit here
			getShieldHit.play();
		}
	}
	//bug 2 takes 2 units of fuel at a time
	if(finalDistance2 < 100){
		if(hasShield == false){
			getEnemyHit.play();
			if(attacker == 1){
				health = health - .75;
					document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
			}
			if(shipAttacker == 1){
				shipHealth--;
				//document.getElementById("shipHealthBox").innerHTML = shipHealth;
			}
			if(fuel >= 0){
				fuel -=2;
				
				if(fuel < 0){
					fuel = 0;
				}
				document.getElementById("fuelBox").innerHTML = fuel;
			}
		}else{
			
			//play shield hit here
			getShieldHit.play();
		}
	}
	//bug 3 takes 3 units of fuel at a time
	if(finalDistance3 < 100){
		if(hasShield == false){
			getEnemyHit.play();
			if(attacker == 2){
				health = health - .75;
					document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
			}
			if(shipAttacker == 2){
				shipHealth--;
							//document.getElementById("shipHealthBox").innerHTML = shipHealth;
			}
			if(fuel >= 0){
				fuel -=3;
				if(fuel < 0){
					fuel = 0;
				}
				document.getElementById("fuelBox").innerHTML = fuel;
			}
		}else{
			
			//play shield hit here
			getShieldHit.play();
		}
	}
	//bug 4 takes all of your fuel
	if(finalDistance4 < 75){
		
		if(hasShield == false){
			getEnemyHit.play();
			if(attacker == 3){
				health = health - .75;
					document.getElementById("healthBox").innerHTML = Math.round((health * .1)) + "%";
			}
			if	(shipAttacker == 3){
				shipHealth--;
						//document.getElementById("shipHealthBox").innerHTML = shipHealth;
			}
			if(fuel >= 0){
				fuel =0;
				document.getElementById("fuelBox").innerHTML = fuel;
			}
		}else{
			
			//play shield hit here
			getShieldHit.play();
		}
	}	
	//fuel tank gives 10 units at a time
	if(finalDistance5 < 50){
		getfuelPickup.play();
		fuel ++;
		fuelCollected++;
		document.getElementById("fuelBox").innerHTML = fuel;
	}
	
	//remove fuel from player and exhange for score
	if(finalDistance6 < 100){
		console.log("HIT");
		if(fuel > 0){
			getfuelDropOff.play();
			fuel --;
			score++;
			
			document.getElementById("fuelBox").innerHTML = fuel;
			document.getElementById("scoreBox").innerHTML = score;
		}

	}
	

}

$(document).ready(function(){
  $("button").click(function(){
    $("div").remove(".player");
  });
});

//entity attributes
var directionXbug1 = 1; // 1 = Right, -1 = Left
var directionYbug1 = 1; // 1 = Down, -1 = Up
var speed = 1;

var directionXbug2 = 12;
var directionYbug2 = 12;
var speedBug2 = 2;

var directionXbug3 = 100;
var directionYbug3 = 100;
var speedBug3 = 7;

var directionXbug4 = 20;
var directionYbug4 = 20;
var speedBug4 = 10;

var directionXfuelTank = 10;
var directionYfuelTank = 10;
var speedFuelTank = 1;

var directionXstation = 0;
var directionYstation = 350;
var speedStation = 1;
//-----------------------------------------------------------bug1
function BounceBall() {

// obtain current location, calculate new location
var ball = document.getElementById("ball");
var left = ball.style.left;
var top = ball.style.top;
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);
x += directionXbug1 * speed;
y += directionYbug1 * speed;
var right = x + ball.style.width;
var bottom = y + ball.style.height;

// bounce off edges of screen
if (right >= window.innerWidth - 100)
  directionXbug1 = -1;
else if (right <= 0)
  directionXbug1 = 1;
if (bottom >= window.innerHeight - 100)
  directionYbug1 = -1;
else if (bottom <= 0)
  directionYbug1 = 1;

// change location of object on screen
ball.style.left = x + "px";
ball.style.top = y + "px";
}

//-----------------------------------------------------------station

function BounceStation() {

// obtain current location, calculate new location
var stat = document.getElementById("station");
var left = stat.style.left;
var top = stat.style.top;
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);
x += directionXstation * speedStation;
y += directionYstation * speedStation;
var right = x + stat.style.width;
var bottom = y + stat.style.height;

// bounce off edges of screen

if (right >= window.innerWidth - 300)
  directionXstation = -1;
else if (right <= 100)
  directionXstation = 1;

 if (bottom >= window.innerHeight - 300)
  directionYstation = -1;
else if (bottom <= 300)
  directionYstation = 1;

// change location of object on screen
stat.style.left = 10 + "px";
stat.style.top = y + "px";

}
//-----------------------------------------------------------bug2
function BounceBug2() {

// obtain current location, calculate new location
var bug2 = document.getElementById("bug2");
var left = bug2.style.left;
var top = bug2.style.top;
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);
x += directionXbug2 * speedBug2;
y += directionYbug2 * speedBug2;
var right = x + bug2.style.width;
var bottom = y + bug2.style.height;

// bounce off edges of screen
if (right >= window.innerWidth - 100)
  directionXbug2 = -.5;
else if (right <= 0)
  directionXbug2 = 1;
if (bottom >= window.innerHeight - 100)
  directionYbug2 = -.5;
else if (bottom <= 0)
  directionYbug2 = 1;

// change location of object on screen
bug2.style.left = x + "px";
bug2.style.top = y + "px";
}

//-----------------------------------------------------------bug3
function BounceBug3() {

// obtain current location, calculate new location
var bug3 = document.getElementById("bug3");
var left = bug3.style.left;
var top = bug3.style.top;
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);
x += directionXbug3 * speedBug3;
y += directionYbug3 * speedBug3;
var right = x + bug3.style.width;
var bottom = y + bug3.style.height;

// bounce off edges of screen
if (right >= window.innerWidth - 100)
  directionXbug3 = -.5;
else if (right <= 0)
  directionXbug3 = 1;
if (bottom >= window.innerHeight - 100)
  directionYbug3 = -.5;
else if (bottom <= 0)
  directionYbug3 = 1;

// change location of object on screen
bug3.style.left = x + "px";
bug3.style.top = y + "px";
}

//------------------------------------------------------------bug4
function BounceBug4() {

// obtain current location, calculate new location
var bug4 = document.getElementById("bug4");
var left = bug4.style.left;
var top = bug4.style.top;
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);
x += directionXbug4 * speedBug4;
y += directionYbug4 * speedBug4;
var right = x + bug4.style.width;
var bottom = y + bug4.style.height;

// bounce off edges of screen
if (right >= window.innerWidth - 100)
  directionXbug4 = -.5;
else if (right <= 0)
  directionXbug4 = 1;
if (bottom >= window.innerHeight - 100)
  directionYbug4 = -.5;
else if (bottom <= 0)
  directionYbug4 = 1;

// change location of object on screen
bug4.style.left = x + "px";
bug4.style.top = y + "px";
}

function BounceFuel() {

// obtain current location, calculate new location
var fuelTank = document.getElementById("fuelCell");
var left = fuelTank.style.left;
var top = fuelTank.style.top;
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);
x += directionXfuelTank * speedFuelTank;
y += directionYfuelTank * speedFuelTank;
var right = x + fuelTank.style.width;
var bottom = y + fuelTank.style.height;

// bounce off edges of screen
if (right >= window.innerWidth - 100)
  directionXfuelTank = -.5;
else if (right <= 0)
  directionXfuelTank = 1;
if (bottom >= window.innerHeight - 100)
  directionYfuelTank = -.5;
else if (bottom <= 0)
  directionYfuelTank = 1;

// change location of object on screen
fuelTank.style.left = x + "px";
fuelTank.style.top = y + "px";
}

function initSetup() {
setInterval(moveMissle, 1000);
setInterval(BounceBall, 5);
setInterval(BounceBug2, 5);
setInterval(BounceBug3, 20);
setInterval(BounceBug4, 20);
setInterval(BounceFuel, 5);
setInterval(BounceStation, 1);
//set blank boxes
document.getElementById("scoreBox").innerHTML = score;
document.getElementById("fuelBox").innerHTML = fuel;
document.getElementById("healthBox").innerHTML = (health * .1) + "%";
gameTimeSet = setInterval(gameTime,1000)
}


var mDirX =1;
var mDirY=1;
var pDirX = 1;


function moveMissle(dirX,dirY) {
mDirX = dirX;
mDirY = dirY;

var missle = document.getElementById("missle");
var left = missle.style.left;
var top = missle.style.top;
//console.log("left: " + left + " top: " + top);
var x = left.substr(0, left.length-2);
var y = top.substr(0, top.length-2);
x = (x == "") ? 0 : parseInt(x);
y = (y == "") ? 0 : parseInt(y);

missle.style.left = x + "px";
missle.style.top = y + "px";

//change dir if on edge of screen -- bouncing off effect
var right = x + missle.style.width;
var bottom = y + missle.style.height;

if (right >= window.innerWidth - 100)
  mDirX = -1;
else if (right <= 0)
  mDirX = 1;
if (bottom >= window.innerHeight - 100)
  mDirY = -1;
else if (bottom <= 0)
  mDirY = 1;


x += mDirX * (speed*5);
y += mDirY * (speed*5);


missle.style.left = x + "px";
missle.style.top = y + "px";

}

$(document).ready(function() {
//alert("Bugs In Space");
$(document).keydown(function (e) {
switch (e.keyCode) {
case 37: moveMissle(-5,0); break; //left
case 39: moveMissle(5,0); break;  //right
case 40: moveMissle(0,5); break; //down
case 38: moveMissle(0,-5); break;  //up
case 83: deployShield(); break;  //s
case 188: health = health - 100; break;  //,
case 190: health = health + 100; break;  //.
case 221: score = score+1000; break;
}
});
});
}
