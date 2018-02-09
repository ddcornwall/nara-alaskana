$(function() { //begin document ready

function loadData() { //begin loadData

//needed for NARA thumbnail Workaround
var filePath="";

var $recentLinks = $("#recent");

$recentLinks.text("");  //Clears any previous search results


//Get recent
//base url
akURL="https://catalog.archives.gov/api/v1/?";

//Set rows to 10 (5 rows retr in 23 seconds, 10 rows retr in about 42 seconds, 20 rows returned in 1:30 or so.)
akURL=akURL+"rows=10&";

//Set keywords from form in search.html, restricted to records mentioning Alaska Digitization Project
var keywords = $("#keywords").val();
akURL=akURL + "q=" + keywords + " and \"Alaska%20Digitization%20Project\"";

//limit records to items with descriptions
akURL=akURL + "&resultTypes=item,fileUnit";

//Sort items by when parent record created
//akURL=akURL + "&sort=description.recordHistory.created.dateTime desc"

console.log(akURL);
$recentLinks.text("Working on getting ten items from the NARA Alaska Digitization Project on " + keywords + ".");

//Let user know if search fails
var naraRequestTimeout = setTimeout(function(){
$("#recent").append("</br><p>Search or display timed out. I apologize for the inconvenience.</p>");
}, 120000);


$.getJSON(akURL, function( data ) {
response=data;
console.log(response);
if (response.opaResponse.results.result.length < 10){
   $recentLinks.text("Only " + response.opaResponse.results.result.length + " items were found on "+ keywords + ".");
} else {
   $recentLinks.text("Ten items from the NARA Alaska Digitization Project on " + keywords + ".");
}

$("#recent").append("</br></br>");

//display results
for (var i=0; i < response.opaResponse.results.result.length; i++) {

//troubleshooting between types of file level descriptions
console.log(response.opaResponse.results.result[i].description)

//for item level descriptive Records
if (typeof response.opaResponse.results.result[i].description.item !== 'undefined') {
$("#recent").append("Record Cataloged: " + response.opaResponse.results.result[i].description.item.recordHistory.created.dateTime);
$("#recent").append("</br> Year Records Start: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
$("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
$("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.item.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.title);

//Workaround for items without digital objects.
if (typeof response.opaResponse.results.result[i].objects === 'undefined') {
  $("#recent").append("</br>Unable to determine number of digital objects.");
} else {
$("#recent").append("</br>This digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object.file["@url"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object.file["@path"] + "</a> </br>" );
$("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.opaResponse.results.result[i].objects.object.thumbnail["@url"] + "\">");
} //end no digital object workaround
} //end item record display.

//For FileUnit records
if (typeof response.opaResponse.results.result[i].description.fileUnit !== 'undefined') {
$("#recent").append("Record Cataloged: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);
$("#recent").append("</br> Year Records Start: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
$("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
$("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);

//Workaround for records without objects section. - this based on 1/30/18 discovery of NaID 41027079
if (typeof response.opaResponse.results.result[i].objects === 'undefined' && typeof response.opaResponse.results.result[i].description.fileUnit !== 'undefined') {
  $("#recent").append("</br> There are " + response.opaResponse.results.result[i].description.fileUnit.itemCount + " digital objects associated with this record.");
  $("#recent").append("</br> <img class=\"img-thumbnail\" src = \"Placeholder.png \">");
} else {
$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found found at <a href = \"https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "</a> </br>" );

//February 2018 NARA provided work around for thumbnails
filePath=response.opaResponse.results.result[i].objects.object[0].file["@path"].slice(4);
console.log(filePath);

$("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@path"] + "\">");
//end NARA workaround

//The line below fails when there is more than one creating organization. Would need to be able to test for a deal with an array before displaying.
//$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);
} //end else if no digital object
}

//common fields for both fileUnit and item records
$("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
$("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");
} // end display loop
clearTimeout(naraRequestTimeout);

}); //End getJSON

return false;

}; //end function load data

$('#form-container').submit(loadData);


}); //end document ready
