import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmationPopup() {

  return (
    <PopupWithForm name="confirmation" title="Вы уверены?" buttonText="Да" />
  )
}

export default ConfirmationPopup;