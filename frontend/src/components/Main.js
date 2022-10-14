import { useContext } from 'react';
import Card from './Card';
import { currentUserContext } from '../contexts/CurrentUserContext';

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = useContext(currentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-group">
          <img src={currentUser.avatar} alt="Аватар пользователя" className="profile__avatar" />
          <div className="profile__avatar-overlay">
            <button className="profile__avatar-button" onClick={onEditAvatar}></button>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__caption">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" className="profile__edit-button interactive-item" onClick={onEditProfile}></button>
          </div>
          <p className="profile__job">{currentUser.about}</p>
        </div>
        <button type="button" className="profile__add-button interactive-item" onClick={onAddPlace}></button>
      </section>
      <section className="photo-grid">
        <ul className="elements">
          {cards.map((card) => (
            <Card card={card} key={card._id} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />
          ))}
        </ul>
      </section>
    </main >
  );
}

export default Main;
