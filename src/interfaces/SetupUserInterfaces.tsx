import * as firebase from "firebase";

export interface NewPlaceFormProps {
  onSubmitCallback: (event: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  shouldWarn: boolean;
}

export interface PlacesSetProps {
  data: string[];
  onClickCallback: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface SetupUserProps {
  firebaseRef: firebase.database.Reference;
  uid: string;
}

export interface SetupUserState {
  places: string[];
  newPlaceName: string;
}
