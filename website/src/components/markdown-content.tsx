import type { ReactNode } from 'react';
import { MermaidDiagram } from '@/components/mermaid-diagram';

interface MarkdownContentProps {
  content: string;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-blue-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      const label = linkMatch[1] ?? '';
      const href = linkMatch[2] ?? '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          key={index}
          href={href}
          className="text-blue-400 underline-offset-2 hover:text-blue-300 hover:underline"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? '';

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="mb-6 text-3xl font-bold text-white">
          {line.slice(2)}
        </h1>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={index}
          id={slugify(line.slice(3))}
          className="mb-4 mt-10 scroll-mt-24 text-2xl font-semibold text-white"
        >
          {line.slice(3)}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="mb-3 mt-8 text-xl font-semibold text-slate-200">
          {line.slice(4)}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={index} className="mb-2 mt-6 text-lg font-semibold text-slate-300">
          {line.slice(5)}
        </h4>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('```mermaid')) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index]?.startsWith('```')) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }
      elements.push(
        <MermaidDiagram key={`mermaid-${String(index)}`} chart={codeLines.join('\n')} />,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index]?.startsWith('```')) {
        codeLines.push(lines[index] ?? '');
        index += 1;
      }
      elements.push(
        <pre
          key={`code-${String(index)}`}
          className="my-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index]?.trim().startsWith('|')) {
        tableLines.push(lines[index]?.trim() ?? '');
        index += 1;
      }
      const rows = tableLines.filter((row) => !row.includes('---'));
      elements.push(
        <div key={`table-${String(index)}`} className="my-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <tbody>
              {rows.map((row, rowIndex) => {
                const cells = row
                  .split('|')
                  .filter(Boolean)
                  .map((cell) => cell.trim());
                const CellTag = rowIndex === 0 ? 'th' : 'td';
                return (
                  <tr key={rowIndex} className="border-b border-slate-800">
                    {cells.map((cell, cellIndex) => (
                      <CellTag
                        key={cellIndex}
                        className={
                          rowIndex === 0
                            ? 'px-3 py-2 text-left font-semibold text-slate-200'
                            : 'px-3 py-2 text-slate-400'
                        }
                      >
                        {renderInline(cell)}
                      </CellTag>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length && lines[index]?.trim().startsWith('- ')) {
        items.push(lines[index]?.trim().slice(2) ?? '');
        index += 1;
      }
      elements.push(
        <ul key={`list-${String(index)}`} className="my-4 list-disc space-y-2 pl-6 text-slate-400">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index]?.trim() ?? '')) {
        items.push(lines[index]?.trim().replace(/^\d+\.\s/, '') ?? '');
        index += 1;
      }
      elements.push(
        <ol
          key={`olist-${String(index)}`}
          className="my-4 list-decimal space-y-2 pl-6 text-slate-400"
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.startsWith('---')) {
      elements.push(<hr key={index} className="my-8 border-slate-800" />);
      index += 1;
      continue;
    }

    elements.push(
      <p key={index} className="my-3 leading-relaxed text-slate-400">
        {renderInline(line)}
      </p>,
    );
    index += 1;
  }

  return <article className="prose-invert max-w-none">{elements}</article>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
