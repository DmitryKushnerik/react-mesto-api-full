import { useContext } from "react";
import { currentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(currentUserContext);

  const isOwn = (card.owner === currentUser._id);
  const cardDeleteButtonClassName = `card__delete-button ${!isOwn && 'card__delete-button_hidden'}`;

  const isLiked = card.likes.some(like => like._id === currentUser._id);
  const cardLikeButtonClassName = `card__like-button ${isLiked && 'card__like-button_active'}`;

  //Обработчик клика на изображение
  function handleClick() {
    onCardClick(card);
  }

  //Обработчик нажатия на лайк 
  function handleLikeClick() {
    onCardLike(card);
  }

  //Удаление карточки
  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img className="card__image" src={card.link} onClick={handleClick} alt="Заготовка карточки" />
      <div className="card__info">
        <h2 className="card__caption">{card.name}</h2>
        <div className="card__like-group">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
      </div>
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
    </li>
  );
}

export default Card;