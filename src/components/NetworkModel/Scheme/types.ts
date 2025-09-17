import type { Activity } from "../slice/NetworkModelSliceModel";

export interface NodePosition {
    x: number;
    y: number;
    id: number;
}

export interface ActivityLayout {
    activity: Activity;
    row: number;
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}