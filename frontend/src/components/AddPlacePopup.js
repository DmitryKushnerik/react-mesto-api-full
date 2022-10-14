import { useState } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
  const [cardName, setCardName] = useState('');
  const [cardLink, setCardLink] = useState('');

  function handleCardNameChange(evt) {
    setCardName(evt.target.value)
  }

  function handleCardLinkChange(evt) {
    setCardLink(evt.target.value)
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({
      name: cardName,
      link: cardLink
    });
  }

  return (
    <PopupWithForm name="place" title="Новое место" buttonText={isLoading ? 'Сохранение...' : 'Создать'} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <div className="popup__input-group">
        <input type="text" placeholder="Название" className="popup__input popup__input_value_place" id="place-input"
          name="name" required minLength="2" maxLength="30" value={cardName || ''} onChange={handleCardNameChange} />
        <span className="popup__error place-input-error"></span>
      </div>
      <div className="popup__input-group">
        <input type="url" placeholder="Ссылка на картинку" className="popup__input popup__input_value_link"
          id="url-input" name="link" required value={cardLink || ''} onChange={handleCardLinkChange} />
        <span className="popup__error url-input-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default AddPlacePopup;