import { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { currentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const currentUser = useContext(currentUserContext);

  function handleNameChange(evt) {
    setName(evt.target.value)
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value)
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm name="profile" title="Редактировать профиль" buttonText={isLoading ? 'Сохранение...' : 'Сохранить'} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <div className="popup__input-group">
        <input type="text" placeholder="Имя" className="popup__input popup__input_value_name" id="name-input"
          name="name" required minLength="2" maxLength="40" value={name || ''} onChange={handleNameChange} />
        <span className="popup__error name-input-error"></span>
      </div>
      <div className="popup__input-group">
        <input type="text" placeholder="О себе" className="popup__input popup__input_value_job" id="job-input"
          name="about" required minLength="2" maxLength="200" value={description || ''} onChange={handleDescriptionChange} />
        <span className="popup__error job-input-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default EditProfilePopup;