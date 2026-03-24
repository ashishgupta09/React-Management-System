import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../../services/userService";
import type { UserData } from "../../interfaces/user.interface";
import { SkeletonStatCard, SkeletonTable } from "../../components/Skeleton";
import "../../styles/reports.css";

function Reports() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const matchesSearch =
                fullName.includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.username.toLowerCase().includes(search.toLowerCase());

            const matchesRole = roleFilter
                ? (user.role || "").toLowerCase() === roleFilter.toLowerCase()
                : true;

            const matchesGender = genderFilter
                ? (user.gender || "").toLowerCase() === genderFilter.toLowerCase()
                : true;

            return matchesSearch && matchesRole && matchesGender;
        });
    }, [users, search, roleFilter, genderFilter]);

    const totalUsers = filteredUsers.length;
    const totalAdmins = filteredUsers.filter((user) => user.role === "admin").length;
    const totalMale = filteredUsers.filter(
        (user) => user.gender?.toLowerCase() === "male"
    ).length;
    const totalFemale = filteredUsers.filter(
        (user) => user.gender?.toLowerCase() === "female"
    ).length;

    const uniqueRoles = [...new Set(users.map((user) => user.role).filter(Boolean))];
    const uniqueGenders = [
        ...new Set(users.map((user) => user.gender).filter(Boolean)),
    ];

    const exportToCSV = () => {
        const headers = [
            "ID",
            "First Name",
            "Last Name",
            "Email",
            "Username",
            "Gender",
            "Role",
            "Phone",
            "University",
        ];

        const rows = filteredUsers.map((user) => [
            user._id,
            user.firstName,
            user.lastName,
            user.email,
            user.username,
            user.gender || "",
            user.role || "",
            user.phone || "",
            user.university || "",
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <h1>Reports</h1>
                    <p>Analyze, filter, and export user records</p>
                </div>

                <button className="export-btn" onClick={exportToCSV}>
                    Export CSV
                </button>
            </div>

            <div className="reports-filters">
                <input
                    type="text"
                    placeholder="Search by name, email, username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    {uniqueRoles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>

                <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                >
                    <option value="">All Genders</option>
                    {uniqueGenders.map((gender) => (
                        <option key={gender} value={gender}>
                            {gender}
                        </option>
                    ))}
                </select>
            </div>

            <div className="reports-stats">
                {loading ? (
                    <>
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                        <SkeletonStatCard />
                    </>
                ) : (
                    <>
                        <div className="report-card">
                            <h3>Total Users</h3>
                            <p>{totalUsers}</p>
                        </div>

                        <div className="report-card">
                            <h3>Total Admins</h3>
                            <p>{totalAdmins}</p>
                        </div>

                        <div className="report-card">
                            <h3>Male Users</h3>
                            <p>{totalMale}</p>
                        </div>

                        <div className="report-card">
                            <h3>Female Users</h3>
                            <p>{totalFemale}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="reports-table-card">
                {loading ? (
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Gender</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>University</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SkeletonTable rows={8} columns={8} />
                        </tbody>
                    </table>
                ) : (
                    <div className="reports-table-wrapper">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Username</th>
                                    <th>Gender</th>
                                    <th>Role</th>
                                    <th>Phone</th>
                                    <th>University</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{index + 1}</td>
                                            <td>{`${user.firstName} ${user.lastName}`}</td>
                                            <td>{user.email}</td>
                                            <td>{user.username}</td>
                                            <td>{user.gender || "-"}</td>
                                            <td>{user.role || "-"}</td>
                                            <td>{user.phone || "-"}</td>
                                            <td>{user.university || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="empty-text">
                                            No report data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reports;