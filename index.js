const infoContainer = document.getElementById("info-container");
const imageContainer = document.getElementById("image-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const autofillList = document.querySelector("#autofill-list");
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
  autofillList.innerHTML = "";
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
  // get the names that match the characters so far
  let chars = document.getElementById("search-input").value;
  // clear autofill list
  autofillList.innerHTML = "";
  // clear the vertical scroll to hide element
  autofillList.style.overflowY = "unset";
  if (chars.length === 0) {
    // clear autofill list
    autofillList.innerHTML = "";
  } else if (chars.length === 1) {
    // set placeholder to autofill list
    autofillList.innerHTML = `<p>...</p>`;
  } else {
    // if 2 or more chars entered
    // get the mathes to display in the dropdown
    let matchesDisplay = getMatches(chars);
    matchesDisplay.forEach((item) => {
      // loop through matches and add name to list
      autofillList.innerHTML += `<p id="${item}" class="autofill-item" onclick="selectPokemon('${item}')">${item}</p>`;
    });
    // add vertical scroll to autofill list
    autofillList.style.overflowY = "scroll";
    // highlight first in list
    if (autofillList.firstElementChild) {
      autofillList.firstElementChild.classList.add("highlighted");
    }
  }
};

const selectPokemon = (poke) => {
  // populate input list with name of selected pokemon from dropdown
  document.querySelector("#search-input").value = poke;
  // clear dropdown
  autofillList.innerHTML = "";
  // search for selected pokemon
  search();
};

const getMatches = (input) => {
  // declare variables
  let currentMatches = [];
  let inputLength = input.length;
  // loop through all pokemon names data
  for (let i = 0; i < pokemonNames.length; i++) {
    // slice the name to check against the chars entered to input
    let stringToMatch = pokemonNames[i].slice(0, inputLength);
    // if the input matches the string
    if (stringToMatch.toLowerCase() === input.toLowerCase()) {
      // push current pokemon name to matches list
      currentMatches.push(pokemonNames[i]);
    }
  }
  // return the current matches
  return currentMatches;
};

// setting event listeners //

// search event listener
searchBtn.addEventListener("click", search);

// Add event listener to document for search with enter key
document.addEventListener("keydown", (e) => {
  // Check if the key pressed is Enter (keyCode 13)
  if (e.key === "Enter") {
    // Prevent the default behavior of the Enter key (form submission)
    e.preventDefault();
    let currentChoice = document.querySelector(".highlighted").id;
    selectPokemon(currentChoice);
    // Call your search function  here
    search();
  }
});

// event listener to scroll dropdown
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    if (
      autofillList.innerHTML === "" ||
      autofillList.innerHTML === "<p>...</p>"
    ) {
      return;
    } else {
      // declare local variables
      let currentSelection;
      let next;
      // get array of element IDs
      let currentOptions = Array.from(
        document.querySelectorAll(".autofill-item")
      ).map((item) => item.id);
      // check for highlighted element
      if (document.querySelector(".highlighted")) {
        // get ID of highlighted
        currentSelection = document.querySelector(".highlighted").id;
        // get index of highlighted
        let currentIndex = currentOptions.indexOf(currentSelection);
        // condition for moving down the list
        if (e.key === "ArrowDown") {
          // don't go below the bottom of the list
          if (currentIndex + 1 >= currentOptions.length) {
            next = document.getElementById(
              currentOptions[currentOptions.length - 1]
            );
          } else {
            // move down 1 item
            next = document.getElementById(currentOptions[currentIndex + 1]);
          }
          // condition for moving up the list
        } else if (e.key === "ArrowUp") {
          if (currentIndex - 1 < 0) {
            // don't go above the top of the list
            next = document.getElementById(currentOptions[0]);
          } else {
            // move up one item
            next = document.getElementById(currentOptions[currentIndex - 1]);
          }
        }
        // highlight the next element and remove from the previous
        document
          .getElementById(currentSelection)
          .classList.remove("highlighted");
        next.classList.add("highlighted");
      } else {
        // if no element already highlighted, start at top of list
        document.getElementById(currentOptions[0]).classList.add("highlighted");
      }
    }
  }
});

// fetch data on load
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
