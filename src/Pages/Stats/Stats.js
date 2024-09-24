import React, { useState, useEffect } from 'react';
import './Stats.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Stats = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    atRiskStudents: 0,
    interventions: 0,
    dropoutRate: 0,
    trends: [],
    atRiskPerMonth: [],
    interventionsDistribution: [],
  });

  useEffect(() => {
    // Simulate fetching data
    const responseData = {
      totalStudents: 500,
      atRiskStudents: 75,
      interventions: 50,
      dropoutRate: 12.5,
      trends: [
        { month: 'January', rate: 10 },
        { month: 'February', rate: 12 },
        { month: 'March', rate: 14 },
        { month: 'April', rate: 11 },
        { month: 'May', rate: 9 },
      ],
      atRiskPerMonth: [
        { month: 'January', atRisk: 10 },
        { month: 'February', atRisk: 15 },
        { month: 'March', atRisk: 18 },
        { month: 'April', atRisk: 12 },
        { month: 'May', atRisk: 20 },
      ],
      interventionsDistribution: [
        { name: 'Counseling', value: 20 },
        { name: 'Parent Meetings', value: 15 },
        { name: 'Tutoring', value: 10 },
        { name: 'Financial Aid', value: 5 },
      ],
    };
    setData(responseData);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="report-container">
      <h1 className='report-head'>Statistical Report</h1>

      <div className="report-summary">
        <div className="report-card">
          <h2>Total Students</h2>
          <p>{data.totalStudents}</p>
        </div>
        <div className="report-card">
          <h2>At Risk Students</h2>
          <p>{data.atRiskStudents}</p>
        </div>
        <div className="report-card">
          <h2>Interventions</h2>
          <p>{data.interventions}</p>
        </div>
        <div className="report-card">
          <h2>Dropout Rate (%)</h2>
          <p>{data.dropoutRate}%</p>
        </div>
      </div>

      <div className="charts-section">
        {/* First Row */}
        <div className="chart-wrapper">
          <h2>Dropout Rate Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.trends}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#5e548e" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h2>Intervention Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.interventionsDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.interventionsDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Second Row */}
        <div className="chart-wrapper">
          <h2>At-Risk Students per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.atRiskPerMonth} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="atRisk" fill="#9f86c0" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
          
        </div>
      </div>
    </div>
  );
};

export default Stats;

