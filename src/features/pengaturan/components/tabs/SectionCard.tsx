export function SectionCard({
  title,
  children,
  className = "",
  rightElement,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark ${className}`}>
      <div className="flex items-center justify-between border-b border-stroke px-4 py-3 md:px-6 md:py-4 dark:border-dark-3">
        <h3 className="text-sm font-bold text-dark dark:text-white md:text-base">
          {title}
        </h3>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}
