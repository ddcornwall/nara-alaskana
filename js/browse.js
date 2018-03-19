

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
hideUnnededBtn(false);
$.getJSON( buildSearch(searchType), function( data ) {
  response=data;
  checkResultBtn();
  console.log(response);
  displayResults(response);
   }); //End getJSON


//define functions

//Hide next 10 records button until needed
function hideUnnededBtn(displayed) {
var x = document.getElementById("fwd");
if (displayed == true) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function checkResultBtn() {
  //disable paging if offset is more than search resultFields
  if ((offset+10) >= response.opaResponse.results.total) {
  document.getElementById("fwd").disabled = true;
  $("#endList").append("</br>End of results list.");
} else {document.getElementById("fwd").disabled = false;}
}

//start function buildSearch
function buildSearch(searchType) { //begin buildSearch

  //Clears previous results
  //var $recentLinks = $("#recent");
  //if (offset == 0) {$recentLinks.text("");}


  //Clears previous intro text
  var $introLinks = $("#intro");
  $introLinks.text("");

  //Clears previous end of results Notes
  var $endResults = $("#endList");
  $endResults.text("");

var akURL="" //clear out past instances in memory

//initialize akURL with all common parts before customizing
  akURL="https://catalog.archives.gov/api/v1/?"; // Base url for API
  akURL=akURL+"rows=10&"; //Set rows to 10

if (searchType == "newItems") {

  //Limit to items and file units that mention Alaska and have digital objects
  akURL = akURL + "q=alaska&resultTypes=item,fileUnit&exists=objects"

  //Sort by date record modified
  akURL = akURL + "&sort=description.recordHistory.changed.modification.dateTime%20desc"

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  //3-7-2018 Testing single record. Comment out when not in use
 //akURL="https://catalog.archives.gov/api/v1/?naIds=";
 //akURL="https://catalog.archives.gov/api/v1/?naIds=24731415";

  console.log(searchType, " ", akURL);

//else if below retrieves federally run school newspapers
} else if (searchType == "schNews"){
 offset=0;
  //Intro text
  $("#intro").append("<p>Scope and Content of parent series: This series consists of school newspapers from Bureau of Indian Affairs schools throughout Alaska. </p> The newspapers include news about school activities such as sports; dances; special projects by different classes; and programs including plays, 4-H club events, and student council affairs. There are usually articles about events in the town or village including hunting; fishing; arrival of the supply ship, North Star, and other visitors; the arrival of the mail plane; births, deaths, and marriages; and weather conditions. Many of the newspapers include articles written by the children about their accomplishments or interests.</p><p style=\"border-bottom-style: solid\">There are also several newspapers concerning events in the Adult Education program.</p><p></p>");
  $("#recent").append("<p>Please be patient as it may take up to 90 seconds for records to appear. This is a known issue and being worked on.</p>")


//pull records mentioning the Alaska Digitization Project as an "alternate control number"
  akURL=akURL + "description.fileUnit.variantControlNumberArray.variantControlNumber=\"Alaska%20Digitization%20Project\""

 //pull records of parent title series 'newspapers'
 akURL=akURL + "&description.fileUnit.parentSeries.title=newspapers"

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by title
  akURL=akURL + "&sort=description.title asc";

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  console.log(searchType, " ", akURL);
} else if (searchType == "1964Quake"){
offset=0;
//Intro text
$("#intro").append("<p>Scope and Content of parent series: This series consists of black and white photographs taken by the Alaska District of the U.S. Army Corps of Engineers of the damage done by the 1964 Good Friday Alaska earthquake and the subsequent recovery efforts. The areas represented are Anchorage, the Turnagain Arm residential area, Denali Elementary School, Cordova, Elmendorf Air Force Base, Fort Richardson, Girdwood, Homer, Kodiak, Moose Pass, Nikolski, Seldovia, Seward, Tatitlek, Valdez, and Whittier.</p>");
$("#intro").append("<p style=\"border-bottom-style: solid\">Items should be in order by community.</p> <p></p>")
$("#recent").append("<p>Please be patient as it may take up to 90 seconds for records to appear. This is a known issue and being worked on.</p>")

//pull records of parent title series 'Alaska Earthquake Photographs'
 akURL=akURL + "description.fileUnit.parentSeries.title=1964%20Alaska%20Earthquake%20Photographs"

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by title
  akURL=akURL + "&sort=description.title asc";

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  console.log(searchType, " ", akURL);
} else if (searchType == "villageCensusRolls"){
offset=0;
//Intro text
//$("#intro").append("<p>Scope and Content of parent series: This series consists of photographs taken between 1972 and 1976 documenting national parks in Alaska. Subjects include flora, fauna, facilities, rivers, mountains, other natural features, towns and villages, and activities of park personnel and visitors.</p>");
//$("#intro").append("<p style=\"border-bottom-style: solid\">Items should be in order by place name.</p> <p></p>")
$("#recent").append("<p>Please be patient as it may take up to 90 seconds for records to appear. This is a known issue and being worked on.</p>")

//pull records of parent title series 'Village Census Rolls"
 akURL=akURL + "description.fileUnit.parentSeries.title=village%20census%20rolls";

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by title
  akURL=akURL + "&sort=description.title asc";

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  console.log(searchType, " ", akURL);

} else if (searchType == "taskForcePhotos"){
offset=0;
//Intro text
$("#intro").append("<p>Scope and Content of parent series: This series consists of photographs taken between 1972 and 1976 documenting national parks in Alaska. Subjects include flora, fauna, facilities, rivers, mountains, other natural features, towns and villages, and activities of park personnel and visitors.</p>");
$("#intro").append("<p style=\"border-bottom-style: solid\">Items should be in order by place name.</p> <p></p>")
$("#recent").append("<p>Please be patient as it may take up to 90 seconds for records to appear. This is a known issue and being worked on.</p>")

//pull records of parent title series 'Alaska Task Force Photographs', naId=2252773
 akURL=akURL + "description.fileUnit.parentSeries.naId=2252773"

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=fileUnit";

  //Sort items by title
  akURL=akURL + "&sort=description.title asc";

  //Save pageURL if needed for paging forward
  pageURL=akURL;

  console.log(searchType, " ", akURL);
} else if (searchType="pageFwd") {
  offset=offset+10;
  akURL=pageURL + "&offset=" + offset;
  console.log(akURL);
}
return akURL;
// end else
} //end function build search

//begin function displayResults
function displayResults(results) {

  //Clears any previous search results unless paging results
  var $recentLinks = $("#recent");
  if (offset == 0) {$recentLinks.text("");}

  var pageDisplayed=true;
  hideUnnededBtn(pageDisplayed);

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
// new code, not fully working yet
   if (typeof response.objects === 'undefined' || recType === 'itemAv' ) {
       console.log("Line 342 - response.objects undefined or recType is itemAV");
       $("#recent").append("No thumbnail available");
   } else if (typeof response.objects.object.length === 'undefined') {
      console.log("Line 345 - response.objects.object.length undefined");
      var filePath = response.objects.object.file["@path"]
      console.log("filePath:" + filePath);
      if (filePath.startsWith("/lz")) {
        filePath=response.objects.object.file["@path"].slice(4);
      $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object.thumbnail["@path"] + "\">");
    } else {
      $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object.thumbnail["@url"] + "\">");
  }
   } else {
         console.log("Line 348 - multiple objects");
     var filePath = response.objects.object[0].file["@path"]
     console.log("filePath:" + filePath);
     if (filePath.startsWith("/lz")) {
       filePath=response.objects.object[0].file["@path"].slice(4);
     $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object[0].thumbnail["@path"] + "\">");
   } else {
     $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object[0].thumbnail["@url"] + "\">");
 }
}


/*
  //March 2018 - trimming paths and prepends are part of a NARA provided workaround while they reorganize files.
  if (typeof response.objects === 'undefined' || recType === 'itemAv' ) {
      console.log("Line 338 - response.objects undefined or recType is itemAV");
      $("#recent").append("No thumbnail available");
  } else if (typeof response.objects.object.length === 'undefined') {
     console.log("Line 341 - response.objects.object.length undefined");
     filePath=response.objects.object.file["@path"].slice(4);
     $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object.thumbnail["@path"] + "\">");
  } else if (response.objects.object[0].file["@mime"] == "image/jpeg") {
        console.log("Line 345 - file of first object is jpeg");
        filePath=response.objects.object[0].file["@path"].slice(4);
      $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object[0].thumbnail["@path"] + "\">");
console.log("https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object[0].thumbnail["@path"])
  } else if (response.objects.object[0].file["@mime"] == "image/pdf") {
    console.log("Line 350 - file of first object is pdf");
        $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object[0].thumbnail["@url"] + "\">");
  } else if (typeof response.objects.object[0].thumbnail === 'undefined') { // this needs to be kept even if workaround goes away
  console.log("Line 353 - digital object has no thumbnail - i.e. csv etc");
     $("#recent").append("No thumbnail available");
  //I'm not sure why I put next line in here.
  } else if (response.objects.object[0].thumbnail["@mime"] == "image/jpeg") {
  console.log("Line 356 - thumbnail itself is jpeg");
      $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object[0].thumbnail["@url"] + "\">");
console.log(response.objects.object[0].thumbnail["@url"]);
}
*/
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


} //end loadData
