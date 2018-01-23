$(function() { //begin document ready

//Get recent
//base url
akURL="https://catalog.archives.gov/api/v1/?"

//Set rows to 5 (5 rows retr in 23 seconds, 10 rows retr in about 42 seconds, 20 rows returned in 1:30 or so.)
akURL=akURL+"rows=5&"

//pull records mentioning the Alaska Digitization Project as an "alternate control number"
akURL=akURL + "description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\""

//Sort items by when parent record created
akURL=akURL + "&sort=description.recordHistory.created.dateTime desc"

//Test search to retrieve only items with objects - 1/20/2018
//akURL="https://catalog.archives.gov/api/v1/?q=alaska&resultTypes=item,object&sort=description.recordHistory.created.dateTime%20desc"
console.log(akURL);


$.getJSON(akURL, function( data ) {
response=data;
console.log(response);

//display results
for (var i=0; i < response.opaResponse.results.result.length; i++) {
$("#recent").append("Record Created: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);
$("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);
$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);

//workaround needed for items without digital objects - need to refine selection
if (response.opaResponse.results.result[i].objects.object.length > 0) {
$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object[0].file["@url"] + "\" target=\"_blank\">" + response.opaResponse.results.result[i].objects.object[0].file["@url"] + "</a>" );
$("#recent").append("<img src = \"" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@url"] + "\">");
}
//end workaround

$("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
$("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");
} // end display loop

}); //End getJSON

}); //end document ready
