// Code goes here
console.log("Script is running.");


function doSomethingIfFound(url, status){
  console.log(url + " was found, status" + status);
}
function doSomethingIfNotFound(url, status){
  console.log(url + " was not found, status" + status);
}
function test(url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      doSomethingIfFound(url, xhttp.status);
    } else if ( xhttp.readyState == 4 && xhttp.status != 200 ){
      doSomethingIfNotFound(url, xhttp.status);
    }
  };



  xhttp.open("GET", url, true);
  xhttp.send();
}

test("http://www.google.com/");
test("http://library.alaska.gov");
test("http://mydomain.notme");
