$(document).ready(
    function()
    {
        originalHand("player1");
        originalHand("player2");
        originalHand("player3");
        originalHand("player4");
        deck();
        turn(1);
    }
);

function randomColor(){
    let colors = ["red", "green", "blue", "yellow"];
    return colors[Math.floor(Math.random() * 4)];
}

function randomNumber(){
    let cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+2", "R", "S"];
    return cards[Math.floor(Math.random() * 13)]; 
}

function originalHand(idName){
    let output = "";
    for (let i = 0; i < 7; i++) {
        output += "<button class=\"" + randomColor() + " " + idName + "\">" 
               + randomNumber() + "</button>\n";
    }
    document.getElementById(idName).innerHTML += output;
}

function deck(){
    document.getElementById("deck").innerHTML += "<button class=\"" + 
                                                 randomColor() + "\">" + 
                                                 randomNumber() + "</button>\n";
}