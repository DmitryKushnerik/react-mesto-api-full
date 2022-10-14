function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup-show ${card && 'popup_is-opened'}`}>
      <div className="gallery">
        <img className="gallery__image" alt={card ? card.name : 'Увеличенное изображение'} src={card ? card.link : ''} />
        <h2 className="gallery__title">{card ? card.name : 'Просмотр изображения'}</h2>
        <button type="button" className="popup__close interactive-item" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default ImagePopup;