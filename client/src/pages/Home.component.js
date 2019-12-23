import React, {useEffect} from "react";
import { useObserver } from "mobx-react";
import {reaction} from "mobx";

import { useStore } from "../contexts/StoreContext/store.context";


import Main from "../components/Main/Main.component";

const Home = () => {
  const store = useStore();

  useEffect(() => {
    console.log("App Level", store)
  }, [store])

  useEffect(() => {
    reaction(() => store.isAuthenticated, (data) => {
      if(store.token) {
        store.loadUser();
      }
    })
    // eslint-disable-next-line
  }, []);
  return useObserver(() =>(
    <div className="app">
      <Main store={store} />
    </div>
  ));
};

export default Home;
