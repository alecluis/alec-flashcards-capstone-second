/*The Study screen has the following features:

The path to this screen should include the deckId (i.e., /decks/:deckId/study).
You must use the readDeck() function from src/utils/api/index.js to load the deck that is being studied.
There is a breadcrumb navigation bar with links to home /, followed by the name of the deck being studied, and finally the text Study (e.g., Home/Rendering In React/Study).
The deck title (i.e., "Study: Rendering in React" ) is shown on the screen.
Cards are shown one at a time, front-side first.
A button at the bottom of each card "flips" it to the other side.
After flipping the card, the screen shows a Next button (see the Next button section below) to continue to the next card.
After the final card in the deck has been shown, a message (see the Restart prompt section below) is shown offering the user the opportunity to restart the deck.
If the user does not restart the deck, they should return to the home screen.
Studying a deck with two or fewer cards should display a "Not enough cards" message (see the "Not enough cards" section below) and a button to add cards to the deck.
Next button
The Next button appears after the card is flipped.
Restart prompt
When all cards are finished, a message is shown and the user is offered the opportunity to restart the deck. If the user does not restart the deck, they return to the home screen.

You can use window.confirm() to create the modal dialog shown in the screenshot below.
Not enough cards
Studying a Deck with two or fewer cards should display a "Not enough cards" message and a button to add cards to the deck.
Clicking the Add Cards button should take the user to the Add Card screen.*/


//Study.js*/

import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck } from "../utils/api/index.js";

function Study() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [cardNumber, setCardNumber] = useState(1);
    const [front, isFront] = useState(true);
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            const abortController = new AbortController();
            const response = await readDeck(deckId, abortController.signal);
            setDeck(response);
            setCards(response.cards);
            return () => {
                abortController.abort();
            };
        }
        fetchData();
    }, []);

    function nextCard(index, total) {
        console.log(index);
        if (index < total) {
            setCardNumber(cardNumber + 1);
            isFront(true);
        } else {
            if (
                window.confirm(
                    `Restart cards? Click 'cancel' to return to the home page`
                )
            ) {
                setCardNumber(1);
                isFront(true);
            } else {
                history.push("/");
            }
        }
    }

    function flipCard() {
        if (front) {
            isFront(false);
        } else {
            isFront(true);
        }
    }

    function showNextButton(cards, index) {
        if (front) {
            return null;
        } else {
            return (
                <button className="button-next"
                    onClick={() => nextCard(index + 1, cards.length)}
                >
                    Next
                </button>
            );
        }
    }

    function enoughCards() {
        return (
            <div className="card">
                {cards.map((card, index) => {
                    if (index === cardNumber - 1) {
                        return (
                            <div className="card-body" key={card.id}>
                                <div className="card-title">
                                    {`Card ${index + 1} of ${cards.length}`}
                                </div>
                                <div className="card-text">
                                    {front ? card.front : card.back}
                                </div>
                                <button className="button-flip"
                                    onClick={flipCard}
                                >
                                    Flip
                                </button>
                                {showNextButton(cards, index)}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }

    function notEnoughCards() {
        return (
            <div className="not-enough-cards">
                <h2>Not enough cards.</h2>
                <p>
                    You need at least 3 cards to study. There are {cards.length}{" "}
                    card(s) in this deck.
                </p>
                <Link
                    to={`/decks/${deck.id}/cards/new`}
                    className="button-addcards">
                    Add Cards
                </Link>
            </div>
        );
    }

    return (
        <div className="study">
        <nav>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </li>
                <li className="breadcrumb-item active">Study</li>
            </ol>
        </nav>
            <div>
                <h2>Study: {deck.name}</h2>
                <div>
                    {cards.length === 0
                        ? notEnoughCards()
                        : cards.length > 2
                        ? enoughCards()
                        : notEnoughCards()}
                </div>
            </div>
        </div>
    );
}

export default Study;