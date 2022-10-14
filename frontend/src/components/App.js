import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup';
import api from '../utils/Api.js';
import auth from '../utils/Auth.js';
import { currentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ConfirmationPopup from './ConfirmationPopup.js';
import InfoTooltip from './InfoTooltip.js';
import Register from './Register.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';
import { AuthUserContext } from '../contexts/AuthUserContext.js';

function App() {
  const [isEditProfilePopupOpened, setIsEditProfilePopupOpened] = useState(false);
  const [isAddPlacePopupOpened, setIsAddPlacePopupOpened] = useState(false);
  const [isEditAvatarPopupOpened, setIsEditAvatarPopupOpened] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const isAnyPopupOpened = isEditAvatarPopupOpened || isEditProfilePopupOpened || isAddPlacePopupOpened || selectedCard;
  const [loggedIn, setLoggedIn] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('E-Mail пользователя');
  const history = useHistory();
  const [isInfoTooltipOpened, setIsInfoTooltipOpened] = useState(false);
  const [infoTooltipMessage, setInfoTooltipMessage] = useState('');
  let token = "";

  //Работа с аватаром
  //Открытие попапа редактирования аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpened(true);
  }

  //Запрос на обновление аватара
  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.setUserAvatar(avatar)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(`Не удалось обновить данные о пользователе. ${err}`))
      .finally(() => setIsLoading(false));
  }

  //Работа с данными о пользователе
  //Открытие попапа редактирования данных о пользователе
  function handleEditProfileClick() {
    setIsEditProfilePopupOpened(true);
  }

  //Запрос на обновление данных о пользователе
  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api.setUserInfo({ name, about })
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(`Не удалось обновить данные о пользователе. ${err}`))
      .finally(() => setIsLoading(false));
  }

  //Работа с карточками
  //Открытие попапа добавления карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpened(true);
  }

  //Запрос на добавление карточки
  function handleAddPlace(newCard) {
    setIsLoading(true);
    api.addNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Не удалось добавить карточку. ${err}`))
      .finally(() => setIsLoading(false));
  }

  //Открытие просмотра увеличенного изображения
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  //Лайк / дизлайк
  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => console.log(`Произошла ${err}`));
  }

  //Удаление карточки
  function handleCardDelete(card) {
    const isOwn = (card.owner._id === currentUser._id);
    if (isOwn) {
      api.deleteCard(card._id)
        .then(() => setCards((state) => state.filter((item) => item._id !== card._id)))
        .catch((err) => console.log(`Произошла ${err}`));
    }
  }

  //Закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpened(false);
    setIsEditProfilePopupOpened(false);
    setIsAddPlacePopupOpened(false);
    setSelectedCard(null);
    setIsInfoTooltipOpened(false);
  }

  //Закрытие при нажатии "Escape"
  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    if (isAnyPopupOpened) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isAnyPopupOpened])

  //Проверка токена
  function checkToken() {
    token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then((res) => {
          setLoggedIn(true);
          setUserEmail(res.data.email);
          history.push('/');
        })
        .catch((err) => console.log(err));
    }
  }

  //Открытие infoTooltip
  function showInfoTooltip({ state, message }) {
    setRegisterSuccess(state);
    setInfoTooltipMessage(message);
    setIsInfoTooltipOpened(true);
  }

  //Регистрация пользователя
  function handleRegister(email, password) {
    let registerState = {};
    auth.register(email, password)
      .then((res) => {
        registerState = ({
          state: true,
          message: 'Вы успешно зарегистрировались!'
        });
        history.push('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        registerState = ({
          state: false,
          message: 'Что-то пошло не так! Попробуйте ещё раз.'
        });
      })
      .finally(() => showInfoTooltip(registerState));
  };

  //Вход в систему
  function handleLogin(email, password, object) {
    console.log(email + '/' + password)
    auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          object.setState({ email: '', password: '' }, () => {
            setUserEmail(email);
            setLoggedIn(true);
            history.push('/');
          })
        }
      })
      .catch(err => {
        console.log(err);
        showInfoTooltip({
          state: false,
          message: 'Что-то пошло не так! Попробуйте ещё раз.'
        });
      });
  }

  //Выход из системы
  function handleLogOut() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push("/sign-in")
  }

  //При загрузке страницы
  useEffect(() => {
    checkToken();

    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, initialCards]) => {
          setCurrentUser(userInfo);
          setCards(initialCards);
        })
        .catch((err) => console.log(`Не удалось выполнить запрос. ${err}`));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <AuthUserContext.Provider value={{ userEmail: userEmail, loggedIn: loggedIn, handleLogin: handleLogin, handleRegister: handleRegister, showInfoTooltip: showInfoTooltip }}>
      <currentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="container">
            <Header userEmail={userEmail} onLogout={handleLogOut} />
            <Switch>
              <Route path="/sign-in">
                <Login />
              </Route>
              <Route path="/sign-up">
                <Register />
              </Route>
              <ProtectedRoute
                path='/'
                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                card={selectedCard}
                onCardClick={handleCardClick}
              />
              <Route>
                {loggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <Redirect to="/sign-in" />
                )}
              </Route>
            </Switch>
            {loggedIn && <Footer />}

            {/* Попап редактирования профиля */}
            <EditProfilePopup isOpen={isEditProfilePopupOpened} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} />

            {/* Попап добавления карточки */}
            <AddPlacePopup isOpen={isAddPlacePopupOpened} onClose={closeAllPopups} onAddPlace={handleAddPlace} isLoading={isLoading} />

            {/* Попап редактирования аватара */}
            <EditAvatarPopup isOpen={isEditAvatarPopupOpened} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />

            {/* Попап подтверждения удаления */}
            <ConfirmationPopup />

            {/* Попап просмотра изображения */}
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />

            {/* Попап состояния регистрации */}
            <InfoTooltip success={registerSuccess} message={infoTooltipMessage} isOpen={isInfoTooltipOpened} onClose={closeAllPopups} />
          </div>
        </div>
      </currentUserContext.Provider>
    </AuthUserContext.Provider>
  );
}

export default App;
