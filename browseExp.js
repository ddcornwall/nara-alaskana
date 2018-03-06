//This is a change.

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

if (searchType == "new"){
  offset=0;
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

  //3-1-2018 effort at new items url
  akURL = akURL + "q=alaska&resultTypes=item,fileUnit&exists=objects&sort=description.recordHistory.changed.modification.dateTime%20desc"

  //Save pageURL if needed for paging forward
  pageURL=akURL;

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

  //Sort items by when parent record created
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

  //Sort items by when parent record created
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

  //Sort items by when parent record created
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
    printCreator(response.opaResponse.results.result[i]); //Needs array testing
    printRecStart(response.opaResponse.results.result[i]);
    printRecEnd(response.opaResponse.results.result[i]);
    printNumObj(response.opaResponse.results.result[i]);
    displayThumbnail(response.opaResponse.results.result[i]);
    printObjLoc(response.opaResponse.results.result[i]);
    printRecLoc(response.opaResponse.results.result[i]);
    printCataloged(response.opaResponse.results.result[i]);
    printNaID(response.opaResponse.results.result[i]);
   $("#recent").append("</br>=============================</br>");

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
}

function printRecNum(response) {
  console.log(response);
  $("#recent").append("</br>");
  $("#recent").append("Record: " + response.num);
}

function printTitle(response) {
$("#recent").append("</br>");

var recType = ShowRecType(response);
if (recType === "fileUnit") {
   $("#recent").append("Title: " + response.description.fileUnit.title);
} else if (recType === "item") {
  $("#recent").append("Title: " + response.description.item.title);
} else if (recType === "itemAv") {
    $("#recent").append("Title: " + description.itemAv.title);
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
}

function printParentTitle(response) {
  $("#recent").append("</br>");
  var recType = ShowRecType(response);
  if (recType === "fileUnit") {
     $("#recent").append("Parent Series: " + response.description.fileUnit.parentSeries.title);
  } else if (recType === "item"  && typeof response.description.item.parentFileUnit.parentSeries.title != "undefined") {
    $("#recent").append("Parent Series: " + response.description.item.parentFileUnit.parentSeries.title);
  } else if (recType === "item"  && typeof description.item.parentSeries != "undefined") {
    $("#recent").append("Parent Series: " + description.item.parentSeries);
  } else if (recType === "itemAv") {
      $("#recent").append("Parent Series: " + description.itemAv.parentSeries.title);
  } else {
      $("#recent").append("Parent Series: Unable to determine. Unknown error.");
      console.log("Parent series display error" + response);
    }
}

//This needs an array test
function printCreator(response) {
  $("#recent").append("</br>");
    $("#recent").append("Creating Agency: Not implemented");
}

function printRecStart(response) {
  var recType = ShowRecType(response);
  if (recType === "fileUnit") {
     $("#recent").append("</br> Year Records Start: " + response.description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
  } else if (recType === "item") {
    $("#recent").append("</br> Year Records Start: " + response.description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year);
  } else if (recType === "itemAv") {
      $("#recent").append("</br> Year Records Start: " + response.description.itemAv.parentSeries.inclusiveDates.inclusiveStartDate);
    } else {
        $("#recent").append("Records Start: Unable to determine. Unknown error.");
        console.log("Records start display error" + response);
      }
} // end printRecStart

function printRecEnd(response) {
  var recType = ShowRecType(response);
  if (recType === "fileUnit") {
     $("#recent").append("</br> Year Records End: " + response.description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
  } else if (recType === "item") {
    $("#recent").append("</br> Year Records End: " + response.description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
  } else if (recType === "itemAv") {
      $("#recent").append("</br> Year Records End: " + response.description.itemAv.parentSeries.inclusiveDates.inclusiveEndDate);
    } else {
        $("#recent").append("Records End: Unable to determine. Unknown error.");
        console.log("Records End display error" + response);
      }
} //end printRecEnd

function printNumObj(response) {
  $("#recent").append("</br>");
    $("#recent").append("Number of digital objects: Not implemented");
}

function displayThumbnail(response) {
  $("#recent").append("</br>");
    $("#recent").append("Thumbnail: Not implemented");
}

//Do I really need this if I have the thumbnail and the main record?
function printObjLoc(response) {
  $("#recent").append("</br>");
    $("#recent").append("First/Only ojbect location: Not implemented");
}

function printRecLoc(response) {
  $("#recent").append("</br>");
    $("#recent").append("View full record in NARA Catalog: Not implemented");
}

function printCataloged(response) {
  $("#recent").append("</br>");
    $("#recent").append("Date Cataloged: Not implemented");
}

function printNaID(response) {
  $("#recent").append("</br>");
    $("#recent").append("NaID: Not implemented");
}

} //end DisplayResults

/*  Use for spare parts

    $("#recent").append("</br> Parent Series Title: " + response.description.item.parentFileUnit.parentSeries.title);

    $("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.item.parentFileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
    $("#recent").append("</br> Record Cataloged: " + response.opaResponse.results.result[i].description.item.recordHistory.created.dateTime);

  //Workaround for items without digital objects. 3/1/18 - need better description

  if (typeof response.opaResponse.results.result[i].objects === 'undefined') {
    $("#recent").append("</br>Unable to determine number of digital objects.");

  } else if (typeof response.opaResponse.results.result[i].objects.object.length === 'undefined') {
  $("#recent").append("</br>This digital object found found at <a href = \"" + response.opaResponse.results.result[i].objects.object.file["@url"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object.file["@path"] + "</a> </br>" );
  $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.opaResponse.results.result[i].objects.object.thumbnail["@url"] + "\">");
} else {
  $("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
  $("#recent").append("</br> First digital object found found at <a href = \"https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "</a> </br>" );
}

//  }//end no digital object workaround
  } //end item record display.

  //For FileUnit records
  if (typeof response.opaResponse.results.result[i].description.fileUnit !== 'undefined') {
  $("#recent").append("</br> Title: " + response.opaResponse.results.result[i].description.fileUnit.title);
  $("#recent").append("</br> Parent Series Title: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.title);

  $("#recent").append("</br> Year Records End: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year);
  $("#recent").append("</br> Record Cataloged: " + response.opaResponse.results.result[i].description.fileUnit.recordHistory.created.dateTime);

  //Workaround for records without objects section. - this based on 1/30/18 discovery of NaID 41027079
  console.log("response.opaResponse.results.result[i].objects.object.length is " + response.opaResponse.results.result[i].objects.object.length)
  if (typeof response.opaResponse.results.result[i].objects === 'undefined' && typeof response.opaResponse.results.result[i].description.fileUnit !== 'undefined') {
    $("#recent").append("</br> There are " + response.opaResponse.results.result[i].description.fileUnit.itemCount + " digital objects associated with this record.");
    $("#recent").append("</br> <a href=\"https://catalog.archives.gov/search?q=*:*&f.ancestorNaIds=" + response.opaResponse.results.result[i].naId + "&sort=naIdSort%20asc" + "\" target=\"_blank\">View digital objects in National Archives Catalog</a>");
    //$("#recent").append("</br> <img class=\"img-thumbnail\" src = \"Placeholder.png \">");
  } else if (typeof response.opaResponse.results.result[i].objects.object.length === 'undefined') {
  $("#recent").append("</br> There is one digital object associated with this record.");
  $("#recent").append("</br> Digital object available at at <a href = \"https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object.file["@path"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object.file["@path"] + "</a> </br>" );
}  else {
$("#recent").append("</br> There are " + response.opaResponse.results.result[i].objects.object.length + " digital objects associated with this record.");
$("#recent").append("</br> First digital object found at <a href = \"https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "\" target=\"_blank\"> https://catalog.archives.gov/catalogmedia" + response.opaResponse.results.result[i].objects.object[0].file["@path"] + "</a> </br>" );
//}
  //February 2018 NARA provided work around for thumbnails
  if (response.opaResponse.results.result[i].objects.object[0].file["@mime"] == "image/jpeg") {
    filePath=response.opaResponse.results.result[i].objects.object[0].file["@path"].slice(4);
    $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@path"] + "\">");
  } else if (response.opaResponse.results.result[i].objects.object[0].file["@mime"] == "image/pdf") {
  $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.opaResponse.results.result[i].objects.object[0].thumbnail["@url"] + "\">");
} else if (response.opaResponse.results.result[i].objects.object[0].thumbnail === 'undefined') { // this needs to be kept even if workaround goes away
  $("#recent").append("No thumbnail available");
}


   //end NARA thumbnail workaround


    //The line below fails when there is more than one creating organization. Would need to be able to test for a deal with an array before displaying.
  //$("#recent").append("</br> Creating Organization: " + response.opaResponse.results.result[i].description.fileUnit.parentSeries.creatingOrganizationArray.creatingOrganization.creator.termName);
  } //end else if no digital object
  }

  //common fields for both fileUnit and item records
  $("#recent").append("</br> Full record available at <a href=\"https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "\" target=\"_blank\"> https://catalog.archives.gov/id/" + response.opaResponse.results.result[i].naId + "</a>");
  $("#recent").append("</br> NaID = " + response.opaResponse.results.result[i].naId + "<p style=\"border-bottom-style: solid\"> ");
*/



} //end loadData
