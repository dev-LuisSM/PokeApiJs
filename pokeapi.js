// Get components
const button = document.getElementById("change");
const pokeName = document.getElementById("pokeName");
const pokeImg = document.getElementById("pokeImg");

const pkmNumber = document.getElementById("pkmNumber");
const pkmName = document.getElementById("name");

const type0 = document.getElementById("type-0");
const type1 = document.getElementById("type-1");

const title = document.getElementsByClassName("title");

const weight = document.getElementById("pokm-weight");
const height = document.getElementById("pokm-height");
const move0 = document.getElementById("pokm-move-0");
const move1 = document.getElementById("pokm-move-1");

const description = document.getElementById("dscrpt");

const progress = document.getElementsByTagName("progress");
const statsNumbers = document.getElementById("numbers").children;
const labels = document.getElementById("labels").children;

const chain = document.getElementById("evolution-chain").children;

const body = document.body;
const pkdxLogo = document.querySelector("body > header > svg > path:nth-child(1)");
const pkdxText = document.querySelector("body > header > svg > path:nth-child(2)");

// Type dictionary
const types = {
    normal : "#A8A878",
    fire :  "#F08030",
    fighting :  "#C03028",
    water :  "#6890F0",
    flying :  "#A890F0",
    grass :  "#78C850",
    poison :  "#A040A0",
    electric :  "#F8D030",
    ground :  "#E0C068",
    psychic :  "#F85888",
    rock :  "#B8A038",
    ice :  "#98D8D8",
    bug :  "#A8B820",
    dragon :  "#7038F8",
    ghost :  "#705898",
    dark :  "#705848",
    steel :  "#B8B8D0",
    fairy :  "#EE99AC",
    unknow :  "#68A090",
    shadow : "#603A70"
};

// Fetch Api
const fetchPokemon = () => {
    chain[0].style.display = 'none';
    chain[1].style.display = 'none';
    chain[2].style.display = 'none';

    let pokeInput = pokeName.value.toLowerCase();

    // Random Pkm
    let randomPkm = Math.floor(Math.random() * 898);
    if(pokeInput === '')
        pokeInput = randomPkm;

    const url = `https://pokeapi.co/api/v2/pokemon/${pokeInput}`;

    fetch(url)
    .then((response) =>{
        if(response.ok)
            return response.json();
        throw new Error ('Pokemon not found');
    })
    .then((data) => {
        // -- Image --
        pokeImg.src = data.sprites.other["official-artwork"].front_default;
        
        // -- Name --
        pkmName.innerHTML = `#${data.id} <br> ${data.name.toUpperCase()}`;

        // -- Weight / Height / Moves --
        weight.innerHTML = `${data.weight/10} kg`;
        height.innerHTML = `${data.height/10} m`;
        move0.innerHTML = `${capitalize(data.abilities[0].ability.name)}`;
        `${
            data.abilities.length > 1
            ? move1.innerHTML = `${capitalize(data.abilities[1].ability.name)}`
            : move1.innerHTML = ``
        }`;

        // -- Types --
        // Get the type, add to the html and change color of type. body and titles
        const firstType = data.types[0].type.name;
        type0.innerHTML = `${capitalize(firstType)}`;
        type0.style.backgroundColor = types[firstType];
        body.style.backgroundColor = types[firstType];

        title[0].style.color = types[firstType];
        title[1].style.color = types[firstType];
        title[2].style.color = types[firstType];
        
        // Types: Verify if the Pkm has 2 types
        if (data.types.length > 1){
            const secondType = data.types[1].type.name;
            type1.style.display = 'block';
            type1.innerHTML = `${capitalize(secondType)}`;
            type1.style.backgroundColor = types[secondType];
        }else{
            type1.style.display = 'none';
        }

        // -- Stats --
        for(let i = 0; i < progress.length; i++){
            // Set stats to progress bars
            progress[i].value = data.stats[i].base_stat;
            statsNumbers[i].innerHTML = data.stats[i].base_stat;

            // Set color of progress
            progress[i].style.setProperty("--val",types[firstType]); // Set color value Ej:60
            progress[i].style.setProperty("--bar",`${types[firstType]+66}`); // Set background color + 66 (transparency)
            // Set color to label
            labels[i].style.color = types[firstType];
        }

        // Fetching second url to get description and evolution chain
        const urlD = `https://pokeapi.co/api/v2/pokemon-species/${pokeInput}/`;
        fetch(urlD)
        .then((responseD) =>{
            if(responseD.ok)
                return responseD.json();
        })
        .then((dataD) => {
            // Setting the description
            for(const lng in dataD.flavor_text_entries){
                if(dataD.flavor_text_entries[lng].language.name == 'en')
                    description.innerHTML = dataD.flavor_text_entries[lng].flavor_text
            }

            // Getting the evolution chain url
            fetch(dataD.evolution_chain.url)
            .then((responseChain) => {
                if(responseChain.ok)
                    return responseChain.json();
                throw new Error;
            })
            .then((dataChain) => {
                // Getting the Pokemon chain evolution and validating if there's more than 1 pokemon in the chain
                const evolution = [dataChain.chain.species.url];
                if(dataChain.chain.evolves_to[0] != undefined){
                   evolution.push(dataChain.chain.evolves_to[0].species.url)
                    if(dataChain.chain.evolves_to[0].evolves_to[0] != undefined){
                        evolution.push(dataChain.chain.evolves_to[0].evolves_to[0].species.url)
                    }
                }
                
                // In evolution (gets the url) it contains the id of the pokemon
                for(const evo in evolution)
                    evolution[evo] = evolution[evo].substr(42).slice(0, -1);           
                
                // -- Fetching to get evolution images --
                for(const evo in evolution){
                    fetch(`https://pokeapi.co/api/v2/pokemon/${evolution[evo]}`)
                    .then((responseImg) => {
                        if(responseImg.ok)
                            return responseImg.json();
                        throw new Error;
                    })
                    .then((dataImg) => {
                        chain[evo].children[0].src = dataImg.sprites.versions["generation-v"]["black-white"].front_default;
                        chain[evo].children[1].innerHTML = capitalize(dataImg.name);
                        chain[evo].style.display = 'block';
                    });
                }
            })
            .catch(() => {
                console.log("No evolution chain found")
            });
        })
    })
    .catch(() => {
        let randomImg = Math.floor(Math.random() * 6);
        pokeImg.src = `./img/silhouette/${randomImg}.png`;
    });
};

fetchPokemon();

// Capitalize strings
capitalize = (ability) => {
    if (typeof ability !== 'string') return ''
    return ability.charAt(0).toUpperCase() + ability.slice(1)
}

// Execute fetchPokemon
button.addEventListener("click", fetchPokemon);

// Enter to send info
pokeName.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("change").click();
    }
});
