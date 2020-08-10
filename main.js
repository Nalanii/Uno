var numPlayers = 4;
var players = definePlayers();
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
        output += "</p>";
    }
    
    document.getElementById("players").innerHTML = output;
}

function displayCards(){
    let output = "";
    let playerNum = 1;
    for(player in hands){
        output += "<p class=\"" + player + "\">Player " + (playerNum) + "'s Cards: ";
        for(card in hands[player]){
            output += "<button class=\"" + hands[player][card]["color"] + 
                        "\"" + hands[player][card]["disabled"] + 
                        " onClick=\"play('"+ player + "', '" + card + "');\"" + 
                        ">" + hands[player][card]["number"] + "</button>\n";
        }
        playerNum++;
        output += "</p>";
    }
    
    document.getElementById("players").innerHTML = output;
    document.getElementById("table").innerHTML = "Table: <button class=\"" + 
                                                 table["color"] + 
                                                 " table \">" + 
                                                 table["number"] + 
                                                 "</button>\n";
}

function originalTable(){
    table["color"] = randomColor();
    table["number"] = randomNumber();
    document.getElementById("table").innerHTML = "Table: <button class=\"" + 
                                                 table["color"] + 
                                                 " table \">" + 
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

function play(player, card){
    if(canPlay(player, card)){
        table["color"] = hands[player][card]["color"];
        table["number"] = hands[player][card]["number"];
        delete hands[player][card];
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