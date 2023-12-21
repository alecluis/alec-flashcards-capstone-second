/*The Home screen has the following features:

The path to this screen should be /.
A Create Deck button is shown, and clicking it brings the user to the Create Deck screen.
Existing decks are each shown with the deck name, the number of cards, and a Study, View, and Delete button.
Clicking the Study button brings the user to the Study screen.
Clicking the View button brings the user to the Deck screen.
Clicking the Delete button shows a warning message before deleting the deck.
Delete Deck prompt
When the user clicks the Delete button, a warning message is shown and the user can click OK or Cancel. If the user clicks OK, the deck is deleted and the deleted deck is no longer visible on the Home screen.

You can use window.confirm() to create the modal dialog shown in the screenshot below.*/

//Home.js

import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Study from "./Study.js"
import { listDecks, deleteDeck } from "../utils/api/index.js"
import "../App.css"

function Home() {
  const history = useHistory()
  const [decks, setDecks] = useState([])

  useEffect(() => {
      async function fetchDecks() {
        const abortController = new AbortController()
        try {
          const fetchedDecks = await listDecks(abortController.signal); 
          setDecks(fetchedDecks);
        } catch (error) {
            console.error("Something went wrong", error);
          }
          return () => {
            abortController.abort()
          }
        };
      fetchDecks();
      }, []);

  async function handleDelete(deck) {
    if (
      window.confirm(
        `Delete this deck? You will not be able to recover it`
      )
    ) {
      history.go(0)
      return await deleteDeck(deck.id)
    }
  }


  return (
    <div className="home">
        <Link className="create-deck-button" to="/decks/new">
            Create Deck
        </Link>
        <div className="deck">
            {decks.map((deck) => {
                return (
                    <div
                        className="card"
                        key={deck.id}
                    >
                        <div className="card-body">
                          <div className="d-flex flex-row">
                            <div className="card-title">
                                {`${deck.name}`}
                            </div>
                            <div className="card-subtitle">
                                {`${deck.cards.length} cards`}
                            </div>
                          </div>
                           
                            <div className="card-text">
                                {`${deck.description}`}
                            </div>
                          <div className="d-flex flex-row">
                            <Link
                                className="button-view"
                                to={`/decks/${deck.id}`}
                            >
                                View
                            </Link>
                            <Link
                                className="button-study"
                                to={`/decks/${deck.id}/study`}
                            >
                                Study
                            </Link>
                            <button
                                className="button-delete"
                                onClick={() => handleDelete(deck)}
                            >
                                Delete
                            </button>
                          </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);
}

export default Home