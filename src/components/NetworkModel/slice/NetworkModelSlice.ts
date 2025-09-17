import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../../root/rootStore";
import { initialState, type Activity, type ActivityResult } from "./NetworkModelSliceModel";

const networkModelSlice = createSlice({
    name: "networkModelSlice",
    initialState,
    reducers: {
        setActivities: (state, action: PayloadAction<Activity[]>) => {
            state.activities = action.payload;
        },

        setResults: (state, action: PayloadAction<ActivityResult[]>) => {
            state.results = action.payload;
        },

        setCriticalPath: (state, action: PayloadAction<number[]>) => {
            state.criticalPath = action.payload;
        },

        setProjectDuration: (state, action: PayloadAction<number>) => {
            state.projectDuration = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        calculateNetworkModel: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        calculateNetworkModelSuccess: (state, action: PayloadAction<{
            results: ActivityResult[];
            criticalPath: number[];
            projectDuration: number;
        }>) => {
            state.results = action.payload.results;
            state.criticalPath = action.payload.criticalPath;
            state.projectDuration = action.payload.projectDuration;
            state.isLoading = false;
        },

        calculateNetworkModelFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        resetNetworkModel: (state) => {
            state.activities = [];
            state.results = [];
            state.criticalPath = [];
            state.projectDuration = 0;
            state.error = null;
            state.isLoading = false;
        },
    },
});

export const {
    setActivities,
    setResults,
    setCriticalPath,
    setProjectDuration,
    setLoading,
    setError,
    calculateNetworkModel,
    calculateNetworkModelSuccess,
    calculateNetworkModelFailure,
    resetNetworkModel,
} = networkModelSlice.actions;

// Selectors
export const selectActivities = (state: RootState): Activity[] => state.networkModel.activities;
export const selectResults = (state: RootState): ActivityResult[] => state.networkModel.results;
export const selectCriticalPath = (state: RootState): number[] => state.networkModel.criticalPath;
export const selectProjectDuration = (state: RootState): number => state.networkModel.projectDuration;
export const selectIsLoading = (state: RootState): boolean => state.networkModel.isLoading;
export const selectError = (state: RootState): string | null => state.networkModel.error;

export default networkModelSlice.reducer;