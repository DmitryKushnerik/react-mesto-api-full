import actionSuccess from '../images/actionSuccess.svg'
import actionFail from '../images/actionFail.svg'

function InfoTooltip({ success, message, isOpen, onClose }) {
  return (
    <div className={`popup popup-infotooltip ${isOpen && 'popup_is-opened'}`}>
      <div className="popup__form infotooltip">
        <img className="infotooltip__image" alt={success ? 'Действие выполнено' : 'Произошла ошибка'} src={success ? actionSuccess : actionFail} />
        <h2 className="infotooltip__text">{message}</h2>
        <button type="button" className="popup__close interactive-item" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default InfoTooltip;