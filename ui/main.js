console.log('Loaded!');

// change the text of the maintxt div

var element = document.getElementById('maintext');
element.innerHTML = "New value";

var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight() {
  marginLeft = marginLeft + 1;
  img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function moveImage() {
  var interval = setInterval(moveRight, 50);
  // img.style.marginLeft = '100px';
}
