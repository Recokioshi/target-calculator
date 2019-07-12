import * as React from "react";
import { Target, Targets } from "../type_definitions";

export interface TargetsProps {
  targets: Targets;
  onTargetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TargetsComponentProps {
  refreshDatabase: Function;
  logoutHandler: Function;
  place: string;
  targets: Targets;
}

export interface TargetsComponentState {
  originalTargets: Targets;
  targets: Targets;
  place: string;
}

export interface TargetRowProps {
  index: string;
  target: Target;
  onTargetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TargetsLoaderProps {
  targetsLoaderChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
