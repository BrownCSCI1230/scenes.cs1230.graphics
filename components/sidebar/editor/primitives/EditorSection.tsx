type EditorSectionProps = {
  label: string;
  children?: React.ReactNode;
};

export const EditorSection = ({ label, children }: EditorSectionProps) => {
  return (
    <div className="flex flex-col">
      <h4 className="rounded-t-md bg-slate-100 p-2 text-sm font-medium">
        {label}
      </h4>
      <div className="bg-slate-25 flex flex-col gap-2 rounded-b-md p-2">
        {children}
      </div>
    </div>
  );
};
