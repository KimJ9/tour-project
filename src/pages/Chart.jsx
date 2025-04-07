// src/pages/Chart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const ChartPage = () => {
  const [chartData, setChartData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [categoryPieData, setCategoryPieData] = useState([]);

  useEffect(() => {
    const rawLogs = JSON.parse(localStorage.getItem("searchLogs") || "[]");

    // ✅ 연령대별 카테고리 검색 수 집계
    const categoryByAge = {};
    rawLogs.forEach((log) => {
      const { ageGroup, category } = log;
      if (!categoryByAge[ageGroup]) categoryByAge[ageGroup] = {};
      if (!categoryByAge[ageGroup][category]) categoryByAge[ageGroup][category] = 0;
      categoryByAge[ageGroup][category]++;
    });

    // ✅ 연령대별로 가장 많이 검색된 카테고리 추출
    const topCategoryByAge = {};
    Object.entries(categoryByAge).forEach(([age, categories]) => {
      const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (topCategory) topCategoryByAge[age] = topCategory;
    });

    // ✅ 연령대 + Top 카테고리 기준으로 Top 3 항목 추천
    const itemCountByAgeAndCategory = {};
    rawLogs.forEach((log) => {
      const { ageGroup, category, name } = log;
      const topCat = topCategoryByAge[ageGroup];
      if (category === topCat) {
        const key = `${ageGroup}-${name}`;
        if (!itemCountByAgeAndCategory[key]) itemCountByAgeAndCategory[key] = 0;
        itemCountByAgeAndCategory[key]++;
      }
    });

    const recommendations = Object.keys(topCategoryByAge).map((ageGroup) => {
      const topCategory = topCategoryByAge[ageGroup];

      const filtered = Object.entries(itemCountByAgeAndCategory)
        .filter(([key]) => key.startsWith(ageGroup + "-"))
        .map(([key, count]) => {
          const name = key.split("-")[1];
          return { name, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        ageGroup,
        topCategory,
        topItems: filtered,
      };
    });

    // ✅ 연령대별 총 검색 수 (BarChart)
    const chartData = Object.entries(categoryByAge).map(([ageGroup, categoryCounts]) => {
      const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
      return { ageGroup, count: total };
    });

    // ✅ 전체 카테고리별 검색 횟수 (PieChart)
    const categoryCounts = {};
    rawLogs.forEach((log) => {
      if (!categoryCounts[log.category]) categoryCounts[log.category] = 0;
      categoryCounts[log.category]++;
    });
    const pieData = Object.entries(categoryCounts).map(([category, value]) => ({
      name: category,
      value,
    }));

    setChartData(chartData);
    setRecommendations(recommendations);
    setCategoryPieData(pieData);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 연령대별 검색 기록 통계</h2>

      {/* 막대그래프 */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="ageGroup" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="검색 수" />
        </BarChart>
      </ResponsiveContainer>

      {/* 파이차트 */}
      <div style={{ marginTop: "50px" }}>
        <h3>🥧 카테고리별 전체 검색 비율</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={categoryPieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {categoryPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 추천 항목 */}
      <div style={{ marginTop: "50px" }}>
        <h3>🎯 연령대별 인기 카테고리 기반 추천</h3>
        {recommendations.map((rec) => (
          <div key={rec.ageGroup} style={{ marginTop: "20px" }}>
            <strong>👤 [{rec.ageGroup}]</strong> 가장 많이 검색한 카테고리: <b>{rec.topCategory}</b>
            <ul style={{ marginTop: "5px" }}>
              {rec.topItems.map((item, index) => (
                <li key={index}>
                  🏆 {index + 1}위: <strong>{item.name}</strong> ({item.count}회)
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartPage;