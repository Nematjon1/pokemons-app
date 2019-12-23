import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useObserver} from "mobx-react";

import { useStore } from "../../contexts/StoreContext/store.context";

const PrivateRoute = ({component: Component, ...rest}) => {
  const store = useStore();

  return useObserver (() => (
    <Route
      {...rest}
      render={props =>
        !store.isAuthenticated && !store.loading ?(
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  ));
};

export default PrivateRoute;
