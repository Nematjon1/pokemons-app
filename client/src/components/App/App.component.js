import React from 'react';
import {observer } from "mobx-react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import { StoreProvider} from "../../contexts/StoreContext/store.context";
import setAuthToken from "../../utils/setAuthToken";

import Home from "../../pages/Home.component";
import About from "../../pages/About.component";
import Navbar from "../Navbar/Navbar.component";
import Pokemon from "../Pokemon/Pokemon.component";
import Footer from "../Footer/Footer.component";
import Register from "../Register/Register.component";
import Login from "../Login/Login.component";
import Alerts from "../Alerts/Alerts.component";
import PrivateRoute from "../PrivateRoute/PrivateRoute.component";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = observer(() => {
  return (
    <StoreProvider>
      <Router>
        <Navbar />
        <Alerts />
        <div className="container h-100">
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/pokemon/:pokemonIndex" component={Pokemon} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </StoreProvider>
  );
});

export default App;
