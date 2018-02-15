$(document).ready(function () {
    var combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                       [0, 3, 6], [1, 4, 7], [2, 5, 8],
                       [0, 4, 8], [2, 4, 6]]; //winning combinations
    var gameField = new Array(9);
    var playerMoves = [];
    var computerMoves = [];
    var player, computer;

    var list = $(".btn"); //list of buttons

    start();

    //*********GAME LOGIC**********//

    function start() {
        $('#overlay').fadeIn(400, // dark background
            function () { //
                $('#start_form')
                    .css('display', 'block') // remove display:none from modal window
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200); // add opacity
            });
    }

    $('.btn2').click(function () {
        player = $(this).text();
        if (player == 'X') computer = 'O'
        else computer = 'X';
        var whoFirst = firstMove();
        $("#first").text("First move " + whoFirst);
        $("#first").animate({
                opacity: 0,
            }, 3000, //
            function () { // after animation
                $(this).text(""); // add display: none;
                $(this).css('opacity', '1');
            }
        );
        if (whoFirst == computer) nextMove();
        $('#start_form')
            .animate({
                    opacity: 0,
                    top: '45%'
                }, 200, //
                function () { // пoсле aнимaции
                    $(this).css('display', 'none'); // add display: none;
                    $('#overlay').fadeOut(400); //
                }
            );
    });

    //who moves first
    function firstMove() {
        if (Math.floor(Math.random() * 2) == 0) return player;
        return computer;
    }

    //player's move
    $("#field").on('click', function (e) {
        if (e.target.type == 'button') {
            if (e.target.value == '') {

                for (let i = 0; i < list.length; i++) {
                    if (e.target == list[i]) {
                        e.target.value = player;
                        gameField[i] = player;
                        playerMoves.push(i);
                        break;
                    }
                }
                if (!gameOver()) nextMove();
            }
        }
    });

    //computer's move
    function nextMove() {
        var N;
        N=findNextMove();
        list[N].value = computer;
        gameField[N] = computer;
        computerMoves.push(N);
        gameOver();
        //
        //if (gameOver()) setTimeout(refreshGame, 1000);
    }

    //check gameOver
    function gameOver() {
        if (findWinner(computerMoves)) {
            showResult("YOU LOST :(");
            return true;
        }
        if (findWinner(playerMoves)) {
            showResult("YOU WON!");
            return true;
        }

        for (let i = 0; i < gameField.length; i++) {
            if (gameField[i] == undefined) break;
            if (i == gameField.length - 1) {
                showResult("IT WAS A DRAW.");
                return true;
            }
        }
        return false;
    }

    //is there the winner?
    function findWinner(moves) {
        for (let i = 0; i < combinations.length; i++) {
            for (let j = 0; j < combinations[i].length; j++) {
                if (moves.indexOf(combinations[i][j]) == -1) break;
                if (j == combinations[i].length - 1) {
                    markWinner(i);
                    return true;
                }
            }
        }
        return false;
    }

    //mark winner row
    function markWinner(num) {
        for (let i = 0; i < combinations[num].length; i++) {
            list[combinations[num][i]].classList.add("winner");
        }
    }

    //show result
    function showResult(res) {
        $('#overlay').fadeIn(400, // dark background
            function () { //
                $("#result").text(res);
                $('#result_form')
                    .css('display', 'block') // remove display:none from modal window
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200); // add opacity
            });
    }

    $('#result_form').click(function () {
        $(this)
            .animate({
                    opacity: 0,
                    top: '45%'
                }, 200, //
                function () { // after animation
                    $(this).css('display', 'none'); // add display: none;
                }
            );
        refreshGame();
        setTimeout(start, 500);
    });

    //clean fields and start game again
    function refreshGame() {
        gameField = new Array(9);
        computer = player = '';
        playerMoves = [];
        computerMoves = [];
        $("#first").text('');
        for (let i = 0; i < list.length; i++) {
            list[i].value = '';
            list[i].classList.remove("winner");
        }
    }

//*********COMPUTER LOGIC**********//
    function findNextMove() {
        var N;
        //first move
        if (playerMoves.length == 0) {
            return Math.floor(Math.random() * 9);
        }

        var cnt = 0;
        //try to win
        for (let i = 0; i < combinations.length; i++) {
            cnt = 0;
            for (let j = 0; j < combinations[i].length; j++) {
                if (computerMoves.indexOf(combinations[i][j]) != -1) cnt++;
                if (cnt == 2) {
                    var num = emtyField(i);
                    if (num != -1) N = num;
                    break;
                }
            }
            if (N != undefined) return N;
        }
        //check player's moves
        for (let i = 0; i < combinations.length; i++) {
            cnt = 0;
            for (let j = 0; j < combinations[i].length; j++) {
                if (playerMoves.indexOf(combinations[i][j]) != -1) cnt++;
                if (cnt == 2) {
                    var num = emtyField(i);
                    if (num != -1) N = num;
                    break;
                }
            }
            if (N != undefined) return N;
        }
        //check combinations
        for (let i = 0; i < combinations.length; i++) {
            if (playerHold(i)) continue;

            if (gameField[4] == undefined) {
                return 4;
            }
            for (let j = 0; j < combinations[i].length; j++) {
              if (computerMoves.indexOf(combinations[i][j]) != -1) {
                let k = [];
                switch (j) {
                  case 0:
                    k = [1,2];
                    break;
                  case 1:
                    k = [0,2];
                    break;
                    default: k = [0,1];
                }

                if (playerMoves.length > 2) {
                  if (gameField[combinations[i][k[1]]] == undefined) {
                    let playersCells = playersCellInRow(combinations[i][k[1]]);
                    if (playersCells > 1) {
                      N = combinations[i][k[1]];
                      break;
                    }
                  }
                  if (gameField[combinations[i][k[0]]] == undefined) {
                    let playersCells = playersCellInRow(combinations[i][k[0]]);
                    if (playersCells > 1) {
                      N = combinations[i][k[0]];
                      break;
                    }
                  }
                }

                if (gameField[combinations[i][k[1]]] == undefined) {
                  let playersCells = playersCellInRow(combinations[i][k[1]]);
                  if (playersCells > 0) {
                    N = combinations[i][k[1]];
                    break;
                  }
                }
                if (gameField[combinations[i][k[0]]] == undefined) {
                  let playersCells = playersCellInRow(combinations[i][k[0]]);
                  if (playersCells > 0) {
                    N = combinations[i][k[0]];
                    break;
                  }
                }
              }
            }
            if (N != undefined) return N;
        }

        //any free cell
        for (let i = 0; i < gameField.length; i++) {
            if (gameField[i] == undefined) return i;
        }
        return N;
    }

    function playersCellInRow(N){
      let res = 0;
        for(let i=0; i<combinations.length; i++){
            if (combinations[i].indexOf(N)!=-1){
              if (computerHold(i)) continue;
              if (playerHold(i)) res++;
            }
        }
        return res;
    }

    function playerHold(num) {
        for (let i = 0; i < playerMoves.length; i++) {
            if (combinations[num].indexOf(playerMoves[i]) != -1) return true;
        }
        return false;
    }

    function computerHold(num) {
        for (let i = 0; i < computerMoves.length; i++) {
            if (combinations[num].indexOf(computerMoves[i]) != -1) return true;
        }
        return false;
    }

    function emtyField(num) {
        var res = -1;
        for (let i = 0; i < combinations[num].length; i++) {
            if (gameField[combinations[num][i]] == undefined) {
                res = combinations[num][i];
                break;
            }
        }
        return res;
    }


})
