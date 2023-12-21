/*The Deck screen has the following features:

The path to this screen should include the deckId (i.e., /decks/:deckId).
You must use the readDeck() function from src/utils/api/index.js to load the existing deck.
There is a breadcrumb navigation bar with a link to home / followed by the name of the deck (e.g., Home/React Router).
The screen includes the deck name (e.g., "React Router") and deck description (e.g., "React Router is a collection of navigational components that compose declaratively in your application").
The screen includes Edit, Study, Add Cards, and Delete buttons. Each button takes the user to a different destination, as follows:

| Button Clicked | Destination |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Edit | Edit Deck Screen |
| Study | Study screen |
| Add Cards | Add Card screen |
| Delete | Shows a warning message before deleting the deck]( See the "Delete Card Prompt" section below) |

Each card in the deck:

Is listed on the page under the "Cards" heading.
Shows a question and the answer to the question.
Has an Edit button that takes the user to the Edit Card screen when clicked.
Has a Delete button that allows that card to be deleted.
Delete Card Prompt
When the user clicks the Delete button associated with a card, a warning message is shown and the user can click OK or Cancel. If the user clicks OK, the card is deleted.

You can use window.confirm() to create the modal dialog shown in the screenshot below.*/

//Deck.js

import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api/index.js";

function Deck() {
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState({});
  const [cards, setCards] = useState([])

  useEffect(() => {
    const fetchDeck = async () => {
      const abortController = new AbortController()
      try {
        const fetchedDeck = await readDeck(deckId, abortController.signal);
        setDeck(fetchedDeck);
        setCards(fetchedDeck.cards)
      } catch (error) {
        console.error("Error fetching deck:", error);
      }
      return () => {
        abortController.abort()
      }
    };

    fetchDeck();
  }, []);

  const handleDeleteDeck = async (deck) => {
    if (
      window.confirm(
          `Delete this deck? You will not be able to recover it`
      )
  ) {
      const abortController = new AbortController();
      try {
          return await deleteDeck(deck.id, abortController.signal);
          history.push("/")
      } catch (error) {
          console.error("Something went wrong", error);
      }
      return () => {
          abortController.abort();
      };
  }
  };

  const handleDeleteCard = async (card) => {
    if (
      window.confirm(
          `Delete this card? You will not be able to recover it`
      )
  ) {
      const abortController = new AbortController();
      try {
          history.go(0);
          return await deleteCard(card.id, abortController.signal);
      } catch (error) {
          console.error("Something went wrong", error);
      }
      return () => {
          abortController.abort();
      };
  }
  };

  async function handleEditDeck() {
    history.push(`/decks/${deckId}/edit`);
}

async function handleStudy() {
    history.push(`/decks/${deckId}/study`);
}

async function handleAddCard() {
    history.push(`/decks/${deckId}/cards/new`);
}

async function handleEditCard(card) {
    history.push(`/decks/${deckId}/cards/${card.id}/edit`);
}

  if (!deck) {
    return <p>Loading...</p>;
  }

  return (
    <div className="deck-deck">
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{deck.name}</li>
        </ol>
      </nav>
      <div className="cardDeck">
        <div className="card-body">
          <h2 className="card-title">{deck.name}</h2>
          <p>{deck.description}</p>
          <div className="deck-button-container d-flex flex-row">
          <button className="button-edit" onClick={() => handleEditDeck()}>Edit</button>
          <button className="button-study" onClick={() => handleStudy()}>Study</button>
          <button className="button-addcards" onClick={() => handleAddCard()}>Add Cards</button>
          <button className="button-delete" onClick={() => handleDeleteDeck(deck)}>Delete</button>
          </div>
        </div>
      </div>
      <h1>Cards</h1>
      {cards.map((card) => (
        <div className="card-deck" key={card.id}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col">{card.front}</div>
                <div className="col">{card.back}</div>
              </div>
              <div className="container row">
                <button className="button-edit" onClick={() => handleEditCard(card)}>Edit</button>
                <button className="button-delete" onClick={() => handleDeleteCard(card)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Deck;
