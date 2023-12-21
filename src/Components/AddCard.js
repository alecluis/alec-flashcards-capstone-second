/*The Add Card screen has the following features:

The path to this screen should include the deckId (i.e., /decks/:deckId/cards/new).
You must use the readDeck() function from src/utils/api/index.js to load the deck that you're adding the card to.
There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck to which the cards are being added, and finally the text Add Card (e.g., Home/React Router/Add Card).
The screen displays the React Router: Add Card deck title.
A form is shown with the "front" and "back" fields for a new card. Both fields use a <textarea> tag that can accommodate multiple lines of text.
If the user clicks Save, a new card is created and associated with the relevant deck. Then the form is cleared and the process for adding a card is restarted.
If the user clicks Done, the user is taken to the Deck screen.*/

//AddCard.js

// AddCard.js

import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index";
import CardForm from "./CardForm";

function AddCard() {
  const { deckId } = useParams();
  const history = useHistory();
  const initialState = {
    front: "",
    back: "",
  };

  const [newCard, setNewCard] = useState(initialState);
  const [deck, setDeck] = useState({});

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
    setNewCard({
      ...newCard,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const createdCard = await createCard(
        deckId,
        { ...newCard },
        abortController.signal
      );
      history.push(`/decks/${deckId}`);
      setNewCard(initialState);
      return createdCard;
    } catch (error) {
      console.error("Error creating card:", error);
    } finally {
      abortController.abort();
    }
  };

  const handleDone = () => {
    history.push(`/decks/${deckId}`);
  };

  return (
    <div className="addcard">
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active">Add Card</li>
        </ol>
      </nav>
      <h2>{deck.name}: Add Card</h2>
      <CardForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleCancel={handleDone} 
        formMode="add" 
        card={newCard}
      />
    </div>
  );
}

export default AddCard;
