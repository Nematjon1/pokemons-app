import React, { createContext, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useLocalStore } from "mobx-react";

import setAuthToken from "../../utils/setAuthToken";

const storeContext = createContext();

export const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    user: null,
    register(formData) {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      axios.post("/api/users", formData, config)
        .then(res => {
          localStorage.setItem("token", res.data.token);
          store.isAuthenticated = true;
          store.loading = false;
          store.token = res.data.token;
          store.loadUser();
        })
        .catch(err => {
          localStorage.removeItem("token");
          store.token =  null;
          store.isAuthenticated = false;
          store.loading = false;
          store.error = err.response.data.msg;
          store.setAlert(err.response.data.msg, "danger")
          store.user = null;
        })
    },
    loadUser() {
      if(localStorage.token) {
        setAuthToken(localStorage.token)
        store.loading = true;
        axios.get("/api/auth")
          .then(res => {
            store.loading = false;
            store.isAuthenticated = true;
            store.user = res.data
          })
          .catch(err => {
            store.isAuthenticated = false;
            store.loading = false;
            store.user = null;
            store.token = null;
            localStorage.removeItem("token");
            store.setAlert(err.response.data.msg, "danger");
            console.log(err.response);
          });
      }
    },
    login(user) {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      store.loading = true;
      axios.post("/api/auth", user, config)
        .then(res => {
          store.token = res.data.token;
          localStorage.setItem("token", res.data.token);
          store.isAuthenticated = true;
          store.loading = false;
          store.loadUser();
          console.log("login", res.data.token);
        })
        .catch(err => {
          localStorage.removeItem("token");
          store.loading = false;
          store.isAuthenticated = false;
          store.token = null;
          store.user = null;
          store.setAlert(err.response.data.msg, "danger")
          console.log(err.response)
        });
    },
    logout() {
      localStorage.removeItem("token");
      store.user = null;
      store.isAuthenticated =  false;
      store.loading =  false;
      store.token = null;
      store.error = null;
      store.pokemons = [];
      store.filtered = [];
      store.sorted = [];
      store.alerts = [];
    },
    clearErrors() {
      store.error = null;
    },
    token: localStorage.token,
    error: null,
    pokemon: null,
    setPokemon(pokemonIndex) {
      axios.get(`/api/pokemon/${pokemonIndex}`)
        .then(res => {
          store.pokemon = res.data;
        })
        .catch(err => {
          store.setAlert(err.response.data.msg, "danger")
        });
    },
    isAuthenticated: false,
    loading: false,
    filtered: [],
    sorted: [],
    alerts: [],
    setAlert(msg, type) {
      const id = store.alerts.length;
      store.alerts.push({msg, type, id});
      setTimeout(() => {
        store.removeAlert(id);
      }, 3000);
      return id;
    },
    removeAlert(id) {
      store.alerts.splice(id, 1);
    },
    pokemons: [],
    loadPokemons() {
      store.loading = true;
      axios.get("/api/pokemons")
        .then(res => {
          console.log(res.data);
          store.pokemons.push(...res.data.results);
          store.loading = false;
        })
        .catch(err => {
          store.loading = false;
          store.setAlert(err.response, "danger")
        })
    },
    filteredPokemons(pokemonName){
      store.filtered = store.pokemons.filter(pokemon => {
        const regex = new RegExp(`${pokemon}`, "gi");
        return pokemon.name.match(regex);
      })
    },
    clearFilter() {
      store.filtered = [];
    },
    sortedPokemons: term => {
      store.sorted = store.pokemons.slice().sort(pokemon => {
        return pokemon.type - term;
      })
    }
  }));

  return (
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.any
};

export const useStore = () => {
  
  const store = useContext(storeContext);
  if(!store) {
    throw new Error("useStore must be used in StoreProvider")
  }
  return store;
};
