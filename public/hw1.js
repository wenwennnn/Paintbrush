var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d')
var textBox = document.getElementById("textBox");
var color_sec = document.getElementById("color_sec");
const fill_cor = document.querySelector("#fill-color")


//
var red = 0;
var green = 0;
var blue = 0;

//
let brush_size = 10;
ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = brush_size;

let transparent = 1;

color_sec.style.backgroundColor = ctx.strokeStyle;

textBox.style.overflow = "hidden";

console.log(ctx.strokeStyle);

//
let font_size = '14px';
let font_look = 'Arial';
let font = 'bold '+ font_size + ' ' + font_look;
let has_input = false;
var text_content = "";
ctx.font = 'bold ' + font_size + ' ' + font_look;

//
let isDrawing = false;
let state = 0; //0->brush 1->eraser 2->text 3->triangle 4->circle 5->rectangle 6->line
let lastX = 0;
let lastY = 0;
let preX =0, preY = 0;

//
let PushArray = [];
let step = -1;

PushArray.push(canvas.toDataURL());
step++;

////
canvas.style.cursor = 'url("icon/pen.png"), auto';
     
function Push() {
    console.log(step);
    step++;
    if (step < PushArray.length - 1) {
        PushArray.length = step + 1;
    }
    //PushArray.push(canvas.toDataURL());
    PushArray[step] = canvas.toDataURL();
}  

canvas.addEventListener('mousemove',function(e){draw(e)});
canvas.addEventListener('mousedown',function(e){

    preX = e.offsetX;
    preY = e.offsetY;

    if(state!=2){
        ctx.beginPath(); //new path
        isDrawing = true;
        [lastX,lastY] = [e.offsetX,e.offsetY];
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    else{
        //isDrawing = false;
            
        if(has_input){
            console.log('text');
            text_content = textBox.value;
            has_input = false;
            textBox.style['z-index'] = 1;
            this.drawing(this.x, this.y);
            textBox.value = "";
        }
        else if(!has_input){
            console.log('text_on');
            this.x = e.offsetX;
            this.y = e.offsetY;
            has_input = true;
            textBox.style.left = this.x + 'px';
            textBox.style.top = this.y + 'px';
            textBox.style['z-index'] = 6;
            
        }
        [lastX,lastY] = [e.offsetX,e.offsetY];
    }
});
canvas.addEventListener('mouseup',function(){
    if(state!=2 && isDrawing) Push();
    isDrawing = false;
});
canvas.addEventListener('mouseout',function(){
    if(isDrawing) Push();
    isDrawing = false;
});



canvas.drawing = function (x1, y1, x2, y2, e) {
    let self = this;
    if (!ctx) {
        return;
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.lineWidth = 0;

        ctx.save();
        ctx.beginPath();

        ctx.font = 'bold ' + font_size + ' ' + font_look;
        ctx.fillText(text_content, x1, y1);  // 文字会展示在（10, 50）展示

        ctx.restore();
        ctx.closePath();
    }
    Push();
};

function draw(e){
    if(!isDrawing) return;
    if(state == 2) return;

    ctx.putImageData(snapshot, 0, 0);

    ctx.globalAlpha = transparent;

    if(state == 0){
        ctx.globalCompositeOperation = "source-over";
        ctx.moveTo(lastX,lastY); //start
        ctx.lineTo(e.offsetX,e.offsetY); //end
        ctx.stroke(); //start -> end
        [lastX,lastY] = [e.offsetX,e.offsetY];
    }
    else if(state == 1){
        ctx.globalCompositeOperation = "destination-out";
        ctx.moveTo(lastX,lastY); //start
        ctx.lineTo(e.offsetX,e.offsetY); //end
        ctx.stroke(); //start -> end
        [lastX,lastY] = [e.offsetX,e.offsetY];
    }
    else if(state == 3){
        ctx.beginPath();
        ctx.moveTo(preX, preY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.lineTo(preX*2 - e.offsetX, e.offsetY);
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
        if(!fill_cor.checked) ctx.stroke();
        else ctx.fill();
    }
    else if(state == 4){
        //console.log('wow');
        ctx.beginPath();
        let radius = Math.sqrt(Math.pow((preX-e.offsetX), 2) + Math.pow((preY-e.offsetY), 2));
        console.log(radius);
        ctx.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
        ctx.globalCompositeOperation = "source-over";
        if(!fill_cor.checked) ctx.stroke();
        else ctx.fill();
    }
    else if(state == 5){
        //console.log('hihih');
        ctx.globalCompositeOperation = "source-over";
        if(!fill_cor.checked) ctx.strokeRect(e.offsetX, e.offsetY, preX-e.offsetX, preY-e.offsetY);
        else ctx.fillRect(e.offsetX, e.offsetY, preX-e.offsetX, preY-e.offsetY);
    }
    else if(state == 6){
        ctx.beginPath();
        ctx.moveTo(preX, preY);
        ctx.lineTo(e.offsetX, e.offsetY);
        //ctx.lineTo(preX*2 - e.offsetX, e.offsetY);
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
        ctx.stroke();
    }
    
}

document.getElementById('download').addEventListener('click', function(e) {
    let canvasUrl = canvas.toDataURL(); //to url

    const createEl = document.createElement('a'); //have url
    createEl.href = canvasUrl;

    createEl.download = "your_canvas~"; //name

    createEl.click(); //download
    createEl.remove(); //remove url
});

const uploader = document.querySelector('#uploader');
document.getElementById('upload').addEventListener('click', function(e){
    //console.log('hihi');
    const myFile = uploader.files[0];
    console.log(myFile.name);

    const img=new Image();
    img.src = URL.createObjectURL(myFile);
    img.onload = function(){
        ctx.drawImage(img,0,0);
        Push();
    }
})

document.getElementById('refresh').addEventListener('click', function(e){
    console.log('refresh');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    PushArray = new Array();
    step = -1;
    Push();
})

document.getElementById('un_do').addEventListener('click', function(e){
    console.log('undo!');
    if (step > 0) {
        step--;
        console.log(step);
        var canvasPic = new Image();
        canvasPic.src = PushArray[step];
        canvasPic.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(canvasPic, 0, 0);
        }
    }
    else {
        alert('you are on the first step !');
    }
})

document.getElementById('re_do').addEventListener('click', function(e){
    console.log('redo!');
    if (step < PushArray.length-1) {
        step++;
        var canvasPic = new Image();
        canvasPic.src = PushArray[step];
        canvasPic.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(canvasPic, 0, 0);
        }
    }
    else {
        alert('you dont have the next step !');
    }
})

document.getElementById('eraser').addEventListener('click', function(){
    //console.log('erase');
    state = 1;
    canvas.style.cursor = 'url("icon/eraser.png"), auto';
})

document.getElementById('brush').addEventListener('click', function(){
    //console.log('paint');
    state = 0;
    canvas.style.cursor = 'url("icon/pen.png"), auto';
})

document.getElementById('thickness').addEventListener('change', function(element){
    //console.log('define');
    brush_size = element.target.value;
    ctx.lineWidth = brush_size;
})

document.getElementById('transparent').addEventListener('change', function(element){
    //console.log('define');
    transparent = element.target.value/100;
    ctx.globalAlpha = transparent;
})

document.getElementById('text').addEventListener('click', function(){
    console.log('text');
    state = 2;
    canvas.style.cursor = 'crosshair';
})

document.getElementById('triangle').addEventListener('click', function(e){
    console.log('tri');
    state = 3;
    canvas.style.cursor = 'url("icon/triangle.png"), auto';
})

document.getElementById('circle').addEventListener('click', function(e){
    console.log('circle');
    state = 4;
    canvas.style.cursor = 'url("icon/circle.png"), auto';
})

document.getElementById('rectangle').addEventListener('click', function(e){
    console.log('rectangle');
    state = 5;
    canvas.style.cursor = 'url("icon/rectangle.jpg"), auto';
})

document.getElementById('line').addEventListener('click', function(){
    //console.log('rectangle');
    state = 6;
    canvas.style.cursor = 'crosshair';
})

document.getElementById('fontsize').addEventListener('change', function(element){
    font_size = element.value;
    console.log(font_size);
})

document.getElementById('red').addEventListener('change', function(element){
    red = element.target.value;
    console.log(red, blue, green);
    ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    color_sec.style.backgroundColor = ctx.strokeStyle;
})
document.getElementById('green').addEventListener('change', function(element){
    green = element.target.value;
    console.log(red, blue, green);
    ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    color_sec.style.backgroundColor = ctx.strokeStyle;
})
document.getElementById('blue').addEventListener('change', function(element){
    blue = element.target.value;
    console.log(red, green, blue);
    ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
    color_sec.style.backgroundColor = ctx.strokeStyle;
})

document.getElementById('fontface').addEventListener('change', function(event){
    font_look = event.target.value;
    console.log(font_look);
    ctx.font = 'bold ' + font_size + ' ' + font_look;
    console.log(ctx.font);
})
document.getElementById('fontsize').addEventListener('change', function(event){
    font_size = event.target.value;
    console.log(font_size);
    ctx.font = 'bold ' + font_size + ' ' + font_look;
    console.log(ctx.font);
})
