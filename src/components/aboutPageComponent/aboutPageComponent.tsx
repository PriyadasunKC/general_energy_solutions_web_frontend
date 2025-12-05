"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sun,
  Leaf,
  Zap,
  Users,
  Award,
  Globe,
  Target,
  Heart,
  Shield,
  CheckCircle,
  Battery,
  TrendingUp,
  Recycle
} from 'lucide-react';

// Import theme (assuming these are available in your project)
import { solarTheme } from '@/theme/theme';
import { cn, glassStyles } from '@/lib/theme-utils';

export default function AboutPageComponent() {
  const router = useRouter();

  // Navigation handlers
  const handleViewProducts = () => {
    router.push('/products');
  };

  const handleScheduleConsultation = () => {
    router.push('/contact-us');
  };

  const handleGetFreeQuote = () => {
    router.push('/main-products');
  };

  const handleGetFreeSolarQuote = () => {
    router.push('/main-products');
  };

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "10,000+", label: "Satisfied Customers" },
    { icon: <Zap className="h-6 w-6" />, value: "50MW", label: "Clean Energy Generated" },
    { icon: <Globe className="h-6 w-6" />, value: "15+", label: "Years Experience" },
    { icon: <Award className="h-6 w-6" />, value: "99%", label: "Customer Satisfaction" }
  ];

  const values = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Committed to protecting our planet through clean, renewable energy solutions that reduce carbon footprint and preserve the environment for future generations."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Reliability",
      description: "We stand behind our products with industry-leading warranties and proven track records, ensuring your solar investment delivers consistent performance."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Customer Focus",
      description: "Our customers are at the heart of everything we do. We provide personalized service, transparent pricing, and ongoing support throughout your solar journey."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously invest in cutting-edge solar technology and energy storage solutions to provide the most efficient and cost-effective systems available."
    }
  ];

  const milestones = [
    {
      year: "2008",
      title: "Company Founded",
      description: "Started with a vision to make solar energy accessible to everyone"
    },
    {
      year: "2012",
      title: "First 1000 Installations",
      description: "Reached our first major milestone of solar installations"
    },
    {
      year: "2018",
      title: "Energy Storage Solutions",
      description: "Expanded into battery storage and complete energy management systems"
    },
    {
      year: "2024",
      title: "10,000+ Happy Customers",
      description: "Celebrating over a decade of clean energy solutions"
    }
  ];

  const features = [
    { icon: <CheckCircle className="h-5 w-5" />, text: "25+ Year Panel Warranty" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Professional Installation" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Free Consultation & Assessment" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Financing Options Available" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "24/7 Customer Support" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Performance Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-solar">
      {/* Hero Section */}
      <div className="section-padding">
        <div className="container-solar">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-lg"
              style={{ background: `linear-gradient(to right, ${solarTheme.primary[500]}, ${solarTheme.primary[600]})` }}>
              <Sun className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-gradient-solar">General Energy Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Leading the solar revolution with innovative clean energy solutions.
              We&apos;re passionate about creating a sustainable future through premium solar panels and energy storage systems.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-solar px-8 py-4" onClick={handleGetFreeQuote}>
                Get Free Quote
              </button>
              <button className="btn-solar-outline px-8 py-4" onClick={handleViewProducts}>
                View Our Products
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className={cn("card-solar text-center hover-lift")}>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-4"
                  style={{ backgroundColor: solarTheme.primary[100] }}>
                  <div style={{ color: solarTheme.primary[600] }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container-solar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At General Energy Solutions, we believe everyone deserves access to clean, affordable energy.
                Our mission is to accelerate the world&apos;s transition to sustainable energy by providing
                high-quality solar solutions that make economic and environmental sense.
              </p>
              <p className="text-gray-600 mb-8">
                We combine cutting-edge technology with personalized service to deliver solar installations
                that exceed expectations. From initial consultation to long-term maintenance,
                we&apos;re your trusted partner in the journey toward energy independence.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div style={{ color: solarTheme.primary[600] }}>
                      {feature.icon}
                    </div>
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("rounded-2xl p-8", glassStyles.medium)}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                  style={{ backgroundColor: solarTheme.secondary[100] }}>
                  <Target className="h-8 w-8" style={{ color: solarTheme.secondary[600] }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 mb-6">
                  To create a world where clean, renewable energy is the primary source of power,
                  making our planet healthier and more sustainable for generations to come.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg">Carbon Neutral</div>
                    <div>by 2030</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg">100% Clean</div>
                    <div>Energy Future</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16" style={{ backgroundColor: `rgba(${solarTheme.primary[50].split(' ').join(', ')}, 0.3)` }}>
        <div className="container-solar">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work and define our commitment to customers and the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className={cn("rounded-xl p-6 hover-lift", glassStyles.light)}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: solarTheme.primary[100] }}>
                    <div style={{ color: solarTheme.primary[600] }}>
                      {value.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16">
        <div className="container-solar">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to industry leadership - here&apos;s how we&apos;ve grown over the years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className={cn("rounded-xl p-6 text-center hover-lift", glassStyles.light)}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                  style={{ backgroundColor: solarTheme.secondary[100] }}>
                  <span className="text-sm font-bold" style={{ color: solarTheme.secondary[600] }}>
                    {milestone.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-600">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Impact Section */}
      <div className="py-16" style={{ backgroundColor: `rgba(${solarTheme.primary[50].split(' ').join(', ')}, 0.3)` }}>
        <div className="container-solar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={cn("rounded-2xl p-8", glassStyles.medium)}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                  style={{ backgroundColor: solarTheme.primary[100] }}>
                  <Recycle className="h-8 w-8" style={{ color: solarTheme.primary[600] }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">15,000</div>
                    <div className="text-sm text-gray-600">Tons CO₂ Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">8,500</div>
                    <div className="text-sm text-gray-600">Trees Equivalent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">50MW</div>
                    <div className="text-sm text-gray-600">Clean Energy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Renewable</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Making a Difference
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Every solar installation makes a real impact on our planet&apos;s future.
                Our customers have collectively prevented thousands of tons of CO₂ emissions,
                equivalent to planting thousands of trees.
              </p>
              <p className="text-gray-600 mb-8">
                We&apos;re proud to be part of the clean energy revolution, helping families and businesses
                reduce their carbon footprint while saving money on electricity bills.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: solarTheme.primary[100] }}>
                    <Battery className="h-6 w-6" style={{ color: solarTheme.primary[600] }} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Energy Storage Solutions</div>
                    <div className="text-sm text-gray-600">Store excess energy for use anytime</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: solarTheme.primary[100] }}>
                    <Zap className="h-6 w-6" style={{ color: solarTheme.primary[600] }} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">High Efficiency Panels</div>
                    <div className="text-sm text-gray-600">Maximum energy production in minimal space</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container-solar">
          <div className={cn("rounded-2xl p-8 md:p-12 text-center", glassStyles.medium)}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Join the Solar Revolution?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover how much you can save with solar energy. Get your free, no-obligation quote today
              and take the first step toward energy independence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-solar px-8 py-4" onClick={handleGetFreeSolarQuote}>
                Get Free Solar Quote
              </button>
              <button className="btn-solar-outline px-8 py-4" onClick={handleScheduleConsultation}>
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}