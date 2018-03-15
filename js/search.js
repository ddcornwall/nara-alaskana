$(function() { //begin document ready

function loadData() { //begin loadData

//needed for NARA thumbnail Workaround
var filePath="";

//offset, SearchType and PageURL needed for possible future paging functionality will be passed in through loadData.
var offset=0;
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

  //Set keywords from form in index.html, restricted to online records mentioning Alaska
 var keywords = $("#keywords").val();
 akURL=akURL + "q=" + keywords + " and alaska &exists=objects";

//Set keywords from form in index.html, restricted to records mentioning Alaska Digitization Project
//  akURL=akURL + "q=" + keywords + " and \"Alaska%20Digitization%20Project\"";

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
//begin function displayResults
function displayResults(results) {

  //Clears any previous search results unless paging results
  var $recentLinks = $("#recent");
  if (offset == 0) {$recentLinks.text("");}

  var pageDisplayed=true;
  //hideUnnededBtn(pageDisplayed); - for future reslease

  //Let user know if search fails
  var naraRequestTimeout = setTimeout(function(){
  $("#recent").append("</br><p>Search or display timed out. I apologize for the inconvenience.</p>");
  }, 120000);


  //space between text and results
  $("#recent").append("</br>" + response.opaResponse.results.total + " results are available.</br>");

  //display results
  for (var i=0; i < response.opaResponse.results.result.length; i++) {

    printRecNum(response.opaResponse.results.result[i]);
    printTitle(response.opaResponse.results.result[i]);
    printScope(response.opaResponse.results.result[i]);
    printParentTitle(response.opaResponse.results.result[i]);
    // printCreator(response.opaResponse.results.result[i]); Needs array testing, will be implemented in future version
    printRecStart(response.opaResponse.results.result[i]);
    printRecEnd(response.opaResponse.results.result[i]);
    printNumObj(response.opaResponse.results.result[i]);
    displayThumbnail(response.opaResponse.results.result[i]);
    // printObjLoc(response.opaResponse.results.result[i]); - likely not needed might come back in future version
    printRecLoc(response.opaResponse.results.result[i]);
    printCataloged(response.opaResponse.results.result[i]);
    printNaID(response.opaResponse.results.result[i]);
   $("#recent").append("<p style=\"border-bottom-style: solid\"></p>" );

  } // end display loop
  clearTimeout(naraRequestTimeout);

//Functions local to DisplayResults

function ShowRecType(response) {
var recType = "";
if (typeof response.description.fileUnit !== 'undefined') {
   recType = "fileUnit";
} else if (typeof response.description.item !== 'undefined') {
   recType = "item";
} else if (typeof response.description.itemAv !== 'undefined') {
   recType = "itemAv";
} else {recType="unknown";}
return recType;
} // End ShowRecType

function printRecNum(response) {
  $("#recent").append("</br>");
  $("#recent").append("Record: " + response.num);
} // End printRecNum

function printTitle(response) {
$("#recent").append("</br>");

var recType = ShowRecType(response);
if (recType === "fileUnit") {
   $("#recent").append("Title: " + response.description.fileUnit.title);
} else if (recType === "item") {
  $("#recent").append("Title: " + response.description.item.title);
} else if (recType === "itemAv") {
    $("#recent").append("Title: " + response.description.itemAv.title);
} else {
  $("#recent").append("Title: Unable to determine. Unknown");
  console.log("Title display error" + response);
}
} //End print title


function printScope(response) {
  var recType = ShowRecType(response);
  if (recType === "itemAv") {
    $("#recent").append("</br>");
    $("#recent").append("Scope and Contents: " + response.description.itemAv.scopeAndContentNote);
  }
} //End print scope

function printParentTitle(response) {
  $("#recent").append("</br>");
  var recType = ShowRecType(response);
    if (recType === "fileUnit") {
       $("#recent").append("Parent Series: " + response.description.fileUnit.parentSeries.title);
  } else if (recType === "item"  && typeof response.description.item.parentFileUnit != "undefined") {
      $("#recent").append("Parent Series: " + response.description.item.parentFileUnit.parentSeries.title);
  } else if (recType === "item"  && typeof response.description.item.parentSeries != "undefined") {
      $("#recent").append("Parent Series: " + response.description.item.parentSeries.title);
  } else if (recType === "itemAv") {
        $("#recent").append("Parent Series: " + response.description.itemAv.parentSeries.title);
  } else {
      $("#recent").append("Parent Series: Unable to determine. Unknown error.");
      console.log("Parent series display error" + response);
    }
} // End printParentTitle

//This needs an array test
function printCreator(response) {
  $("#recent").append("</br>");
    $("#recent").append("Creating Agency: Not implemented");
}

function printRecStart(response) {
  var recType = ShowRecType(response);
  if (recType === "fileUnit") {
     $("#recent").append("</br> Year Records Start: " + response.description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
  } else if (recType === "item"  && typeof response.description.item.parentFileUnit != "undefined") {
    $("#recent").append("</br> Year Records Start: " + response.description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
  } else if (recType === "item"  && typeof response.description.item.parentSeries != "undefined") {
    $("#recent").append("</br> Year Records Start: " + response.description.item.parentSeries.inclusiveDates.inclusiveStartDate.year);
  } else if (recType === "itemAv") {
      $("#recent").append("</br> Year Records Start: " + response.description.itemAv.parentSeries.inclusiveDates.inclusiveStartDate.year);
    } else {
        $("#recent").append("Records Start: Unable to determine. Unknown error.");
        console.log("Records start display error" + response);
      }
} // end printRecStart

function printRecEnd(response) {
  var recType = ShowRecType(response);
  if (recType === "fileUnit") {
     $("#recent").append("</br> Year Records End: " + response.description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
   } else if (recType === "item"  && typeof response.description.item.parentFileUnit != "undefined") {
     $("#recent").append("</br> Year Records End: " + response.description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
   } else if (recType === "item"  && typeof response.description.item.parentSeries != "undefined") {
     $("#recent").append("</br> Year Records End: " + response.description.item.parentSeries.inclusiveDates.inclusiveEndDate.year);
  } else if (recType === "itemAv") {
      $("#recent").append("</br> Year Records End: " + response.description.itemAv.parentSeries.inclusiveDates.inclusiveEndDate.year);
    } else {
        $("#recent").append("Records End: Unable to determine. Unknown error.");
        console.log("Records End display error" + response);
      }
} //end printRecEnd

function printNumObj(response) {
  var recType = ShowRecType(response);
  if (typeof response.objects === 'undefined' && recType === "fileUnit") {
    $("#recent").append("</br> There are " + response.description.fileUnit.itemCount + " digital objects associated with this record.");
    $("#recent").append("</br> <a href=\"https://catalog.archives.gov/search?q=*:*&f.ancestorNaIds=" + response.naId + "&sort=naIdSort%20asc" + "\" target=\"_blank\">View digital objects in National Archives Catalog</a>");
      } else if (typeof response.objects.object.length === 'undefined') {
  $("#recent").append("</br> There is one digital object associated with this record.");
  }  else {
$("#recent").append("</br> There are " + response.objects.object.length + " digital objects associated with this record.");
}
} // End printNumObj

//3-8-2018 still in progress
function displayThumbnail(response) {
  var recType = ShowRecType(response);

   $("#recent").append("</br>");
  //March 2018 - trimming paths and prepends are part of a NARA provided workaround while they reorganize files.
  if (typeof response.objects === 'undefined' || recType === 'itemAv' ) {
      $("#recent").append("No thumbnail available");
  } else if (typeof response.objects.object.length === 'undefined') {
     filePath=response.objects.object.file["@path"].slice(4);
     $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object.thumbnail["@path"] + "\">");
  } else if (response.objects.object[0].file["@mime"] == "image/jpeg") {
        filePath=response.objects.object[0].file["@path"].slice(4);
      $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object[0].thumbnail["@path"] + "\">");
console.log("https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object[0].thumbnail["@path"])
  } else if (response.objects.object[0].file["@mime"] == "image/pdf") {
        $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object[0].thumbnail["@url"] + "\">");
  } else if (typeof response.objects.object[0].thumbnail === 'undefined') { // this needs to be kept even if workaround goes away
     $("#recent").append("No thumbnail available");
  } else if (response.objects.object[0].thumbnail["@mime"] == "image/jpeg") {
      $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object[0].thumbnail["@url"] + "\">");
console.log(response.objects.object[0].thumbnail["@url"]);
 }
} //end displayThumbnail


//Leaving unimplemented for now, may be enough to have thumbnail and record.
function printObjLoc(response) {
  $("#recent").append("</br>");
    $("#recent").append("First/Only object location: Not implemented");
} //End printObjLoc

function printRecLoc(response) {
  $("#recent").append("</br><a href=\"https://catalog.archives.gov/id/" + response.naId + "\" target=\"_blank\">View full record in NARA Catalog</a>");
} //End printRecLoc

function printCataloged(response) {
var recType = ShowRecType(response);
if (recType === "fileUnit") {
   $("#recent").append("</br> Record Cataloged: " + response.description.fileUnit.recordHistory.created.dateTime);
} else if (recType === "item") {
  $("#recent").append("</br> Record Cataloged: " + response.description.item.recordHistory.created.dateTime);
} else if (recType === "itemAv") {
    $("#recent").append("</br> Record Cataloged: " + response.description.itemAv.recordHistory.created.dateTime);
} else {
  $("#recent").append("Title: Unable to determine. Unknown");
  console.log("Date Cataloged display error" + response);
}
} //End printCataloged

function printNaID(response) {
  $("#recent").append("</br> NaID = " + response.naId);
} //End printNaID

} //end DisplayResults


return false;

}; //end function load data

$('#form-container').submit(loadData);


}); //end document ready