module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  // true == cross | false == circle
  var mark = true;
  var crossMarked = [];
  var circleMarked = [];

  var winPatterns = [
    ["one", "two", "three"],
    ["four", "five", "six"],
    ["seven", "eight", "nine"],

    ["one", "four", "seven"],
    ["two", "five", "eight"],
    ["three", "six", "nine"],

    ["one", "five", "nine"],
    ["three", "five", "seven"]
  ]

  let containsAll = (arr, target) => target.every(v => arr.includes(v));
  
  

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'LiveTicTacToe' });
  });

  
  io.on('connection', (socket) => {
    socket.join("room1");

    // data is the id of clicked square
    socket.on('user select', (data) => {
      if(mark == true){
        crossMarked.push(data);
      }
      else{
        circleMarked.push(data);
      }
      
      io.sockets.in("room1").emit("mark data", {markStatus: mark, markId: data});

      winPatterns.forEach((winPattern) => {
        if(containsAll(crossMarked, winPattern)){
          console.log("Cross player has won");
        }
        else if(containsAll(circleMarked, winPattern)){
          console.log("Circle player has won");
        }
      });

      mark = !mark;

    });
  });
  

  // socket.io functions

  return router;
}