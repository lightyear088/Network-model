import { configureStore } from '@reduxjs/toolkit';
import localizationSlice from './localizations/slices/LocalizationSlice'
import networkModelSlice from '../src/components/NetworkModel/slice/NetworkModelSlice'

const store = configureStore({
    reducer: {
        localization: localizationSlice,
        networkModel: networkModelSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;