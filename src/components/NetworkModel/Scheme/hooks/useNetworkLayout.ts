import { useMemo } from 'react';
import type { Activity } from '../../slice/NetworkModelSliceModel';
import type { NodePosition, ActivityLayout } from '../types';

export const useNetworkLayout = (activities: Activity[], containerWidth: number, containerHeight: number) => {
    return useMemo(() => {
        if (!activities.length) return { nodePositions: {}, activityLayouts: [], maxRow: 0 };


        const nodes = Array.from(
            new Set(activities.flatMap(a => [a.from, a.to]))
        ).sort((a, b) => a - b);

        const rows: Activity[][] = [];
        const placed = new Set<string>();

        const sortedActivities = [...activities].sort((a, b) => a.from - b.from || a.to - b.to);

        sortedActivities.forEach(activity => {
            if (placed.has(activity.id)) return;

            let rowIndex = 0;
            while (rowIndex < rows.length) {
                const canPlace = !rows[rowIndex].some(existing => {
                    const overlaps = (activity.from < existing.to && activity.to > existing.from);
                    return overlaps;
                });

                if (canPlace) break;
                rowIndex++;
            }

            if (rowIndex >= rows.length) {
                rows.push([]);
            }

            rows[rowIndex].push(activity);
            placed.add(activity.id);
        });

        const horizontalPadding = 80;
        const verticalPadding = 60;
        const availableWidth = containerWidth - horizontalPadding * 2;
        const availableHeight = containerHeight - verticalPadding * 2;

        const nodePositions: { [key: number]: NodePosition } = {};
        let nodeLevels: { [key: number]: number } = {};

        const calculateLevels = () => {
            const levels: { [key: number]: number } = {};
            const visited = new Set<number>();

            const startNodes = nodes.filter(node =>
                !activities.some(a => a.to === node && a.from !== node)
            );

            const queue: [number, number][] = startNodes.map(node => [node, 0]);

            while (queue.length > 0) {
                const [currentNode, level] = queue.shift()!;
                if (visited.has(currentNode)) continue;

                visited.add(currentNode);
                levels[currentNode] = level;

                const outgoingActivities = activities.filter(a => a.from === currentNode);
                outgoingActivities.forEach(activity => {
                    if (!visited.has(activity.to)) {
                        queue.push([activity.to, level + 1]);
                    }
                });
            }

            return levels;
        };

        nodeLevels = calculateLevels();

        const nodesByLevel: { [level: number]: number[] } = {};
        nodes.forEach(node => {
            const level = nodeLevels[node] || 0;
            if (!nodesByLevel[level]) {
                nodesByLevel[level] = [];
            }
            nodesByLevel[level].push(node);
        });

        const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number));
        const levelWidth = availableWidth / Math.max(1, maxLevel);

        Object.entries(nodesByLevel).forEach(([levelStr, levelNodes]) => {
            const level = parseInt(levelStr);
            const nodesInLevel = levelNodes.length;
            const levelHeight = availableHeight / Math.max(1, nodesInLevel + 1);

            levelNodes.forEach((node, index) => {
                nodePositions[node] = {
                    x: horizontalPadding + level * levelWidth,
                    y: verticalPadding + (index + 1) * levelHeight,
                    id: node
                };
            });
        });

        const activityLayouts: ActivityLayout[] = activities.map(activity => {
            const fromPos = nodePositions[activity.from];
            const toPos = nodePositions[activity.to];

            let row = 0;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].some(a => a.id === activity.id)) {
                    row = i;
                    break;
                }
            }

            return {
                activity,
                row,
                startX: fromPos.x,
                endX: toPos.x,
                startY: fromPos.y,
                endY: toPos.y
            };
        });

        return {
            nodePositions,
            activityLayouts,
            maxRow: rows.length,
            containerWidth,
            containerHeight
        };

    }, [activities, containerWidth, containerHeight]);
};