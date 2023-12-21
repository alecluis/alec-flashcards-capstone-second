/*The Edit Card screen has the following features:

The path to this screen should include the deckId and the cardId (i.e., /decks/:deckId/cards/:cardId/edit).
You must use the readDeck() function from src/utils/api/index.js to load the deck that contains the card to be edited. Additionally, you must use the readCard() function from src/utils/api/index.js to load the card that you want to edit.
There is a breadcrumb navigation bar with a link to home /, followed by the name of the deck of which the edited card is a member, and finally the text Edit Card :cardId (e.g., Home/Deck React Router/Edit Card 4).
It displays the same form as the Add Card screen, except it is prefilled with information for the existing card. It can be edited and updated.
If the user clicks on either Save or Cancel, the user is taken to the Deck screen.*/

//EditCard.js

import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck, readCard, updateCard } from "../utils/api/index";
import CardForm from "./CardForm"; 


function EditCard() {
  const history = useHistory();
  const { deckId, cardId } = useParams();
  const [card, setCard] = useState({
    id: "",
    front: "",
    back: "",
    deckId: "",
  });
  const [deck, setDeck] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDeckAndCardData = async () => {
      try {
        const cardResponse = await readCard(cardId, abortController.signal);
        const deckResponse = await readDeck(deckId, abortController.signal);
        if (!abortController.signal.aborted) {
          setCard(cardResponse);
          setDeck(deckResponse);
        }
      } catch (error) {
        console.error("Error fetching deck or card:", error);
      } finally {
        if (!abortController.signal.aborted) {
          abortController.abort();
        }
      }
    };

    fetchDeckAndCardData();

    return () => {
      abortController.abort();
    };
  }, [cardId, deckId]);

  const handleChange = ({ target }) => {
    setCard({
      ...card,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const updatedCard = await updateCard(card, abortController.signal);
      history.push(`/decks/${deckId}`);
      return updatedCard;
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleCancel = () => {
    history.push(`/decks/${deckId}`);
  };

  return (
    <div className="editcard">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active">Edit Card {cardId}</li>
        </ol>
      </nav>
      <h2>Edit Card</h2>
      <CardForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleCancel={handleCancel}
        formMode="edit"
        card={card}
      />
    </div>
  );
}

export default EditCard;


