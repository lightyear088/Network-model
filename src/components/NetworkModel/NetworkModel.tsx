import React, { useEffect } from 'react';
import './NetworkModel.css';
import { useNetworkModel } from './hooks/useNetworkModel';
import { NetworkDiagram } from './Scheme/NetworkDiagram';

const NetworkModelCalculator: React.FC = () => {
    const {
        activities,
        results,
        criticalPath,
        projectDuration,
        isLoading,
        error,
        calculateNetworkModel
    } = useNetworkModel();

    useEffect(() => {
        calculateNetworkModel();
    }, [calculateNetworkModel]);

    if (isLoading) {
        return (
            <div className="network-model-container">
                <div className="loading">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="network-model-container">
                <div className="error">Ошибка: {error}</div>
            </div>
        );
    }

    return (
        <div className="network-model-container">
            <h2 className="network-model-title">Сетевая модель "Дуга-работа"</h2>

            <div className="network-model-section">
                <h3>Исходные данные:</h3>
                <table className="network-table">
                    <thead>
                        <tr>
                            <th>Работа</th>
                            <th>Из узла</th>
                            <th>В узел</th>
                            <th>Длительность</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity, index) => (
                            <tr key={index}>
                                <td>A{index + 1}</td>
                                <td>{activity.from}</td>
                                <td>{activity.to}</td>
                                <td>{activity.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <NetworkDiagram></NetworkDiagram>

            <div className="network-model-section">
                <h3>Результаты расчета:</h3>
                <table className="network-table">
                    <thead>
                        <tr>
                            <th rowSpan={2}>Операция</th>
                            <th colSpan={2}>Раннее</th>
                            <th colSpan={2}>Позднее</th>
                            <th rowSpan={2}>Полный резерв</th>
                            <th rowSpan={2}>Свободный резерв</th>
                            <th rowSpan={2}>Независимый резерв</th>
                            <th rowSpan={2}>Гарантированный резерв</th>
                        </tr>
                        <tr className="sub-header-row">
                            <th>начало</th>
                            <th>окончание</th>
                            <th>начало</th>
                            <th>окончание</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr
                                key={index}
                                className={result.isCritical ? 'critical-row' : ''}
                            >
                                <td>
                                    {result.from}-{result.to} {result.isCritical && '- крит.'}
                                </td>
                                <td>{result.earlyStart}</td>
                                <td>{result.earlyFinish}</td>
                                <td>{result.lateStart}</td>
                                <td>{result.lateFinish}</td>
                                <td>{result.totalFloat}</td>
                                <td>{result.freeFloat}</td>
                                <td>{result.independentFloat}</td>
                                <td>{result.guaranteedFloat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="network-model-section">
                <div className="critical-path">
                    <h3>Критический путь:</h3>
                    <p>{criticalPath.join(' → ')}</p>
                </div>
                <div className="project-duration">
                    <p>Общая длительность проекта: {projectDuration}</p>
                </div>
            </div>
        </div>
    );
};

export default NetworkModelCalculator;