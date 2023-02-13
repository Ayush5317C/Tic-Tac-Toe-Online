const socket = io();

let pn1 = "Player 1",
  pn2 = "Player 2";
let name_p1 = document.querySelector("#name_p1");
let name_p2 = document.querySelector("#name_p2");
let input_p1 = document.querySelector(".input_p1");
let input_p2 = document.querySelector(".input_p2");
let c2 = document.querySelector(".c2");
let result = document.querySelector(".result");
let canvas = document.querySelector(".canvas");
let menuContainer = document.querySelector(".menuContainer");
let waitingSection = document.querySelector(".waitingSection");
let menuBtn = document.querySelector(".menu button");
let userName = document.querySelector(".askName");
let myName;
let opponentType;
let myTurn = false;
let count = 0;
let boxes = new Array();
let childs = new Array();

menuBtn.addEventListener("click", () => {
  myName = userName.value;
  if (myName == "") return;
  menuContainer.style.display = "none";
  waitingSection.style.display = "grid";
  socket.emit("letsconnect");
});
socket.on("getopponentname", (oppName) => {
  if (opponentType == "cross") {
    pn1 = myName;
    pn2 = oppName;
    myTurn = true;
  } else {
    pn1 = oppName;
    pn2 = myName;
  }
  showName();
});
socket.on("getopponenttype", (oppType) => {
  opponentType = oppType;
});
socket.on("connected2players", () => {
  socket.emit("sendname", myName);
  waitingSection.style.display = "none";
});
socket.on("opponentchoice", (boxId, cnt, turn) => {
  let box = document.getElementById(boxId);
  count = cnt;
  myTurn = turn;
  let i = document.createElement("i");
  if (opponentType == "cross") {
    i.setAttribute("class", "fa fa-times");
  } else {
    i.setAttribute("class", "fa fa-circle-o");
  }
  box.appendChild(i);
});
socket.on("result", () => {
  checkAndShowRes();
});
document.querySelectorAll(".box").forEach((box) => {
  boxes.push(box);
  let iElement;
  box.addEventListener("mouseenter", () => {
    if (!myTurn) return;
    if (!box.hasChildNodes()) {
      box.style.background = "#333333";
      iElement = document.createElement("i");
      if (opponentType == "cross") {
        iElement.setAttribute("class", "fa fa-circle-o");
      } else {
        iElement.setAttribute("class", "fa fa-times");
      }
      box.appendChild(iElement);
    }
  });
  box.addEventListener("mouseleave", () => {
    if (!iElement) return;
    iElement.remove();
    box.style.background = "white";
  });
  box.addEventListener("click", () => {
    let isBoxEmpty = box.getAttribute("isEmpty") == "true";
    if (!myTurn || !isBoxEmpty) return;
    if (isBoxEmpty) {
      let boxId = box.getAttribute("id");
      box.setAttribute("isEmpty", "false");
      myTurn = false;
      count++;
      socket.emit("choosen", boxId, count, myTurn);
      let i = document.createElement("i");
      if (opponentType == "cross") {
        i.setAttribute("class", "fa fa-circle-o");
      } else {
        i.setAttribute("class", "fa fa-times");
      }
      box.appendChild(i);
    }
    let hasResCome = checkAndShowRes();
    if (hasResCome) socket.emit("result");
  });
});
const checkAndShowRes = () => {
  childs.splice(0, 9);
  let a = 0;
  for (i = 0; i < 9; i++) {
    if (boxes[i].children[0] != null) {
      childs.push(boxes[i].children[0].classList.value);
    } else {
      childs.push(a++);
    }
  }
  let hasResCome = false;
  let rowWin = rowCheck();
  let colWin = colCheck();
  let diagWin = diagCheck();
  if (rowWin != null || colWin != null || diagWin != null || count == 9) {
    hasResCome = true;
    canvas.style.display = "flex";
  }
  if (rowWin != null) {
    if (rowWin == "fa fa-circle-o") {
      result.innerHTML = `${pn1} wins`;
      result.style.color = "#0028d8";
    } else {
      result.innerHTML = `${pn2} wins`;
      result.style.color = "#d8003c";
    }
  }
  if (colWin != null) {
    if (colWin == "fa fa-circle-o") {
      result.innerHTML = `${pn1} wins`;
      result.style.color = "#0028d8";
    } else {
      result.innerHTML = `${pn2} wins`;
      result.style.color = "#d8003c";
    }
  }
  if (diagWin != null) {
    if (diagWin == "fa fa-circle-o") {
      result.innerHTML = `${pn1} wins`;
      result.style.color = "#0028d8";
    } else {
      result.innerHTML = `${pn2} wins`;
      result.style.color = "#d8003c";
    }
  }
  if (rowWin == null && colWin == null && diagWin == null && count == 9) {
    result.innerHTML = "The Game is Draw";
    result.style.color = "green";
  }
  return hasResCome;
};
const rowCheck = () => {
  if (childs[0] == childs[1] && childs[1] == childs[2]) {
    return childs[0];
  } else if (childs[3] == childs[4] && childs[4] == childs[5]) {
    return childs[3];
  } else if (childs[6] == childs[7] && childs[7] == childs[8]) {
    return childs[6];
  }
};
const colCheck = () => {
  if (childs[0] == childs[3] && childs[3] == childs[6]) {
    return childs[0];
  } else if (childs[1] == childs[4] && childs[4] == childs[7]) {
    return childs[1];
  } else if (childs[2] == childs[5] && childs[5] == childs[8]) {
    return childs[2];
  }
};
const diagCheck = () => {
  if (childs[0] == childs[4] && childs[4] == childs[8]) {
    return childs[0];
  } else if (childs[2] == childs[4] && childs[4] == childs[6]) {
    return childs[2];
  }
};
const Restart = () => {
  canvas.style.display = "none";
  document.querySelectorAll(".box").forEach((box) => {
    if (box.children[0] != null) {
      box.children[0].remove();
    }
    box.setAttribute("isEmpty", "true");
  });
  count = 0;
};
const showName = () => {
  name_p1.innerHTML = ` : ${pn1}`;
  name_p2.innerHTML = ` : ${pn2}`;
};
