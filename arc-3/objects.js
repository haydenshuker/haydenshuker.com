function playerObject() {
	this.x = 0
	this.y = 0

	this.grounded = false
	this.collisionRight = false
	this.collisionLeft = false
	this.collisionUp = false

	this.jumptime = 0
	this.coyoteTime = 0

	this.jumpBuffered = false
	this.jumpBufferTime = 0

	this.Xpull = 0
	this.Ypull = 0

	this.draw = function() {
		fill(accent1)
		rect(this.x, this.y, 10, 10)
	}

	this.updatePull = function () {
		if(jumpSpaced){
			this.jumpBuffered = true
		}

		//falling
		if(this.Ypull <= terminalVelocity){
			this.Ypull = this.Ypull + gravity
		}

		//jumping
		/*
		if(jumpSpaced && this.grounded && this.Xpull == 0){
			this.Ypull = - verticalJumpPower
			this.jumptime = maxJumpTime
			this.coyoteTime = 0
		}
		else*/ if(this.jumpBuffered && (this.grounded || this.coyoteTime > 0) ){
			this.Ypull = -jumpPower
			this.jumptime = maxJumpTime
			this.coyoteTime = 0
			this.jumpBuffered = false
		}
		else if(!this.grounded && this.jumptime > 0 && jumpKeyDown){
			this.Ypull = -jumpPower
			this.jumptime = this.jumptime - 1
		}
		else{
			this.jumptime = 0
		}

		//grounded
		if(this.grounded){
			this.coyoteTime = maxCoyoteTime
			//grounded
			if(rightKeyDown && leftKeyDown){

			}
			/*
			else if(downSpaced){
				this.Xpull = 0
				fill(accent1)
				rect(this.x,0, 10, CanvasHight)
			}
			*/
			else if(rightKeyDown){
				this.Xpull += groundLateralAcceleration
			}
			else if(leftKeyDown){
				this.Xpull -= groundLateralAcceleration
			}

			//friction
			else if(Math.abs(this.Xpull) < roundToZero){
				this.Xpull = 0
			}
			else if(this.Xpull > 0){
				this.Xpull -= friction
			}
			else if(this.Xpull < 0){
				this.Xpull += friction
			}
		}
		
		//aerial
		if(!this.grounded){
			if(rightKeyDown && leftKeyDown){

			}
			else if(rightKeyDown && this.Xpull >= 0){
				this.Xpull += airLateralAcceleration
			}
			else if(rightKeyDown && this.Xpull < 0){
				this.Xpull += airLateralBreaks
			}
			else if(leftKeyDown && this.Xpull <= 0){
				this.Xpull -= airLateralAcceleration
			}
			else if(leftKeyDown && this.Xpull > 0){
				this.Xpull -= airLateralBreaks
			}

			if(downKeyDown){
				this.Ypull += airFallAcceleration
			}
			/*
			if(downSpaced){
				this.Xpull = 0
				this.Ypull = 1000
			}
			*/
		}

		//wall interaction
		if(this.collisionRight || this.collisionLeft){
			//this.coyoteTime = maxCoyoteTime
			//slide
			/*
			if(this.Ypull > 0 && jumpKeyDown){
				this.Ypull = wallSlideSpeed
			}
			*/

			//Climb
			if(this.collisionLeft && leftKeyDown){
				this.Ypull = -climbSpeed
				this.Xpull = -climbLurchPower
			}
			else if(this.collisionRight && rightKeyDown){
				this.Ypull = -climbSpeed
				this.Xpull = climbLurchPower
				this.jumptime = maxJumpTime
			}

			//wall jump
			if(this.collisionLeft && this.jumpBuffered && !this.grounded){
				this.Ypull = -jumpPower
				this.Xpull = wallJumpLateral
				this.jumptime = maxJumpTime
				this.jumpBuffered = false
			}
			else if(this.collisionRight && this.jumpBuffered && !this.grounded){
				this.Ypull = -jumpPower
				this.Xpull = -wallJumpLateral
				this.jumptime = maxJumpTime
				this.jumpBuffered = false
			}


			
		}
		//roof interaction
		if(this.collisionUp){/*
			if(jumpKeyDown && !rightKeyDown && !leftKeyDown){
				this.Ypull = 0
				this.Xpull = 0
			}
			else*/ if(jumpKeyDown && rightKeyDown){
				this.Ypull = -(jumpPower + lateralRoofYmod)
				this.Xpull = lateralRoofX
				this.jumptime = maxJumpTime
			}
			else if(jumpKeyDown && leftKeyDown){
				this.Ypull = -(jumpPower + lateralRoofYmod)
				this.Xpull = -lateralRoofX
				this.jumptime = maxJumpTime
			}
		}
		this.coyoteTime --
		this.jumpBufferTime --
		if(this.jumpBufferTime == 0){
			this.jumpBuffered = false
		}
	}
//Move and collide
	this.move = function () {

    //vertical
	//down
	if (this.Ypull >= 0) {
      for (U = 0; U < this.Ypull; U++) {
				if(this.grounded){
					this.Ypull = 0
					break
				}
				else{
					this.y ++
				}
				this.testAllCollide()
      }
    }
	//up
    if (this.Ypull < 0) {
      for (U = 0; U < -this.Ypull; U++) {
				if(this.collisionUp){
					this.Ypull = 0
					break
				}
				else{
					this.y--
				}
				this.testAllCollide()
      }
    }
		//horizontal
		if(this.Xpull > 0){
			for (U = 0; U < this.Xpull; U ++){
				if(this.collisionRight){
					this.Xpull = 0
					break
				}
				else {
					this.x ++
				}
				this.testAllCollide()
			}
		}
		else if(this.Xpull < 0){
			for (U = 0; U < -this.Xpull; U ++){
				if(this.collisionLeft){
					this.Xpull = 0
					break
				}
				else {
					this.x --
				}
			this.testAllCollide()
			}
		}
  }

	this.collideDown = function () {
	for (C = 0; C < amoutOfPlatforms; C++) {
		if (
		Math.floor(player.y) +playerSize  == Math.floor(platforms[C].y) &&
		Math.floor(this.x + playerSize) > Math.floor(platforms[C].x) &&
		Math.floor(this.x) < platforms[C].x + Math.floor(platforms[C].width) &&
				platforms[C].active

		) {
		return true
		}
	}
	return false
	}

	this.collideUp = function () {
	for (C = 0; C < amoutOfPlatforms; C++) {
		if (
		Math.floor(player.y) == Math.floor(platforms[C].y + platforms[C].hight)		&&
		Math.floor(this.x + playerSize) > Math.floor(platforms[C].x) 							&&
		Math.floor(this.x) < platforms[C].x + Math.floor(platforms[C].width) 			&&
				platforms[C].active

		) {
				return true
		}
	}
	return false
	}

	this.collideRight = function(){
		for (C = 0; C < amoutOfPlatforms; C++) {

		if (
		this.x + playerSize == platforms[C].x &&
				this.y + playerSize > platforms[C].y &&
				this.y < platforms[C].y + platforms[C].hight &&
				platforms[C].active
		) {
		return true
		}
		}
		return false
	}

	this.collideLeft = function(){
		for (C = 0; C < amoutOfPlatforms; C++) {

		if (
		this.x == platforms[C].x  + platforms[C].width &&
				this.y + 10 > platforms[C].y  &&
				this.y < platforms[C].y + platforms[C].hight &&
				platforms[C].active
		) {
		return true
		}
		}
		return false
	}

	this.testAllCollide = function(){
		this.grounded = this.collideDown()
		this.collisionUp = this.collideUp()
		this.collisionLeft = this.collideLeft()
		this.collisionRight = this.collideRight()
	}
}

function platformObject() {
	this.x = 0
	this.y = 0
	this.width = 100
	this.hight = 100
	this.active = true

	this.draw = function () {
	if (this.active) {
		fill(platformShade)
		rect(this.x, this.y, this.width, this.hight)
	}
  }
}

function goalObject(){
	this.x = 0
	this.y = 0
	this.size = 70
	this.active = true

	this.draw = function(){
		if(this.active){
			rect(this.x, this.y, this.size, this.size);
		}
	}
	this.testPlayerC = function(){
		if(player.x + playerSize/2 > this.x &&
		player.x + playerSize/2 < this.x + this.size &&
		player.y + playerSize/2 > this.y &&
		player.y + playerSize/2 < this.y + this.size &&
		this.active){
			return(true)
		}
		else{
			return(false)
		}
	}
}
