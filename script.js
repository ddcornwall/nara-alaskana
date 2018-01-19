$(function() { //begin document ready

//Get recent
akURL="https://catalog.archives.gov/api/v1/?" //base akURL
//akURL=akURL + "q=alaska digitization project"
akURL=akURL + "description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\""
akURL=akURL + "&sort=description.recordHistory.created.dateTime desc"
console.log(akURL);


$.getJSON(akURL, function( data ) {
response=data;

//display results

for (var i=0; i < response.opaResponse.results.result.length; i++) {
$("#recent").append("Record Created: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);
$("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);
$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);

//workaround needed for items without digital objects - need to refine selection
if (response.opaResponse.results.result[i].objects.object.length > 0) {
$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object[0].file["@url"] + "\">" + response.opaResponse.results.result[i].objects.object[0].file["@url"] + "</a>" );
$("#recent").append("<img src = \"" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@url"] + "\">");
}
//end workaround

$("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
$("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");
}

}); //End getJSON

} //end loadData
); //end document ready
