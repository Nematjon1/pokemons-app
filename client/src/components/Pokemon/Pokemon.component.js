import React, { useState, useEffect } from 'react';
import {useObserver} from "mobx-react";
import {reaction} from "mobx";


import {useStore} from "../../contexts/StoreContext/store.context";

const TYPE_COLORS = {
  bug: 'B1C12E',
  dark: '4F3A2D',
  dragon: '755EDF',
  electric: 'FCBC17',
  fairy: 'F4B1F4',
  fighting: '823551D',
  fire: 'E73B0C',
  flying: 'A3B3F7',
  ghost: '6060B2',
  grass: '74C236',
  ground: 'D3B357',
  ice: 'A3E7FD',
  normal: 'C8C4BC',
  poison: '934594',
  psychic: 'ED4882',
  rock: 'B9A156',
  steel: 'B5B5C3',
  water: '3295F6'
};

const Pokemon = (props) => {
  const [state, setState] = useState({
    name: '',
    pokemonIndex: '',
    imageUrl: '',
    types: [],
    description: '',
    statTitleWidth: 3,
    statBarWidth: 9,
    stats: {
      hp: '',
      attack: '',
      defense: '',
      speed: '',
      specialAttack: '',
      specialDefense: ''
    },
    height: '',
    weight: '',
    eggGroups: '',
    catchRate: '',
    abilities: '',
    genderRatioMale: '',
    genderRatioFemale: '',
    evs: '',
    hatchSteps: '',
    themeColor: '#EF5350'
  });

  const { pokemonIndex } = props.match.params;

  const store = useStore();
  useEffect(() => {
    reaction(() => store.pokemon, (data) => {
      console.log("Pokemon Component", store.pokemon);
        // Urls for pokemon information
        //const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        //const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        // Get Pokemon Information
        const pokemonRes = store.pokemon[0];

        const name = pokemonRes.name;
        const imageUrl = pokemonRes.sprites.front_default;

        let { hp, attack, defense, speed, specialAttack, specialDefense } = state.stats;

        pokemonRes.stats.forEach(stat => {
          switch (stat.stat.name) {
            case 'hp':
              hp = stat['base_stat'];
              break;
            case 'attack':
              attack = stat['base_stat'];
              break;
            case 'defense':
              defense = stat['base_stat'];
              break;
            case 'speed':
              speed = stat['base_stat'];
              break;
            case 'special-attack':
              specialAttack = stat['base_stat'];
              break;
            case 'special-defense':
              specialDefense = stat['base_stat'];
              break;
            default:
              break;
          }
        });

        // Convert Decimeters to Feet... The + 0.0001 * 100 ) / 100 is for rounding to two decimal places :)
        const height =
          Math.round((pokemonRes.height * 0.328084 + 0.00001) * 100) / 100;

        const weight =
          Math.round((pokemonRes.weight * 0.220462 + 0.00001) * 100) / 100;

        const types = pokemonRes.types.map(type => type.type.name);

        const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;

        const abilities = pokemonRes.abilities
          .map(ability => {
            return ability.ability.name
              .toLowerCase()
              .split('-')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ');
          })
          .join(', ');

        const evs = pokemonRes.stats
          .filter(stat => {
            if (stat.effort > 0) {
              return true;
            }
            return false;
          })
          .map(stat => {
            return `${stat.effort} ${stat.stat.name
              .toLowerCase()
              .split('-')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')}`;
          })
          .join(', ');

        // Get Pokemon Description .... Is from a different end point uggh
      //axios.get(pokemonSpeciesUrl).then(res => {
        const pokemonSpec = store.pokemon[1];
      console.log("PokemonSpec", pokemonSpec)
        let description = '';
        pokemonSpec.flavor_text_entries.some(flavor => {
          if (flavor.language.name === 'en') {
            description = flavor.flavor_text;
            return undefined;
          } else {
            return undefined;
          }
        });
        let femaleRate = pokemonSpec.gender_rate;
        let genderRatioFemale = 12.5 * femaleRate;
        let genderRatioMale = 12.5 * (8 - femaleRate);

        let catchRate = Math.round((100 / 255) * pokemonSpec.capture_rate);

        let eggGroups = pokemonSpec.egg_groups
          .map(group => {
            return group.name
              .toLowerCase()
              .split(' ')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ');
          })
          .join(', ');

        const hatchSteps = 255 * (pokemonSpec.hatch_counter + 1);

        setState({
          ...state,
          imageUrl,
          description,
          genderRatioFemale,
          genderRatioMale,
          catchRate,
          eggGroups,
          hatchSteps,
          pokemonIndex,
          name,
          types,
          stats: {
            hp,
            attack,
            defense,
            speed,
            specialAttack,
            specialDefense
          },
          themeColor,
          height,
          weight,
          abilities,
          evs
        });
      })
    //eslint-disable-next-line
  }, []);

  return useObserver(() => (
    <div className="col">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-5">
              <h5>{state.pokemonIndex}</h5>
            </div>
            <div className="col-7">
              <div className="float-right">
                {state.types.map(type => (
                  <span
                    key={type}
                    className="badge badge-pill mr-1"
                    style={{
                      backgroundColor: `#${TYPE_COLORS[type]}`,
                      color: 'white'
                    }}
                  >
                    {type
                      .toLowerCase()
                      .split(' ')
                      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <div className=" col-md-3 ">
              <img
                src={state.imageUrl}
                alt={state.name}
                className="card-img-top rounded mx-auto mt-2"
              />
            </div>
            <div className="col-md-9">
              <h4 className="mx-auto">
                {state.name
                  .toLowerCase()
                  .split(' ')
                  .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')}
              </h4>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${state.statTitleWidth}`}>
                  HP
                </div>
                <div className={`col-12 col-md-${state.statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${state.stats.hp}%`,
                        backgroundColor: `#${state.themeColor}`
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.stats.hp}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${state.statTitleWidth}`}>
                  Attack
                </div>
                <div className={`col-12 col-md-${state.statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${state.stats.attack}%`,
                        backgroundColor: `#${state.themeColor}`
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.stats.attack}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${state.statTitleWidth}`}>
                  Defense
                </div>
                <div className={`col-12 col-md-${state.statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${state.stats.defense}%`,
                        backgroundColor: `#${state.themeColor}`
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.stats.defense}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${state.statTitleWidth}`}>
                  Speed
                </div>
                <div className={`col-12 col-md-${state.statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${state.stats.speed}%`,
                        backgroundColor: `#${state.themeColor}`
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.stats.speed}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${state.statTitleWidth}`}>
                  Sp Atk
                </div>
                <div className={`col-12 col-md-${state.statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${state.stats.specialAttack}%`,
                        backgroundColor: `#${state.themeColor}`
                      }}
                      aria-valuenow={state.stats.specialAttack}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.stats.specialAttack}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${state.statTitleWidth}`}>
                  Sp Def
                </div>
                <div className={`col-12 col-md-${state.statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${state.stats.specialDefense}%`,
                        backgroundColor: `#${state.themeColor}`
                      }}
                      aria-valuenow={state.stats.specialDefense}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.stats.specialDefense}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col">
              <p className="">{state.description}</p>
            </div>
          </div>
        </div>
        <hr />
        <div className="card-body">
          <h5 className="card-title text-center">Profile</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-6">
                  <h6 className="float-right">Height:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.height} ft.</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-right">Weight:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.weight} lbs</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-right">Catch Rate:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.catchRate}%</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-right">Gender Ratio:</h6>
                </div>
                <div className="col-6">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${state.genderRatioFemale}%`,
                        backgroundColor: '#c2185b'
                      }}
                      aria-valuenow="15"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.genderRatioFemale}</small>
                    </div>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${state.genderRatioMale}%`,
                        backgroundColor: '#1976d2'
                      }}
                      aria-valuenow="30"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{state.genderRatioMale}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6">
                  <h6 className="float-right">Egg Groups:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.eggGroups} </h6>
                </div>
                <div className="col-6">
                  <h6 className="float-right">Hatch Steps:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.hatchSteps}</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-right">Abilities:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.abilities}</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-right">EVs:</h6>
                </div>
                <div className="col-6">
                  <h6 className="float-left">{state.evs}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted">
          Data From{' '}
          <a href="https://pokeapi.co/" className="card-link">
            PokeAPI.co
          </a>
        </div>
      </div>
    </div>
  ));
 }
export default Pokemon;
