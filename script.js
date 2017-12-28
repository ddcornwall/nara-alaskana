
//Get recent
akURL="https://catalog.archives.gov/api/v1/?" //base akURL
akURL=akURL + "q=alaska"

console.log(akURL);
$.getJSON(akURL, function( data ) {
 response=data;
 console.log(response);

//display location information
//$("#local-location").append("<p>" + conditions.name + ", located at </br>" +  "Latitude: " + conditions.coord.lat + "</br>" +
//"Longitude: " + conditions.coord.lon + "</p>");


}); //End getJSON
