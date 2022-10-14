import { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const avatarLinkRef = useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarLinkRef.current.value
    });
  }

  return (
    <PopupWithForm name="avatar" title="Обновить аватар" buttonText={isLoading ? 'Сохранение...' : 'Сохранить'} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <div className="popup__input-group">
        <input type="url" placeholder="Ссылка на аватар" className="popup__input popup__input_value_avatar"
          id="avatar-input" name="avatar" required ref={avatarLinkRef} />
        <span className="popup__error avatar-input-error"></span>
      </div>
    </PopupWithForm>)
}

export default EditAvatarPopup;