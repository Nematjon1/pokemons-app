import React from "react";

import { useObserver } from "mobx-react";

import { useStore } from "../../contexts/StoreContext/store.context";

const Alerts = () => {
  const store = useStore();

  return useObserver(() => (
    store.alerts.length > 0 &&
    store.alerts.map(alert=> (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        {alert.msg}
      </div>
    ))
  ));
};

export default Alerts;
