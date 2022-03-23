const MAX_X_STRETCH = 255;
const MAX_Y_STRETCH = 255;
const MAX_X_ROTATION = 30;
const MAX_Y_ROTATION = 30;

let largeNameItems = document.querySelectorAll(".large-name");
let nameContainer = document.getElementById("name-container");

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

window.addEventListener('resize', updateHeightWidth);

function updateHeightWidth() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
}

document.addEventListener('mousemove', mouseTouchMove)
document.addEventListener('touchstart', mouseTouchMove)
document.addEventListener('touchmove', mouseTouchMove)

let percentFromCenterX, percentFromCenterY;
function mouseTouchMove(e) {
    console.log(e);
    // Clear existing logic for 
    clearInterval(returnAnimationTimer);
    returning = false;

    let x, y;
    if(e.touches) {
        console.log("mobile");
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    let screenXCenter = window.innerWidth/2;
    let screenYCenter = window.innerHeight/2;

    if(x <= screenXCenter) {
        percentFromCenterX = ((screenXCenter-x)/screenXCenter)*-1;
    } else {
        percentFromCenterX = (x-screenXCenter)/screenXCenter;
    }

    if(y <= screenYCenter) {
        percentFromCenterY = ((screenYCenter-y)/screenYCenter)*-1;
    } else {
        percentFromCenterY = (y-screenYCenter)/screenYCenter;
    }

    update3dPositionAndShadow(percentFromCenterX, percentFromCenterY);
}

function touchStart(e) {

}

function touchMove(e) {

}

function update3dPositionAndShadow(percentFromCenterX, percentFromCenterY) {     
    //Update the shadows based on the percent from screen center
    let shadowX, shadowY, rotateX, rotateY;
    shadowX = percentFromCenterX * MAX_X_STRETCH;
    shadowY = percentFromCenterY * MAX_Y_STRETCH;
    rotateY = percentFromCenterX * MAX_Y_ROTATION * -1;
    rotateX = percentFromCenterY * MAX_X_ROTATION;
    largeNameItems[0].style.textShadow = generateShadow(shadowX,shadowY);
    largeNameItems[1].style.textShadow = generateShadow(shadowX,shadowY);
    if(shadowY>0) {
        largeNameItems[1].style.zIndex = 100;
        largeNameItems[0].style.zIndex = 1;
    } else {
        largeNameItems[0].style.zIndex = 100;
        largeNameItems[1].style.zIndex = 1;
    }
    nameContainer.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) perspective(200px)`;
}

// check every 1 second if there was any movement
let lastPercentX, lastPercentY, returning = false;
setInterval(() => {
    if(lastPercentX==percentFromCenterX && lastPercentY==percentFromCenterY && returning==false) {
        returning = true;
        returnShadowToCenter();
    }

    lastPercentX = percentFromCenterX;
    lastPercentY = percentFromCenterY;
}, 1000)

let returnAnimationTimer;
function returnShadowToCenter() {
    let step = 0;
    let amountToDecreaseX = percentFromCenterX / 50;
    let amountToDecreaseY = percentFromCenterY / 50;
    returnAnimationTimer = setInterval(() => {
        if(step<50) {
            percentFromCenterX -= amountToDecreaseX;
            percentFromCenterY -= amountToDecreaseY;
            update3dPositionAndShadow(percentFromCenterX, percentFromCenterY);
            step++;
        } else {
            clearInterval(returnAnimationTimer);
        }
        
    }, 10);
}





function generateShadow(x,y) {
    let colorList = [];
    let maxPixels = Math.max(Math.abs(x), Math.abs(y));
    for (let i=1 ; i<=maxPixels; i++) {
        colorList.push(`${(x/maxPixels)*i}px ${(y/maxPixels)*i}px 0 ${generateColorAtPercent(i/maxPixels)}`);
    }
    return colorList.join(",");
}

function generateColorAtPercent(percent) {
    let r=0, g=0, b=0;
    if (percent>=0 && percent<.166) {
        r = 255;
        g = (percent/.166)*255;
        b = 0;
    } else if (percent>=.166 && percent<.333) {
        r = 255-(((percent-.166)/.166)*255);
        g = 255;
        b = 0;
    } else if (percent>=.333 && percent<.5) {
        r = 0;
        g = 255;
        b = ((percent-.333)/.166)*255;
    }  else if (percent>=.5 && percent<.666) {
        r = 0;
        g = 255-(((percent-.5)/.166)*255);
        b = 255;
    }  else if (percent>=.666 && percent<.833) {
        r = ((percent-.666)/.166)*255;
        g = 0;
        b = 255;
    }  else if (percent>=.833 && percent<=1) {
        r = 255;
        g = 0;
        b = 255-(((percent-.833)/.166)*255);
    } 

    return `rgb(${r},${g},${b})`;
}