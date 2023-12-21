/*The Create Deck screen has the following features:

The path to this screen should be /decks/new.
There is a breadcrumb navigation bar with a link to home / followed by the text Create Deck (i.e., Home/Create Deck).
A form is shown with the appropriate fields for creating a new deck.
The name field is an <input> field of type text.
The description field is a <textarea> field that can be multiple lines of text.
If the user clicks Submit, the user is taken to the Deck screen.
If the user clicks Cancel, the user is taken to the Home screen.*/

//CreateDeck.js

import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createDeck } from "../utils/api/index";

function CreateDeck() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = ({target}) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController()
    try {
      const createdDeck = await createDeck({...formData }, abortController.signal);
      history.push("/");
      return createdDeck
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  const handleCancel = async() => {
    history.push("/")
  }
  return (
    <div className="createdeck">
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Create Deck</li>
        </ol>
      </nav>
      <h1>Create Deck</h1>
      <form name="create" onSubmit={(event) => handleSubmit(event)}>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Deck Name"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the deck"
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
            <button className="button-cancel" onClick={() => handleCancel()}>Cancel</button>
            <button className="button-submit">Submit</button>
    </form>
    </div>
  );
}

export default CreateDeck;
