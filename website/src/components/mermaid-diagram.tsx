'use client';

import { useEffect, useId, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    cancelledRef.current = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      });

      const container = containerRef.current;
      if (!container || cancelledRef.current) {
        return;
      }

      const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
      // Effect may unmount while mermaid.render is in flight.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- cleanup runs during await
      if (cancelledRef.current) {
        return;
      }

      container.innerHTML = svg;
    }

    void render();

    return () => {
      cancelledRef.current = true;
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
