
const setup = ()=>{
  //manipulates the dom and global variables

  let oldConfig = getCookie("config");
  if (oldConfig)
  {
    configuration = JSON.parse(oldConfig);
  }
  else
  {
    configuration = JSON.parse(JSON.stringify(startConf));
    configuration.goal = makeGoalConf();

  }

  setBlanks();
  loadRobots();
  configuration.squares = loadSquares();

  setGoalBlanks();
  loadGoalbots();

  document.getElementById("score").innerHTML = `${getScore()}`;
}

const setBlanks = ()=>{
  //Sets up the blank spaces on the board
  //manipulates dom only
  let board = document.getElementById("board");
  let rows = board.getElementsByClassName("row");
  [].forEach.call(rows, row=>{
    let cols = row.getElementsByClassName("column");


    [].forEach.call(cols, col=>{
      let content = document.createElement('img');
      content.style.width='100%';
      content.src = "images/blank.jpg";

      while (col.hasChildNodes()) {
          col.removeChild(col.lastChild);
      }
      col.appendChild(content);
    });
  });
}


const addRobot = (color, num, direction, rownum, colnum)=>{
  //the direction is some number of degrees clockwise from the starting direction, which is facing right
  //This method manipulates the dom only
  let board = document.getElementById("board");
  let row =board.getElementsByClassName("row")[rownum];
  let col = row.getElementsByClassName("column")[colnum];
  let robot = document.createElement('img');
  robot.style.width="100%";
  robot.src = "images/" + color +`${direction}.jpg`;

  while (col.hasChildNodes()) {
      col.removeChild(col.lastChild);
  }
  col.appendChild(robot);

  let info = document.createElement('h1');
  let numtext = document.createTextNode(`${num}`);
  info.appendChild(numtext);
  col.appendChild(info);
}

const loadRobots = ()=>{
  //this method manipulates the dom and cookies
  for (let key in configuration.robots)
  {
    let robot = configuration.robots[key];
    addRobot(robot.color,robot.number,robot.direction,robot.row,robot.column);
    //configuration.squares[robot.row][robot.column] = 1;
  }

  let save = JSON.stringify(configuration)
  setCookie("config",save);
}

const loadSquares = ()=>{
  //no side effects
  let newSquares = [];
  for(let i=0;i<configuration.dimensions.height;i++)
    {
      let row = [];
      for(let j=0;j<configuration.dimensions.width;j++)
      {
        row.push(0);
      }
      newSquares.push(row);
    }
  for (let key in configuration.robots)
  {
    let robot = configuration.robots[key];
    newSquares[robot.row][robot.column] = 1;
  }
  return newSquares
}

const rotateRobots = (color, num, degrees)=>{
  //no side effects
  let newRobots = JSON.parse(JSON.stringify(configuration.robots));
  for (let key in newRobots)
  {
    let robot = configuration.robots[key];
    if ((newRobots[key].color === color)||newRobots[key].number===num)
    {
      newRobots[key].direction=(newRobots[key].direction+degrees)%360;
    }
  }
  return newRobots;

};

const findSquareToMove = (currentrow, currentcol, direction, distance, localSquares)=>{
  //no side effects
  let rowstep;
  let colstep;
  switch(direction%360)
  {
    case 0:
      rowstep=0;
      colstep=1;
      break;
    case 90:
      rowstep=1;
      colstep=0;
      break;
    case 180:
      rowstep=0;
      colstep=-1;
      break;
    case 270:
      rowstep=-1;
      colstep=0;
  }
  do
  {
    currentcol += colstep;
    currentrow += rowstep;
    if ((currentcol<0)||(currentcol>=configuration.dimensions.width)||(currentrow<0)||(currentrow>=configuration.dimensions.height))
    {
      break;
    }
    distance--;
  }while ((localSquares[currentrow][currentcol]===0)&&(distance>0));
  return [currentrow-rowstep, currentcol-colstep];
}

const moveRobots = (color, num, distance)=>{
  //so side effects
  let newSquares = JSON.parse(JSON.stringify(configuration.squares));
  let newRobots = JSON.parse(JSON.stringify(configuration.robots));
  for (let key in newRobots)
  {
    if ((newRobots[key].color !== color)&&(newRobots[key].number!==num))
    {
      continue;
    }
    let locationPair = findSquareToMove(newRobots[key].row, newRobots[key].column,newRobots[key].direction, distance+1, newSquares);
    newSquares[newRobots[key].row][newRobots[key].column]=0;
    newRobots[key].row = locationPair[0];
    newRobots[key].column = locationPair[1];
    newSquares[newRobots[key].row][newRobots[key].column]=1;
  }

  return newRobots;
}

const setCookie = (cname, cvalue, exdays)=> {
  //manipulates cookies
  //taken from w3schools
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";path=/";
}

const getCookie= (cname)=> {
  //no side effects
  //taken from w3schools
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
