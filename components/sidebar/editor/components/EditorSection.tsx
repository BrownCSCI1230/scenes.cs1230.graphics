type EditorSectionProps = {
  label: string;
  children?: React.ReactNode;
};

export default function EditorSection({ label, children }: EditorSectionProps) {
  return (
    <div className="flex flex-col">
      <h4 className="text-sm font-medium bg-slate-100 p-2 rounded-t-md">
        {label}
      </h4>
      <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-b-md">
        {children}
      </div>
    </div>
  );
}
