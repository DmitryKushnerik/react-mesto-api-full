import React from "react";
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from "../contexts/AuthUserContext";

class Login extends React.Component {
  static contextType = AuthUserContext;
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    const { name, value } = evt.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(evt) {
    const value = this.context;
    evt.preventDefault();
    value.handleLogin(this.state.email, this.state.password, this);
  }


  render() {
    return (
      <div className="authorisation">
        <form className="authorisation__form" onSubmit={this.handleSubmit}>
          <div className="authorisation__block">
            <h2 className="authorisation__title">Вход</h2>
            <input type="email" className="authorisation__input" id="email" name="email"
              placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
            <input type="password" className="authorisation__input" id="password" name="password"
              placeholder="Пароль" value={this.state.password} onChange={this.handleChange} required />
          </div>
          <div className="authorisation__block">
            <button type="submit" className="authorisation__button" name="login__button">Войти</button>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(Login);