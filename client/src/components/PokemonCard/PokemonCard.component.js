import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import styled from "styled-components";
import spinner from "../../assets/spinner.gif";

import {useObserver } from "mobx-react";
import {useStore} from "../../contexts/StoreContext/store.context";

import "./PokemonCard.styles.scss";

const Sprite = styled.img`
  width: 5rem;
  height: 5rem;
  display: none;
`;

const Card = styled.div`
  opacity: 0.95;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -o-user-select: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;
const PokemonCard = ({name, url}) => {
  const store = useStore();
  const [state, setState] = useState({
    name: "",
    imageUrl: "",
    pokemonIndex: "",
    imageLoaded: true,
    toManyRequests: false
  });

  useEffect(() => {
    const pokemonIndex = url.split("/")[url.split("/").length - 2];
    const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
    setState({
      ...state,
      name,
      imageUrl,
      pokemonIndex
    })
    //eslint-disable-next-line
  }, []);
  const onClick = (e) => {
    store.setPokemon(state.pokemonIndex)
  };
  return useObserver(() => (
    <div className="col-md-3 col-sm-6 mb-5">
      <StyledLink onClick={onClick} to={`/pokemon/${state.pokemonIndex}`}>
        <Card className="card">
          <h5 className="text-center card-header">{state.pokemonIndex}</h5>
          {state.imageLoading ?(
            <img
              src={spinner}
              alt={state.name}
              style={{width: "3rem", height: "3rem"}}
              className="card-img-top rounded mx-auto d-block mt-2"
            />
          ) : null}
          <Sprite
            className="card-img-top w-50 rounded mx-auto mt-2"
            src={state.imageUrl}
            onLoad={() => setState({ ...state, imageLoading: false })}
            onError={() => setState({ ...state, toManyRequests: true })}
            style={
              state.toManyRequests
                ? { display: 'none' }
                : state.imageLoading
                ? null
                : { display: 'block' }
            }
          />
          {state.toManyRequests ? (
            <h6 className="mx-auto">
              <span className="badge badge-danger mt-2">
                To Many Requests
              </span>
            </h6>
          ) : null}
          <div className="card-body mx-auto">
            <h6 className="card-title">
              {state.name
                .toLowerCase()
                .split(' ')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}
            </h6>
          </div>
        </Card>
      </StyledLink>
    </div>
  ));
};

PokemonCard.propTypes = {
  pokemon: PropTypes.object
};

export default PokemonCard;
