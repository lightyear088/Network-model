import { loadLanguageFromLocalStorage } from "../localizationService";

export const initialState = {
    language: loadLanguageFromLocalStorage(),
};

export type DeviceListStateType = typeof initialState;
