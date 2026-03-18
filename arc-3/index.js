function setup() {
  createCanvas(CanvasWidth, CanvasHight);

  backgroundShade = color(100, 17, 63);
  backgroundShadeTranslucent = color(100, 17, 63, 5);
  platformShade = color(222, 77, 134);
  accent1 = color(132, 230, 248);
  accent2 = color(247, 202, 205, 50);
  textColor = color(255, 255, 255);

  player = new playerObject()
  goal = new goalObject()
  for (var i = 0; i < amoutOfPlatforms; i++) {
    platforms.push(new platformObject())
  }
  for (var i = 0; i < amoutOfSideGoals; i++) {
    sideGoals.push(new goalObject())
  }
}

function draw() {
  input()
  if(state == "menu"){
    menu()
  }
  else if(state == "game"){
    game()
  }
}

function menu(){
  background(backgroundShadeTranslucent)
  fill(accent1)

  //spin
  translate(CanvasWidth*0.1 + 10* ( -leftKeyDown + rightKeyDown), -5 * (jumpKeyDown - downKeyDown))
  noStroke()

  textAlign(LEFT, BASELINE)
  textStyle(BOLD)
  textSize(100)
  text("ARC 3",0,CanvasHight*0.27)
  textSize(30)
  text("by: Hayden Shuker\nthanks to: Clayton Hickey\n2025",0,CanvasHight*0.35)
  textSize(20)
  text("[A] [D] [J]  together to start",0,CanvasHight*0.55)

  textSize(80)
  textStyle(NORMAL)
  text(score,0,CanvasHight*0.7)
  textStyle(BOLD)
  text(highScore,0,CanvasHight*0.85)

  if(leftKeyDown && rightKeyDown && jumpKeyDown){
    state = "game"
    reset()
  }
}

function game(){
  CurrentTimer = timerSeconds * 1000 - (millis() - timerLastUpdate)
  gameLogic()
  player.move()
  player.updatePull()

  //drawing steps
  scoreText()
  background(backgroundShadeTranslucent)
  fill(0,0,0,5)
  rect(0,0,CanvasWidth, CanvasHight*CurrentTimer/timerSeconds/1000)


  player.draw()

  fill(accent2)
  for(p = 0; p < amoutOfSideGoals; p ++){
    sideGoals[p].draw()
  }
  fill(accent1)
  goal.draw()
  for (var i = 0; i < amoutOfPlatforms; i++) {
    platforms[i].draw()
  }

}

function reset(){
  timerLastUpdate = millis()
  score = 0
  clearCount = 0
  player.x = 100
  player.y = CanvasHight - 100
  player.Xpull = 0
  player.Ypull = 0
  generateLevel()
}

function gameLogic(){
  if(CurrentTimer <= 0){
    if(score > highScore){
      highScore = score
    }
    this.state = "menu"
  }

  for(p = 0; p < amoutOfSideGoals; p ++){
    if(sideGoals[p].testPlayerC()){
      sideGoals[p].active = false
      score += sideGoalValue
    }
  }

  if(goal.testPlayerC()){
    clearCount ++
    score += clearValue
    generateLevel()
  }
}

function scoreText(){
  //score
  textAlign(CENTER, CENTER)
  textSize(250)
  fill(textColor)
  text(score, CanvasWidth/2, CanvasHight/2)
}

function developerHud(){
  if(developerHudActive){
    textSize(15)
    textAlign(LEFT)
    text("X pull: " + Math.floor(player.Xpull), 200, 40)
    text("Y pull: " + player.Ypull, 200, 60)
    text("Ctime: " + player.coyoteTime, 200, 80)
    text("right: " + player.collisionRight, 200, 100)
    text("left: " + player.collisionLeft, 200, 120)
    text("GCP: " + goal.playerCollision, 200, 140)
    text("X: " + player.x, 200, 160)
    text("Y: " + player.y, 200, 180)
  }
}

function generateLevel() {
  //clear screen
  background(backgroundShade)

  goal.x = floor(random(0, CanvasWidth -goal.size)/3) + (CanvasWidth -goal.size)*2/3 * (player.x< CanvasWidth/2)
  goal.y = floor(random(0, (CanvasHight -goal.size)/3))

  for(p = 0; p < amoutOfSideGoals; p ++){
    sideGoals[p].active = true
    sideGoals[p].x = floor(random(0, CanvasWidth -sideGoals[p].size))
    sideGoals[p].y = floor(random(CanvasHight/2, CanvasHight -sideGoals[p].size))
  }

  for (C = 0; C < amoutOfPlatforms; C++) {
    randomizePlat(C)
    if(
      Math.abs(platforms[C].x + platforms[C].width/2 - player.x) < lGPgap ||
      //Math.abs(platforms[C].y+ platforms[C].hight/2 - player.y) < lGPgap ||
      //Math.abs(platforms[C].x + platforms[C].width/2 - goal.x - goal.size/2) < lGPgap //||
     Math.abs(platforms[C].y + platforms[C].hight/2 - goal.y - goal.size/2) < lGPgap
    ){
      platforms[C].active = false
    }
  }

  function randomizePlat(Z){
    platforms[Z].active = true
    platforms[Z].x = floor(random(0 - platforms[Z].width/2, CanvasWidth - platforms[Z].width/2))
    platforms[Z].y = floor(random(0 - platforms[Z].hight/2, CanvasHight - platforms[Z].hight/2))

    platforms[Z].x = Math.round(platforms[Z].x/ gridSize) * gridSize
        platforms[Z].y = Math.round(platforms[Z].y/ gridSize) * gridSize
  }

  //top
  platforms[0].x = 0
  platforms[0].y = 0
  platforms[0].width = CanvasWidth
  platforms[0].hight = border
  platforms[0].active = true
  //bottom
  platforms[1].x = 0
  platforms[1].y = CanvasHight - border
  platforms[1].width = CanvasWidth
  platforms[1].hight = border
  platforms[1].active = true
  //left
  platforms[2].x = 0
  platforms[2].y = 0
  platforms[2].width = border
  platforms[2].hight = CanvasHight
  platforms[2].active = true
  //right
  platforms[3].x = CanvasWidth - border
  platforms[3].y = 0
  platforms[3].width = border
  platforms[3].hight = CanvasHight
  platforms[3].active = true
}

function input() {
  //left
  if (keyIsDown(65)) {
    leftKeyDown = true
  }
  else {
    leftKeyDown = false
    leftGap = true
  }
  if (leftGap && leftKeyDown) {
    leftSpaced = true
    leftGap = false
  }
  else {
    leftSpaced = false
  }
  //right
  if (keyIsDown(68)) {
    rightKeyDown = true
  }
  else {
    rightKeyDown = false
    rightGap = true
  }
  if (rightGap && rightKeyDown) {
    rightSpaced = true
    rightGap = false
  }
  else {
    rightSpaced = false
  }
  //down
  if (keyIsDown(83)) {
    downKeyDown = true
  }
  else {
    downKeyDown = false
    downGap = true
  }
  if (downGap && downKeyDown) {
    downSpaced = true
    downGap = false
  }
  else {
    downSpaced = false
  }
  //jump
  if (keyIsDown(74) || keyIsDown(87)) {
    jumpKeyDown = true
  }
  else {
    jumpKeyDown = false
    jumpGap = true
  }
  if (jumpGap && jumpKeyDown) {
    jumpSpaced = true
    jumpGap = false
  }
  else {
    jumpSpaced = false
  }
  //option
  if (keyIsDown(49)) {
    optionKeyDown = true
  }
  else {
    optionKeyDown = false
    optionGap = true
  }
  if (optionGap && optionKeyDown) {
    optionSpaced = true
    optionGap = false
  }
  else {
    optionSpaced = false
  }
}

