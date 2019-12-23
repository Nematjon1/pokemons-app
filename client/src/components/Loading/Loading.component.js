import React from 'react';
import ReactLoading from 'react-loading';
import {useObserver} from "mobx-react";


const Loading = () => {
  return useObserver(() => (
    <ReactLoading type="bars" className="text-center" color="#ff11dd" height={"20%"} width={"20%"} />
  ));
}

export default Loading;
