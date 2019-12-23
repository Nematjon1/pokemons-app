const express = require("express");
const { check, validationResult } = require("express-validator");
const Pokedex = require("pokedex-promise-v2");
/*const options = {
  protocol: 'https',
  hostName: 'https://pokeapi.co',
  versionPath: '/api/v2/',
  cacheLimit: 10 * 1000, // 100s
  timeout: 3 * 1000 // 5s
};*/
const P = new Pokedex();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Pokemon = require("../models/Pokemon");

const router = express.Router();

// @route GET /api/pokemon/:id
// @desc  Get pokemon description
// @access  Private
router.get("/pokemon/:id", auth, (req, res) => {
  let response = null;
  P.resource([`https://pokeapi.co/api/v2/pokemon/${req.params.id}/`, `https://pokeapi.co/api/v2/pokemon-species/${req.params.id}/`])
    .then(resp => {
      response = resp;
      res.json(response);
    })
    .catch(err => {
      res.status(500).json({msg: "There was an ERROR" + err});
    })
});

// @route   GET /api/pokemons
// @desc    Get all pokemons
// @access  Private
router.get("/pokemons", auth, async (req,res) => {
  try {
    const interval = {
        limit: 20,
        offset: 0
      }
      P.getPokemonsList(interval)
        .then(function(response) {
          res.json(response);
        })
      .catch(err => {
          res.status(500).send("Server Error")
        })
  } catch(err) {
    res.status(500).send("Server Error");
  }
});
// @route   GET /api/pokemons/favourites
// @desc    Get all pokemons
// @access  Private
router.get("/pokemons/favourites", auth, async (req,res) => {
  try {
    const pokemons = await Pokemon.find({user: req.user.id}).sort({date: -1});
    res.json(pokemons);
  } catch(err) {
    res.status(500).send("Server Error");
  }
});

router.post("/pokemons", [auth, [
  check("name", "Name is required")
]], async (req,res) => {
  const errors = validationResult(req.body);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  const {name, type} = req.body;

  try {
    const newPokemon = new Pokemon({
      name,
      type,
      user: req.user.id
    });

    const pokemon = await Pokemon.save();
  } catch(err) {
    res.status(500).send("Server Error");
  }
});

router.delete("/pokemons/:id", auth, async (req, res) => {
  try {
    let pokemon = await Pokemon.findById(req.params.id);

    if(!pokemon) return res.status(404).json({ msg: "Pokemon not found" });

    //Make sure user owns pokemon
    if(pokemon.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "Not authorized"})
    }

    await Pokemon.findByIdAndRemove(req.params.id);

    res.json({ msg: "Pokemon removed from favourites"});
  } catch(err) {
    res.status(500).send("Server Error")
  }
});
module.exports = router;

