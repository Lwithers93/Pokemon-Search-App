const infoContainer = document.getElementById("info-container");
const imageContainer = document.getElementById("image-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const url = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
let pokemonData = {};
let pokemonNames = [];
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

const autofill = () => {
  console.log("onchange triggered");
  // get the names that match the characters so far
  let chars = document.getElementById("search-input").value;
  let autofill = document.querySelector("#autofill-list");
  autofill.classList.remove("hidden");
  autofill.classList.add("autofill");
  autofill.innerHTML = "";
  if (chars.length <= 2) {
    autofill.innerHTML = `<p>...</p>`;
  } else {
    let matchesDisplay = getMatches(chars);
    matchesDisplay.forEach((item) => {
      autofill.innerHTML += `<p onclick="selectPokemon('${item}')">${item}</p>`;
    });
  }
};

const selectPokemon = (poke) => {
  document.querySelector("#search-input").value = poke;
  autofill();
};

const getMatches = (input) => {
  let currentMatches = [];
  let inputLength = input.length;
  for (let i = 0; i < pokemonNames.length; i++) {
    let stringToMatch = pokemonNames[i].slice(0, inputLength);
    if (stringToMatch.toLowerCase() === input.toLowerCase()) {
      currentMatches.push(pokemonNames[i]);
    }
  }
  return currentMatches;
};

// search event listener
searchBtn.addEventListener("click", search);
// Add event listener to input element
searchInput.addEventListener("keydown", (e) => {
  // Check if the key pressed is Enter (keyCode 13)
  if (e.key === 13) {
    // Prevent the default behavior of the Enter key (form submission)
    e.preventDefault();
    // Call your search function  here
    search();
  }
});

window.onload = () => {
  // fetch pokemon data from API using generic url
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
      // Check for matches
      pokemonData = data;
      let numberOfPokemon = pokemonData.results.length;
      for (let i = 0; i < numberOfPokemon; i++) {
        pokemonNames.push(pokemonData.results[i].name);
      }
    })
    .catch((error) => {
      // Handle errors (e.g., fetch request failed)
      alert("Pokémon not found");
      console.error("There was a problem fetching the data:", error);
    });
};
