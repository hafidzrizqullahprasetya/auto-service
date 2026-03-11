import Link from "next/link";
import { HomeIcon } from "@/assets/icons";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-4 flex items-center justify-between sm:mb-6">
      <nav>
        <ol className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
          <li>
            <Link
              className="font-medium text-dark-5 hover:text-dark"
              href="/"
            >
              <HomeIcon width={14} height={14} className="inline-block sm:hidden" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </li>
          <li className="text-dark-5">/</li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
