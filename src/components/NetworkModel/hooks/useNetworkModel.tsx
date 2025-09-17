import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateNetworkModelFailure, calculateNetworkModelSuccess, resetNetworkModel, selectActivities, selectCriticalPath, selectError, selectIsLoading, selectProjectDuration, selectResults } from '../slice/NetworkModelSlice';
import type { Activity, ActivityResult } from '../slice/NetworkModelSliceModel';

export const useNetworkModel = () => {
    const dispatch = useDispatch();

    const activities = useSelector(selectActivities);
    const results = useSelector(selectResults);
    const criticalPath = useSelector(selectCriticalPath);
    const projectDuration = useSelector(selectProjectDuration);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    // Парсинг CSV данных
    // const parseCsvData = useCallback((csvContent: string): Activity[] => {
    //     const lines = csvContent.trim().split('\n');
    //     const activities: Activity[] = [];

    //     for (let i = 0; i < lines.length; i++) {
    //         const line = lines[i].replace(/"/g, '').split(',');
    //         if (line.length >= 3) {
    //             activities.push({
    //                 id: `A${i}`,
    //                 from: parseInt(line[0]),
    //                 to: parseInt(line[1]),
    //                 duration: parseInt(line[2])
    //             });
    //         }
    //     }

    //     return activities;
    // }, []);

    // Расчет ранних сроков (прямой проход)
    const calculateEarlyTimes = useCallback((activities: Activity[]): {
        earlyStart: number[],
        earlyFinish: number[]
    } => {
        const nodes = Math.max(...activities.flatMap(a => [a.from, a.to])) + 1;
        const earlyStart = new Array(nodes).fill(0);
        const earlyFinish: number[] = [];

        const sortedActivities = [...activities].sort((a, b) => a.from - b.from);

        for (const activity of sortedActivities) {
            const es = earlyStart[activity.from];
            const ef = es + activity.duration;
            earlyFinish[parseInt(activity.id.slice(1))] = ef;

            if (ef > earlyStart[activity.to]) {
                earlyStart[activity.to] = ef;
            }
        }

        return { earlyStart, earlyFinish };
    }, []);

    // Расчет поздних сроков (обратный проход)
    const calculateLateTimes = useCallback((
        activities: Activity[],
        earlyStart: number[],
        projectDuration: number
    ): { lateStart: number[], lateFinish: number[] } => {
        const nodes = earlyStart.length;
        const lateFinish = new Array(nodes).fill(projectDuration);
        const lateStart: number[] = [];

        const sortedActivities = [...activities].sort((a, b) => b.to - a.to);

        for (const activity of sortedActivities) {
            const lf = lateFinish[activity.to];
            const ls = lf - activity.duration;
            lateStart[parseInt(activity.id.slice(1))] = ls;

            if (ls < lateFinish[activity.from]) {
                lateFinish[activity.from] = ls;
            }
        }

        return { lateStart, lateFinish };
    }, []);

    // Расчет всех резервов
    const calculateAllReserves = useCallback((
        activities: Activity[],
        earlyStart: number[],
        earlyFinish: number[],
        lateStart: number[],
        lateFinish: number[]
    ): ActivityResult[] => {
        const results: ActivityResult[] = [];

        for (const activity of activities) {
            const index = parseInt(activity.id.slice(1));
            const es = earlyStart[activity.from];
            const ef = earlyFinish[index];
            const ls = lateStart[index];
            const lf = lateFinish[activity.to];

            const totalFloat = lf - ef;
            const freeFloat = Math.max(0, earlyStart[activity.to] - ef);
            const independentFloat = Math.max(0, Math.min(
                earlyStart[activity.to] - lateFinish[activity.from] - activity.duration,
                totalFloat
            ));
            const guaranteedFloat = Math.max(0, lateFinish[activity.to] - earlyStart[activity.from] - activity.duration);

            const isCritical = totalFloat === 0;

            results.push({
                ...activity,
                earlyStart: es,
                earlyFinish: ef,
                lateStart: ls,
                lateFinish: lf,
                totalFloat,
                freeFloat,
                independentFloat,
                guaranteedFloat,
                isCritical
            });
        }

        return results;
    }, []);

    // Определение критического пути
    const findCriticalPath = useCallback((results: ActivityResult[]): number[] => {
        const criticalNodes: number[] = [0];

        let currentNode = 0;
        while (true) {
            const criticalActivities = results.filter(a =>
                a.from === currentNode && a.isCritical
            );

            if (criticalActivities.length === 0) break;

            currentNode = criticalActivities[0].to;
            criticalNodes.push(currentNode);

            if (currentNode === Math.max(...results.map(r => r.to))) break;
        }

        return criticalNodes;
    }, []);

    // Основная функция расчета (теперь с dispatch)
    const calculateNetworkModel = useCallback(() => {
        try {




            const { earlyStart, earlyFinish } = calculateEarlyTimes(activities);
            const duration = Math.max(...earlyStart);

            const { lateStart, lateFinish } = calculateLateTimes(
                activities,
                earlyStart,
                duration
            );

            const calculatedResults = calculateAllReserves(
                activities,
                earlyStart,
                earlyFinish,
                lateStart,
                lateFinish
            );

            const criticalPath = findCriticalPath(calculatedResults);

            dispatch(calculateNetworkModelSuccess({
                results: calculatedResults,
                criticalPath,
                projectDuration: duration
            }));

        } catch (err) {
            dispatch(calculateNetworkModelFailure(
                err instanceof Error ? err.message : 'Произошла ошибка при расчете сетевой модели'
            ));
        }
    }, [calculateEarlyTimes, activities, calculateLateTimes, calculateAllReserves, findCriticalPath, dispatch]);

    // Функция сброса
    const reset = useCallback(() => {
        dispatch(resetNetworkModel());
    }, [dispatch]);

    return {
        activities,
        results,
        criticalPath,
        projectDuration,
        isLoading,
        error,
        calculateNetworkModel,
        reset
    };
};