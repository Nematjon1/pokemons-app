import React, {useEffect} from 'react';
import { useObserver } from "mobx-react";
import {reaction} from "mobx";

import {useStore} from "../../contexts/StoreContext/store.context";

import Pokemons from "../Pokemons/Pokemons.component";
import SearchAndSort from "../SearchAndSort/SearchAndSort.component";


import "./Main.styles.scss";






const Main = () => {
  const store = useStore();
  useEffect(() => {
    reaction(() => store.isAuthenticated, (data) => {
      console.log(data);
    })
    // eslint-disable-next-line
  }, [])
  return useObserver(() => (
      <main className="container">
        <SearchAndSort />
        <Pokemons />
      </main>
  ));
}


export default Main;
