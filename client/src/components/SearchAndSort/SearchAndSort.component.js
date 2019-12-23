import React, {useState, useEffect} from "react";
import { useObserver } from "mobx-react";

import {reaction} from "mobx";

import {useStore} from "../../contexts/StoreContext/store.context";

import "./SearchAndSort.styles.scss";

const SearchAndSort = () => {
  const [term, setTerm] = useState("");

  const store = useStore();
  useEffect(() => {
    reaction(() => store.filtered.length, (data) => {
      return store.filtered
    })
    // eslint-disable-next-line
  }, []);
  const onChange = e => {
    setTerm(e.target.value)
    if(term.length > 0) {
      store.filteredPokemons(term)
    } else {
      store.clearFilter();
    }
  }
  return useObserver(() => (
    <form>
      <div className="row form-group justify-content-center d-flex">
        <div className="col-4">
          <input
            type="text"
            value={term}
            className="form-control mx-auto"
            placeholder="Search..."
            onChange={onChange}
          />
        </div>
        <div className="col-8 col-sm-8">
          <div className="row d-flex align-items-center">
            <span className="font-weight-bold">Sort By:</span>
            <select className="w-25 mx-2" onChange={e => console.log(`${e.target.value}, ${typeof e.target.value}`)}>
              <option value="name">Name</option>
              <option value="id">ID</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  ));
};

export default SearchAndSort;
