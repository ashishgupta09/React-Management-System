import "../styles/skeleton.css";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    variant?: "text" | "circle" | "rect" | "rounded";
    className?: string;
}

export function Skeleton({
    width = "100%",
    height = "20px",
    variant = "rounded",
    className = "",
}: SkeletonProps) {
    const style = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
        />
    );
}

export function SkeletonStatCard() {
    return (
        <div className="skeleton-stat-card">
            <div className="skeleton-stat-label">
                <Skeleton width="60%" height="12px" />
            </div>
            <div className="skeleton-stat-value">
                <Skeleton width="80%" height="32px" />
            </div>
        </div>
    );
}

export function SkeletonTableRow({ columns = 9 }: { columns?: number }) {
    return (
        <tr className="skeleton-row">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i}>
                    <Skeleton height="40px" />
                </td>
            ))}
        </tr>
    );
}

export function SkeletonTable({
    rows = 8,
    columns = 9,
}: {
    rows?: number;
    columns?: number;
}) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonTableRow key={i} columns={columns} />
            ))}
        </>
    );
}

export function SkeletonChartCard() {
    return (
        <div className="skeleton-chart-card">
            <div className="skeleton-chart-header">
                <Skeleton width="40%" height="12px" />
            </div>
            <div className="skeleton-chart-body">
                <Skeleton width="100%" height="200px" />
            </div>
        </div>
    );
}

export function SkeletonFormField() {
    return (
        <div className="skeleton-form-field">
            <div className="skeleton-label">
                <Skeleton width="50%" height="12px" />
            </div>
            <div className="skeleton-input">
                <Skeleton width="100%" height="44px" />
            </div>
        </div>
    );
}

export function SkeletonFormSection({ fields = 6 }: { fields?: number }) {
    return (
        <div className="skeleton-form-section">
            <div className="skeleton-section-title">
                <Skeleton width="40%" height="16px" />
            </div>
            <div className="skeleton-form-grid">
                {Array.from({ length: fields }).map((_, i) => (
                    <SkeletonFormField key={i} />
                ))}
            </div>
        </div>
    );
}

export function SkeletonAvatarWithText() {
    return (
        <div className="skeleton-avatar-text">
            <Skeleton width="44px" height="44px" variant="circle" />
            <Skeleton width="80%" height="16px" />
        </div>
    );
}