import { combineReducers, type Reducer } from 'redux';
import { initialState as localizationState } from './localizations/slices/LocalizationSliceModels';
import { initialState as networkModelState } from '../src/components/NetworkModel/slice/NetworkModelSliceModel';


export const initialState = {
    localization: localizationState,
    networkModel: networkModelState
}

export type RootStoreType = typeof initialState;


export const createRootReducer = (): Reducer<RootStoreType> => combineReducers<RootStoreType>({
    localization: localizationState,
    networkModel: networkModelState
});
