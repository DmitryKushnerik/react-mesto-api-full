function PopupWithForm({ name, isOpen, title, children, buttonText, onClose, onSubmit }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen && 'popup_is-opened'}`}>
      <form className="popup__form" name={name} onSubmit={onSubmit}>
        <h2 className="popup__title">{title}</h2>
        <fieldset className="popup__fieldset">
          {children}
        </fieldset>
        <button type="submit" className={`popup__button popup__button_value_${name}`}>{buttonText}</button>
        <button type="button" className="popup__close interactive-item" onClick={onClose}></button>
      </form>
    </div>
  );
}

export default PopupWithForm;