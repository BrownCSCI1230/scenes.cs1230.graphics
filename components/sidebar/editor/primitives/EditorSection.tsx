type EditorSectionProps = {
  label: string;
  children?: React.ReactNode;
};

export const EditorSection = ({ label, children }: EditorSectionProps) => {
  return (
    <div className="flex flex-col">
      <h4 className="rounded-t-md bg-accent p-2 text-sm font-medium">
        {label}
      </h4>
      <div className="flex flex-col gap-2 rounded-b-md bg-accent/30 p-2 dark:bg-accent/50">
        {children}
      </div>
    </div>
  );
};
