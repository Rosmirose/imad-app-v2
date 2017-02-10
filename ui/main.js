var button = document.getElementById('counter');
// var counter = 0;
button.onclick = function () {
 //  create a request object to the counter end point
  var request = new XMLHttpRequest();

  // capture response and store in a var
  request.onreadystatechange = function() {
    if(request.readyState === XMLHttpRequest.DONE) {
      if(request.status === 200) {
        // render the variable in correct span
        var counter = request.responseText;
        var span = document.getElementById('count');
        span.innerHTML = counter.toString();
      }
    }
  };
   
  //make the request
  
  request.open('GET','http://rosmirose.imad.hasura-app.io/counter', true);
  request.send(null);
};

//submit name

var submit = document.getElementById('submit_bn');
submit.onclick = function() {
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    if(request.readyState === XMLHttpRequest.DONE) {
      if(request.status === 200) {
        var names= request.responseText;
        names = JSON.parse(names);
        var list = '';
        for (var i=0; i<names.length; i++) {
            list += '<li>' + names[i] + '</li>';
        }
        var ul = document.getElementById('namelist');
        ul.innerHTML = list;
      }
    }
  };
   
  request.open('GET','http://rosmirose.imad.hasura-app.io/submit-name?name=' + name, true);
  request.send(null); 
};