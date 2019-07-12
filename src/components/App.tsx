import * as React from "react";
import firebase from "../config";

import LoginComponent from "./Login-component";
import TargetsComponent from "./Targets-component";
import SetupUser from "./SetupUser-component";
import Menu from "./Menu-component";

import ReactLoading from "react-loading";

import { IAppState } from "../interfaces/AppInterfaces";
import { STATE, Targets, TargetsDefault } from "../type_definitions";

import { MainDiv } from "../styled_components/App-component-styles";

class App extends React.Component<{}, IAppState> {
  unsubscribeMethod = () => {};

  constructor(props: {}) {
    super(props);

    this.logOut = this.logOut.bind(this);
    this.removePlaceFromUser = this.removePlaceFromUser.bind(this);

    this.state = {
      targets: {},
      place: "",
      uid: "",
      authorized: false,
      state: STATE.INIT
    };
    this.refreshDatabse = this.refreshDatabse.bind(this);
  }

  unsubscribeFirebaseListeners = () => {
    const date = new Date();
    const { uid, place } = this.state;
    firebase
      .database()
      .ref(`users/${uid}/`)
      .off();
    firebase
      .database()
      .ref(`places/${place}/${date.getFullYear()}/${date.getMonth() + 1}/`)
      .off();
  };

  componentDidMount() {
    this.unsubscribeMethod = this.initializeFirebaseAndLoggedUser();
  }

  componentWillUnmount() {
    //this.unsubscribeMethod();
    //this.unsubscribeFirebaseListeners();
  }

  initializeFirebaseAndLoggedUser() {
    this.setState({
      state: STATE.CHECKING_USER
    });
    return firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        this.refreshLoggedInUser(user);
      } else {
        this.setState({
          state: STATE.USER_NOT_LOGGED
        });
      }
    });
  }

  refreshLoggedInUser = (user: firebase.User) => {
    this.setState({
      authorized: true,
      uid: user.uid,
      state: STATE.USER_LOGGED
    });
    this.loadTarget(user.uid);
  };

  async logOut(e: React.FormEvent<HTMLButtonElement>) {
    console.log("logOut");
    try {
      firebase.auth().signOut();
      console.log(`sign out successfully`);
      this.unsubscribeFirebaseListeners();
      this.setState({
        authorized: false,
        uid: "",
        place: ""
      });
    } catch (error) {
      console.log(`error ${error.message}`);
    }
  }

  async removePlaceFromUser(e: React.FormEvent<HTMLButtonElement>) {
    const { uid } = this.state;
    try {
      const ref = firebase.database().ref(`users/${uid}/`);
      ref.set({ place: "" });
    } catch (error) {
      console.log(error.message);
    }
  }

  async loadTarget(uid: string) {
    try {
      this.setState({
        state: STATE.LOADING_RESULTS
      });
      await firebase
        .database()
        .ref(`users/${uid}/`)
        .on("value", snapshotUser => {
          const userData = snapshotUser.val();
          if (userData === null) {
            this.setState({
              state: STATE.FAILED_LOADING_RESULTS
            });
          } else {
            const place = userData.place;
            if (place === null || place === "") {
              this.setState({
                state: STATE.FAILED_LOADING_RESULTS
              });
            } else {
              const date = new Date();
              firebase
                .database()
                .ref(
                  `places/${place}/${date.getFullYear()}/${date.getMonth() +
                    1}/`
                )
                .on("value", snapshotTargets => {
                  const targetsForMonth = snapshotTargets.val();
                  if (targetsForMonth === null) {
                    const monthVal = date.getMonth() + 1;
                    firebase
                      .database()
                      .ref(`places/${place}/${date.getFullYear()}/`)
                      .set({ [monthVal]: TargetsDefault });
                  }
                  this.setState({
                    targets: targetsForMonth,
                    place: place,
                    state: STATE.RESULTS_LOADED
                  });
                });
            }
          }
        });
    } catch (error) {
      console.log(`error occured while loadPlaceForUser ${error.message}`);
      this.setState({
        state: STATE.FAILED_LOADING_RESULTS
      });
    }
  }

  async refreshDatabse(targets: Targets) {
    const date = new Date();
    const { place } = this.state;
    try {
      await firebase
        .database()
        .ref(`places/${place}/${date.getFullYear()}/${date.getMonth() + 1}/`)
        .set(targets);
      alert("New targets saved. Refresh page to start new day");
    } catch (error) {
      console.log(`error occured while refreshDatabse ${error.message}`);
    }
  }

  loggedInSuccessfully = (uid: string) => {
    this.setState({
      authorized: true,
      uid: uid
    });
    this.loadTarget(uid);
  };

  render() {
    const { targets, place, state, uid } = this.state;
    let mainComponent = null;
    switch (state) {
      case STATE.INIT:
      case STATE.CHECKING_USER:
      case STATE.USER_LOGGED:
      case STATE.LOADING_RESULTS:
        mainComponent = (
          <ReactLoading
            type={"spin"}
            color={"#4287f5"}
            height={"10%"}
            width={"10%"}
          />
        );
        break;
      case STATE.USER_NOT_LOGGED:
        mainComponent = (
          <MainDiv className="container">
            <LoginComponent
              loggedInHandler={this.loggedInSuccessfully}
              firebaseAuth={firebase.auth()}
            />
          </MainDiv>
        );
        break;
      case STATE.RESULTS_LOADED:
        mainComponent = (
          <div>
            <Menu
              handleExitPlace={this.removePlaceFromUser}
              handleLogOut={this.logOut}
            />
            <MainDiv className="container">
              <TargetsComponent
                targets={targets}
                place={place}
                logoutHandler={this.logOut}
                refreshDatabase={this.refreshDatabse}
              />
            </MainDiv>
          </div>
        );
        break;
      case STATE.FAILED_LOADING_RESULTS:
        mainComponent = (
          <MainDiv className="container">
            <SetupUser firebaseRef={firebase.database().ref()} uid={uid} />
          </MainDiv>
        );
        break;
      default:
        mainComponent = <p>Error occured...</p>;
    }

    return mainComponent;
  }
}

export default App;
