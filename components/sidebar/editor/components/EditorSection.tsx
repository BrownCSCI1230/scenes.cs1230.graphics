type EditorSectionProps = {
  label: string;
  children?: React.ReactNode;
};

export default function EditorSection({ label, children }: EditorSectionProps) {
  return (
    <div className="flex flex-col">
      <h4 className="rounded-t-md bg-slate-100 p-2 text-sm font-medium">
        {label}
      </h4>
      <div className="flex flex-col gap-2 rounded-b-md bg-slate-25 p-2">
        {children}
      </div>
    </div>
  );
}
