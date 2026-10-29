import { useEffect, useRef, useState } from "react";

// Definitions for each object type
const defs = {
  mesa: { w: 60, h: 100, fill: "#cfe2f3", stroke: "#2c6e91" },
  banco: { w: 40, h: 200, fill: "#d9ead3", stroke: "#38761d" },
  pizarron: { w: 120, h: 30, fill: "#fff2cc", stroke: "#b45f06" },
  panel: { w: 80, h: 80, fill: "#f4cccc", stroke: "#990000" },
};

export default function FloorPlan({
  onAdd, // function(type) to add an object
  onReset,
}) {
  const svgRef = useRef(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 600 });
  const [objects, setObjects] = useState([]);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [dragIdx, setDragIdx] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Load saved layout
  useEffect(() => {
    const raw = localStorage.getItem("utnLayout");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setObjects(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save layout whenever objects change
  useEffect(() => {
    localStorage.setItem("utnLayout", JSON.stringify(objects));
  }, [objects]);

  // Zoom handling
  const onWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const wx = viewBox.x + (mx / rect.width) * viewBox.w;
    const wy = viewBox.y + (my / rect.height) * viewBox.h;
    const newW = viewBox.w * scale;
    const newH = viewBox.h * scale;
    const newX = wx - (mx / rect.width) * newW;
    const newY = wy - (my / rect.height) * newH;
    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  };

  const onMouseDown = (e) => {
    // Start pan if clicking on empty svg area
    if (e.target === svgRef.current) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseMove = (e) => {
    if (isPanning) {
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const dx = ((panStart.current.x - e.clientX) / rect.width) * viewBox.w;
      const dy = ((panStart.current.y - e.clientY) / rect.height) * viewBox.h;
      setViewBox((vb) => ({ ...vb, x: vb.x + dx, y: vb.y + dy }));
      panStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseUp = () => {
    setIsPanning(false);
    setDragIdx(null);
  };

  // Object dragging
  const onObjectMouseDown = (e, idx) => {
    e.stopPropagation();
    setDragIdx(idx);
    const svg = svgRef.current;
    const pt = {
      x: e.clientX,
      y: e.clientY,
    };
    const rect = svg.getBoundingClientRect();
    const curX = (pt.x - rect.left) / rect.width * viewBox.w + viewBox.x;
    const curY = (pt.y - rect.top) / rect.height * viewBox.h + viewBox.y;
    const obj = objects[idx];
    dragOffset.current = { x: curX - obj.x, y: curY - obj.y };
  };

  const onObjectMouseMove = (e) => {
    if (dragIdx === null) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const pt = {
      x: e.clientX,
      y: e.clientY,
    };
    const curX = (pt.x - rect.left) / rect.width * viewBox.w + viewBox.x;
    const curY = (pt.y - rect.top) / rect.height * viewBox.h + viewBox.y;
    setObjects((prev) => {
      const copy = [...prev];
      copy[dragIdx] = { ...copy[dragIdx], x: curX - dragOffset.current.x, y: curY - dragOffset.current.y };
      return copy;
    });
  };

  // Public methods
  const addObject = (type) => {
    const d = defs[type];
    const newObj = { type, x: viewBox.x + 100, y: viewBox.y + 100, w: d.w, h: d.h };
    setObjects((prev) => [...prev, newObj]);
  };

  const reset = () => {
    setObjects([]);
  };

  // Expose to parent via callbacks if needed
  useEffect(() => {
    if (onAdd) onAdd(addObject);
    if (onReset) onReset(reset);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      className="border border-gray-400 bg-white cursor-pointer w-full h-full"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={isPanning ? onMouseMove : onObjectMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Simple grid background */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      {/* Objects */}
      {objects.map((obj, idx) => {
        const d = defs[obj.type];
        return (
          <rect
            key={idx}
            x={obj.x}
            y={obj.y}
            width={d.w}
            height={d.h}
            fill={d.fill}
            stroke={d.stroke}
            strokeWidth={2}
            className="cursor-move hover:stroke-orange-500 hover:stroke-3"
            onMouseDown={(e) => onObjectMouseDown(e, idx)}
          />
        );
      })}
    </svg>
  );
}
