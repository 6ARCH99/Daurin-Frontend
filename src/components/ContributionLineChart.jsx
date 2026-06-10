/** Line chart for 6-month waste contribution (Impact page design). */
export default function ContributionLineChart({ labels = [], values = [], loading }) {
  const width = 640;
  const height = 260;
  const pad = { top: 24, right: 24, bottom: 36, left: 44 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const maxVal = Math.max(...values, 1);
  const yStep = 7;
  const yMax = Math.max(yStep * 4, Math.ceil(maxVal / yStep) * yStep);
  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const points = values.map((v, i) => {
    const x = pad.left + (values.length <= 1 ? chartW / 2 : (i / (values.length - 1)) * chartW);
    const y = pad.top + chartH - (v / yMax) * chartH;
    return { x, y, v, label: labels[i] };
  });

  const linePath =
    points.length > 0
      ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      : '';

  if (loading) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
        Memuat grafik…
      </div>
    );
  }

  if (!values.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-gray-400 text-center px-6">
        Data grafik belum tersedia. Pastikan backend berjalan dan Anda sudah login.
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto max-h-[300px]"
      role="img"
      aria-label="Grafik trend kontribusi sampah 6 bulan"
    >
      {/* Horizontal grid */}
      {yTicks.map((tick) => {
        const y = pad.top + chartH - (tick / yMax) * chartH;
        return (
          <g key={tick}>
            <line
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              stroke="#E8E8E4"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={pad.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-gray-400 text-[11px] font-medium"
              style={{ fontSize: 11 }}
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* Y-axis label */}
      <text
        x={12}
        y={pad.top + chartH / 2}
        textAnchor="middle"
        transform={`rotate(-90, 12, ${pad.top + chartH / 2})`}
        className="fill-gray-400 text-[10px] font-bold"
        style={{ fontSize: 10 }}
      >
        kg
      </text>

      {/* Vertical grid */}
      {points.map((p, i) => (
        <line
          key={`v-${i}`}
          x1={p.x}
          y1={pad.top}
          x2={p.x}
          y2={pad.top + chartH}
          stroke="#E8E8E4"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Trend line */}
      <path
        d={linePath}
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#2D6A4F" strokeWidth="2.5" />
          <text
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            className="fill-gray-500 text-[11px] font-bold"
            style={{ fontSize: 11 }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
