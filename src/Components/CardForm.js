// CardForm.js

import React from 'react';

const CardForm = ({ handleSubmit, handleChange, handleDone, handleCancel, formMode, card }) => {
  const isEditMode = formMode === 'edit';

  return (
    <form name={isEditMode ? 'editCard' : 'addCard'} onSubmit={handleSubmit}>
      <label htmlFor="front">Front</label>
      <textarea
        id="front"
        name="front"
        value={isEditMode ? card.front : ''}
        onChange={handleChange}
        placeholder="Front side of card"
        required
      />
      <label htmlFor="back">Back</label>
      <textarea
        id="back"
        name="back"
        value={isEditMode ? card.back : ''}
        onChange={handleChange}
        placeholder="Back side of card"
        required
      />
      {isEditMode ? (
        <div>
          <button className="button-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="button-save">Save</button>
        </div>
      ) : (
        <div>
          <button className="button-done" onClick={handleDone}>
            Done
          </button>
          <button className="button-save">Save</button>
        </div>
      )}
    </form>
  );
};

export default CardForm;
