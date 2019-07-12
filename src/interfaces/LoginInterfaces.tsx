import * as firebase from "firebase";

export interface ILoginComponentState {
  email: string;
  password: string;
  wrongCredentialsMessage: string;
}

export interface ILoginComponentProps {
  firebaseAuth: firebase.auth.Auth;
  loggedInHandler: Function;
}
