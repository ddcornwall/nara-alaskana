(function() {
  const form = document.getElementById('form-container'),
        searchField = document.getElementById('search-field'),
        naraAPI = 'https://catalog.archives.gov/api/v1/',
        responseContainer = document.getElementById('response-container');

  let searchedForText = '';

  form.addEventListener('submit', e => {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    // fetch NARA data
    fetch(`${naraAPI}?q=${searchedForText}`) // fetch API
    .then( response => response.json() ) //parse JSON
    .then(addEntry) // post entry
    .catch( error => requestError(error, searchedForText) ); // catch error

    // add each entry
    function addEntry(data) {
      let htmlContent = '';
      const dataEntries = data.opaResponse.results,
            firstEntry = dataEntries.result[0];

      if (firstEntry) {
        // use Object.keys && for(var k in Object)
        // to output each list item

        htmlContent = `
          <p>${dataEntries.total} results are available</p>
          <li>
            <img src="${firstEntry.img}" alt="">
            <h2>Title: ${dataEntries.description.fileUnit.title}</h2>
            <ul>
              <li>Parent Series: ${firstEntry.description.fileUnit.parentSeries.title}</li>
              <li>Record Year Span: ${firstEntry.description.fileUnit.parentSeries.inclusiveDates.inclusiveStartDate.year} - ${firstEntry.description.fileUnit.parentSeries.inclusiveDates.inclusiveEndDate.year}</li>
              <li>${firstEntry.object.technicalMetadata.size} of Digital Objects</li>
              <li><a href="https://catalog.archives.gov/id/${firstEntry.naId}">View ${firstEntry.description.item.title} on NARA</a></li>
            </ul>
          </li>`;
      } else {
        htmlContent = `Unfortunately, no results were found for ${searchedForText}.`
      }

      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function requestError(e, part) {
      console.log(e);

      responseContainer.insertAdjacentHTML(
        'beforeend', 
        `<p class="network-warning">Oh no! There was an error making a request for ${part}.</p>`);
    }
  });
})();