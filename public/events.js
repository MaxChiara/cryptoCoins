document.getElementById("cap").addEventListener("mouseenter", hoverCap);
document.getElementById("cap").addEventListener("mousemove", mouseTrack);
document.getElementById("cap").addEventListener("mouseleave", hoverCapLeave);

function hoverCap(){
	document.getElementById("hoverCap").style.display = "block"
}

function hoverCapLeave(){
	document.getElementById("hoverCap").style.display = "none"
}

function mouseTrack(event) {
    document.getElementById("hoverCap").style.left = event.clientX + "px";
   document.getElementById("hoverCap").style.top = event.clientY -200 + "px";
}