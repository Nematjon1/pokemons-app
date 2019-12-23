import React, {useEffect} from "react";
import { useObserver } from "mobx-react";
import {reaction} from "mobx";

import {useStore} from "../../contexts/StoreContext/store.context";

import Loading from "../Loading/Loading.component";
import PokemonCard from "../PokemonCard/PokemonCard.component";

import "./Pokemons.styles.scss";

const Pokemons = () => {
  const store = useStore();

  useEffect(() => {
    reaction(() => {
      return store.isAuthenticated;
    }, (data) => {
      console.log("Pokemons...", store)
      store.loadPokemons();
      console.log("After load Pokemons...", store)
    })
    // eslint-disable-next-line
  }, []);

  console.log(store)
  return useObserver(() => {
    let list = [];
    if(store.filtered.length > 0) {
      list = store.filtered;
    } else {
      list = store.pokemons;
    }

    return (
      <div>
        {store.pokemons.length > 0 ? (
          <div className="row">
            {list.map(pokemon => {
              return (<PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
              />
              )
            })}
          </div>) : (
          <Loading />
        )}
      </div>
    )
  });
};

export default Pokemons;
