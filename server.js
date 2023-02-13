const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;
const clientPath = __dirname;
app.use(express.static(clientPath));
const queue = [];
const rooms = {};
function connectTwoPlayers(player1, player2) {
  let room = `${player1.id}#${player2.id}`;
  rooms[player1.id] = room;
  rooms[player2.id] = room;
  player1.join(room);
  player2.join(room);
  player1.emit("getopponenttype", "cross");
  player2.emit("getopponenttype", "circle");
}
io.on("connection", (socket) => {
  socket.on("letsconnect", () => {
    if (queue.length == 0) {
      queue.push(socket);
    } else {
      connectTwoPlayers(socket, queue[0]);
      io.in(rooms[socket.id]).emit("connected2players");
      queue.shift();
    }
    socket.on("sendname", (username) => {
      socket.to(rooms[socket.id]).emit("getopponentname", username);
    });
    socket.on("choosen", (boxId,count, turn)=>{
        socket.to(rooms[socket.id]).emit("opponentchoice", boxId,count,!turn);
    })
    socket.on("result",()=>{
        socket.to(rooms[socket.id]).emit("result");
    })
  });
});
server.listen(PORT);
