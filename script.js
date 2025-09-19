let gridSize=6,cellSize=35;
let startCell,goalCell,playerCell;

// Menu / Level Modal
function openLevelModal(){
  document.getElementById("levelModal").style.display="flex";
  document.getElementById("menu").classList.add("blur-bg");
}
function closeLevelModal(){
  document.getElementById("levelModal").style.display="none";
  document.getElementById("menu").classList.remove("blur-bg");
}
function backToMenu(){
  document.getElementById("game").style.display="none";
  document.getElementById("menu").style.display="flex";
}

// Dark Mode
function toggleMode(){
  document.body.classList.toggle("dark-mode");
}

// Game Start
function startGame(size){
  gridSize=size;
  cellSize=(size===6)?35:(size===9?28:22);
  document.getElementById("menu").style.display="none";
  closeLevelModal();
  document.getElementById("game").style.display="flex";
  generateValidGrid();
}

// Grid generation
function generateValidGrid(){
  let valid=false;
  while(!valid){generateGrid();valid=isPathAvailable();}
}

function generateGrid(){
  const grid=document.getElementById("grid");
  grid.innerHTML="";
  grid.style.gridTemplateColumns=`repeat(${gridSize},${cellSize}px)`;
  grid.style.gridTemplateRows=`repeat(${gridSize},${cellSize}px)`;

  let startRow=Math.floor(Math.random()*gridSize);
  let startCol=Math.floor(Math.random()*gridSize);
  let goalRow,goalCol;
  const minDistance=Math.floor(gridSize/2);

  do{
    goalRow=Math.floor(Math.random()*gridSize);
    goalCol=Math.floor(Math.random()*gridSize);
  } while(Math.abs(startRow-goalRow)+Math.abs(startCol-goalCol)<minDistance);

  for(let r=0;r<gridSize;r++){
    for(let c=0;c<gridSize;c++){
      const cell=document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row=r;
      cell.dataset.col=c;
      if(r===startRow && c===startCol){startCell=cell;playerCell=cell;cell.classList.add("start","player");}
      else if(r===goalRow && c===goalCol){goalCell=cell;cell.classList.add("goal");}
      else if(Math.random()<0.3) cell.classList.add("wall");
      grid.appendChild(cell);
    }
  }
}

// BFS for solvable
function isPathAvailable(){
  const visited=Array.from({length:gridSize},()=>Array(gridSize).fill(false));
  const queue=[];
  const sr=parseInt(startCell.dataset.row),sc=parseInt(startCell.dataset.col);
  const gr=parseInt(goalCell.dataset.row),gc=parseInt(goalCell.dataset.col);
  queue.push([sr,sc]);visited[sr][sc]=true;
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  while(queue.length>0){
    let [r,c]=queue.shift();
    if(r===gr && c===gc) return true;
    for(let [dr,dc] of dirs){
      let nr=r+dr,nc=c+dc;
      if(nr>=0 && nr<gridSize && nc>=0 && nc<gridSize && !visited[nr][nc]){
        let neighbor=document.querySelector(`.cell[data-row='${nr}'][data-col='${nc}']`);
        if(!neighbor.classList.contains("wall")){
          visited[nr][nc]=true;queue.push([nr,nc]);
        }
      }
    }
  }
  return false;
}

// Popup
function showPopup(){document.getElementById("popup").style.display="flex";}
function hidePopup(){document.getElementById("popup").style.display="none";}
function startNextPuzzle(){hidePopup();generateValidGrid();}

// Player movement and ESC key
document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape"){backToMenu(); return;}
  if(!playerCell) return;
  if(e.key==="Enter" && document.getElementById("popup").style.display==="flex"){startNextPuzzle(); return;}
  let row=parseInt(playerCell.dataset.row),col=parseInt(playerCell.dataset.col);
  let newRow=row,newCol=col;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
  if(e.key==="ArrowUp"||e.key==="w") newRow--;
  if(e.key==="ArrowDown"||e.key==="s") newRow++;
  if(e.key==="ArrowLeft"||e.key==="a") newCol--;
  if(e.key==="ArrowRight"||e.key==="d") newCol++;
  if(newRow>=0 && newRow<gridSize && newCol>=0 && newCol<gridSize){
    let nextCell=document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
    if(!nextCell.classList.contains("wall")){
      playerCell.classList.remove("player");
      playerCell=nextCell;
      playerCell.classList.add("player");
      if(playerCell===goalCell) setTimeout(showPopup,50);
    }
  }
});
// --- Controls Setup ---
function movePlayer(dir) {
  if (!playerCell) return;
  let row = parseInt(playerCell.dataset.row), col = parseInt(playerCell.dataset.col);
  let newRow = row, newCol = col;

  if (dir === "up") newRow--;
  if (dir === "down") newRow++;
  if (dir === "left") newCol--;
  if (dir === "right") newCol++;

  if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
    let nextCell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
    if (!nextCell.classList.contains("wall")) {
      playerCell.classList.remove("player");
      playerCell = nextCell;
      playerCell.classList.add("player");
      if (playerCell === goalCell) setTimeout(showPopup, 50);
    }
  }
}

// Map keyboard keys to button press highlight
const keyMap = {
  "ArrowUp": "btn-up", "w": "btn-up",
  "ArrowDown": "btn-down", "s": "btn-down",
  "ArrowLeft": "btn-left", "a": "btn-left",
  "ArrowRight": "btn-right", "d": "btn-right"
};
document.addEventListener("keydown", (e) => {
  let btnId = keyMap[e.key];
  if (btnId) {
    document.getElementById(btnId).classList.add("active");
  }
});


document.addEventListener("keyup", (e) => {
  let btnId = keyMap[e.key];
  if (btnId) document.getElementById(btnId).classList.remove("active");
});

// Hook buttons for clicks/touches
document.getElementById("btn-up").addEventListener("touchstart",()=>movePlayer("up"));
document.getElementById("btn-down").addEventListener("touchstart",()=>movePlayer("down"));
document.getElementById("btn-left").addEventListener("touchstart",()=>movePlayer("left"));
document.getElementById("btn-right").addEventListener("touchstart",()=>movePlayer("right"));

document.getElementById("btn-up").addEventListener("click",()=>movePlayer("up"));
document.getElementById("btn-down").addEventListener("click",()=>movePlayer("down"));
document.getElementById("btn-left").addEventListener("click",()=>movePlayer("left"));
document.getElementById("btn-right").addEventListener("click",()=>movePlayer("right"));
