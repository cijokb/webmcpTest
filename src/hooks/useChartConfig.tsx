import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type ChartType = 'line' | 'column' | 'bar' | 'pie' | 'area' | 'spline';

export interface ChartConfig {
    title: string;
    subtitle?: string;
    type: ChartType;
    colors: string[];
    showLegend: boolean;
    xAxisCategories: string[];
    yAxisTitle: string;
    series: {
        name: string;
        data: number[];
        type?: ChartType;
        color?: string;
    }[];
    plotLines?: {
        value: number;
        color: string;
        width: number;
        label?: {
            text: string;
            style?: React.CSSProperties;
        }
    }[];
}

interface ChartContextType {
    config: ChartConfig;
    updateConfig: (newConfig: Partial<ChartConfig>) => void;
    addDataPoint: (seriesName: string, value: number) => void;
    addPlotLine: (value: number, label: string, color: string) => void;
    clearPlotLines: () => void;
}

const DEFAULT_CONFIG: ChartConfig = {
    title: 'Dispatch Node Throughput',
    subtitle: 'Real-time logistics flow analysis',
    type: 'column',
    colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'],
    showLegend: true,
    xAxisCategories: ['Node Alpha', 'Node Beta', 'Node Gamma', 'Node Delta', 'Node Epsilon'],
    yAxisTitle: 'Payloads Processed',
    series: [
        {
            name: 'Primary Link',
            data: [450, 620, 580, 710, 490],
            color: '#6366f1'
        },
        {
            name: 'Secondary Link',
            data: [320, 410, 390, 480, 350],
            color: '#10b981'
        }
    ],
    plotLines: []
};

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<ChartConfig>(DEFAULT_CONFIG);

    const updateConfig = (newConfig: Partial<ChartConfig>) => {
        setConfig(prev => {
            const updated = {
                ...prev,
                ...newConfig
            };

            if (newConfig.colors && !newConfig.series) {
                updated.series = updated.series.map((s, i) => ({
                    ...s,
                    color: newConfig.colors![i % newConfig.colors!.length]
                }));
            }

            return updated;
        });
    };

    const addDataPoint = (seriesName: string, value: number) => {
        setConfig(prev => ({
            ...prev,
            series: prev.series.map(s =>
                s.name === seriesName
                    ? { ...s, data: [...s.data, value].slice(-10) } // Keep last 10 points
                    : s
            )
        }));
    };

    const addPlotLine = (value: number, label: string, color: string) => {
        setConfig(prev => ({
            ...prev,
            plotLines: [
                ...(prev.plotLines || []),
                {
                    value,
                    color,
                    width: 2,
                    label: {
                        text: label,
                        style: { color: color, fontWeight: 'bold' }
                    }
                }
            ]
        }));
    };

    const clearPlotLines = () => {
        setConfig(prev => ({
            ...prev,
            plotLines: []
        }));
    };

    return (
        <ChartContext.Provider value={{ config, updateConfig, addDataPoint, addPlotLine, clearPlotLines }}>
            {children}
        </ChartContext.Provider>
    );
};

export const useChartConfig = () => {
    const context = useContext(ChartContext);
    if (context === undefined) {
        throw new Error('useChartConfig must be used within a ChartProvider');
    }
    return context;
};
