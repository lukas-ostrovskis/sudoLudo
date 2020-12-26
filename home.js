//@ts-check


var show = function(){
    document.getElementById("howTo").style.display = "block";
    document.getElementById("howToButton").style.display = "block";
    
}

var hide = function(){
    document.getElementById("howTo").style.display = "none";
    document.getElementById("howToButton").style.display = "none";
    
}

document.querySelector(".btn1").addEventListener("click", show);
document.querySelector(".hidden-btn").addEventListener("click", hide);

