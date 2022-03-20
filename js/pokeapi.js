// Get components
const button = document.querySelector("#change");
const pokeName = document.querySelector("#pokeName");
const pokeImg = document.querySelector("#pokeImg");

const pkmNumber = document.querySelector("#pkmNumber");
const pkmName = document.getElementById("name");

const type0 = document.querySelector("#type-0");
const type1 = document.querySelector("#type-1");

const title = document.getElementsByClassName("title");

const weight = document.querySelector("#pokm-weight");
const height = document.querySelector("#pokm-height");
const move0 = document.querySelector("#pokm-move-0");
const move1 = document.querySelector("#pokm-move-1");

const description = document.querySelector("#dscrpt");

const progress = document.getElementsByTagName("progress");
const statsNumbers = document.querySelector("#numbers").children;
const labels = document.querySelector("#labels").children;

const chain = document.querySelector("#evolution-chain").children;

const body = document.body;
const pkdxLogo = document.querySelector(
  "body > header > svg > path:nth-child(1)"
);
const pkdxText = document.querySelector(
  "body > header > svg > path:nth-child(2)"
);

// Type dictionary
const types = {
  normal: "#A8A878",
  fire: "#F08030",
  fighting: "#C03028",
  water: "#6890F0",
  flying: "#A890F0",
  grass: "#78C850",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  psychic: "#F85888",
  rock: "#B8A038",
  ice: "#98D8D8",
  bug: "#A8B820",
  dragon: "#7038F8",
  ghost: "#705898",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  unknow: "#68A090",
  shadow: "#603A70",
};

// Fetch Api
const fetchPokemon = () => {
  chain[0].style.display = "none";
  chain[1].style.display = "none";
  chain[2].style.display = "none";

  let pokeInput = pokeName.value.toLowerCase();

  // Random Pkm
  let randomPkm = Math.floor(Math.random() * 898);
  if (pokeInput === "") pokeInput = randomPkm;

  const url = `https://pokeapi.co/api/v2/pokemon/${pokeInput}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // -- Images and name --
      pokeImg.src = data.sprites.other["official-artwork"].front_default;
      const id = data.species.url.substr(42).slice(0, -1);
      pkmName.innerHTML = `#${id} <br> ${data.name.toUpperCase()}`;

      // -- Weight, Height and Abilities
      weight.innerHTML = `${data.weight / 10} kg`;
      height.innerHTML = `${data.height / 10} m`;
      move0.innerHTML = `${capitalize(data.abilities[0].ability.name)}`;
      data.abilities.length > 1
        ? (move1.innerHTML = `${capitalize(data.abilities[1].ability.name)}`)
        : (move1.innerHTML = ``);

      // -- Types --
      const firstType = data.types[0].type.name;
      type0.innerHTML = `${capitalize(firstType)}`;
      type0.style.backgroundColor = types[firstType];
      body.style.backgroundColor = types[firstType];

      title[0].style.color = types[firstType];
      title[1].style.color = types[firstType];
      title[2].style.color = types[firstType];

      if (data.types.length > 1) {
        const secondType = data.types[1].type.name;
        type1.style.display = "block";
        type1.innerHTML = `${capitalize(secondType)}`;
        type1.style.backgroundColor = types[secondType];
      } else {
        type1.style.display = "none";
      }

      // -- Stats --
      for (let i = 0; i < progress.length; i++) {
        progress[i].value = data.stats[i].base_stat;
        statsNumbers[i].innerHTML = data.stats[i].base_stat;

        progress[i].style.setProperty("--val", types[firstType]); // Set color value Ej:60
        progress[i].style.setProperty("--bar", `${types[firstType] + 66}`); // Set background color + 66 (transparency)
        labels[i].style.color = types[firstType];
      }

      // -- Description and evolution chain --
      const urlD = `https://pokeapi.co/api/v2/pokemon-species/${pokeInput}/`;
      fetch(urlD)
        .then((responseD) => responseD.json())
        .then((dataD) => {
          // Description
          for (const lng in dataD.flavor_text_entries) {
            if (dataD.flavor_text_entries[lng].language.name == "en")
              description.innerHTML =
                dataD.flavor_text_entries[lng].flavor_text;
          }

          // Evolution chain
          fetch(dataD.evolution_chain.url)
            .then((responseChain) => responseChain.json())
            .then((dataChain) => {
              const evolution = [dataChain.chain.species.url];
              if (dataChain.chain.evolves_to[0] != undefined) {
                evolution.push(dataChain.chain.evolves_to[0].species.url);
                if (dataChain.chain.evolves_to[0].evolves_to[0] != undefined) {
                  evolution.push(
                    dataChain.chain.evolves_to[0].evolves_to[0].species.url
                  );
                }
              }

              for (const evo in evolution)
                evolution[evo] = evolution[evo].substr(42).slice(0, -1);

              // -- Evolution images --
              for (const evo in evolution) {
                fetch(`https://pokeapi.co/api/v2/pokemon/${evolution[evo]}`)
                  .then((responseImg) => responseImg.json())
                  .then((dataImg) => {
                    chain[evo].children[0].src =
                      dataImg.sprites.versions["generation-v"][
                        "black-white"
                      ].front_default;
                    chain[evo].children[1].innerHTML = capitalize(dataImg.name);
                    chain[evo].style.display = "block";
                  });
              }
            });
        });
    })
    .catch(() => {
      let randomImg = Math.floor(Math.random() * 6);
      pokeImg.src = `./img/silhouette/${randomImg}.png`;
    });
};

// Execute fetchPokemon
fetchPokemon();
button.addEventListener("click", fetchPokemon);

// Capitalize strings
capitalize = (ability) => {
  if (typeof ability !== "string") return "";
  return ability.charAt(0).toUpperCase() + ability.slice(1);
};

// Enter to send info
pokeName.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#change").click();
  }
});
