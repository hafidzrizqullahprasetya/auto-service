import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  growth?: {
    value: number;
    isUp: boolean;
  };
}

export function StatCard({ title, value, icon, growth }: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-2 text-primary">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold tracking-tight text-dark dark:text-white">
            {value}
          </h4>
          <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
            {title}
          </span>
        </div>

        {growth && (
          <span className={`flex items-center gap-1 text-sm font-medium ${growth.isUp ? 'text-green' : 'text-red'}`}>
            {growth.value}%
            <svg
              className={`fill-current ${growth.isUp ? '' : 'rotate-180'}`}
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.35716 2.47738L0.508974 6.22914C0.223089 6.5068 0.223089 6.9569 0.508974 7.23456C0.794859 7.51222 1.25731 7.51222 1.54319 7.23456L5 3.87738L8.45681 7.23456C8.74269 7.51222 9.20514 7.51222 9.49103 7.23456C9.77691 6.9569 9.77691 6.5068 9.49103 6.22914L5.64284 2.47738C5.35695 2.19972 4.8945 2.19972 4.60862 2.47738H4.35716Z" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
