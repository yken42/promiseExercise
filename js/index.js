let Promise = require("bluebird");

function getCountryPopulation(country) {
  return new Promise((resolve, reject) => {
    const url = `https://countriesnow.space/api/v0.1/countries/population`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.populationCounts)
          resolve(json.data.populationCounts.at(-1).value);
        else reject(new Error(`My Error: no data for ${country}`)); //app logic error message
      })
      .catch((err) => reject(err)); // network error - server is down for example...
    // .catch(reject)  // same same, only shorter...
  });
}

//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
function manual() {
  getCountryPopulation("France")
    .then((population) => {
      console.log(`population of France is ${population}`);
      return getCountryPopulation("Germany");
    })
    .then((population) => console.log(`population of Germany is ${population}`))
    .catch((err) => console.log("Error in manual: ", err.message));
}
// manual()

//------------------------------
//   Sequential processing
//------------------------------
const countries = [
  "France",
  "Russia",
  "Germany",
  "United Kingdom",
  "Portugal",
  "Spain",
  "Netherlands",
  "Sweden",
  "Greece",
  "Czechia",
  "Romania",
  "Israel",
];

function sequence() {
  return Promise.each(countries, (country) => {
    return getCountryPopulation(country)
      .then((population) =>
        console.log(`population of ${country} is ${population}`)
      )
      .catch((error) => console.error(error.message));
  }).then(() => {
    console.log("All Done!");
  });
}

//sequence();

//--------------------------------------------------------
//  Parallel processing
//--------------------------------------------------------
function parallel() {
  // return Promise.map(countries, (country) => {
  //   return getCountryPopulation(country)
  //     .then((population) =>
  //       console.log(`population of ${country} is ${population}`)
  //     )
  //     .catch((error) => console.error(error.message));
  // }).then(() => {
  //   console.log("All Done!");
  // });

  const promises = countries.map((country) => {
    return getCountryPopulation(country)
      .then((population) => ({country, population}))
      .catch((error) => {
        console.error(error.message);
      });
  });

  return Promise.all(promises)
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {console.error(err)})
}
parallel();
