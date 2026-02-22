"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";

interface AnalyticsChartsProps {
    activityData: any[];
}

export default function AnalyticsCharts({ activityData }: AnalyticsChartsProps) {
    // Process activity data to group by date
    const processedData = activityData.reduce((acc: any, log: any) => {
        const date = new Date(log.timestamp).toLocaleDateString();
        if (!acc[date]) acc[date] = { date, views: 0, actions: 0 };

        if (log.activity_type === "PAGE_VIEW") {
            acc[date].views += 1;
        } else {
            acc[date].actions += 1;
        }
        return acc;
    }, {});

    const chartData = Object.values(processedData).slice(0, 7).reverse(); // Last 7 days

    if (chartData.length === 0) {
        // Dummy data if there is no activity
        chartData.push(
            { date: "Mon", views: 120, actions: 45 },
            { date: "Tue", views: 250, actions: 60 },
            { date: "Wed", views: 340, actions: 80 },
            { date: "Thu", views: 280, actions: 65 },
            { date: "Fri", views: 390, actions: 90 },
            { date: "Sat", views: 420, actions: 110 },
            { date: "Sun", views: 500, actions: 130 }
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border-4 border-black p-4 brutal-shadow-sm font-bold uppercase text-sm">
                    <p className="border-b-2 border-black pb-2 mb-2">{label}</p>
                    <p className="text-[var(--color-primary-blue)]">VIEWS: {payload[0].value}</p>
                    {payload[1] && <p className="text-[var(--color-primary-orange)]">ACTIONS: {payload[1].value}</p>}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white border-4 border-black p-6 brutal-shadow-sm h-[400px] flex flex-col">
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4">Traffic Overview</h2>
                <div className="flex-grow w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#000" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: "#000", fontWeight: 'bold' }} axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} />
                            <YAxis tick={{ fill: "#000", fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="views" fill="var(--color-primary-blue)" stroke="#000" strokeWidth={2} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="actions" fill="var(--color-primary-orange)" stroke="#000" strokeWidth={2} radius={[0, 0, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-[var(--color-primary-yellow)] border-4 border-black p-6 brutal-shadow-sm h-[400px] flex flex-col">
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4">Growth Trend</h2>
                <div className="flex-grow w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.2)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: "#000", fontWeight: 'bold' }} axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} />
                            <YAxis tick={{ fill: "#000", fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="views" stroke="#000" strokeWidth={4} dot={{ stroke: '#000', strokeWidth: 2, r: 6, fill: 'var(--color-primary-yellow)' }} activeDot={{ r: 8, fill: '#000' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
