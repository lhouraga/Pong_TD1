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

    //Vitesse de la balle
    speed : 1,

    bounce : function() {
      if ( this.posX > game.groundWidth || this.posX < 0 )
        this.directionX = -this.directionX;
      if ( this.posY > game.groundHeight || this.posY < 0  )
        this.directionY = -this.directionY;      
    },

    move : function() {
      this.posX += this.directionX * this.speed;
      this.posY += this.directionY * this.speed;
    },
  },

  //Raquette du joueur 1
  playerOne : {
    width : 10,
    height : 50,
    color : "#FFFFFF",
    posX : 10,
    posY : 200
  },
   
  //Raquette du joueur 2
  playerTwo : {
    width : 10,
    height : 50,
    color : "#FFFFFF",
    posX : 600,
    posY : 200
  },


  init : function() {
    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0); 
    game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
    
    this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
    game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);
    
    this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);  
    game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);
  
    //On appelle la fonction displayScore Pour afficher le score
    this.displayScore(0,0);

    //On appelle la fonction displayScore Pour afficher la balle
    this.displayBall();
    
    //On appelle la fonction displayPlayers Pour afficher les raquettes
    this.displayPlayers();
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
    this.ball.bounce();
    this.displayBall();
  },

  clearLayer : function(targetLayer) {
    targetLayer.clear();
  }
};