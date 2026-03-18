var CanvasWidth = 600
var CanvasHight = 600

//score
var score = 0
var clearValue = 3
var sideGoalValue = 1
var highScore = 0

// level stats
var clearCount = 0
var timerSeconds = 80
var levelPlatNumber = amoutOfPlatforms

//level
//platforms
var platforms = []
var amoutOfPlatforms = 30
var border = 5
var gridSize = 25

//goals
var sideGoals = []
var amoutOfSideGoals = 5
var lGPgap = 60
var groundGoalGap = 100

//Player
var playerSize = 10
var maxLateralSpeed = 10
//air
var terminalVelocity = 15
var jumpPower = 7
var verticalJumpPower = 50
var maxJumpTime = 10
var maxCoyoteTime = 3
var bufferTime = 3
var airLateralAcceleration = 0.2
var airFallAcceleration = 1
var airLateralBreaks = 0.6
var gravity = 0.8
//ground
var groundLateralAcceleration = 0.6
var friction = 0.2
var roundToZero = 2
//wall
var wallSlideSpeed = 0.8
var wallJumpLateral = 8
var wallJumpX = 7
var climbSpeed = 5
var climbLurchPower = 2
//roof
var lateralRoofX = 6
var lateralRoofYmod = 1

//timer
var timerLastUpdate = 0
var CurrentTimer = 0

//game
var state = "menu"

//gui
var developerHudActive = true
var developerHudSize = 20

//Controls
var jumpGap = false
var jumpSpaced = false
var jumpKeyDown = false

var upGap = false
var upSpaced = false
var upKeyDown = false

var downGap = false
var downSpaced = false
var downKeyDown = false

var rightGap = false
var rightSpaced = false
var rightKeyDown = false

var leftGap = false
var leftSpaced = false
var leftKeyDown = false

var optionGap = false
var optionSpaced = false
var optionKeyDown = false
