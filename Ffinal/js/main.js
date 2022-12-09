class BlockMap{
    constructor(row,column){
        this.Map = Array.from(Array(row), ()=> Array(column).fill(null));
        this.div_app = document.getElementById("app");
        this.blockOnBoard = new Array();
        this.score = 0;
        this.gameState = 0; //0: 게임 준비,  1: 플레이 중,  2: 플레이 중 애니메이션 
    }
    addblock(x,y,block){
        block.setactive(true);
        block.setcoord(x,y);
        this.Map[y][x] = block;
        this.div_app.appendChild(block.Element);
    }
    removeblock(x,y){
        blockPool.push(this.Map[x][y]);
        this.Map[x][y] = null;
    }

    compute(direction){//     0: up,  1: right,  2:  down,  3:  left
        switch(direction){
            case 0: this.move(); break; //up
            case 1: this.rotate(3); this.move(); this.rotate(1); break; //right
            case 2: this.rotate(2); this.move(); this.rotate(2); break; //down
            case 3: this.rotate(1); this.move(); this.rotate(3); break; //left
        }

        //this.animate();
    }

    animate(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.Map[i][j] == null) continue;
                this.Map[i][j].setcoord(j,i);
            }
        }

    }

    rotate(n){
        while (n--) {
            var tempBoard = Array.from(Array(4), ()=> Array(4).fill(null));
            for (var i = 0; i < 4; i++)
                for (var j = 0; j < 4; j++)
                    tempBoard[i][j] = this.Map[i][j];
            for (var i = 0; i < 4; i++)
                for (var j = 0; j < 4; j++)
                    this.Map[j][3 - i] = tempBoard[i][j];

        }
    }

    move(){
        var isMoved = false;
        var isPlused = Array(Array(0, 0, 0, 0), Array(0, 0, 0, 0), Array(0, 0, 0, 0), Array(0, 0, 0, 0));
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.Map[i][j] == null) continue;
                var tempY = i - 1;
                while (tempY > 0 && this.Map[tempY][j] == null) tempY--;
                if (this.Map[tempY][j] == null) {
                    this.Map[tempY][j] = this.Map[i][j];
                    this.Map[i][j] = null;
                    isMoved = true;
                }
                else if (this.Map[tempY][j].Value != this.Map[i][j].Value) {
                    if (tempY + 1 == i) continue;
                    this.Map[tempY + 1][j] = this.Map[i][j];
                    this.Map[i][j] = null;
                    isMoved = true;
                }
                else {
                    if (isPlused[tempY][j] == 0) {
                        this.Map[tempY][j].changevalue(this.Map[tempY][j].Value * 2);
                        this.Map[i][j].removeblock(blockPool);
                        this.Map[i][j] = null;      //삭제 구현
                        isPlused[tempY][j] = 1;
                        isMoved = true;
                    }
                    else {
                        this.Map[tempY + 1][j] = this.Map[i][j];
                        this.Map[i][j] = null;
                        isMoved = true;
                    }
                }
            }
        }
        if (isMoved){
            this.score = this.score+1;
            document.getElementById("score").innerHTML = "Score: "+this.score.toString();
            this.generate();
            this.checkGameOver();
        }
    }

    generate(){
        var zeroNum = 0;
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if (this.Map[i][j] == null)
                    zeroNum++;
        while (true) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (this.Map[i][j] == null) {
                        var rand = parseInt(Math.random() * zeroNum);
                        if (rand == 0) {
                            this.addblock(j, i, blockPool.pop());       //blockPool의 box를 pop하여 메모리 최적화
                            return;
                        }
                    }
                }
            }
        }
    }

    checkGameOver() {
        for (var i = 0; i < 4; i++) {
            var colCheck = this.Map[i][0];
            if (colCheck == null) return;
            var colCheckV = this.Map[i][0].Value;
            for (var j = 1; j < 4; j++) {
                if(this.Map[i][j] == null) return;
                if (this.Map[i][j].Value == colCheckV) return;
                else{
                    colCheck = this.Map[i][j];
                    colCheckV = this.Map[i][j].Value;
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            var rowCheck = this.Map[0][i];
            if (rowCheck == null) return;
            var rowCheckV = this.Map[0][i].Value;
            for (var j = 1; j < 4; j++) {
                if(this.Map[j][i] == null) return;
                if (this.Map[j][i].Value == rowCheckV) return;
                else {
                    rowCheck = this.Map[j][i];
                    rowCheckV = this.Map[j][i].Value;
                }
            }
        }
        this.gameover();
    }

    gameover(){
        this.gameState = 0;
        document.getElementById("btn").style.display = "block";
        document.getElementById("gameover").style.display = "block";
    }

    init(){
        this.gameState = 1;
        this.score = 0;
        document.getElementById("score").innerHTML = "Score: "+this.score.toString();
        document.getElementById("btn").style.display = "none";
        document.getElementById("gameover").style.display = "none";


        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(this.Map[i][j] == null) continue;
                this.Map[i][j].removeblock(blockPool);
                this.Map[i][j] = null;
            }
        }

        var num = parseInt(Math.random() * 2);
        if(num == 1){                   //한개만 생성
            var rand = parseInt(Math.random() * 16);
            var y = parseInt(rand / 4);
            var x = rand % 4;
            var num;
            var rand = parseInt(Math.random() * 2);
            if (rand == 0) num = 4;
            else num = 2;

            if (blockmap.Map[y][x] == null){
                blockmap.addblock(x,y,blockPool.pop());
                blockmap.Map[y][x].changevalue(num);
            }
        }
        else if(num == 0)
        {                                   //두개 생성
            for (var i = 0; i < 2; i++) {
                var rand = parseInt(Math.random() * 16);
                var y = parseInt(rand / 4);
                var x = rand % 4;
                if (blockmap.Map[y][x] == null){
                    blockmap.addblock(x,y,blockPool.pop());
                    blockmap.Map[y][x].changevalue((i+1)*2);
                }
                else i--;
            }
        }
    }


}

class Block{
    constructor(value){
        this.Value = value;
        this.Active = false;
        this.XPos = 0;
        this.YPos = 0;
        this.dx = 0;
        this.dy = 0;
        this.aniState = 0;
        this.Element = document.createElement("div");
        this.Element.setAttribute("class","blockPrefab");
        this.Element.innerText = this.Value;
        this.Element.setAttribute("id","color2");
    }
    changevalue(value){
        this.Value = value;
        this.Element.innerText = this.Value;
        switch(this.Value){
            case 2: this.Element.setAttribute("id","color2"); break;
            case 4: this.Element.setAttribute("id","color4"); break;
            case 8: this.Element.setAttribute("id","color8"); break;
            case 16: this.Element.setAttribute("id","color16"); break;
            case 32: this.Element.setAttribute("id","color32"); break;
            case 64: this.Element.setAttribute("id","color64"); break;
            case 128: this.Element.setAttribute("id","color128"); break;
            case 256: this.Element.setAttribute("id","color256"); break;
            case 512: this.Element.setAttribute("id","color512"); break;
            case 1024: this.Element.setAttribute("id","color1024"); break;
        }
    }
    setactive(isActivated){
        this.Element.style.display = "block";
        this.Active = isActivated;      
    }
    setcoord(x,y){
        this.XPos =x;
        this.Element.style.left = this.XPos*202+18;
        this.YPos =y;
        this.Element.style.top = this.YPos*202+17;
    }
    setcoordWthAni(x,y){
        this.XPos =x;
        this.YPos =y;
        let desX = this.XPos*202+18;
        let desY = this.YPos*202+17;
        let acX = 0;
        let acY = 0;

        if(desX == parseInt(this.Element.style.left,10)) acX = 0;
        else if(desX > parseInt(this.Element.style.left,10)) acX = 1;
        else acX= -1;

        if(desY == parseInt(this.Element.style.top,10)) acY = 0;
        else if(desY > parseInt(this.Element.style.top,10)) acY = -1;
        else acY = 1;

        this.Element.style.left = parseInt(this.Element.style.top,10) + acX;
        this.Element.style.top = this.YPos*202+17;

        console.log(this.Element.style.left);
        console.log(this.Element.style.top);

        //this.Element.style.left = this.XPos*202+18;
        //this.Element.style.top = this.YPos*202+17;
    }

    removeblock(pool){
        this.Element.style.display = "none"
        this.Active = false;
        this.XPos = 20;
        this.YPos = 20;
        this.changevalue(2);
        pool.push(this);
    }
}

window.onkeydown = keylog;
var blockmap = new BlockMap(4,4);
var blockPool = new Array();
for(var i = 0; i < 16; i++){
    blockPool.push(new Block(2));
}

var commandQueue = new Array();
setInterval(update,1000/60);
function update(){
    if(commandQueue.length > 0 && blockmap.gameState == 1){
        switch(commandQueue.pop()){
            case 'Enter':
                KeyEnter();
                break;
            case 'ArrowRight':
                keyArrowRight();
                break;
            case 'ArrowLeft':
                keyArrowLeft();
                break;
            case 'ArrowUp':
                keyArrowUp();
                break;
            case 'ArrowDown':
                keyArrowDown();
                break;
        }
    }

    blockmap.animate();
    for(var i = 0; i < 4; i++){
        for(var j = 0; j <4; j++){
            if(blockmap.Map[i][j] == null) continue;
            if(blockmap.Map[i][j].aniState != 0) blockmap.gameState = 2;
        }
    }
}

function keyArrowRight(){
    //console.log("Right Pressed.");
    blockmap.compute(1);    
}

function keyArrowLeft(){
    //console.log("Left Pressed.");
    blockmap.compute(3);
}

function keyArrowUp(){
    //console.log("Up Pressed.");
    blockmap.compute(0);
}

function keyArrowDown(){
    //console.log("Down Pressed.");
    blockmap.compute(2);
}

function KeyEnter(){
    blockmap.compute(0);
    blockmap.compute(1); 
    blockmap.compute(2);
    blockmap.compute(3);
}

function start(){
    blockmap.init();
}

function keylog(e){
    commandQueue.push(e.key);            
}