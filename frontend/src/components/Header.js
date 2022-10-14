import { useState, useEffect, useContext } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import { AuthUserContext } from '../contexts/AuthUserContext';

function Header({ onLogout }) {
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 640);
  const [mobileInfo, setMobileInfo] = useState(false);
  const value = useContext(AuthUserContext);

  function handleShowMobileInfo() {
    setMobileInfo(!mobileInfo);
  }

  function handleResize() {
    setMobileMode(window.innerWidth < 640);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mobileMode) {
      setMobileInfo(false);
    }
  }, [mobileMode])

  return (
    <header className="header">
      <div className={`header__mobile-info ${mobileInfo && 'header__mobile-info_active'}`}>
        <div className="header__text header__text_type_email">{value.userEmail}</div>
        <button type="button" className='header__text header__text_type_logout interactive-item' onClick={onLogout}>Выйти</button>
      </div>
      <div className='header__info'>
        <img src={logo} alt="Логотип Mesto Russia" className="header__logo" />
        <nav className="header__text-container">
          <Switch>
            <Route path="/sign-in">
              <Link to="/sign-up" className="header__text interactive-item">Регистрация</Link>
            </Route>
            <Route path="/sign-up">
              <Link to="/sign-in" className="header__text interactive-item">Войти</Link>
            </Route>
            <Route path="/">
              {mobileMode ? <button type="button" className={`header__mobile-button interactive-item ${mobileInfo && 'header__mobile-button_active'}`} onClick={handleShowMobileInfo} />
                : <><div className="header__text header__text_type_email">{value.userEmail}</div>
                  <button type="button" className='header__text header__text_type_logout interactive-item' onClick={onLogout}>Выйти</button></>}
            </Route>
          </Switch>
        </nav>
      </div>
    </header>
  );
}

export default Header;
