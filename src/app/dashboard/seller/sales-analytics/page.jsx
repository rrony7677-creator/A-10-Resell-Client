"use client";

import React, { useMemo } from 'react';
import { Card, Button, Tooltip } from "@heroui/react";
import { TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, BarChart3 } from "lucide-react";
// Using Recharts for highly accessible, fluid React analytic dashboards
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

const SalesAnalytics = () => {
    // Mock dataset for Monthly Sales Trend (12 Months)
    const salesTrendData = [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 5000 },
        { month: 'Apr', sales: 4500 },
        { month: 'May', sales: 6000 },
        { month: 'Jun', sales: 5500 },
        { month: 'Jul', sales: 7000 },
        { month: 'Aug', sales: 6800 },
        { month: 'Sep', sales: 8200 },
        { month: 'Oct', sales: 7500 },
        { month: 'Nov', sales: 9000 },
        { month: 'Dec', sales: 11000 },
    ];

    // Mock dataset for Top Selling Products
    const topProductsData = [
        { name: 'Wireless Earbuds', units: 420, fill: '#3b82f6' },
        { name: 'Mechanical Keyboard', units: 310, fill: '#10b981' },
        { name: 'Ergonomic Desk Chair', units: 285, fill: '#f59e0b' },
        { name: 'Smart Fitness Watch', units: 190, fill: '#ef4444' },
        { name: 'USB-C Docking Hub', units: 155, fill: '#8b5cf6' },
    ];

    // Simple performance calculation metrics
    const totalRevenue = useMemo(() => salesTrendData.reduce((acc, curr) => acc + curr.sales, 0), []);
    const totalUnitsSold = useMemo(() => topProductsData.reduce((acc, curr) => acc + curr.units, 0), []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-white min-h-screen bg-[#0d0d0e]">
            
            {/* Header Block Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight">Sales Analytics</h2>
                    <p className="text-sm text-zinc-400">Visual representation of your custom merchant and seller performance metrics.</p>
                </div>
                <Button 
                    size="sm"
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium text-xs rounded-lg px-4"
                    onClick={() => window.print()}
                >
                    Export Report
                </Button>
            </div>

            {/* Quick Metrics Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex flex-row items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gross Sales</span>
                        <h3 className="text-2xl font-bold">${totalRevenue.toLocaleString()}</h3>
                        <p className="text-xs text-emerald-400 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +14.2% MoM
                        </p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </Card>

                <Card className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex flex-row items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Items Shifted</span>
                        <h3 className="text-2xl font-bold">{totalUnitsSold.toLocaleString()} units</h3>
                        <p className="text-xs text-emerald-400 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +8.4% velocity
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </Card>

                <Card className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex flex-row items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Conversion Ratio</span>
                        <h3 className="text-2xl font-bold">4.82%</h3>
                        <p className="text-xs text-zinc-500">Benchmark industry avg: 2.5%</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </Card>
            </div>

            {/* Main Analytical Charts Dynamic Section Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Monthly Sales Trend Graph Card (Takes up 2/3 space) */}
                <Card className="lg:col-span-2 bg-[#121214] border border-zinc-900 rounded-xl p-6 shadow-2xl space-y-4">
                    <div className="flex flex-col gap-0.5">
                        <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                            Sales Chart 
                            <span className="text-xs font-normal text-zinc-500 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full">Live</span>
                        </h4>
                        <p className="text-xs text-zinc-500">Breakdown analysis highlighting month-on-month trendlines.</p>
                    </div>
                    
                    <div className="h-72 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#52525b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#52525b" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#salesColor)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 2. Top Selling Products Distribution Card (Takes up 1/3 space) */}
                <Card className="bg-[#121214] border border-zinc-900 rounded-xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
                    <div className="flex flex-col gap-0.5">
                        <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                            Top Selling Products
                            <BarChart3 className="w-4 h-4 text-zinc-500" />
                        </h4>
                        <p className="text-xs text-zinc-500">Highest individual volumes cataloged this term.</p>
                    </div>

                    {/* Bar visualization element block */}
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProductsData} layout="vertical" margin={{ top: 0, right: 10, left: -30, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" hide />
                                <Bar dataKey="units" radius={[0, 4, 4, 0]} barSize={14}>
                                    {topProductsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.85} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Styled list legend details row element representation */}
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                        {topProductsData.slice(0, 3).map((item, idx) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 max-w-[70%] truncate">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                                    <span className="text-zinc-400 truncate">{item.name}</span>
                                </div>
                                <span className="font-semibold text-zinc-200">{item.units} units</span>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default SalesAnalytics;