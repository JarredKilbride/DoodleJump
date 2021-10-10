document.addEventListener('DOMContentLoaded', ()=>{
    const grid  = document.querySelector('.grid'); 
    const doodler = document.createElement('div'); 
    let doodlerLeftSpace = 20;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameover = false;
    let plateFormCount = 5;
    let plateforms = []; 
    let upTimerId,downTimerId;
    let isJumping = true;
    let goingLeft = false;
    let goingRight = false;
    let leftTimerId; 
    let rightTimerId;
    let score = 0

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add("doodler"); 
        doodlerLeftSpace = plateforms[0].left
        doodler.style.left = doodlerLeftSpace + "px"
        doodler.style.bottom = doodlerBottomSpace + "px"

    }

    class Platform{
        constructor(newPlatebottom){
            this.bottom = newPlatebottom;
            this.left = Math.random() * 300;
            this.visual = document.createElement('div'); 
            
            
            const visual = this.visual; 
            visual.classList.add('platform'); 
            visual.style.left = this.left + "px";
            visual.style.bottom = this.bottom + "px";
            grid.appendChild(visual); 


        }
    }

    function createPlatform() {
        for(let i = 0; i <plateFormCount;i++) {
            let plateFormSpace = 600/plateFormCount
            let newPlatebottom = 100 + i * plateFormSpace
            let newPlateForm = new Platform(newPlatebottom); 
            plateforms.push(newPlateForm);
            console.log(plateforms)
        }
    }    

    function movePlatforms(){
        if(doodlerBottomSpace>200){
            plateforms.forEach(platform => {
                platform.bottom -= 4; 
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px'; 

                if(platform.bottom<10){
                    score++
                    let firstPlatform = plateforms[0].visual
                    firstPlatform.classList.remove('platform')
                    plateforms.shift()
                    let newPlateform = new Platform(600)
                    plateforms.push(newPlateform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true;
       upTimerId = setInterval(function(){
            doodlerBottomSpace+=20
            doodler.style.bottom = doodlerBottomSpace + "px"

            //reset the start point for the doodler can jumper higher. 
            if(doodlerBottomSpace> startPoint+200) {
                fall()
            }
       },30)
    }

    function fall() {
        clearInterval(upTimerId); 
        isJumping = false; 
        downTimerId = setInterval(function(){
            doodlerBottomSpace  -= 5
            doodler.style.bottom = doodlerBottomSpace + "px"

            if(doodlerBottomSpace<=0) {
                gameOver();
            }
            //this is for when just jumps o a plat form he will then jump again. 
            plateforms.forEach(plat => {
                if((doodlerBottomSpace>= plat.bottom) &&
                    (doodlerBottomSpace<=plat.bottom + 15) &&
                    ((doodlerLeftSpace+60) >= plat.left) &&
                    (doodlerLeftSpace <= (plat.left+85)) &&
                    !isJumping
                    ) {
                        console.log("landed"); 
                        startPoint = doodlerBottomSpace
                        jump();
                    }
            })
        },30)
    }

    function gameOver(){
        console.log("gameOver")
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId); 
        clearInterval(downTimerId)
        clearInterval(leftTimerId); 
        clearInterval(rightTimerId)
        moveStraight()
    }

    function control(e) {
        if(e.key ==="ArrowLeft"){
            //lfet
            moveLeft();
        }
        else if(e.key ==="ArrowRight") {
            //right
            moveRight()
        }
        else if(e.key ==="ArrowUp") {
            //str
            moveStraight()
        }
    }

    function moveLeft(){
        if(goingRight) {
            clearInterval(rightTimerId);
            goingRight = false;
        }
        goingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace>=0){
                doodlerLeftSpace-=5
                doodler.style.left = doodlerLeftSpace + "px"
            }
            else {
                moveRight()
            }
        },30)
    }

    function moveRight(){
        if(goingLeft) {
            clearInterval(leftTimerId);
            goingLeft = false;
        }
        console.log("right")
        goingRight = true; 
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace<= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + "px"
            } else {
                moveLeft()
            }
        },30)
        
    }

    function moveStraight(){
        goingLeft = false
        goingRight = false
        clearInterval(leftTimerId); 
        clearInterval(rightTimerId)
    }

    function start() {
        if(!isGameover){
            createPlatform();
            createDoodler();
            setInterval(movePlatforms,30);
            jump(); 
            document.addEventListener("keyup",control)
        }
    }
    start()
})