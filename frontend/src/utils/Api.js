class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  setToken() {
    const token = localStorage.getItem('token');
    this._headers["Authorization"] = `Bearer ${token}`;
  }

  getUserInfo() {
    this.setToken();
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
      .then((res) => this._getResponseData(res))
  }

  setUserInfo({ name, about }) {
    this.setToken();
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then((res) => this._getResponseData(res))
  }

  getInitialCards() {
    this.setToken();
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
      .then((res) => this._getResponseData(res))
  }

  addNewCard(item) {
    this.setToken();
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(item)
    })
      .then((res) => this._getResponseData(res))
  }

  deleteCard(cardId) {
    this.setToken();
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then((res) => this._getResponseData(res))
  }

  changeLikeCardStatus(cardId, newLike) {
    this.setToken();
    const method = newLike ? "PUT" : "DELETE";
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: method,
      headers: this._headers
    })
      .then((res) => this._getResponseData(res))
  }

  setUserAvatar(avatar) {
    this.setToken();
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(avatar)
    })
      .then((res) => this._getResponseData(res))
  }
}

const api = new Api({
  baseUrl: 'https://api.kushnerik.students.nomoredomains.icu',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;