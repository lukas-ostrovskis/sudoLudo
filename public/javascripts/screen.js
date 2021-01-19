function alert_screen() {
 if(width.matches || height.matches){
     alert("your screen is too small, please scale it up.")
 }
}

let width = window.matchMedia("(max-width: 700px)");
let height = window.matchMedia("(max-height: 500px)");

let innerwidth = window.innerWidth;
let innerheight = window.innerHeight;

alert_screen();
width.addEventListener("change", alert_screen);
height.addEventListener("change", alert_screen);

