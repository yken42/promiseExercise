let Promise = require("bluebird");

async function getCountryPopulation(country) {
  try{
    const url = `https://countriesnow.space/api/v0.1/countries/population`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country }),
    };
    const res = await fetch(url, options);
    const json = await res.json();
    if(json?.data?.populationCounts) return json.data.populationCounts.at(-1).value;
  }
    catch(err){
      console.log(`My Error: no data for ${country}`);
      throw err;
    }
    
  }

//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
async function manual() {
  try{
    let populationFrance = await getCountryPopulation("France");
    console.log(`population of France is ${populationFrance}`)

    let populationGermany = await getCountryPopulation("Germany");
    console.log(`population of Germany is ${populationGermany}`)
  } catch (err){
    console.log('Error in manual:', err.message);
  }
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

async function sequence() {
  try{
    for(let country of countries){
      let population = await getCountryPopulation(country);
      console.log(`population of ${country} is ${population}`);
    }
    console.log("all done!");
  } catch(err){
    console.log('Error in sequance: ', err.message );
  }
}

// sequence();

//--------------------------------------------------------
//  Parallel processing
//--------------------------------------------------------
async function parallel() {
  try{
    let populations = [];
    for(let country of countries){
      const population = await getCountryPopulation(country);
      populations.push(population)
    }
    countries.forEach((country, i) => console.log(`population of ${country} is ${populations[i]}`));
  } catch(err){
    console.log('Error in parallel: ', err.message);
  }
}
parallel();
