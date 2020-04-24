var game = {
  groundWidth : 700,
  groundHeight : 400,
  groundColor: "#000000",
  netWidth : 6,
  netColor: "#FFFFFF",

  //Joueur 1 à 300 pixels du bord gauche du canvas html5.
  scorePosPlayer1 : 300,

  // Joueur 2 à 365 pixels du bord gauche du canvas html5.
  scorePosPlayer2 : 365,
 
  groundLayer : null,  
  scoreLayer : null,
  playersBallLayer : null,
  //SON
  wallSound : null,
  playerSound : null,
  
  //Position de la balle
  ball : {
    width : 10,
    height : 10,
    color : "#FFFFFF",
    //Ces 2 variables posX et posY sont nécessaires pour faire bouger la balle
    posX : 200,
    posY : 200,
    directionX : 1,
    directionY : 1,
    inGame : false,

    //Vitesse de la balle
    speed : 1,

    bounce : function(soundToPlay) {
      if ( this.posX > game.groundWidth || this.posX < 0 )
        this.directionX = -this.directionX;
          //soundToPlay.play();
      if ( this.posY > game.groundHeight || this.posY < 0  )
        this.directionY = -this.directionY;  
         // soundToPlay.play();    
    },

    move : function() {
      if (this.inGame){
      this.posX += this.directionX * this.speed;
      this.posY += this.directionY * this.speed;
      }
    },

    collide : function(anotherItem) {
      if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
      || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height ) ) {
        // Collision
        return true;
      } 
      return false;
    },

    lost : function(player) {
      var returnValue = false;
      if ( player.originalPosition == "left" && this.posX < player.posX - this.width ) {
        returnValue = true;
      } else if ( player.originalPosition == "right" && this.posX > player.posX + player.width ) {
        returnValue = true;
      }
      return returnValue;
    }
  },

  //Raquette du joueur 1
  playerOne : {
    width : 10,
    height : 50,
    color : "#FFFFFF",
    posX : 10,
    posY : 200,
    goUp : false,
    goDown : false,
    score:0,
    originalPosition : "left"
  },
   
  //Raquette du joueur 2
  playerTwo : {
    width : 10,
    height : 50,
    color : "#FFFFFF",
    posX : 600,
    posY : 200,
    score:0,
    goUp : false,
    goDown : false,
    originalPosition : "right"
  },


  init : function() {
    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0); 
    game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
    
    this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, this.playerTwo, 0);
    game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);
    
    this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);  
    game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);
  
    //On appelle la fonction displayScore Pour afficher le score
    this.displayScore(this.playerOne.score1,this.playerTwo.score2);

    //On appelle la fonction displayScore Pour afficher la balle
    this.displayBall();
    
    //On appelle la fonction displayPlayers Pour afficher les raquettes
    this.displayPlayers();

    this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
    this.initMouse(game.control.onMouseMove); 
    this.wallSound = new Audio("./sound/pingRaquette.ogg");
    this.playerSound = new Audio("./sound/pingRaquette.ogg");
 
    game.ai.setPlayerAndBall(this.playerTwo, this.ball);
    this.collideBallWithPlayersAndAction();
    this.moveBall();
    this.lostBall();

     },

  //Fonction pour l'affichage du score
  displayScore : function(scorePlayer1, scorePlayer2) {
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
  },

  //Fonction pour l'affichage de la balle
  displayBall : function() {
    game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
  } ,

  //Fonction pour l'affichage de la raquette
  displayPlayers : function() {
    game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
    game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
  },

  moveBall : function() { 
    this.ball.move();
    this.ball.bounce(this.wallSound);
    this.displayBall();
  },

  clearLayer : function(targetLayer) {
    targetLayer.clear();
  },

  initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
    window.onkeydown = onKeyDownFunction;
    window.onkeyup = onKeyUpFunction;
  },
  movePlayers : function() {
    if ( game.control.controlSystem == "KEYBOARD" ) {
      // keyboard control
      if ( game.playerOne.goUp ) {
        game.playerOne.posY-=5;
      } else if ( game.playerOne.goDown ) {
        game.playerOne.posY+=5;
      }
    } else if ( game.control.controlSystem == "MOUSE" ) {
      // mouse control
      if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer)
        game.playerOne.posY-=5;
      else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer)
        game.playerOne.posY+=5;
    }
  },

  initMouse : function(onMouseMoveFunction) {
    window.onmousemove = onMouseMoveFunction;
  },

  collideBallWithPlayersAndAction : function() { 
    if ( this.ball.collide(game.playerOne) ) {
      game.ball.directionX = -game.ball.directionX;
      this.playerSound.play();
    } else 
    {
      this.playerOne.score1+=1;
    }
    if ( this.ball.collide(game.playerTwo) ) {
      game.ball.directionX = -game.ball.directionX;
      this.playerSound.play();
    } else 
    {
      this.playerTwo.score2+=1;
    }
  },

  lostBall : function() {
    if ( this.ball.lost(this.playerOne) ) {
      // action si joueur de gauche perd la balle
      this.playerTwo.score++;
    } else if ( this.ball.lost(this.playerTwo) ) {
      // action si joueur de droiteperd la balle
      this.playerOne.score++;
    }
    this.scoreLayer.clear();
    this.displayScore(this.playerOne.score, this.playerTwo.score);
  },

 
};