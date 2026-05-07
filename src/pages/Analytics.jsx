import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, AreaChart, Area, ScatterChart, Scatter, Cell, ZAxis
} from 'recharts';
import * as XLSX from 'xlsx';

export default function Analytics() {
    const [rawCleanData, setRawCleanData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [timeData, setTimeData] = useState([]);
    const [stats, setStats] = useState({ total: 0, avg: 0, satisfaction: 0 });
    const [loading, setLoading] = useState(true);
    const [kValue, setKValue] = useState(3);

    const COLORS = ['#e11d48', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [bookingsRes, reviewsRes] = await Promise.all([
                    supabase.from('bookings').select('*'),
                    supabase.from('reviews').select('rating')
                ]);

                if (bookingsRes.data) {
                    const clean = bookingsRes.data.filter(item => Number(item.price) > 0);
                    setRawCleanData(clean);

                    const total = clean.reduce((sum, item) => sum + Number(item.price), 0);
                    const destMap = {};
                    const timeMap = {};

                    clean.forEach(item => {
                        // 1. معالجة الوجهات
                        let name = item.destination_name || "أخرى";
                        destMap[name] = (destMap[name] || 0) + 1;

                        // 2. معالجة التاريخ بدقة لتجنب Invalid Date
                        let dateRaw = new Date(item.created_at);
                        let dateLabel = !isNaN(dateRaw) ? dateRaw.toLocaleDateString('en-GB') : "غير معروف";
                        timeMap[dateLabel] = (timeMap[dateLabel] || 0) + Number(item.price);
                    });

                    let avgSat = 0;
                    if (reviewsRes.data?.length > 0) {
                        avgSat = (reviewsRes.data.reduce((s, r) => s + r.rating, 0) / reviewsRes.data.length).toFixed(1);
                    }

                    setChartData(Object.entries(destMap).map(([name, value]) => ({ name, value })));
                    setTimeData(Object.entries(timeMap).map(([date, amount]) => ({ date, amount })));
                    setStats({ total, avg: (total / clean.length || 0).toFixed(0), satisfaction: avgSat });
                }
            } catch (e) { console.error("Error:", e); }
            finally { setLoading(false); }
        };
        fetchAllData();
    }, []);

    // --- محرك K-means الذكي (Client-side Engine) ---
    const clusteredData = useMemo(() => {
        if (rawCleanData.length === 0) return [];
        let points = rawCleanData.map(item => ({
            x: Number(item.age) || 0,
            y: Number(item.price) || 0,
            name: item.user_name || "زبون"
        }));

        let centroids = points.slice(0, kValue).map(p => ({ x: p.x, y: p.y }));
        let assignments = new Array(points.length);

        for (let iter = 0; iter < 10; iter++) {
            points.forEach((p, i) => {
                let minDist = Infinity;
                centroids.forEach((c, cIdx) => {
                    // Normalization: السعر يُقسم على 100 لموازنة الأوزان إحصائياً
                    const d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y / 100 - c.y / 100, 2));
                    if (d < minDist) { minDist = d; assignments[i] = cIdx; }
                });
            });
            let newC = Array.from({ length: kValue }, () => ({ x: 0, y: 0, count: 0 }));
            points.forEach((p, i) => {
                newC[assignments[i]].x += p.x;
                newC[assignments[i]].y += p.y;
                newC[assignments[i]].count++;
            });
            centroids = newC.map(c => ({
                x: c.count > 0 ? c.x / c.count : Math.random() * 50,
                y: c.count > 0 ? c.y / c.count : Math.random() * 5000
            }));
        }
        return points.map((p, i) => ({ ...p, cluster: assignments[i] }));
    }, [rawCleanData, kValue]);

    // --- ملخص العناقيد للتقرير التفسيري ---
    const clusterSummaries = useMemo(() => {
        const summaries = Array.from({ length: kValue }, (_, i) => ({ id: i, count: 0, ageSum: 0, priceSum: 0 }));
        clusteredData.forEach(p => {
            summaries[p.cluster].count++;
            summaries[p.cluster].ageSum += p.x;
            summaries[p.cluster].priceSum += p.y;
        });
        return summaries.map(s => ({
            ...s,
            avgAge: s.count > 0 ? (s.ageSum / s.count).toFixed(1) : 0,
            avgPrice: s.count > 0 ? (s.priceSum / s.count).toFixed(0) : 0
        }));
    }, [clusteredData, kValue]);

    // --- وظيفة التصدير إلى Excel ---
    const exportToExcel = () => {
        const dataToExport = clusteredData.map((item, index) => ({
            "الرقم التسلسلي": index + 1,
            "الاسم": item.name,
            "السن": item.x,
            "قيمة الطلب (د.ج)": item.y,
            "رقم العنقود (Cluster)": item.cluster + 1,
            "توصية إدارية": item.x < 30 ? "استهداف عروض شبابية" : "استهداف فئة رجال الأعمال"
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "نتائج العنقودة");
        XLSX.writeFile(wb, `SoufSim_Data_Analysis_K${kValue}.xlsx`);
    };

    if (loading) return <div style={loadingStyle}>جاري تحليل البيانات الاستراتيجية...</div>;

    return (
        <div style={containerStyle}>
            {/* Header Section */}
            <div style={headerStyle}>
                <div>
                    <h2 style={{ fontWeight: '900', margin: 0 }}>نظام الذكاء التسويقي <span style={{ color: '#e11d48' }}>K-means BI</span></h2>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>تحليل قطاعات السوق الجزائري بناءً على السلوك الشرائي والسن</p>
                </div>
                <button onClick={exportToExcel} style={btnStyle}>تصدير التقرير (Excel)</button>
            </div>

            {/* KPIs Cards */}
            <div style={statsGrid}>
                <div style={cardStyle("#3b82f6")}>إجمالي الإيرادات: <br /> <strong>{stats.total} د.ج</strong></div>
                <div style={cardStyle("#10b981")}>متوسط السن العام: <br /> <strong>{(rawCleanData.reduce((a, b) => a + (b.age || 0), 0) / rawCleanData.length || 0).toFixed(1)} سنة</strong></div>
                <div style={cardStyle("#f59e0b")}>حجم العينة: <br /> <strong>{rawCleanData.length} زبون</strong></div>
                <div style={cardStyle("#8b5cf6")}>رضا الزبائن: <br /> <strong>{stats.satisfaction} / 5</strong></div>
            </div>

            {/* K-Means Clustering Section */}
            <div style={whiteBox}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>توزيع المجموعات المستهدفة (Market Segments)</h4>
                    <div style={controlPanel}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>عدد القطاعات K = {kValue}</label>
                        <input type="range" min="2" max="6" value={kValue} onChange={(e) => setKValue(parseInt(e.target.value))} style={sliderStyle} />
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="x" name="العمر" unit=" سنة" />
                        <YAxis type="number" dataKey="y" name="السعر" unit=" د.ج" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={clusteredData}>
                            {clusteredData.map((e, i) => <Cell key={i} fill={COLORS[e.cluster % COLORS.length]} />)}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>

                {/* التقرير التفسيري للعناقيد */}
                <div style={clusterGrid}>
                    {clusterSummaries.map((s, i) => (
                        <div key={i} style={{ ...clusterCard, borderRight: `5px solid ${COLORS[i % COLORS.length]}` }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: COLORS[i % COLORS.length] }}>المجموعة {i + 1}</div>
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '5px' }}>
                                العدد: {s.count} زبائن | السن: {s.avgAge} | الإنفاق: {s.avgPrice} د.ج
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Traditional Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "25px" }}>
                <div style={whiteBox}>
                    <h4 style={{ marginBottom: '20px' }}>الاتجاه الزمني للإيرادات</h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#bfdbfe" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div style={whiteBox}>
                    <h4 style={{ marginBottom: '20px' }}>الوجهات الأكثر طلباً</h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// --- Styles Object ---
const containerStyle = { padding: "30px", direction: "rtl", background: "#f1f5f9", minHeight: "100vh", fontFamily: 'Arial' };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "30px" };
const cardStyle = (c) => ({ background: "white", padding: "20px", borderRadius: "15px", borderRight: `6px solid ${c}`, boxShadow: "0 2px 4px rgba(0,0,0,0.05)", textAlign: 'right', fontSize: '14px' });
const whiteBox = { background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" };
const controlPanel = { display: "flex", alignItems: "center", gap: "15px", background: "#f8fafc", padding: "10px 20px", borderRadius: "10px", border: '1px solid #e2e8f0' };
const sliderStyle = { cursor: 'pointer', accentColor: '#e11d48' };
const clusterGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' };
const clusterCard = { padding: '15px', background: '#f8fafc', borderRadius: '10px' };
const btnStyle = { background: "#1e293b", color: "white", border: "none", padding: "12px 25px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };
const loadingStyle = { textAlign: 'center', padding: '100px', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' };