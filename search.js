$(function() { //begin document ready

function loadData() { //begin loadData

//needed for NARA thumbnail Workaround
var filePath="";

//SearchType and PageURL needed for possible future paging functionality will be passed in through loadData.
searchType="search";
pageURL="";

//main program
$.getJSON( buildSearch(), function( data ) {
  response=data;
  console.log(response);
  displayResults(response);
 }); //End getJSON


//define functions

//start function buildSearch
function buildSearch() { //begin buildSearch

  //Clears previous results
  var $recentLinks = $("#recent");
  $recentLinks.text("");

  //Clears previous intro text
  var $introLinks = $("#intro");
  $introLinks.text("");

  //clear out past instances in memory
  var akURL=""

//initialize akURL with all common parts before customizing
  akURL="https://catalog.archives.gov/api/v1/?"; // Base url for API
  akURL=akURL+"rows=10&"; //Set rows to 10

if (searchType == "search"){

  //Set keywords from form in index.html, restricted to records mentioning Alaska Digitization Project
  var keywords = $("#keywords").val();
  akURL=akURL + "q=" + keywords + " and \"Alaska%20Digitization%20Project\"";

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=item,fileUnit";

  //Save pageURL if needed for paging forward
  pageURL=akURL;
  console.log(searchType, " ", akURL);
} else if (searchType="pageFwd") {
  offset=offset+9;
  akURL=pageURL + "&offset=" + offset;
  console.log(akURL);
}
return akURL;
// end else
} //end function build search

//begin function displayResults
function displayResults(results) {

  //Clears any previous search results
  var $recentLinks = $("#recent");
  $recentLinks.text("");

  //Let user know if search fails
  var naraRequestTimeout = setTimeout(function(){
  $("#recent").append("</br><p>Search or display timed out. I apologize for the inconvenience.</p>");
  }, 120000);


  //space between text and results
  $("#recent").append("</br></br>");

  //display results
  for (var i=0; i < response.opaResponse.results.result.length; i++) {

  //troubleshooting between types of file level descriptions
  console.log(response.opaResponse.results.result[i].description)

  //for item level descriptive Records
  if (typeof response.opaResponse.results.result[i].description.item !== 'undefined') {
    $("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.item.title);
    $("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.title);
    $("#recent").append("</br> Year Records Start: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
    $("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
    $("#recent").append("</br> Record Cataloged: " + response.opaResponse.results.result[i].description.item.recordHistory.created.dateTime);

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
  $("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
  $("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);
  $("#recent").append("</br> Year Records Start: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
  $("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
  $("#recent").append("</br> Record Cataloged: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);

  //Workaround for records without objects section. - this based on 1/30/18 discovery of NaID 41027079
  if (typeof response.opaResponse.results.result[i].objects === 'undefined' && typeof response.opaResponse.results.result[i].description.fileUnit !== 'undefined') {
    $("#recent").append("</br> There are " + response.opaResponse.results.result[i].description.fileUnit.itemCount + " digital objects associated with this record.");
    $("#recent").append("</br> <img class=\"img-thumbnail\" src = \"Placeholder.png \">");
  } else {
  $("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
  $("#recent").append("</br> First digital object found found at <a href = \"https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "</a> </br>" );

  //February 2018 NARA provided work around for thumbnails
  if (response.opaResponse.results.result[i].objects.object[0].file["@mime"] == "image/jpeg") {
    filePath=response.opaResponse.results.result[i].objects.object[0].file["@path"].slice(4);
    $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@path"] + "\">");
  } else {
  $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@url"] + "\">");
   } //end NARA thumbnail workaround


    //The line below fails when there is more than one creating organization. Would need to be able to test for a deal with an array before displaying.
  //$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);
  } //end else if no digital object
  }

  //common fields for both fileUnit and item records
  $("#recent").append("</br> Full record and additional objects available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
  $("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");
  } // end display loop
  clearTimeout(naraRequestTimeout);

} //end DisplayResults

return false;

}; //end function load data

$('#form-container').submit(loadData);


}); //end document ready
