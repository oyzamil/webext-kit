interface SharedPanelProps {
  label: string;
}

// Same component, same Tailwind utility classes, imported into 3 separate
// WXT entrypoints. Each entrypoint bundles its own copy of tailwind.css,
// so this one component's styles end up shipped 3 times in .output.
export function SharedPanel({ label }: SharedPanelProps) {
  return (
    <div className="panel flex items-center gap-2 text-sm text-brand-900">
      <span className="badge">{label}</span>
      <span>shared tailwind.css entrypoint</span>
    </div>
  );
}
