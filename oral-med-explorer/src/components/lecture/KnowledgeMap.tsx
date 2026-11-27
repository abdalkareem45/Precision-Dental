import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, LocateFixed, Maximize2, Minimize2, Network } from 'lucide-react';
import type { KnowledgeNode, LectureSectionKey } from '@/src/types/lecture';

interface KnowledgeMapProps {
  nodes: KnowledgeNode[];
  onNavigateSection: (section: LectureSectionKey) => void;
}

const CATEGORY_STYLES: Record<
  KnowledgeNode['category'],
  { fill: string; border: string; badge: string }
> = {
  Core: {
    fill: '#1B3A8C',
    border: '#93C5FD',
    badge: 'bg-[#1B3A8C]/12 text-[#1B3A8C] dark:bg-[#3B82F6]/20 dark:text-[#93C5FD]',
  },
  Anatomy: {
    fill: '#0F766E',
    border: '#5EEAD4',
    badge: 'bg-teal-500/15 text-teal-800 dark:text-teal-300',
  },
  Pathology: {
    fill: '#B91C1C',
    border: '#FCA5A5',
    badge: 'bg-red-500/15 text-red-800 dark:text-red-300',
  },
  Diagnostic: {
    fill: '#B45309',
    border: '#FCD34D',
    badge: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
  },
  Treatment: {
    fill: '#047857',
    border: '#6EE7B7',
    badge: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
  },
};

// Lecture node coordinates live in roughly x: 180..820, y: 70..500 (1000x560 canvas space)
const VIEWBOX_W = 1000;
const VIEWBOX_H = 560;

function toCanvasCoords(node: KnowledgeNode): { x: number; y: number } {
  // Support either 0..1000 coordinates (used across lectures 1-10) or normalized 0..100 coordinates
  const x = node.x <= 100 ? (node.x / 100) * 820 + 90 : node.x;
  const y = node.y <= 100 ? (node.y / 100) * 420 + 70 : node.y;
  return { x, y };
}

export const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ nodes, onNavigateSection }) => {
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id || '');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  // Reset selection and camera when switching lectures
  useEffect(() => {
    setSelectedId(nodes[0]?.id || '');
    setHoveredId(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, KnowledgeNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ from: KnowledgeNode; to: KnowledgeNode; key: string }> = [];
    for (const node of nodes) {
      for (const targetId of node.connections) {
        const target = nodeMap.get(targetId);
        if (!target) continue;
        const pairKey = [node.id, target.id].sort().join('--');
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);
        list.push({ from: node, to: target, key: pairKey });
      }
    }
    return list;
  }, [nodes, nodeMap]);

  const activeNode = nodeMap.get(selectedId) || nodes[0];
  const hoveredNode = hoveredId ? nodeMap.get(hoveredId) : null;

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[data-node-id]')) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore if not captured
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(1.8, Math.max(0.65, +(z + delta).toFixed(2))));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <section
      id="section-knowledge-map"
      aria-labelledby="knowledge-map-heading"
      className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
            <Network className="w-3.5 h-3.5" />
            Section 02 • Interactive Knowledge Map
          </div>
          <h2 id="knowledge-map-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
            Visual Concept Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Drag to pan, scroll or use buttons to zoom, hover for summaries, and click any concept node to open its learning module.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
            aria-label="Zoom out knowledge map"
            className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-[#0B1F4D] dark:text-slate-200 hover:border-[#1B3A8C] cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs px-2 tabular-nums text-slate-600 dark:text-slate-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
            aria-label="Zoom in knowledge map"
            className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-[#0B1F4D] dark:text-slate-200 hover:border-[#1B3A8C] cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-xs font-medium text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B] cursor-pointer"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(['Core', 'Anatomy', 'Pathology', 'Diagnostic', 'Treatment'] as const).map((cat) => (
          <span key={cat} className={`px-2.5 py-0.5 rounded-md font-medium ${CATEGORY_STYLES[cat].badge}`}>
            {cat}
          </span>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-stretch">
        {/* Interactive Pannable / Zoomable SVG Map */}
        <div className="lg:col-span-8 relative rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#0B1220] overflow-hidden h-[360px] sm:h-[420px]">
          <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            role="img"
            aria-label="Interactive Oral Medicine concept network"
          >
            {/* Subtle clinical grid */}
            <defs>
              <pattern id="concept-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#concept-grid)" />

            <g
              transform={`translate(${VIEWBOX_W / 2 + pan.x}, ${VIEWBOX_H / 2 + pan.y}) scale(${zoom}) translate(${-VIEWBOX_W / 2}, ${-VIEWBOX_H / 2})`}
            >
              {/* Connection edges */}
              {edges.map(({ from, to, key }) => {
                const p1 = toCanvasCoords(from);
                const p2 = toCanvasCoords(to);
                const isHighlighted =
                  activeNode?.id === from.id ||
                  activeNode?.id === to.id ||
                  hoveredId === from.id ||
                  hoveredId === to.id;
                const mx = (p1.x + p2.x) / 2;
                const my = (p1.y + p2.y) / 2 - 22;
                return (
                  <path
                    key={key}
                    d={`M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={isHighlighted ? '#C9A24B' : '#475569'}
                    strokeWidth={isHighlighted ? 3 : 1.75}
                    strokeOpacity={isHighlighted ? 0.95 : 0.72}
                    strokeDasharray={isHighlighted ? undefined : '5 3'}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const { x: cx, y: cy } = toCanvasCoords(node);
                const style = CATEGORY_STYLES[node.category];
                const isSelected = activeNode?.id === node.id;
                const isHovered = hoveredId === node.id;

                return (
                  <g
                    key={node.id}
                    data-node-id={node.id}
                    transform={`translate(${cx}, ${cy})`}
                    onClick={() => setSelectedId(node.id)}
                    onDoubleClick={() => onNavigateSection(node.targetSection)}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label} (${node.category})`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(node.id);
                      }
                    }}
                  >
                    {(isSelected || isHovered) && (
                      <rect
                        x="-98"
                        y="-34"
                        width="196"
                        height="68"
                        rx="18"
                        fill={style.border}
                        fillOpacity="0.22"
                      />
                    )}
                    <rect
                      x="-90"
                      y="-27"
                      width="180"
                      height="54"
                      rx="13"
                      fill={style.fill}
                      stroke={isSelected ? '#E4C16E' : style.border}
                      strokeWidth={isSelected ? 3 : 1.6}
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {node.label.length > 22 ? `${node.label.slice(0, 20)}…` : node.label}
                    </text>
                    <text
                      x="0"
                      y="15"
                      textAnchor="middle"
                      fill="#CBD5E1"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {node.category.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Hover summary tooltip */}
          {hoveredNode && (
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm rounded-xl bg-[#111827]/95 border border-[#C9A24B]/50 p-3 text-xs text-slate-200 shadow-lg">
              <div className="font-bold text-white mb-0.5">{hoveredNode.label}</div>
              <p className="text-slate-300 leading-snug">{hoveredNode.summary}</p>
            </div>
          )}
        </div>

        {/* Selected Node Inspector */}
        <div className="lg:col-span-4 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 flex flex-col justify-between gap-4">
          {activeNode ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${CATEGORY_STYLES[activeNode.category].badge}`}>
                    {activeNode.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    Target: {activeNode.targetSection}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
                  {activeNode.label}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeNode.summary}
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Takeaways
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeNode.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateSection(activeNode.targetSection)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3A8C] hover:bg-[#0B1F4D] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Open Linked Learning Module
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Accessible node index buttons for keyboard/mobile navigation */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={() => setSelectedId(node.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeNode?.id === node.id
                ? 'bg-[#1B3A8C] text-white dark:bg-[#3B82F6]'
                : 'bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] text-slate-700 dark:text-slate-300 hover:border-[#1B3A8C]'
            }`}
          >
            {node.label}
          </button>
        ))}
      </div>
    </section>
  );
};
