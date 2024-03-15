const infoContainer = document.getElementById("info-container");
const imageContainer = document.getElementById("image-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const url = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
let currentPoke = "";
const attributes = [
  "pokemon-name",
  "pokemon-id",
  "weight",
  "height",
  "types",
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

const consolidateData = (data) => {
  // loop through attributes array
  attributes.forEach((attr) => {
    // assign pokemon name
    if (attr === "pokemon-name") {
      document.getElementById(attr).innerText = data.name;
    } else if (attr === "pokemon-id") {
      // assign pokemon id
      document.getElementById(attr).innerText = data.id;
    } else if (attr === "types") {
      // assign pokemon type(s)
      data.types.forEach((item) => {
        document.getElementById(
          attr
        ).innerHTML += `<span>${item.type.name}</span> `;
      });
    } else if (attr === "weight" || attr === "height") {
      // assign weight and height
      document.getElementById(attr).innerText = data[attr];
    } else {
      // assign all other stats
      data.stats.forEach((item) => {
        document.getElementById(item.stat.name).innerText = item.base_stat;
      });
    }
  });
  imageContainer.innerHTML = `<img id="sprite" src="${data.sprites.front_default}" alt="${data.name}-image" />`;
};

const fetchData = (url) => {
  // fetch data from API using provided url
  fetch(url)
    .then((res) => {
      // Check if response is successful
      if (!res.ok) {
        // If response is not successful, reject the promise with an error
        throw new Error("Network response was not ok");
      }
      // If response is successful, parse JSON response
      return res.json();
    })
    .then((data) => {
      // Run the consolidateData function
      consolidateData(data);
    })
    .catch((error) => {
      // Handle errors (e.g., fetch request failed)
      alert("Pokémon not found");
      console.error("There was a problem fetching the data:", error);
    });
};

const search = () => {
  // get the table data elements in an array
  const tableItems = Array.from(document.querySelectorAll(".table-data"));
  // loop through elements and clear their innerHTML
  tableItems.forEach((item) => {
    item.innerHTML = "";
  });
  // get input value as lower cas
  currentPoke = searchInput.value.toLowerCase();
  // assign to url and fetch data
  let pokeToFetch = `${url}/${currentPoke}`;
  fetchData(pokeToFetch);
};

// search event listener
searchBtn.addEventListener("click", search);
