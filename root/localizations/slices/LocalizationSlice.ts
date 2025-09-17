import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { LanguageListEnum } from '../localizationModels';
import { initialState } from './LocalizationSliceModels';
import type { RootStoreType } from '../../rootReducer';



const localizationSlice = createSlice({
    name: 'localizationSlice',
    initialState: initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<LanguageListEnum>) => { state.language = action.payload; },
    }
});

export const {
    setLanguage
} = localizationSlice.actions;

//selectors
export const getLanguage = (store: RootStoreType): LanguageListEnum => store.localization.language;

export default localizationSlice.reducer;
