$(function() { //begin document ready

function loadData() { //begin loadData

//Get recent
//base url
akURL="https://catalog.archives.gov/api/v1/?";

//Set rows to 10 (5 rows retr in 23 seconds, 10 rows retr in about 42 seconds, 20 rows returned in 1:30 or so.)
akURL=akURL+"rows=10&";

//Set keywords from form in search.html
var keywords = $("#keywords").val();
akURL=akURL + "q=" + keywords + "&";

//limit records mentioning the Alaska Digitization Project as an "alternate control number"
akURL=akURL + "description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\"";

//Sort items by when parent record created
//akURL=akURL + "&sort=description.recordHistory.created.dateTime desc"

//Sort items by title of record
//akURL=akURL + "&sort=description.fileUnit.title asc";

console.log(akURL);


$.getJSON(akURL, function( data ) {
response=data;
console.log(response);

//display results

for (var i=0; i < response.opaResponse.results.result.length; i++) {

//workaround needed for objects retreived without descriptions
if (response.opaResponse.results.result[i].type === "object") {
$("#recent").append("No description retrieved for this digital object.");
$("#recent").append("</br> This digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object.file["@url"] + "\" target=\"_blank\">" + response.opaResponse.results.result[i].objects.object.file["@url"] + "</a></br>" );
$("#recent").append("<img src = \"" + response.opaResponse.results.result[i].objects.object.thumbnail["@url"] + "\">");
$("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].parentDescriptionNaId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].parentDescriptionNaId + "</a>");
$("#recent").append("</br>Parent Description NaID = " + response.opaResponse.results.result[i].parentDescriptionNaId + "<p style=\"border-bottom-style: solid\"> ");
} else {

$("#recent").append("Record Cataloged: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);
$("#recent").append("</br> Year Records Start: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
$("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
$("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);
$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);

//workaround needed for items without digital objects - need to refine selection
if (response.opaResponse.results.result[i].objects.object.length > 0) {
$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object[i].file["@url"] + "\" target=\"_blank\">" + response.opaResponse.results.result[i].objects.object[i].file["@url"] + "</a> </br>" );
$("#recent").append("<img src = \"" + response.opaResponse.results.result[i].objects.object[i].thumbnail["@url"] + "\">");
} //end workaround for non objects/

$("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
$("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");
} // end workaround for non-description

} // end display loop

}); //End getJSON

return false;

}; //end function load data

$('#form-container').submit(loadData);

}); //end document ready
