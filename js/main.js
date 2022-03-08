const MAX_X_STRETCH = 255;
const MAX_Y_STRETCH = 255;

let tyler = document.getElementById("tyler");

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

window.addEventListener('resize', updateHeightWidth);

function updateHeightWidth() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
}

document.addEventListener('mousemove', updateShadow)

function updateShadow(e) {
    let screenXCenter = window.innerWidth/2;
    let screenYCenter = window.innerHeight/2;

    let percentFromCenterX, percentFromCenterY;
    if(e.clientX <= screenXCenter) {
        percentFromCenterX = ((screenXCenter-e.clientX)/screenXCenter)*-1;
    } else {
        percentFromCenterX = (e.clientX-screenXCenter)/screenXCenter;
    }

    if(e.clientY <= screenYCenter) {
        percentFromCenterY = ((screenYCenter-e.clientY)/screenYCenter)*-1;
    } else {
        percentFromCenterY = (e.clientY-screenYCenter)/screenYCenter;
    }


    tyler.style.textShadow = generateShadow(percentFromCenterX*MAX_X_STRETCH,percentFromCenterY*MAX_Y_STRETCH);
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