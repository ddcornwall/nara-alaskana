$(function() { //begin document ready

//Get recent
akURL="https://catalog.archives.gov/api/v1/?" //base akURL
akURL=akURL + "q=alaska digitization project"
akURL=akURL + "&sort=description.recordHistory.created.dateTime desc"
console.log(akURL);


$.getJSON(akURL, function( data ) {
response=data;

//display results

for (var i=0; i < response.opaResponse.results.result.length; i++) {
$("#recent").append("<p> Record Created: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);
$("#recent").append("Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
$("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);
$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);

//workaround needed for items without digital objects - need to refine selection
if (response.opaResponse.results.result[i].objects.object.length > 0) {
$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found found at " + response.opaResponse.results.result[i].objects.object[0].file["@url"]);
$("#recent").append("<img src = \"" + response.opaResponse.results.result[i].objects.object[0].file["@url"] + "\">");
}
//end workaround

$("#recent").append("</br> Full record and additional objects available at https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId);
$("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "</p>");
}

}); //End getJSON

} //end loadData
); //end document ready
