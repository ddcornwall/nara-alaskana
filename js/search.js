//Seearch Script for Alaskana Explorer


// Declare global variables

// needed for NARA thumbnail Workaround
var filePath="";

//offset, SearchType and PageURL needed for possible future paging functionality will be passed in through loadData.
var offset=0;
searchType="";
pageURL="";

//need global variable catalogURL to provide browsing workaround
var catalogKeywords="";

//Experimental code based on PJS todo list app at https://glitch.com/edit/#!/kiwi-cap
//handlers need to be up here for showButton to work
var handlers = {
  getSearch: function() {
    var keywords = document.getElementById('keywords');
    mainProgram(keywords.value, 'search');
    keywords.value="";
  },
  getBrowse: function(searchType) {
      mainProgram("", searchType);
  },
   pageFwd: function() {
      mainProgram("", 'pageFwd');
   },
   showButton: function(displayed) {
     var x = document.getElementById("fwd");
     if (displayed == true) {
        x.style.display = "block";
     } else {
        x.style.display = "none";
     }
   },
   checkResultBtn: function() {
     //disable paging if offset is more than search resultFields
     if ((offset+10) >= response.opaResponse.results.total) {
        document.getElementById("fwd").disabled = true;
        $("#endList").append("<br>End of results list.");
     } else {document.getElementById("fwd").disabled = false;}
   }
 } //end handlers



handlers.showButton(false);

//Start function mainProgram
function mainProgram(keywords, searchType) {
searchURL = buildSearch(keywords, searchType); //put in paraments, may need handlers
$.getJSON( searchURL, function( data ) {
  response=data;
  handlers.checkResultBtn();
  console.log(response);
  displayResults(response);
 }); //End getJSON

} // end mainProgram

//define functions

//start function buildSearch
function buildSearch(keywords, searchType) { //begin buildSearch

  //Clears previous results
  if (searchType != "pageFwd") {
     var $recentLinks = $("#recent");
     $recentLinks.text("");
  }

  //Clears previous intro text
  var $introLinks = $("#intro");
  $introLinks.text("");

  //clear out past instances in memory
  var akURL="" //clear out past instances in memory

//initialize akURL with all common parts before customizing
  akURL="https://catalog.archives.gov/api/v1/?"; // Base url for API
  akURL=akURL+"rows=10&"; //Set rows to 10

if (searchType == "search"){

  //Set keywords from form in index.html, restricted to online records mentioning Alaska
 var keywords = $("#keywords").val();
 akURL=akURL + "q=" + keywords + " and alaska &exists=objects";


 $("#recent").append("<br>Searching for digital Alaskana relating to " + keywords + ".");

  //limit records to items with descriptions
  akURL=akURL + "&resultTypes=item,fileUnit";

  //Save pageURL if needed for paging forward
  pageURL=akURL;
  console.log(searchType, " ", akURL);
} else if (searchType == "newItems") {

  //Limit to items and file units that mention Alaska and have digital objects
  akURL = akURL + "q=alaska&resultTypes=item,fileUnit&exists=objects"

  //Sort by date record modified
  akURL = akURL + "&sort=description.recordHistory.changed.modification.dateTime%20desc"

  //Save pageURL if needed for paging forward
  pageURL=akURL;

    console.log(searchType, " ", akURL);
 //else if below retrieves federally run school newspapers
} else if (searchType == "schNews"){
 offset=0;
  //Intro text
  $("#intro").append("<p>Scope and Content of parent series: This series consists of school newspapers from Bureau of Indian Affairs schools throughout Alaska. </p> The newspapers include news about school activities such as sports; dances; special projects by different classes; and programs including plays, 4-H club events, and student council affairs. There are usually articles about events in the town or village including hunting; fishing; arrival of the supply ship, North Star, and other visitors; the arrival of the mail plane; births, deaths, and marriages; and weather conditions. Many of the newspapers include articles written by the children about their accomplishments or interests.</p><p>There are also several newspapers concerning events in the Adult Education program.</p><hr>");
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
$("#intro").append("<p>Items should be in order by community.</p><hr>")
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
$("#intro").append("<p>Scope and Content of parent series: This series consists of census sheets for towns and villages throughout the Territory and State of Alaska. The census was mainly taken by Bureau of Indian Affairs teachers and maintained by the Bureau's area office in Juneau. Information included on the census varies from year to year but consistently contains the names of each family member, their relationship to the head of the household, their age, and degree of Native blood. In some years the census sheets also asked for information on individual's education, ability to speak and read English, martial status, occupation, and special skills. Some sheets also have a column for remarks in which notes were made on the social, economic, and physical health of individuals. For some years the census also included questions relating to the monetary value of homes, vehicles, livestock such as reindeer, sled dogs, and foxes, and Native store shares held by each family.</p><hr>");
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
$("#intro").append("<p>Items should be in order by place name.</p><hr>")
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
  //hideUnnededBtn(pageDisplayed); - for future reslease

  //Let user know if search fails
  var naraRequestTimeout = setTimeout(function(){
  $("#recent").append("</br><p>Search or display timed out. I apologize for the inconvenience.</p>");
  }, 120000);


  //space between text and results
  if (response.opaResponse.results.total === 0) {
    $("#recent").append("<br> No results were available for your search. Please try again.");
    return;
  } else {
       $("#recent").append("<br>" + response.opaResponse.results.total + " results are available.<br>");
      }

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

handlers.showButton(pageDisplayed);

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

function displayThumbnail(response) {
  var recType = ShowRecType(response);

   $("#recent").append("</br>");
// new code, not fully working yet
   if (typeof response.objects === 'undefined' || recType === 'itemAv' ) {
       console.log("Line 342 - response.objects undefined or recType is itemAV");
       $("#recent").append("No thumbnail available");
   } else if (typeof response.objects.object.length === 'undefined') {
      console.log("Line 341 - response.objects.object.length undefined");
      var filePath = response.objects.object.file["@path"]
      console.log("filePath:" + filePath);
      if (filePath.startsWith("/lz")) {
        filePath=response.objects.object.file["@path"].slice(4);
      $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object.thumbnail["@path"] + "\">");
    } else {
      $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object.thumbnail["@url"] + "\">");
    }
   } else if (typeof response.objects.object[0].thumbnail === 'undefined') {
       $("#recent").append("No thumbnail available");
   }  else {
         console.log("Line 351 - multiple objects");
     var filePath = response.objects.object[0].file["@path"]
     console.log("filePath:" + filePath);
     if (filePath.startsWith("/lz")) {
       filePath=response.objects.object[0].file["@path"].slice(4);
     $("#recent").append("<img class=\"img-thumbnail\" src = \"https://catalog.archives.gov/catalogmedia/live/" + filePath + "/" + response.objects.object[0].thumbnail["@path"] + "\">");
   } else {
     $("#recent").append("<img class=\"img-thumbnail\" src = \"" + response.objects.object[0].thumbnail["@url"] + "\">");
 }
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
