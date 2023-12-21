/*The Edit Deck screen has the following features:

The path to this screen should include the deckId (i.e., /decks/:deckId/edit).
You must use the readDeck() function from src/utils/api/index.js to load the existing deck.
There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck being edited, and finally the text Edit Deck (e.g., Home/Rendering in React/Edit Deck).
It displays the same form as the Create Deck screen, except it is prefilled with information for the existing deck.
The user can edit and update the form.
If the user clicks Cancel, the user is taken to the Deck screen.*/

//EditDeck.js

import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api/index";

function EditDeck() {
  const { deckId } = useParams();
  const history = useHistory();
  const initialDeckState = {
    name: "",
    description: "",
    id: "",
  };
  const [deck, setDeck] = useState(initialDeckState);

  useEffect(() => {
    const fetchDeckData = async () => {
      const abortController = new AbortController();
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        setDeck(fetchedDeck);
      } catch (error) {
        console.error("Error fetching deck:", error);
      }
      return () => {
        abortController.abort();
      };
    };

    fetchDeckData();
  }, []);

  const handleChange = ({ target }) => {
    setDeck({
      ...deck,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const updatedDeck = await updateDeck({ ...deck }, abortController.signal);
      history.push(`/decks/${deckId}`);
      return updatedDeck;
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  };

  const handleCancel = async () => {
    history.push(`/decks/${deckId}`);
  };

  return (
    <div className="editdeck">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active">Edit Deck</li>
        </ol>
      </nav>
      <form name="edit" onSubmit={handleSubmit}>
        <h1>Edit Deck</h1>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={deck.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={deck.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <button className="button-cancel" onClick={() => handleCancel()}>Cancel</button>
        <button className="button-submit">Submit</button>
      </form>
    </div>
  );
}

export default EditDeck;
