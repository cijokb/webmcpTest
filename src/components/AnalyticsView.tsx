import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useChartConfig } from '../hooks/useChartConfig';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
    const { config } = useChartConfig();

    const options: Highcharts.Options = {
        chart: {
            type: config.type,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Inter, system-ui, sans-serif'
            },
            height: 500
        },
        title: {
            text: config.title,
            style: {
                color: 'var(--foreground)',
                fontWeight: '800',
                fontSize: '24px'
            }
        },
        subtitle: {
            text: config.subtitle,
            style: {
                color: 'var(--muted-foreground)',
                fontSize: '14px'
            }
        },
        colors: config.colors,
        xAxis: {
            categories: config.xAxisCategories,
            labels: {
                style: {
                    color: 'var(--muted-foreground)'
                }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.05)'
        },
        yAxis: {
            title: {
                text: config.yAxisTitle,
                style: {
                    color: 'var(--muted-foreground)'
                }
            },
            labels: {
                style: {
                    color: 'var(--muted-foreground)'
                }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.05)',
            plotLines: config.plotLines as any
        },
        legend: {
            enabled: config.showLegend,
            itemStyle: {
                color: 'var(--muted-foreground)'
            },
            itemHoverStyle: {
                color: 'var(--foreground)'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(24, 24, 27, 0.95)',
            borderWidth: 1,
            borderColor: 'rgba(99, 102, 241, 0.2)',
            style: {
                color: '#fff'
            },
            borderRadius: 12,
            shared: true
        },
        plotOptions: {
            column: {
                borderRadius: 8,
                borderWidth: 0
            },
            series: {
                animation: {
                    duration: 1000
                },
                marker: {
                    radius: 4
                }
            }
        },
        series: config.series as any,
        credits: {
            enabled: false
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-indigo-400 mb-1">
                    <TrendingUp size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">Strategic Intelligence</span>
                </div>
                <h2 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight">Analytics Hub</h2>
                <p className="text-[var(--muted-foreground)] max-w-2xl">
                    Real-time visualization of logistical throughput and node performance metrics.
                    Agents can dynamically reconfigure these visualizations to highlight critical anomalies.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-10 rounded-3xl border border-indigo-500/10 relative overflow-hidden group shadow-2xl"
                >
                    <div
                        className="absolute top-0 right-0 p-8 pointer-events-none"
                        style={{ opacity: 0.01, zIndex: 0 }}
                    >
                        <BarChart3 size={240} className="text-indigo-400" />
                    </div>

                    <div className="relative z-10">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="glass-panel p-8 rounded-2xl border border-emerald-500/10 relative overflow-hidden">
                        <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-3">
                            <Info size={18} />
                            Agent Control Protocol
                        </h4>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                            The visual palette and data variation of this chart are exposed via the <code className="text-zinc-300">update_chart_config</code> tool.
                            AI agents use this to optimize the signal-to-noise ratio during high-velocity dispatch cycles.
                        </p>
                    </section>

                    <section className="glass-panel p-8 rounded-2xl border border-indigo-500/10 relative overflow-hidden">
                        <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-3">
                            <TrendingUp size={18} />
                            Predictive Trajectory
                        </h4>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                            Integrated ML models analyze current throughput to predict future node saturation.
                            Current data indicates +15% capacity headroom in the Epsilon sector.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
