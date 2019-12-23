import React, { useState, useEffect } from "react";
import {useObserver } from "mobx-react";
import {autorun} from "mobx";

import { useStore } from "../../contexts/StoreContext/store.context";


const Login = (props) => {
  const store = useStore();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  useEffect(() => {
    autorun(() => {
      if(localStorage.token) {
        console.log("Login", store);
        store.loadUser();
        props.history.push("/");
      } else {
        store.logout();
      }
    })
    // eslint-disable-next-line
  }, [store.isAuthenticated, props.history])

  const onChange = e => {
    setUser({...user, [e.target.name]: e.target.value})
  };

  const onSubmit = e => {
    e.preventDefault();
    store.login(user);
    setUser({
      email: "",
      password: ""
    })
  };

  return useObserver(() => (
    <div className="form-container">
      <h1>Account <span className="text-primary">Login</span></h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="Login" className="btn btn-primary btn-block" />
      </form>
    </div>
  ));
};

export default Login;

