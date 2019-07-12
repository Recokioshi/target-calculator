import { Targets } from "../type_definitions";

export interface IAppState {
  targets: Targets;
  place: string;
  authorized: Boolean;
  state: number;
  uid: string;
}
