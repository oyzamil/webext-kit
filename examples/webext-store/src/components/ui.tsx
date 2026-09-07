import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Card({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {subtitle && (
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-300',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 disabled:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 disabled:bg-rose-300',
};

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${props.className ?? ''}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${props.className ?? ''}`}
    />
  );
}

export function Select({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select
      {...props}
      className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-40 overflow-auto rounded-md bg-slate-900 p-2.5 text-[11px] leading-relaxed text-emerald-300">
      {JSON.stringify(value, null, 2) ?? 'null'}
    </pre>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function LogList({ entries }: { entries: string[] }) {
  return (
    <ul className="max-h-32 space-y-1 overflow-auto rounded-md bg-slate-50 p-2 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
      {entries.length === 0 && <li className="italic text-slate-400">No events yet.</li>}
      {entries.map((entry, i) => (
        <li key={i} className="border-b border-slate-200/60 pb-1 last:border-0 dark:border-slate-700/60">
          {entry}
        </li>
      ))}
    </ul>
  );
}
