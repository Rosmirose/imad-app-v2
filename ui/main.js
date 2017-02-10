var button = document.getElementById('counter');
var counter = 0;
button.onclick = function () {
  // create a request object to the counter end point
  var request = new XMLHttpRequest();

  //capture response and store in a var
//   request.onreadystatechange = function() {
//     if(request.readyState === XMLHttpRequest.DONE) {
//       if(request.status === 200) {
//         console.log('STATUS 200');
//         // render the variable in correct span
//         var counter = request.responseText;
//         var span = document.getElementById('count');
//         span.innerHTML = counter.toString();
//       }
//     }
//   }
   var counter = request.responseText;
        var span = document.getElementById('count');
        span.innerHTML = counter.toString();
  //make the request
  
//   request.open('GET','http://rosmirose.imad.hasura-app.io/counter', true);
//   request.send(null);
}
