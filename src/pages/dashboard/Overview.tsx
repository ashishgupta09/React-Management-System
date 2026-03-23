import { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { getUsers } from "../../services/userService";
import type { UserFormData } from "../../interfaces/user.interface";
import "../../styles/overview.css";

function Overview() {
    const [users, setUsers] = useState<UserFormData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load overview data", error);
        } finally {
            setLoading(false);
        }
    };

    const roleChartData = useMemo(() => {
        const counts = users.reduce<Record<string, number>>((acc, user) => {
            const role = user.role?.trim() || "user";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [users]);

    const genderChartData = useMemo(() => {
        const counts = users.reduce<Record<string, number>>((acc, user) => {
            const gender = user.gender?.trim() || "unknown";
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [users]);

    const bloodGroupChartData = useMemo(() => {
        const counts = users.reduce<Record<string, number>>((acc, user) => {
            const bloodGroup = user.bloodGroup?.trim() || "unknown";
            acc[bloodGroup] = (acc[bloodGroup] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [users]);

    const monthlyChartData = useMemo(() => {
        const counts = users.reduce<Record<string, number>>((acc, user) => {
            const rawDate =
                (user as UserFormData & { createdAt?: string }).createdAt || user.birthDate;

            if (!rawDate) {
                acc["Unknown"] = (acc["Unknown"] || 0) + 1;
                return acc;
            }

            const date = new Date(rawDate);

            if (Number.isNaN(date.getTime())) {
                acc["Unknown"] = (acc["Unknown"] || 0) + 1;
                return acc;
            }

            const monthKey = `${date.toLocaleString("default", {
                month: "short",
            })} ${date.getFullYear()}`;

            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [users]);

    const COLORS = ["#2563eb", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];

    return (
        <div className="overview-page">
            <div className="overview-header">
                <h1>Overview</h1>
                <p>Analytics and insights from user data</p>
            </div>

            <div className="overview-stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Roles</h3>
                    <p>{roleChartData.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Genders</h3>
                    <p>{genderChartData.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Blood Groups</h3>
                    <p>{bloodGroupChartData.length}</p>
                </div>
            </div>

            {loading ? (
                <div className="chart-card">
                    <p>Loading charts...</p>
                </div>
            ) : (
                <div className="charts-grid">
                    <div className="chart-card">
                        <h2>Users by Role</h2>
                        <div className="chart-box">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={roleChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h2>Users by Gender</h2>
                        <div className="chart-box">
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={genderChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        label
                                    >
                                        {genderChartData.map((entry, index) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h2>Users by Blood Group</h2>
                        <div className="chart-box">
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={bloodGroupChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        label
                                    >
                                        {bloodGroupChartData.map((entry, index) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h2>Users by Month</h2>
                        <div className="chart-box">
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Overview;