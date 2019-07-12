import * as React from "react";
import {
  SetupUserProps,
  SetupUserState,
  PlacesSetProps,
  NewPlaceFormProps
} from "../interfaces/SetupUserInterfaces";
import { TargetsDefault } from "../type_definitions";
import {
  PlacesSetContainer,
  PlaceButton
} from "../styled_components/SetupUser-component-styles";

function PlacesSet(props: PlacesSetProps) {
  const placesButtons = props.data.map(placeString => (
    <PlaceButton
      className="btn btn-secondary"
      id={placeString}
      key={placeString}
      onClick={props.onClickCallback}
      value={placeString}
    >
      {placeString}
    </PlaceButton>
  ));
  return <PlacesSetContainer>{placesButtons}</PlacesSetContainer>;
}

function NewPlaceForm(props: NewPlaceFormProps) {
  const { inputValue, onSubmitCallback, onInputChange, shouldWarn } = props;
  return (
    <form onSubmit={onSubmitCallback} className="form-inline">
      <div className="form-group mb-2">
        <input
          className="form-control"
          type="text"
          placeholder="new place name"
          onChange={onInputChange}
          value={inputValue}
          style={{ color: shouldWarn ? "red" : "black" }}
        />
      </div>
      <button type="submit" className="btn btn-primary mb-2">
        Save
      </button>
    </form>
  );
}

export default class SetupUser extends React.Component<
  SetupUserProps,
  Partial<SetupUserState>
> {
  readonly state = { places: [], newPlaceName: "" };

  async loadPlaces() {
    try {
      await this.props.firebaseRef.child("places/").on("value", snapshot => {
        this.setState({
          places: Object.keys(snapshot.val()).map(key => key)
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveNewPlaceToDb(newPlaceName: string) {
    const places: string[] = this.state.places;
    const { firebaseRef } = this.props;
    try {
      if (!places.includes(newPlaceName)) {
        const date = new Date();
        const monthVal = date.getMonth() + 1;
        firebaseRef
          .child(`places/${newPlaceName}/${date.getFullYear()}/`)
          .set({ [monthVal]: TargetsDefault });
        this.setState({
          newPlaceName: ""
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async savePlaceToUser(place: string, uid: string) {
    console.log(`savePlaceToUser place ${place}, user ${uid}`);
    try {
      this.props.firebaseRef.child(`users/${uid}/`).set({ place: place });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    this.loadPlaces();
  }

  componentWillUnmount() {
    this.props.firebaseRef.off();
    this.props.firebaseRef.child("places/").off();
  }

  placeSelected = (e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    this.savePlaceToUser(target.value, this.props.uid);
  };

  addNewPlace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.saveNewPlaceToDb(this.state.newPlaceName);
  };

  newPlaceOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newPlaceName: e.target.value
    });
  };

  render() {
    const places: string[] = this.state.places;
    const { newPlaceName } = this.state;
    return (
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Select your place</h2>
        <PlacesSet onClickCallback={this.placeSelected} data={places} />
        <NewPlaceForm
          inputValue={newPlaceName}
          onSubmitCallback={this.addNewPlace}
          onInputChange={this.newPlaceOnChange}
          shouldWarn={places.includes(newPlaceName)}
        />
      </div>
    );
  }
}
