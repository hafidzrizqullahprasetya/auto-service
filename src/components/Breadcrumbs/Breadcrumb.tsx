import Link from "next/link";
import { Icons } from "@/components/Icons";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <nav>
        <ol className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dark-5">
          <li>
            <Link
              className="flex items-center gap-1 transition-colors hover:text-primary"
              href="/"
            >
              <Icons.Dashboard size={12} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>-</li>
          <li className="text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
