import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './NetworkDiagram.css';
import { selectActivities } from '../slice/NetworkModelSlice';
import { useNetworkLayout } from './hooks/useNetworkLayout';

interface NetworkDiagramProps {
    width?: number;
    height?: number;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
    width = 800,
    height = 500
}) => {
    const activities = useSelector(selectActivities);
    const [containerSize, setContainerSize] = useState({ width, height });
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
    const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
    const [labelPositions, setLabelPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

    const { nodePositions, activityLayouts } = useNetworkLayout(
        activities,
        containerSize.width,
        containerSize.height
    );

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node) &&
            svgRef.current &&
            !svgRef.current.contains(event.target as Node)
        ) {
            setSelectedActivity(null);
        }
    }, []);

    const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
        if (event.target === svgRef.current) {
            setSelectedActivity(null);
        }
    };

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width: containerWidth, height: containerHeight } =
                    containerRef.current.getBoundingClientRect();
                setContainerSize({
                    width: Math.max(containerWidth - 40, 300),
                    height: Math.max(containerHeight - 40, 200)
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', updateSize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleActivityClick = (activityId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedActivity(selectedActivity === activityId ? null : activityId);
    };

    const handleActivityHover = (activityId: string | null) => {
        setHoveredActivity(activityId);
    };

    const getTextPosition = useCallback((
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        row: number,
        activityId: string
    ) => {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;


        let offsetY = 10 * (row % 2 === 0 ? -1 : 1);
        let offsetX = 0;

        const labelWidth = 50;
        const labelHeight = 16;

        let attempts = 0;
        let foundPosition = false;

        while (attempts < 10 && !foundPosition) {
            const candidateX = midX + offsetX;
            const candidateY = midY + offsetY;

            const hasOverlap = Object.entries(labelPositions).some(([otherId, otherPos]) => {
                if (otherId === activityId) return false;

                return Math.abs(candidateX - otherPos.x) < labelWidth * 0.8 &&
                    Math.abs(candidateY - otherPos.y) < labelHeight * 0.8;
            });

            if (!hasOverlap) {
                foundPosition = true;
            } else {
                attempts++;
                const angle = (attempts * 45) * Math.PI / 180;
                const radius = 15 * attempts;
                offsetX = radius * Math.cos(angle);
                offsetY = radius * Math.sin(angle);
            }
        }

        return { x: midX + offsetX, y: midY + offsetY };
    }, [labelPositions]);

    useEffect(() => {
        const newLabelPositions: { [key: string]: { x: number; y: number } } = {};

        activityLayouts.forEach(layout => {
            const position = getTextPosition(
                layout.startX,
                layout.startY,
                layout.endX,
                layout.endY,
                layout.row,
                layout.activity.id
            );
            newLabelPositions[layout.activity.id] = position;
        });

        setLabelPositions(newLabelPositions);
    }, [activityLayouts, getTextPosition]);

    if (activities.length === 0) {
        return <div className="network-diagram-empty">Нет данных для отображения</div>;
    }

    return (
        <div
            ref={containerRef}
            className="network-diagram-container"
            style={{ width: '100%', height: '100%', minHeight: '500px' }}
            onClick={() => setSelectedActivity(null)}
        >
            <svg
                ref={svgRef}
                width={containerSize.width}
                height={containerSize.height}
                className="network-diagram-svg"
                viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
                preserveAspectRatio="xMidYMid meet"
                onClick={handleSvgClick}
            >
                {activityLayouts.map((layout) => {
                    const { activity, startX, startY, endX, endY } = layout;
                    const isSelected = selectedActivity === activity.id;
                    const isHovered = hoveredActivity === activity.id;
                    const isDummy = activity.duration === 0;
                    const textPosition = labelPositions[activity.id] || { x: 0, y: 0 };

                    return (
                        <g key={activity.id} className="activity-group">
                            <line
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                className={`activity-line ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isDummy ? 'dummy' : ''}`}
                                onClick={(e) => handleActivityClick(activity.id, e)}
                                onMouseEnter={() => handleActivityHover(activity.id)}
                                onMouseLeave={() => handleActivityHover(null)}
                            />

                            <polygon
                                points={`
                  ${endX - 8 * Math.cos(Math.atan2(endY - startY, endX - startX)) + 4 * Math.sin(Math.atan2(endY - startY, endX - startX))},
                  ${endY - 8 * Math.sin(Math.atan2(endY - startY, endX - startX)) - 4 * Math.cos(Math.atan2(endY - startY, endX - startX))}
                  ${endX},
                  ${endY}
                  ${endX - 8 * Math.cos(Math.atan2(endY - startY, endX - startX)) - 4 * Math.sin(Math.atan2(endY - startY, endX - startX))},
                  ${endY - 8 * Math.sin(Math.atan2(endY - startY, endX - startX)) + 4 * Math.cos(Math.atan2(endY - startY, endX - startX))}
                `}
                                className={`activity-arrow ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isDummy ? 'dummy' : ''}`}
                                onClick={(e) => handleActivityClick(activity.id, e)}
                                onMouseEnter={() => handleActivityHover(activity.id)}
                                onMouseLeave={() => handleActivityHover(null)}
                            />
                            {textPosition.x > 0 && textPosition.y > 0 && (
                                <>
                                    <rect
                                        x={textPosition.x - 25}
                                        y={textPosition.y - 8}
                                        width={50}
                                        height={16}
                                        fill="white"
                                        stroke={isSelected ? '#ff6b6b' : isHovered ? '#45b7d1' : '#e0e0e0'}
                                        strokeWidth={isSelected ? 2 : 1}
                                        rx="3"
                                        className="activity-label-bg"
                                        onClick={(e) => handleActivityClick(activity.id, e)}
                                        onMouseEnter={() => handleActivityHover(activity.id)}
                                        onMouseLeave={() => handleActivityHover(null)}
                                    />

                                    <text
                                        x={textPosition.x}
                                        y={textPosition.y + 4}
                                        className={`activity-label ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                                        onClick={(e) => handleActivityClick(activity.id, e)}
                                        onMouseEnter={() => handleActivityHover(activity.id)}
                                        onMouseLeave={() => handleActivityHover(null)}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {activity.id} ({activity.duration})
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {Object.values(nodePositions).map((position) => (
                    <g key={position.id} className="node-group">
                        <circle
                            cx={position.x}
                            cy={position.y}
                            r={8}
                            className="node-circle"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedActivity(null);
                            }}
                        />
                        <text
                            x={position.x}
                            y={position.y + 20}
                            className="node-label"
                            textAnchor="middle"
                        >
                            {position.id}
                        </text>
                    </g>
                ))}
            </svg>

            {selectedActivity && (
                <div
                    className="activity-info-panel"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="close-button"
                        onClick={() => setSelectedActivity(null)}
                    >
                        ×
                    </button>
                    <h3>Информация об активности</h3>
                    {(() => {
                        const activity = activities.find(a => a.id === selectedActivity);
                        return activity ? (
                            <>
                                <p><strong>ID:</strong> {activity.id}</p>
                                <p><strong>Из узла:</strong> {activity.from}</p>
                                <p><strong>В узел:</strong> {activity.to}</p>
                                <p><strong>Длительность:</strong> {activity.duration}</p>
                                {activity.duration === 0 && <p className="dummy-note">(Фиктивная активность)</p>}
                            </>
                        ) : null;
                    })()}
                </div>
            )}

            <div
                className="diagram-legend"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="legend-item">
                    <div className="legend-color real-activity"></div>
                    <span>Обычная активность</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color dummy-activity"></div>
                    <span>Фиктивная активность</span>
                </div>
            </div>
        </div>
    );
};
