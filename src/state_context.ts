import React from "react";
import { State } from "patchkit-generic-patcher2_foundation";

export const StateContext =
  React.createContext<State | undefined>(undefined);
