export interface Activity {
    id: string;
    from: number;
    to: number;
    duration: number;
}

export interface ActivityResult extends Activity {
    earlyStart: number;
    earlyFinish: number;
    lateStart: number;
    lateFinish: number;
    totalFloat: number;
    freeFloat: number;
    independentFloat: number;
    guaranteedFloat: number;
    isCritical: boolean;
}

export interface NetworkModelState {
    activities: Activity[];
    results: ActivityResult[];
    criticalPath: number[];
    projectDuration: number;
    isLoading: boolean;
    error: string | null;
}

export const initialState: NetworkModelState = {
    activities: [],
    results: [],
    criticalPath: [],
    projectDuration: 0,
    isLoading: false,
    error: null,
};