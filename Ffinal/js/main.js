class BlockMap{
    constructor(row,column){
        this.Map = Array.from(Array(row), ()=> Array(column).fill(0));
        this.div_app = document.getElementById("app");
    }
    addblock(x,y,block){
        block.setactive(true);
        block.setcoord(x,y);
        this.Map[x][y] = block;
        this.div_app.appendChild(block.Element);
        console.log(block.XPos,block.YPos);
    }
    removeblock(x,y){
        block.setactive(false);
        this.Map[x][y] = null;
    } 

}

class Block{
    constructor(value){
        this.Value = value;
        this.Active = false;
        this.XPos = 20;
        this.YPos = 20;
        this.Element = document.createElement("div");
        this.Element.setAttribute("class","blockPrefab");
        this.Element.append(this.Value);
    }
    changevalue(value){
        this.Value = value;
    }
    setactive(isActivated){
        this.Element.style.display = "block";
        this.Active = isActivated;        
    }
    setcoord(x,y){
        this.XPos += 150*x;
        this.YPos += 150*y;
    }
    removeblock(){
        this.Element.style.display = "none"
        this.Active = false;
        this.XPos = 20;
        this.YPos = 20;
    }
}

window.onkeydown = keylog;
var blockmap = new BlockMap(4,4);

function keyArrowRight(){
    console.log("Right Pressed.");
    let blocks = document.getElementsByClassName("blockPrefab");
    for (let i = 0; i < blocks.length; i++){
        console.log(blocks[i].style.left);
        blocks[i].style.left += 170;                           
    }
}

function keyArrowLeft(){
    console.log("Left Pressed.");
    let blocks = document.getElementsByClassName("blockPrefab");
    for (let i = 0; i < blocks.length; i++){
        blocks[i].style.left -= 170;        
    }
}
function keyArrowUp(){
    console.log("Up Pressed.");
    let blocks = document.getElementsByClassName("blockPrefab");
    for (let i = 0; i < blocks.length; i++){
        blocks[i].style.top -= 170;        
    }
}
function keyArrowDown(){
    console.log("Down Pressed.");
    let blocks = document.getElementsByClassName("blockPrefab");
    for (let i = 0; i < blocks.length; i++){
        blocks[i].style.top += 170;        
    }
}

function KeyEnter(){
    blockmap.addblock(1,1, new Block(2));
}

function keylog(e){
    console.log(e.key);
    switch(e.key){
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
        default:            
            break;
    }
}