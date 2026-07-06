'use client';

import { useEffect, useId, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      });

      if (!containerRef.current || cancelled) {
        return;
      }

      const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60 p-4"
      role="img"
      aria-label="Architecture diagram"
    />
  );
}
