
setup();
document.getElementById("counter").innerHTML = ` ${configuration.counter}`;
let inputs = document.getElementsByTagName('input');


const rotateCallback = e=>{
  //manipulates dom and global variables
  e.preventDefault();
  let moveForm = document.getElementById("rotate");
  let color = moveForm.getElementsByTagName('select')[0].value;
  let num = parseInt(moveForm.getElementsByTagName('select')[1].value,10);
  let rotate = parseInt(moveForm.getElementsByTagName('select')[2].value, 10);
  configuration.counter ++;
  configuration.robots = rotateRobots(color, num, rotate);
  setBlanks();
  loadRobots();
  document.getElementById("counter").innerHTML = ` ${configuration.counter}`;
}

const moveCallback = e=>{
  //manipulates dom and global variables
  e.preventDefault();
  let moveForm = document.getElementById("move");
  let color = moveForm.getElementsByTagName('select')[0].value;
  let num = parseInt(moveForm.getElementsByTagName('select')[1].value,10);
  let squares = parseInt(moveForm.getElementsByTagName('select')[2].value,10);
  configuration.robots = moveRobots(color, num, squares);
  configuration.counter ++;
  setBlanks();
  loadRobots();
  configuration.squares = loadSquares();
  document.getElementById("counter").innerHTML = ` ${configuration.counter}`;

}

document.getElementById("move").addEventListener("submit", e=>{moveCallback(e)});
document.getElementById("rotate").addEventListener("submit", e=>{rotateCallback(e)});

const restart = ()=>{
  //manipulates dom and global variables
  configuration.robots = JSON.parse(JSON.stringify(startConf.robots));
  configuration.squares = [];
  for(let i=0;i<configuration.dimensions.height;i++)
    {
      let row = [];
      for(let j=0;j<configuration.dimensions.width;j++)
      {
        row.push(0);
      }
      configuration.squares.push(row);
    }
  configuration.counter = 0;
  document.getElementById("counter").innerHTML = ` ${configuration.counter}`;
  setBlanks();
  loadRobots();
  displayScore();
}

const newGoal = ()=>{
  //manipulates dom and global variables
  configuration.goal = makeGoalConf();
  setGoalBlanks();
  loadGoalbots();
  displayScore();
}

const displayScore = ()=>{
  //manipulates dom
  document.getElementById("score").innerHTML = `${getScore()}`;
}
