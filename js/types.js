const button = document.querySelector("#change");
const pokeName = document.querySelector("#pokeName");

const template = document.querySelector("[data-template]");
const container = document.querySelector("[data-container]");

const body = document.body;

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

const randomType =
  Object.keys(types)[Math.floor(Math.random() * Object.keys(types).length)];

const fetchPokemon = () => {
  // Remove previous nodes
  container.innerHTML = "";
  let pokeInput = pokeName.value.toLowerCase();

  if (pokeInput === "") pokeInput = randomType;

  const url = `https://pokeapi.co/api/v2/type/${pokeInput}/`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let pokemon = data.pokemon;
      body.style.backgroundColor = types[pokeInput];
      pokemon.map((pkm) => {
        fetch(pkm.pokemon.url)
          .then((result) => result.json())
          .then((pokemonData) => {
            const card = template.content.cloneNode(true).children[0];
            const name = card.querySelector("[data-name]");
            const img = card.querySelector("[data-image]");
            const number = card.querySelector("[data-number]");
            const type0 = card.querySelector("[data-t0]");
            const type1 = card.querySelector("[data-t1]");

            // Get real number
            const id = pokemonData.species.url.substr(42).slice(0, -1);
            const pokeball = "../img/pokeball-undefined.png";
            
            const src = pokemonData.sprites.versions["generation-v"]["black-white"].front_default;
            const t0 = pokemonData.types[0].type.name;

            name.textContent = capitalize(pokemonData.name);
            src === null ? (img.src = pokeball) : (img.src = src);
            number.textContent = `#${id}`;
            type0.textContent = capitalize(t0);
            type0.style.backgroundColor = types[t0];
            if (pokemonData.types.length > 1) {
                const t1 = pokemonData.types[1].type.name;
                type1.textContent = capitalize(t1);
                type1.style.display = "block";
                type1.style.backgroundColor = types[t1];
            } else {
                type1.style.display = "none";
            }

            container.append(card);
          });
      });
    });
};

fetchPokemon();
capitalize = (ability) => {
  if (typeof ability !== "string") return "";
  return ability.charAt(0).toUpperCase() + ability.slice(1);
};

button.addEventListener("click", fetchPokemon);

pokeName.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector("#change").click();
    }
});