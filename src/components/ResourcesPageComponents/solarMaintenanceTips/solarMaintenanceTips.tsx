'use client';
import React, { JSX } from 'react';
import { CheckCircle, AlertTriangle, Calendar, Wrench, Droplets, Shield, Zap } from 'lucide-react';
import { solarTheme } from '@/theme/theme';

interface MaintenanceTip {
    id: number;
    title: string;
    description: string;
    frequency: string;
    difficulty: 'Easy' | 'Medium' | 'Professional';
    icon: JSX.Element;
    steps: string[];
    warning?: string;
}

interface MaintenanceSchedule {
    period: string;
    tasks: string[];
    icon: JSX.Element;
}

export default function SolarMaintenanceTips(): JSX.Element {
    const maintenanceTips: MaintenanceTip[] = [
        {
            id: 1,
            title: "Panel Cleaning",
            description: "Keep your solar panels clean to maintain optimal energy production",
            frequency: "Monthly",
            difficulty: "Easy",
            icon: <Droplets className="w-5 h-5" />,
            steps: [
                "Turn off the solar system before cleaning",
                "Use soft brush or cloth with mild soap and water",
                "Rinse thoroughly with clean water",
                "Clean during cooler parts of the day",
                "Check for any visible damage while cleaning"
            ],
            warning: "Never use abrasive materials or high-pressure water"
        },
        {
            id: 2,
            title: "Visual Inspection",
            description: "Regular visual checks help identify potential issues early",
            frequency: "Monthly",
            difficulty: "Easy",
            icon: <Shield className="w-5 h-5" />,
            steps: [
                "Check panels for cracks, chips, or discoloration",
                "Inspect mounting hardware for looseness",
                "Look for any signs of water damage or corrosion",
                "Check inverter display for error codes",
                "Ensure no debris or bird nests around panels"
            ]
        },
        {
            id: 3,
            title: "Performance Monitoring",
            description: "Track energy production to ensure optimal performance",
            frequency: "Weekly",
            difficulty: "Easy",
            icon: <Zap className="w-5 h-5" />,
            steps: [
                "Check your monitoring app or inverter display",
                "Compare current output to expected production",
                "Note any significant drops in performance",
                "Check weather conditions affecting output",
                "Keep records of monthly energy production"
            ]
        },
        {
            id: 4,
            title: "Electrical Connections",
            description: "Ensure all electrical connections are secure and safe",
            frequency: "Annually",
            difficulty: "Professional",
            icon: <Wrench className="w-5 h-5" />,
            steps: [
                "Have a certified technician inspect connections",
                "Check for any signs of overheating or burning",
                "Tighten any loose connections",
                "Test grounding connections",
                "Verify safety disconnect switches work properly"
            ],
            warning: "Always hire certified professionals for electrical work"
        }
    ];

    const maintenanceSchedule: MaintenanceSchedule[] = [
        {
            period: "Monthly Tasks",
            icon: <Calendar className="w-5 h-5" />,
            tasks: [
                "Clean panels if needed",
                "Visual inspection for damage",
                "Check inverter status",
                "Review energy production data"
            ]
        },
        {
            period: "Quarterly Tasks",
            icon: <CheckCircle className="w-5 h-5" />,
            tasks: [
                "Deep clean panels",
                "Trim vegetation around panels",
                "Check mounting system integrity",
                "Review system performance trends"
            ]
        },
        {
            period: "Annual Tasks",
            icon: <Wrench className="w-5 h-5" />,
            tasks: [
                "Professional electrical inspection",
                "Inverter maintenance check",
                "Warranty documentation review",
                "Performance optimization assessment"
            ]
        }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return solarTheme.primary[500];
            case 'Medium': return solarTheme.secondary[500];
            case 'Professional': return solarTheme.error[500];
            default: return solarTheme.neutral[500];
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: solarTheme.neutral[50] }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: solarTheme.primary[100] }}>
                            <Wrench className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: solarTheme.primary[600] }} />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Solar Panel
                        <span className="block text-transparent bg-clip-text mt-1" style={{
                            backgroundImage: `linear-gradient(to right, ${solarTheme.primary[600]}, ${solarTheme.secondary[500]})`
                        }}>
                            Maintenance Tips
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                        Keep your solar panels operating at peak efficiency with these expert maintenance guidelines
                    </p>
                </div>

                {/* Maintenance Tips Grid */}
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                    {maintenanceTips.map((tip) => (
                        <div key={tip.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border"
                            style={{ borderColor: solarTheme.primary[200] }}>

                            {/* Tip Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: solarTheme.primary[100] }}>
                                        <div style={{ color: solarTheme.primary[600] }}>
                                            {tip.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{tip.title}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                                            <span className="text-xs sm:text-sm text-gray-600">{tip.frequency}</span>
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold text-white self-start"
                                                style={{ backgroundColor: getDifficultyColor(tip.difficulty) }}>
                                                {tip.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                                {tip.description}
                            </p>

                            {/* Steps */}
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Steps:</h4>
                                <ol className="space-y-2">
                                    {tip.steps.map((step, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                                                style={{ backgroundColor: solarTheme.primary[500] }}>
                                                {index + 1}
                                            </span>
                                            <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Warning */}
                            {tip.warning && (
                                <div className="p-3 rounded-lg flex items-start space-x-2"
                                    style={{ backgroundColor: solarTheme.warning[50] }}>
                                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                                        style={{ color: solarTheme.warning[600] }} />
                                    <p className="text-xs sm:text-sm" style={{ color: solarTheme.warning[700] }}>
                                        <strong>Warning:</strong> {tip.warning}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Maintenance Schedule */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8"
                    style={{ border: '1px solid', borderColor: solarTheme.primary[200] }}>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                        Maintenance Schedule
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                        {maintenanceSchedule.map((schedule, index) => (
                            <div key={index} className="p-4 sm:p-6 rounded-xl text-center"
                                style={{ backgroundColor: solarTheme.primary[50] }}>
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                    style={{ backgroundColor: solarTheme.primary[500] }}>
                                    <div className="text-white">
                                        {schedule.icon}
                                    </div>
                                </div>

                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                                    {schedule.period}
                                </h3>

                                <ul className="space-y-2 text-left">
                                    {schedule.tasks.map((task, taskIndex) => (
                                        <li key={taskIndex} className="flex items-start space-x-2">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-1"
                                                style={{ color: solarTheme.primary[500] }} />
                                            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>             
            </div>
        </div>
    );
}