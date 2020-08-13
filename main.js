var numPlayers = 4;
var players = definePlayers();
var uno = defineUno();
var hands = {};
var table = {};
var playersTurn = "player1";

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
        output += "<p class=\"" + player + "\">Player " + (j+1) + "'s Cards: ";
        for (let i = 0; i < 7; i++) {
            let card = "card" + (i+1);
            hands[player][card]={"color": randomColor(), 
                                 "number": randomNumber(),
                                 "disabled": ""};
            output += "<button class=\"" + hands[player][card]["color"] + 
                        "\"" + hands[player][card]["disabled"] + 
                        " onClick=\"play('"+ player + "', '" + card + "');\"" +  
                        ">" + hands[player][card]["number"] + "</button>\n";
        }
        output += "<button class='uno' onclick = 'displayUno();'>UNO</button></p><p id='displayUno'></p>";
    }
    
    document.getElementById("players").innerHTML = output;
}

function displayCards(){
    let output = "";
    let playerNum = 1;
    for(player in hands){
        output += "<p class=\"" + player + "\">Player " + (playerNum) + "'s Cards: ";
        for(card in hands[player]){
            output += "<button class=\"playable " + hands[player][card]["color"] + 
                        "\"" + hands[player][card]["disabled"] + 
                        " onClick=\"play('"+ player + "', " + playerNum + ", '" + card + "');\"" + 
                        ">" + hands[player][card]["number"] + "</button>\n";
        }
        let disabled = "disabled";
        if(almostUno(playerNum) && ("player" + playerNum) === playersTurn){
            disabled = "";
        }
        output += "<button class='uno' id='uno' onclick='isUno(" + playerNum + ");' " + disabled + ">UNO</button></p><p id='displayUno'></p>";
        playerNum++;
    }
    
    document.getElementById("players").innerHTML = output;
    document.getElementById("tableCard").innerHTML = "Table: <button class=\"tableCard " + 
                                                 table["color"] + 
                                                 " tableCard \" disabled>" + 
                                                 table["number"] + 
                                                 "</button>\n";
}

function originalTable(){
    table["color"] = randomColor();
    table["number"] = randomNumber();
    document.getElementById("tableCard").innerHTML = "Table: <button class=\"" + 
                                                 table["color"] + 
                                                 " tableCard \">" + 
                                                 table["number"] + 
                                                 "</button>\n";
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
        }
        nextTurn();
        displayCards();
    }
    else{
        alert("Can't play card");
    }
}

function nextTurn(){
    for(let i = 0; i < players.length; i++){
        if(playersTurn == players[i]){
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

function almostUno(playerNum){
    if(Object.keys(hands["player"+(playerNum)]).length === 1){
        return true;
    }
    return false;
}

function isUno(playerNum){
    if(Object.keys(hands["player"+(playerNum)]).length === 1){
        return true; 
        uno[playerNum - 1] = true;
    }
    return false;
}

function callUno(){
    var timeleft = 5;
        var timer = setInterval(function(){
            if(document.getElementById('uno').clicked === true){
                clearInterval(timer);
                displayUno();
            }
            else if(timeleft <= 0 ){
                clearInterval(timer);
                alert("You didn't say Uno! +2 Cards");
                draw();
                draw();
            }
            timeleft -= 1;
        }, 500);  
}

function displayUno(){
    document.getElementById("displayUno").innerHTML = "UNO";
}

function win(playerNum){
    if(Object.keys(hands["player"+(playerNum)]).length === 0){
        return true;
    }
    return false;
}