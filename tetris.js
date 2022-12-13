/** @type {HTMLCanvasElement} */
var c1 = document.getElementById("canv1");
var ctx1 = c1.getContext("2d");
var c2 = document.getElementById("canv2");
var ctx2 = c2.getContext("2d");
var highscore = document.getElementById("highscore");
var score = document.getElementById("score");
var lines = document.getElementById("lines");
var level = document.getElementById("level");
var skin = document.getElementById("skin");
var skinselect = document.getElementById("skinSelect");

var skinsize = 32;

var w = 10;
var h = 20;
var size = 40;

c1.width = w*size;
c1.height = h*size;

c2.width = 4*size;
c2.height = 3*size;

var speed = 2;
var linecount = 0;
var lvl = 1;
var sc = 0;
var hsc = 0;
var drop = false;

var stack = new Array();
var block = new Array(4);
var next = new Array(4);

createBlock();
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
var moveinterval = setInterval(moveDown, 1000/speed);
var dropcheckinterval = setInterval(checkDrop, 1000/30);
var drawinterval = setInterval(draw, 1000/60);

function createBlock()
{
    if(next[0]!=null)
    {
        for(let i=0; i<4; i++)
        {
            block[i] = next[i];
            block[i].x += 3;
        }
    }

    r = Math.floor(Math.random() * 7);

    switch(r)
    {
        case 0: //O
            next[0] = {x:0, y:0, c:0};
            next[1] = {x:1, y:0, c:0};
            next[2] = {x:0, y:1, c:0};
            next[3] = {x:1, y:1, c:0};
            break;
        case 1: //Z
            next[0] = {x:0, y:0, c:1};
            next[1] = {x:1, y:0, c:1};
            next[2] = {x:1, y:1, c:1};
            next[3] = {x:2, y:1, c:1};
            break;
        case 2: //S
            next[0] = {x:0, y:1, c:2};
            next[1] = {x:1, y:1, c:2};
            next[2] = {x:1, y:0, c:2};
            next[3] = {x:2, y:0, c:2};
            break;
        case 3: //T
            next[0] = {x:0, y:0, c:3};
            next[1] = {x:1, y:0, c:3};
            next[2] = {x:2, y:0, c:3};
            next[3] = {x:1, y:1, c:3};
            break;
        case 4: //L
            next[0] = {x:0, y:0, c:4};
            next[1] = {x:1, y:0, c:4};
            next[2] = {x:2, y:0, c:4};
            next[3] = {x:0, y:1, c:4};
            break;
        case 5: //I
            next[0] = {x:0, y:0, c:5};
            next[1] = {x:1, y:0, c:5};
            next[2] = {x:2, y:0, c:5};
            next[3] = {x:2, y:1, c:5};
            break;
        case 6: //J
            next[0] = {x:0, y:0, c:6};
            next[1] = {x:1, y:0, c:6};
            next[2] = {x:2, y:0, c:6};
            next[3] = {x:3, y:0, c:6};
            break;
    }

    if(block[0]==null) createBlock();
}

function checkCollision(action)
{
    for(let i=0; i<4; i++) //Bounds
    {
        if(block[i].y==h || block[i].x==w || block[i].x==-1)
        {
            action();
            return;
        }
    }

    for(let i=0; i<4; i++) //Stack
    {
        for(let j=0; j<stack.length; j++)
        {
            if(block[i].x==stack[j].x && block[i].y==stack[j].y)
            {
                action();
                return;
            }
        }
    }
}

function checkLine()
{
    multiplier = 0;

    for(let y=0; y<h; y++)
    {
        count = 0;
        tab = new Array();
        for(let i=0; i<stack.length; i++)
        {
            if(stack[i].y==y)
            {
                tab.push(i);
                count++;
            }
        }
        if(count==w)
        {
            tab.sort(function (a, b) {  return b - a;  });
            for(let i=0; i<tab.length; i++)
            {
                stack.splice(tab[i],1);
            }
            for(let i=0; i<stack.length; i++)
            {
                if(stack[i].y<y) stack[i].y++;
            }
            multiplier++;
            linecount++;
        }
    }

    switch(multiplier)
    {
        case 1:
            sc+=40;
            break;
        case 2:
            sc+=100;
            break;
        case 3:
            sc+=300;
            break;
        case 4:
            sc+=1200;
            break;
    }

    changeStats();
}

function checkGameOver()
{
    for(let i=0; i<stack.length; i++)
    {
        if(stack[i].y<=1)
        {
            stack = new Array();

            speed = 2;
            clearInterval(moveinterval);
            moveinterval = setInterval(moveDown, 1000/speed)

            sc = 0;
            linecount = 0;
            lvl = 1;

            score.innerHTML = sc;
            lines.innerHTML = linecount;
            level.innerHTML = lvl;

            return;
        }
    }
}

function changeStats()
{
    if(sc>hsc) hsc = sc;

    lvl = parseInt(linecount/10)+1;
    
    speed = lvl+1;

    clearInterval(moveinterval);
    moveinterval = setInterval(moveDown, 1000/speed)

    highscore.innerHTML = hsc;
    score.innerHTML = sc;
    lines.innerHTML = linecount;
    level.innerHTML = lvl;
}

function moveDown()
{
    for(let i=0; i<4; i++)
    {
        block[i].y++;
    }

    checkCollision(function(){
        for(let i=0; i<4; i++)
        {
            block[i].y--;
            stack.push(block[i]);
        }
        checkLine();
        checkGameOver();
        createBlock();
    });
}

function moveLeft()
{
    for(let i=0; i<4; i++)
    {
        block[i].x--;
    }

    checkCollision(function(){
        for(let i=0; i<4; i++)
        {
            block[i].x++;
        }
    });
}

function moveRight()
{
    for(let i=0; i<4; i++)
    {
        block[i].x++;
    }

    checkCollision(function(){
        for(let i=0; i<4; i++)
        {
            block[i].x--;
        }
    });
}

function rotate()
{
    origin = block[1];
    for(let i=0; i<4; i++)
    {
        tmpx = block[i].x - origin.x;
        tmpy = block[i].y - origin.y;
        block[i].x = -tmpy + origin.x;
        block[i].y = tmpx + origin.y;
    }

    checkCollision(function(){
        origin = block[1];
        for(let i=0; i<4; i++)
        {
            tmpx = block[i].x - origin.x;
            tmpy = block[i].y - origin.y;
            block[i].x = tmpy + origin.x;
            block[i].y = -tmpx + origin.y;
        }
    });
}

function keyDown(e)
{
    switch(e.keyCode)
    {
        case 37:
            moveLeft();
            break;
        case 38:
            rotate();
            break;
        case 39:
            moveRight();
            break;
        case 40:
            drop = true;
            break;
    }
}

function keyUp()
{
    drop = false;
}

function checkDrop()
{
    if(drop) moveDown();
}

function draw()
{
    ctx1.clearRect(0,0,w*size,h*size);

    for(let i=0; i<4; i++)
    {
        ctx1.drawImage(skin, block[i].c*skinsize, 0, skinsize, skinsize, block[i].x*size, block[i].y*size, size, size);
    }

    for(let i=0; i<stack.length; i++)
    {
        ctx1.drawImage(skin, stack[i].c*skinsize, 0, skinsize, skinsize, stack[i].x*size, stack[i].y*size, size, size);
    }

    ctx2.clearRect(0,0,4*size,4*size);
    for(let i=0; i<4; i++)
    {
        ctx2.drawImage(skin, next[i].c*skinsize, 0, skinsize, skinsize, next[i].x*size, next[i].y*size, size, size);
    }
}

function changeSkin()
{
    skin.src = "skins/"+skinselect.value+".png";
    skinselect.blur();
}