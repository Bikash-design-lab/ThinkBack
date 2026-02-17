import { useState, useRef, useEffect, useCallback } from "react";

const KEYFRAME_NAME = "__scaleLoader_scale__";

function injectKeyframe() {
    if (document.getElementById(KEYFRAME_NAME)) return;
    const style = document.createElement("style");
    style.id = KEYFRAME_NAME;
    style.textContent = `
    @keyframes ${KEYFRAME_NAME} {
      0%   { transform: scaleY(1.0); }
      50%  { transform: scaleY(0.4); }
      100% { transform: scaleY(1.0); }
    }
  `;
    document.head.appendChild(style);
}

function ScaleLoader({
    loading = true,
    color = "#36D7B7",
    height = 35,
    width = 4,
    radius = 2,
    margin = 2,
    speedMultiplier = 1,
    barCount = 5,
    style = {},
    "aria-label": ariaLabel = "Loading",
}) {
    useEffect(() => { injectKeyframe(); }, []);

    if (!loading) return null;

    const duration = 1 / speedMultiplier;
    const delays = Array.from({ length: barCount }, (_, i) =>
        `${(i * 0.1).toFixed(2)}s`
    );

    return (
        <div
            role="status"
            aria-label={ariaLabel}
            style={{ display: "inline-flex", alignItems: "center", ...style }}
        >
            {delays.map((delay, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        backgroundColor: color,
                        width: typeof width === "number" ? `${width}px` : width,
                        height: typeof height === "number" ? `${height}px` : height,
                        margin: `0 ${typeof margin === "number" ? margin : margin}px`,
                        borderRadius: typeof radius === "number" ? `${radius}px` : radius,
                        animation: `${KEYFRAME_NAME} ${duration}s ${delay} ease-in-out infinite`,
                    }}
                />
            ))}
            <span
                style={{
                    position: "absolute",
                    width: 1, height: 1,
                    padding: 0, margin: -1,
                    overflow: "hidden",
                    clip: "rect(0,0,0,0)",
                    whiteSpace: "nowrap",
                    border: 0,
                }}
            >
                {ariaLabel}
            </span>
        </div>
    );
}

export default ScaleLoader;

export function App() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

    const [cfg, setCfg] = useState({
        color: "#36D7B7", height: 35, width: 4,
        radius: 2, margin: 2, speed: 1, bars: 5,
    });
    const [loading, setLoading] = useState(true);

    const update = <K extends keyof typeof cfg>(key: K, val: (typeof cfg)[K]) =>
        setCfg((prev) => ({ ...prev, [key]: val }));

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setDragging(true);
        dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
        e.preventDefault();
    }, [pos]);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const t = e.touches[0];
        setDragging(true);
        dragStart.current = { mx: t.clientX, my: t.clientY, ox: pos.x, oy: pos.y };
    }, [pos]);

    useEffect(() => {
        const onMove = (e: any) => {
            if (!dragging) return;
            const cx = e.clientX ?? e.touches?.[0]?.clientX;
            const cy = e.clientY ?? e.touches?.[0]?.clientY;
            setPos({
                x: dragStart.current.ox + cx - dragStart.current.mx,
                y: dragStart.current.oy + cy - dragStart.current.my,
            });
        };
        const onUp = () => setDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove, { passive: true });
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
        };
    }, [dragging]);

    const SliderRow = ({ label, prop, min, max, step = 1, unit = "" }: any) => (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: "#a0aec0", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>{cfg[prop as keyof typeof cfg]}{unit}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={cfg[prop as keyof typeof cfg]}
                onChange={(e) => update(prop as any, parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: cfg.color, cursor: "pointer" }}
            />
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            display: "flex",
            gap: 20,
            padding: 24,
            boxSizing: "border-box",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "center",
        }}>

            {/* Controls */}
            <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: 20,
                width: 230,
                flexShrink: 0,
                backdropFilter: "blur(12px)",
            }}>
                <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
                    ScaleLoader
                </p>

                <SliderRow label="Height" prop="height" min={10} max={80} unit="px" />
                <SliderRow label="Width" prop="width" min={1} max={20} unit="px" />
                <SliderRow label="Margin" prop="margin" min={0} max={10} unit="px" />
                <SliderRow label="Radius" prop="radius" min={0} max={10} unit="px" />
                <SliderRow label="Speed" prop="speed" min={0.2} max={3} step={0.1} unit="×" />
                <SliderRow label="Bar Count" prop="bars" min={2} max={10} />

                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "#a0aec0", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Color</span>
                        <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>{cfg.color}</span>
                    </div>
                    <input
                        type="color" value={cfg.color}
                        onChange={(e) => update("color", e.target.value)}
                        style={{ width: "100%", height: 34, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }}
                    />
                </div>

                <button onClick={() => setLoading((l) => !l)} style={{
                    width: "100%", padding: "10px 0", borderRadius: 10,
                    background: loading ? "rgba(239,68,68,0.12)" : "rgba(52,211,153,0.12)",
                    border: `1px solid ${loading ? "#ef4444" : "#34d399"} `,
                    color: loading ? "#ef4444" : "#34d399",
                    fontWeight: 700, fontSize: 13, cursor: "pointer", letterSpacing: "0.03em",
                }}>
                    {loading ? "■  Stop" : "▶  Start"}
                </button>
            </div>

            {/* Draggable canvas */}
            <div style={{
                flex: 1,
                minWidth: 300,
                minHeight: 420,
                position: "relative",
                background: "rgba(0,0,0,0.2)",
                border: "1px dashed rgba(255,255,255,0.08)",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <span style={{
                    position: "absolute", top: 12, left: 16,
                    color: "#2d3748", fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.1em", userSelect: "none",
                }}>
                    Drag area
                </span>

                <div
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    style={{
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                        cursor: dragging ? "grabbing" : "grab",
                        userSelect: "none",
                        touchAction: "none",
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: "28px 36px",
                        backdropFilter: "blur(8px)",
                        boxShadow: `0 8px 40px ${cfg.color} 33, 0 2px 8px rgba(0, 0, 0, 0.4)`,
                    }}>
                        <ScaleLoader
                            loading={loading}
                            color={cfg.color}
                            height={cfg.height}
                            width={cfg.width}
                            margin={cfg.margin}
                            radius={cfg.radius}
                            speedMultiplier={cfg.speed}
                            barCount={cfg.bars}
                        />
                    </div>
                    <span style={{
                        color: "#4a5568", fontSize: 10,
                        textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600,
                    }}>
                        {dragging ? "✦ dragging" : "✦ grab me"}
                    </span>
                </div>
            </div>

        </div>
    );
}