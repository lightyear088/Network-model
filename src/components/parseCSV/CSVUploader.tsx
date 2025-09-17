import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { Activity } from '../NetworkModel/slice/NetworkModelSliceModel';
import { setActivities } from '../NetworkModel/slice/NetworkModelSlice';

const CSVUploader: React.FC = () => {
    const dispath = useDispatch();


    const parseCsvData = useCallback((csvContent: string): Activity[] => {
        const lines = csvContent.trim().split('\n');
        const activities: Activity[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/"/g, '').split(',');
            if (line.length >= 3) {
                activities.push({
                    id: `A${i}`,
                    from: parseInt(line[0]),
                    to: parseInt(line[1]),
                    duration: parseInt(line[2])
                });
            }
        }

        return activities;
    }, []);



    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const csvText = e.target?.result as string;
                const activities = parseCsvData(csvText);
                dispath(setActivities(activities))
                console.log('Блоки успешно загружены и сохранены в store:', activities);
            } catch (error) {
                console.error('Ошибка при обработке CSV файла:', error);
            }
        };

        reader.onerror = () => {
            console.error('Ошибка при чтении файла');
        };

        reader.readAsText(file);
    }, [dispath, parseCsvData]);

    return (
        <div>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{
                    padding: '10px',
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            />
        </div>
    );
};

export default CSVUploader;