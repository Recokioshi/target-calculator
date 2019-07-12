export function getTargetWithName(
  name: string,
  today: number,
  done: number,
  total: number
): Target {
  return {
    name: name,
    today: today,
    done: done,
    total: total
  };
}

function getDefaultTargetwitnName(name: string): Target {
  return getTargetWithName(name, 0, 0, 0);
}

export let TargetsDefault: Targets = {};

[
  "VOICE MASS",
  "WART MASS",
  "UTRZ MASS/DOSP",
  "VOICE BIZNES",
  "WART BIZNES",
  "UTRZ BIZ/DOSP",
  "FBB TOTAL",
  "FBB WART",
  "LTE",
  "VDSL",
  "FTTH",
  "TV TOTAL",
  "TV WART",
  "NC+",
  "oLove",
  "OL wartość"
].forEach((key, index) => {
  TargetsDefault[index] = getDefaultTargetwitnName(key);
});

export const STATE = {
  INIT: 0,
  CHECKING_USER: 10,
  USER_NOT_LOGGED: 20,
  USER_LOGGED: 30,
  LOADING_RESULTS: 40,
  RESULTS_LOADED: 50,
  FAILED_LOADING_RESULTS: 60
};

export interface Targets {
  [key: string]: Target;
}

export interface Target {
  name: string;
  today: number;
  done: number;
  total: number;
}
