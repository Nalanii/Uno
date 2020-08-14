var numPlayers = parseInt(prompt("Please enter the number of players:", 4));
var players = definePlayers();
var uno = defineUno();
var hands = {};
var table = {};
var playersTurn = "player1";
var timer;
var timeout;

$(document).ready(
    function()
    {
        originalHands();
        originalTable();
        turn(playersTurn);
        displayCards();

    }
);

function definePlayers(){
    let players = [];
    for(let i = 1; i<=numPlayers; i++){
        players[i-1] = "player" + i;
    }
    return players;
}

function defineUno(){
    let uno = [];
    for(let i = 0; i<numPlayers; i++){
        uno[i] = false;
    }
    return uno;
}

function randomColor(){
    let colors = ["red", "green", "blue", "yellow"];
    return colors[Math.floor(Math.random() * 4)];
}

function randomNumber(){
    let cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+2", "R", "S"];
    return cards[Math.floor(Math.random() * 13)]; 
}

function originalHands(){
    let output = "";
    for(let j = 0; j < numPlayers; j++){
        let player = "player" + (j+1);
        hands[player] = {};
        output += "<p class='label " + player + "'>Player " + (j+1);
        for (let i = 0; i < 7; i++) {
            let card = "card" + (i+1);
            hands[player][card]={"color": randomColor(), 
                                 "number": randomNumber(),
                                 "disabled": ""};
            output += "<button class=\"" + hands[player][card]["color"] + 
                        "\"" + hands[player][card]["disabled"] + 
                        " onClick=\"play('"+ player + "', '" + card + "');\"" +  
                        ">" + hands[player][card]["number"] + "</button>";
        }
        output += "<button class='uno' onclick = 'displayUno();'>UNO</button></p>";
    }
    
    document.getElementById("players").innerHTML = output;
}

function displayCards(){
    let output = "";
    let playerNum = 1;
    for(player in hands){
        output += "<div class='container'>" +
                    "<div class='row'>" +
                        "<div class='col-sm-1'>" +
                            "<p class=\"label " + player + " player\">" +
                                "Player " + (playerNum) +
                            "</p>" +
                        "</div>" + 
                        "<div class='col-sm-6'>";
        for(card in hands[player]){
            output +=       "<button class=\"playable " + hands[player][card]["color"] + "\"" + hands[player][card]["disabled"] + " onClick=\"play('"+ player + "', " + playerNum + ", '" + card + "');\">" + 
                                "<div class='numIcon'>" +
                                    "<i class='fa fa-circle'></i>" +
                                    "<p class='num'>" + hands[player][card]["number"] + "</p>" +
                                "</div>" + 
                            "</button>";
        }
        let disabled = "disabled";
        if(uno[playerNum - 1] == true && isUno(playerNum) && ("player" + playerNum) === playersTurn && uno[playerNum-1] == true){
            uno[playerNum - 1] = false;
            disabled = "";
        }
        output +=       "</div>" +
                        "<div class='col-sm-1'>" +
                            "<button class='uno' id='uno' onclick='displayUno(" + timer + ", " + timeout + ");' " + disabled + ">UNO</button>" +
                        "</div>" + 
                    "</div>" +
                "</div>";
        playerNum++;
    }
    
    document.getElementById("players").innerHTML = output;
    document.getElementById("tableCard").innerHTML ="<button class='tableCard " + table["color"] + "' disabled>" +
                                                        "<div class='numIcon'>" +
                                                            "<i class='fa fa-circle'></i>"+ 
                                                            "<p class='num'>" + table["number"] + "<p>" +
                                                        "</div>" + 
                                                    "</button>" +
                                                    "<br /><br /><p class='label'>Table</p>";
}

function originalTable(){
    table["color"] = randomColor();
    table["number"] = randomNumber();
    document.getElementById("tableCard").innerHTML = "Table: <button class=\"" + 
                                                 table["color"] + 
                                                 " tableCard \">" + 
                                                 table["number"] + 
                                                 "</button>";
}

function turn(playerTurn){
    for (player in hands){
        for (card in hands[player]){
            hands[player][card]["disabled"] = "disabled";
        }
    }

    for (card in hands[playerTurn]){
        hands[playerTurn][card]["disabled"] = "";
    }

}

function canPlay(player, card){
    return hands[player][card]["color"] === table["color"] || 
           hands[player][card]["number"] === table["number"];
}

function play(player, playerNum, card){
    if(canPlay(player, card)){
        table["color"] = hands[player][card]["color"];
        table["number"] = hands[player][card]["number"];
        if(table["number"] === "+2"){
            draw2();
        }
        else if(table["number"] === "S"){
            nextTurn();
        }
        else if(table["number"] === "R"){
            players.reverse();
        }
        delete hands[player][card];
        if(win(playerNum)){
            if(!alert(playersTurn.toUpperCase() + " WINS!")){
                window.location.reload();
            }
        }
        else if(isUno(playerNum)){
            callUno();
            timeout = setTimeout(
                function(){ 
                    nextTurn();
                    displayCards(); 
                }, 5000);
        }
        else{
            clearUno();
            nextTurn();
            displayCards();
        }
    }
    else{
        alert("Can't play card");
    }
}

function nextTurn(){
    for(let i = 0; i < players.length; i++){
        if(playersTurn === players[i]){
            if(i+1 >= players.length){
                playersTurn = players[0];
            }
            else{
                playersTurn = players[i+1];
            }
            break;
        }
    }
    turn(playersTurn);
}

function draw(){
    let cardNum = "card" + (Math.random() * Number.MAX_VALUE);
    hands[playersTurn][cardNum] =  {
        "color": randomColor(),
        "number": randomNumber(),
        "disabled": ""
    };
    displayCards();
}

function draw2(){
    nextTurn();
    draw();
    draw();
}


function isUno(playerNum){
    if(Object.keys(hands["player"+(playerNum)]).length === 1){
        uno[playerNum - 1] = true;
        return true; 
    }
    else{
        uno[playerNum - 1] = false;
        return false;
    }
    
}

function callUno(){
    var timeleft = 5;
    timer = setInterval(function(){
        if(timeleft <= 0 ){
            clearInterval(timer);
            alert("You didn't say Uno! +2 Cards");
            draw();
            draw();
        }
        timeleft -= 1;
    }, 500); 
    displayCards();
}

function displayUno(timer, timeout){
    clearInterval(timer);
    document.getElementById("displayUno").innerHTML += playersTurn + " UNO\n";
}

function clearUno(){
    document.getElementById("displayUno").innerHTML = "";
}

function win(playerNum){
    if(Object.keys(hands["player"+(playerNum)]).length === 0){
        return true;
    }
    return false;
}