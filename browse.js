//searchType is shared between buildSearch and getJSON
var searchType = "";

//Need a variable to remember akURL and offset outside of buildSearch function in case paging forward is needed.
var pageURL="";
var offset=0;

//needed for NARA thumbnail Workaround
var filePath="";


function loadData(searchType) {


//main program
console.log("This is searchType: ", searchType);
$.getJSON( buildSearch(searchType), function( data ) {
  response=data;
  console.log(response);
  displayResults(response);
 }); //End getJSON


//define functions

//start function buildSearch
function buildSearch(searchType) { //begin buildSearch

  //Clears previous intro text
  var $introLinks = $("#intro");
  $introLinks.text("");


var akURL="" //clear out past instances in memory

//initialize akURL with all common parts before customizing
  akURL="https://catalog.archives.gov/api/v1/?"; // Base url for API
  akURL=akURL+"rows=10&"; //Set rows to 10

if (searchType == "new"){
  //pull records mentioning the Alaska Digitization Project as an "alternate control number"
  akURL=akURL + "description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\""

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by when parent record created
  akURL=akURL + "&sort=description.recordHistory.created.dateTime desc";

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  console.log(searchType, " ", akURL);
} else if (searchType == "newItems") {
  //pull records mentioning the Alaska Digitization Project"
  akURL=akURL + "q=\"Alaska%20Digitization%20Project\""

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=item";

  //Sort items by when record modified
  akURL=akURL + "&sort=description.recordHistory.changed.modification.dateTime desc";

  console.log(searchType, " ", akURL);
//else if below retrieves federally run school newspapers
} else if (searchType == "schNews"){
  //Intro text
  $("#intro").append("<p>Scope and Content of parent series: This series consists of school newspapers from Bureau of Indian Affairs schools throughout Alaska. </p> The newspapers include news about school activities such as sports; dances; special projects by different classes; and programs including plays, 4-H club events, and student council affairs. There are usually articles about events in the town or village including hunting; fishing; arrival of the supply ship, North Star, and other visitors; the arrival of the mail plane; births, deaths, and marriages; and weather conditions. Many of the newspapers include articles written by the children about their accomplishments or interests.</p><p style=\"border-bottom-style: solid\">There are also several newspapers concerning events in the Adult Education program.</p><p></p>");
  $("#recent").append("<p>Please be patient as it may take up to 90 seconds for records to appear. This is a known issue and being worked on.</p>")



  //pull records mentioning the Alaska Digitization Project as an "alternate control number"
  akURL=akURL + "description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\""

 //pull records of parent title series 'newspapers'
 akURL=akURL + "&description.fileUnit.parentSeries.title=newspapers"

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by when parent record created
  akURL=akURL + "&sort=description.title asc";

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  console.log(searchType, " ", akURL);
} else if (searchType == "1964Quake"){
//Intro text
$("#intro").append("<p>Scope and Content of parent series: This series consists of black and white photographs taken by the Alaska District of the U.S. Army Corps of Engineers of the damage done by the 1964 Good Friday Alaska earthquake and the subsequent recovery efforts. The areas represented are Anchorage, the Turnagain Arm residential area, Denali Elementary School, Cordova, Elmendorf Air Force Base, Fort Richardson, Girdwood, Homer, Kodiak, Moose Pass, Nikolski, Seldovia, Seward, Tatitlek, Valdez, and Whittier.</p>");
$("#intro").append("<p style=\"border-bottom-style: solid\">Items should be in order by community.</p> <p></p>")
$("#recent").append("<p>Please be patient as it may take up to 90 seconds for records to appear. This is a known issue and being worked on.</p>")

//pull records of parent title series 'Alaska Earthquake Photographs'
 akURL=akURL + "description.fileUnit.parentSeries.title=1964%20Alaska%20Earthquake%20Photographs"

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by when parent record created
  akURL=akURL + "&sort=description.title asc";

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

} //end loadData
