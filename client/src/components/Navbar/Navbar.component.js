import React, {Fragment} from "react";
import {Link } from "react-router-dom";
import {useObserver, Observer } from "mobx-react";

import { useStore} from "../../contexts/StoreContext/store.context";

import "./Navbar.styles.scss";

const Navbar = () => {
  const store = useStore();
  const guestLinks = <Observer>{() => (
    <Fragment>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </Fragment>
  )}</Observer>;
  const onLogout = e => {
    store.logout();
  };

  const authLinks = <Observer>{() => (
    <Fragment>
      <a href="#!" onClick={onLogout}>Logout</a>
    </Fragment>
  )}</Observer>;
  return useObserver(() => (
    <nav className="navbar navbar-expand-sm">
      <div className="navbar-brand col-sm-3 col-md-2 mr-0 align-items-center">
        <Link to="/">PokemonsApp</Link>
      </div>
      <ul className="d-flex align-items-center text-primary">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        {store.isAuthenticated ? authLinks : guestLinks }
      </ul>
    </nav>
  ));
};

export default Navbar;
