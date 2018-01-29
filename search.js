$(function() { //begin document ready

function loadData() { //begin loadData

var $recentLinks = $("#recent");

$recentLinks.text("");  //Clears any previous search results


//Get recent
//base url
akURL="https://catalog.archives.gov/api/v1/?";

//Set rows to 10 (5 rows retr in 23 seconds, 10 rows retr in about 42 seconds, 20 rows returned in 1:30 or so.)
akURL=akURL+"rows=10&";

//Set keywords from form in search.html
var keywords = $("#keywords").val();
akURL=akURL + "q=" + keywords;

//limit records mentioning the Alaska Digitization Project as an "alternate control number"
akURL=akURL + "&description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\"";

//limit records to items with descriptions
akURL=akURL + "&resultTypes=fileUnit";

//Sort items by when parent record created
//akURL=akURL + "&sort=description.recordHistory.created.dateTime desc"

//Sort items by title of record
//akURL=akURL + "&sort=description.fileUnit.title asc";

console.log(akURL);
$recentLinks.text("Working on getting ten items from the NARA Alaska Digitization Project on " + keywords + ".");

//Let user know if search fails
var naraRequestTimeout = setTimeout(function(){
$recentLinks.text("Search failed. Unable to get search results in reasonable time.");
}, 60000);


$.getJSON(akURL, function( data ) {
response=data;
console.log(response);
$recentLinks.text("Ten items from the NARA Alaska Digitization Project on " + keywords + ".");
$("#recent").append("</br></br>");

//display results
for (var i=0; i < response.opaResponse.results.result.length; i++) {

$("#recent").append("Record Cataloged: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);
$("#recent").append("</br> Year Records Start: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
$("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
$("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);
//The line below fails when there is more than one creating organization. Would need to be able to test for a deal with an array before displaying.
//$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);

$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object[0].file["@url"] + "\" target=\"_blank\">" + response.opaResponse.results.result[i].objects.object[i].file["@url"] + "</a> </br>" );
$("#recent").append("<img src = \"" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@url"] + "\">");
$("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
$("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");

} // end display loop
clearTimeout(naraRequestTimeout);

}); //End getJSON

return false;

}; //end function load data

$('#form-container').submit(loadData);


}); //end document ready
