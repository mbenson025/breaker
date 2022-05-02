const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//background image
const bg_img = new Image();
bg_img.src = "assets/images/vapormountains.jpg";




let score = 0;
let lives = 0;


let brickRowCount = 9;
let brickColumnCount = 5;


//console.log(bricks)

//create ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height /2,
  radius: 10,
  speed: 4,
  dx: 4,
  dy: -4
}

//create paddle properties
let paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 100,
  h: 12,
  speed: 12,
  dx: 0
}

//create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

//create bricks
let bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//draw paddle 
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#05ffa1';
  ctx.fill();
  ctx.closePath();
}


//draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#05ffa1';
  ctx.fill();
  ctx.closePath();
}


//draw score
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#D407DE';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//draw bricks on canvas
function drawBricks() {
  this.image = document.getElementById("img_brick")
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#4465dd' : 'transparent';
      ctx.fill();
      this.markedForDeletion = false;
      ctx.closePath();
    });
  });   
}

//move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //wall detection
  if(paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if(paddle.x < 0) {
    paddle.x = 0;
  }
}



//move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;


  //wall collision (right/left or x axis)
  if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1; //this is basically ball.dx = ball.dx * -1
  }

  //wall collision (top/bottom)
  if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  //console.log(ball.x, ball.y); <--------to see ball movement location

  //paddle collision
  //always take into account size of object(why the subtraction)
  if(ball.x - ball.radius > paddle.x && ball.x + ball.radius < paddle.x + paddle.w && ball.y + ball.radius > paddle.y) {
    // ball.dy = -ball.speed;

            // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.w/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.w/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
            
            //-1 to account for slow bounce speed? - IDK COME BACK HERE
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
  }


  //brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if(
          ball.x - ball.radius > brick.x && // left brick side check
          ball.x + ball.radius < brick.x + brick.w && // right brick side check
          ball.y + ball.radius > brick.y && // top brick side check
          ball.y - ball.radius < brick.y + brick.h // bottom brick side check

        ) {
          ball.dy *= -1;
          brick.visible = false;
          this.markedForDeletion = true;

          increaseScore();
        }
      }
    });
  });
  //hit bottom wall - lose
  if(ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

//increase score
function increaseScore() {
  score += 3

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

//make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => brick.visible = true)
  })
}


//draw everything
function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(bg_img, 0, 0);
  drawPaddle();
  drawBall();
  drawScore();
  drawBricks();
}

//update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  //draw everything
  draw();


  requestAnimationFrame(update);
}


update();




//keydown event
function keyDown(e) {
  console.log(e);
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

//keyup event
function keyUp(e) {
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = 0;

  }
}

//keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//mouse move control---5.1.22
document.addEventListener('mousemove', mouseMoveHandler , false );
//paddle movement based on mouse movement
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX>0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.w / 2;
    
  }
}


//rules and close event handlers
rulesBtn.addEventListener('click', () =>
rules.classList.add('show'));
closeBtn.addEventListener('click', () =>
rules.classList.remove('show'));
