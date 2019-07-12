import * as React from "react";

import {
  ILoginComponentState,
  ILoginComponentProps
} from "../interfaces/LoginInterfaces";

export default class LoginComponent extends React.Component<
  ILoginComponentProps,
  Partial<ILoginComponentState>
> {
  readonly state = {
    email: "",
    password: "",
    wrongCredentialsMessage: ""
  };

  async logInWithEmailAndPassword(email: string, password: string) {
    try {
      const authentication = await this.props.firebaseAuth.signInWithEmailAndPassword(
        email,
        password
      );
      if (authentication !== null) {
        this.setState({
          wrongCredentialsMessage: ""
        });
        this.props.loggedInHandler(authentication.user!.uid);
      }
    } catch (error) {
      var errorMessage = error.message;
      this.setState({
        wrongCredentialsMessage: errorMessage
      });
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const authentication = await this.props.firebaseAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (authentication !== null) {
        this.setState({
          wrongCredentialsMessage: ""
        });
        this.props.loggedInHandler(authentication.user!.uid);
      }
    } catch (error) {
      var errorMessage = error.message;
      this.setState({
        wrongCredentialsMessage: errorMessage
      });
    }
  }

  loginButtonClicked = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.logInWithEmailAndPassword(this.state.email, this.state.password);
  };

  signInButtonClicked = (e: React.MouseEvent) => {
    e.preventDefault();
    this.signInWithEmailAndPassword(this.state.email, this.state.password);
  };

  emailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value
    });
  };

  passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value
    });
  };

  render() {
    return (
      <div className="container">
        <br />
        <form onSubmit={this.loginButtonClicked}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                onChange={this.emailOnChange}
                value={this.state.email}
                placeholder="enter email"
              />
            </div>
            <div className="form-group col-md-6">
              <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                onChange={this.passwordOnChange}
                value={this.state.password}
                placeholder="enter password"
              />
            </div>
          </div>
          {this.state.wrongCredentialsMessage ? (
            <div className="alert alert-danger" role="alert">
              {this.state.wrongCredentialsMessage}
            </div>
          ) : null}
          <button className="btn btn-primary">Log In</button>
        </form>
        <br />
        <p>
          Don't have account yet?{" "}
          <button
            className="btn btn-secondary btn-sm"
            onClick={this.signInButtonClicked}
          >
            Sign in
          </button>
        </p>
      </div>
    );
  }
}
