/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useMemo, JSX } from 'react';
import { Calculator, DollarSign, Zap, TrendingUp, Leaf, Sun, Home } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface CalculatorInputs {
    monthlyBill: number;
    homeSize: number;
    sunlightHours: number;
    systemSize: number;
    systemCost: number;
    electricityRate: number;
    annualIncrease: number;
}

interface SavingsResult {
    monthlySavings: number;
    annualSavings: number;
    paybackPeriod: number;
    totalSavings20Years: number;
    co2Offset: number;
    monthlyProduction: number;
}

export default function SolarSavingCalculator(): JSX.Element {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        monthlyBill: 15000,
        homeSize: 1500,
        sunlightHours: 5.5,
        systemSize: 5,
        systemCost: 500000,
        electricityRate: 25,
        annualIncrease: 8
    });

    const handleInputChange = (field: keyof CalculatorInputs, value: number): void => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculatedResults: SavingsResult = useMemo(() => {
        const monthlyConsumption = inputs.monthlyBill / inputs.electricityRate;
        const dailyProduction = inputs.systemSize * inputs.sunlightHours;
        const monthlyProduction = dailyProduction * 30;

        const monthlySavings = Math.min(monthlyProduction * inputs.electricityRate, inputs.monthlyBill);
        const annualSavings = monthlySavings * 12;

        const paybackPeriod = inputs.systemCost / annualSavings;

        let totalSavings20Years = 0;
        let currentRate = inputs.electricityRate;
        for (let year = 1; year <= 20; year++) {
            currentRate *= (1 + inputs.annualIncrease / 100);
            totalSavings20Years += Math.min(monthlyProduction * currentRate * 12, inputs.monthlyBill * 12 * (1 + inputs.annualIncrease / 100) ** year);
        }

        const co2Offset = monthlyProduction * 0.5 * 12; // kg CO2 per year

        return {
            monthlySavings,
            annualSavings,
            paybackPeriod,
            totalSavings20Years,
            co2Offset,
            monthlyProduction
        };
    }, [inputs]);

    const formatCurrency = (amount: number): string => {
        return `Rs. ${amount.toLocaleString()}`;
    };

    const inputFields = [
        {
            label: "Monthly Electricity Bill",
            field: 'monthlyBill' as keyof CalculatorInputs,
            icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
            unit: "Rs.",
            min: 1000,
            max: 100000,
            step: 500
        },
        {
            label: "Home Size",
            field: 'homeSize' as keyof CalculatorInputs,
            icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
            unit: "sq ft",
            min: 500,
            max: 10000,
            step: 100
        },
        {
            label: "Daily Sunlight Hours",
            field: 'sunlightHours' as keyof CalculatorInputs,
            icon: <Sun className="w-4 h-4 sm:w-5 sm:h-5" />,
            unit: "hours",
            min: 3,
            max: 8,
            step: 0.1
        },
        {
            label: "System Size",
            field: 'systemSize' as keyof CalculatorInputs,
            icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
            unit: "kW",
            min: 1,
            max: 50,
            step: 0.5
        },
        {
            label: "System Cost",
            field: 'systemCost' as keyof CalculatorInputs,
            icon: <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />,
            unit: "Rs.",
            min: 100000,
            max: 5000000,
            step: 10000
        },
        {
            label: "Electricity Rate (per kWh)",
            field: 'electricityRate' as keyof CalculatorInputs,
            icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
            unit: "Rs.",
            min: 10,
            max: 50,
            step: 1
        }
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: solarTheme.neutral[50] }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.secondary[100] }}>
                            <Calculator className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: solarTheme.secondary[600] }} />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Solar Savings
                        <span className="block text-transparent bg-clip-text mt-1" style={{
                            backgroundImage: `linear-gradient(to right, ${solarTheme.secondary[600]}, ${solarTheme.primary[500]})`
                        }}>
                            Calculator
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                        Calculate your potential savings and return on investment with solar energy
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">

                    {/* Input Section */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
                        style={{ border: '1px solid', borderColor: solarTheme.secondary[200] }}>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: solarTheme.secondary[600] }} />
                            Calculator Inputs
                        </h2>

                        <div className="space-y-4 sm:space-y-6">
                            {inputFields.map((field) => (
                                <div key={field.field}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div style={{ color: solarTheme.secondary[600] }}>
                                                {field.icon}
                                            </div>
                                            {field.label}
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={field.min}
                                            max={field.max}
                                            step={field.step}
                                            value={inputs[field.field]}
                                            onChange={(e) => handleInputChange(field.field, parseFloat(e.target.value) || 0)}
                                            className="w-full px-4 py-3 pr-16 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
                                            style={{
                                                borderColor: solarTheme.secondary[300],
                                                '--tw-ring-color': solarTheme.secondary[300]
                                            } as React.CSSProperties}
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                            {field.unit}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Annual Increase Rate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: solarTheme.secondary[600] }} />
                                        Annual Electricity Rate Increase
                                    </div>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={0}
                                        max={20}
                                        step={0.5}
                                        value={inputs.annualIncrease}
                                        onChange={(e) => handleInputChange('annualIncrease', parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
                                        style={{
                                            borderColor: solarTheme.secondary[300],
                                            '--tw-ring-color': solarTheme.secondary[300]
                                        } as React.CSSProperties}
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
                        style={{ border: '1px solid', borderColor: solarTheme.primary[200] }}>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: solarTheme.primary[600] }} />
                            Your Savings Potential
                        </h2>

                        <div className="space-y-4 sm:space-y-6">

                            {/* Monthly Production */}
                            <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Monthly Energy Production</span>
                                    <Zap className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold" style={{ color: solarTheme.primary[600] }}>
                                    {calculatedResults.monthlyProduction.toFixed(0)} kWh
                                </div>
                            </div>

                            {/* Monthly Savings */}
                            <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.secondary[50] }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Monthly Savings</span>
                                    <DollarSign className="w-4 h-4" style={{ color: solarTheme.secondary[600] }} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold" style={{ color: solarTheme.secondary[600] }}>
                                    {formatCurrency(calculatedResults.monthlySavings)}
                                </div>
                            </div>

                            {/* Annual Savings */}
                            <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Annual Savings</span>
                                    <TrendingUp className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold" style={{ color: solarTheme.primary[600] }}>
                                    {formatCurrency(calculatedResults.annualSavings)}
                                </div>
                            </div>

                            {/* Payback Period */}
                            <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.secondary[50] }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Payback Period</span>
                                    <Calculator className="w-4 h-4" style={{ color: solarTheme.secondary[600] }} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold" style={{ color: solarTheme.secondary[600] }}>
                                    {calculatedResults.paybackPeriod.toFixed(1)} years
                                </div>
                            </div>

                            {/* 20-Year Savings */}
                            <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">20-Year Total Savings</span>
                                    <TrendingUp className="w-4 h-4" style={{ color: solarTheme.primary[600] }} />
                                </div>
                                <div className="text-xl sm:text-2xl font-bold" style={{ color: solarTheme.primary[600] }}>
                                    {formatCurrency(calculatedResults.totalSavings20Years)}
                                </div>
                            </div>

                            {/* Environmental Impact */}
                            <div className="p-4 rounded-xl" style={{ backgroundColor: solarTheme.success[50] }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Annual CO₂ Offset</span>
                                    <Leaf className="w-4 h-4" style={{ color: solarTheme.success[600] }} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold" style={{ color: solarTheme.success[600] }}>
                                    {calculatedResults.co2Offset.toFixed(0)} kg
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                    Equivalent to planting {Math.round(calculatedResults.co2Offset / 25)} trees
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border"
                        style={{ borderColor: solarTheme.primary[200] }}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.primary[100] }}>
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: solarTheme.primary[600] }} />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {((calculatedResults.monthlySavings / inputs.monthlyBill) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Bill Reduction</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border"
                        style={{ borderColor: solarTheme.secondary[200] }}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.secondary[100] }}>
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: solarTheme.secondary[600] }} />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {((calculatedResults.totalSavings20Years / inputs.systemCost) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">20-Year ROI</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border"
                        style={{ borderColor: solarTheme.primary[200] }}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.primary[100] }}>
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: solarTheme.primary[600] }} />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {(inputs.systemSize * 365 * inputs.sunlightHours / 1000).toFixed(1)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">MWh/Year Production</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border"
                        style={{ borderColor: solarTheme.success[200] }}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.success[100] }}>
                            <Leaf className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: solarTheme.success[600] }} />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {Math.round(calculatedResults.co2Offset / 25)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Trees Equivalent</div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center"
                    style={{ border: '1px solid', borderColor: solarTheme.primary[200] }}>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                        Ready to Start Saving?
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                        Based on your calculations, solar energy could save you {formatCurrency(calculatedResults.annualSavings)} per year.
                        Get a personalized quote today!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
                        <button
                            className="flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] min-h-[48px] text-sm sm:text-base"
                            style={{ background: `linear-gradient(135deg, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}
                        >
                            Get Free Quote
                        </button>

                        <button
                            className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 transition-all duration-300 hover:shadow-lg min-h-[48px] text-sm sm:text-base"
                            style={{
                                borderColor: solarTheme.secondary[500],
                                color: solarTheme.secondary[600],
                                backgroundColor: 'white'
                            }}
                        >
                            View Products
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-xs sm:text-sm text-gray-500 max-w-4xl mx-auto leading-relaxed">
                        * Calculations are estimates based on average conditions and may vary depending on location, weather patterns,
                        system efficiency, and local electricity rates. Actual results may differ. Consult with our solar experts for
                        a detailed assessment.
                    </p>
                </div>
            </div>
        </div>
    );
}