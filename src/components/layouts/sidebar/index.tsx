"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { Icons } from "@/components/Icons";
import { useSidebarContext } from "./sidebar-context";
import Link from "next/link";
import Image from "next/image";
import { canAccess, type Role } from "@/lib/permissions";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [authUser, setAuthUser] = useState<{
    name: string;
    role: Role;
    username: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        setAuthUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const toggleExpanded = (title: string) => {
    if (!isOpen && !isMobile) setIsOpen(true);
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items?.length) {
          item.items.forEach((subItem: any) => {
            if (
              subItem.url === pathname &&
              !expandedItems.includes(item.title)
            ) {
              setExpandedItems((prev) => [...prev, item.title]);
            }
          });
        }
      });
    });
  }, [pathname]);

  // Filter nav berdasarkan permission role user yang sedang login
  const filteredNav = authUser
    ? NAV_DATA.map((section) => ({
        ...section,
        items: section.items
          .map((item) => ({
            ...item,
            items: (item.items ?? []).filter((sub: any) =>
              canAccess(authUser.role, sub.url),
            ),
          }))
          .filter((item) => {
            const url = (item as any).url as string | undefined;
            // Item tanpa url = grup parent (e.g. "Katalog Sparepart")
            // hanya tampil kalau masih ada sub-item yang lolos filter
            if (!url) return (item.items ?? []).length > 0;
            return canAccess(authUser.role, url);
          }),
      })).filter((section) => section.items.length > 0)
    : NAV_DATA;

  const collapsed = !isOpen && !isMobile;

  return (
    <>
      {/* Mobile overlay - hanya muncul di mobile saat sidebar terbuka */}
      {isMobile && isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        style={{
          width: isMobile ? (isOpen ? 280 : 0) : isOpen ? 260 : 68,
        }}
        className="relative z-50 overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear"
        aria-label="Main navigation"
      >
        <div
          style={{ width: isMobile ? 280 : isOpen ? 260 : 68 }}
          className="flex h-screen flex-col"
        >
          {/* ── Logo Header ───────────────────────────────────────────── */}
          <div
            className={cn(
              "flex border-b border-gray-100 py-5 transition-all duration-200",
              collapsed
                ? "flex-col items-center gap-4 px-0"
                : "items-center gap-3 px-4",
            )}
          >
            <Link
              href="/"
              className="flex shrink-0 items-center justify-center"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg bg-dark text-white transition-all duration-200",
                  collapsed ? "size-10" : "size-10",
                )}
              >
                <Icons.Repair size={collapsed ? 20 : 22} />
              </div>
            </Link>

            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black uppercase tracking-tighter text-dark">
                  Auto Service
                </p>
                <p className="-mt-0.5 truncate text-[10px] font-bold uppercase tracking-widest text-dark-5">
                  Premium Garage
                </p>
              </div>
            ) : null}

            {/* Toggle button */}
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                  "bg-gray-1 text-dark-5 hover:bg-dark hover:text-white dark:bg-dark-2 dark:text-dark-4 dark:hover:bg-white dark:hover:text-dark",
                  collapsed && "mt-1",
                )}
                title={isOpen ? "Tutup" : "Buka"}
              >
                {isOpen ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </button>
            )}

            {/* Mobile close */}
            {isMobile && isOpen && (
              <button
                onClick={toggleSidebar}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-dark-5"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Nav items ─────────────────────────────────────────────── */}
          <div className="custom-scrollbar flex-1 overflow-y-auto py-3">
            {filteredNav.map((section) => (
              <div key={section.label} className="mb-4 last:mb-0">
                {/* Section label */}
                {!collapsed && (
                  <p className="mb-2 px-4 pt-4 text-[10px] font-black uppercase tracking-[0.2em] text-dark-5">
                    {section.label}
                  </p>
                )}
                {collapsed && <div className="mx-3 my-2 h-px bg-gray-200" />}

                <ul className="space-y-1 px-2">
                  {section.items.map((item) => {
                    const href =
                      "url" in item
                        ? (item.url as string)
                        : "/" +
                          (item as any).title
                            .toLowerCase()
                            .split(" ")
                            .join("-");

                    const hasChildren = !!item.items?.length;
                    const isActive = hasChildren
                      ? item.items.some(({ url }: any) => url === pathname)
                      : pathname === href;
                    const isExpanded = expandedItems.includes(item.title);

                    return (
                      <li key={item.title}>
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() => toggleExpanded(item.title)}
                              title={collapsed ? item.title : undefined}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg py-2.5 text-[13px] font-bold transition-none",
                                collapsed ? "justify-center px-1" : "px-3",
                                isActive
                                  ? "bg-dark text-white shadow-none"
                                  : "text-dark-5 hover:bg-gray-100 hover:text-dark",
                              )}
                            >
                              <item.icon className="size-[18px] shrink-0" />
                              {!collapsed && (
                                <>
                                  <span className="flex-1 text-left">
                                    {item.title}
                                  </span>
                                  <Icons.ChevronUp
                                    className={cn(
                                      "size-3.5 rotate-180 transition-transform",
                                      isExpanded && "rotate-0",
                                    )}
                                  />
                                </>
                              )}
                            </button>

                            {/* Sub items */}
                            {!collapsed && isExpanded && (
                              <ul className="ml-7 mt-1 space-y-1 border-l border-gray-100 pb-2 pl-3">
                                {item.items.map((sub: any) => (
                                  <li key={sub.title}>
                                    <Link
                                      href={sub.url}
                                      onClick={() =>
                                        isMobile && setIsOpen(false)
                                      }
                                      className={cn(
                                        "flex items-center gap-2 rounded-md px-2 py-2 text-[13px] font-bold tracking-tight transition-none",
                                        pathname === sub.url
                                          ? "font-black text-dark dark:text-white"
                                          : "text-dark-5 hover:text-dark dark:hover:text-white",
                                      )}
                                    >
                                      {sub.icon && (
                                        <sub.icon
                                          size={14}
                                          className="shrink-0"
                                        />
                                      )}
                                      <span className="truncate">
                                        {sub.title}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={href}
                            onClick={() => isMobile && setIsOpen(false)}
                            title={collapsed ? item.title : undefined}
                            className={cn(
                              "flex items-center gap-3 rounded-lg py-2.5 text-[13px] font-bold transition-none",
                              collapsed ? "justify-center px-1" : "px-3",
                              isActive
                                ? "bg-dark text-white shadow-none"
                                : "text-dark-5 hover:bg-gray-100 hover:text-dark",
                            )}
                          >
                            <item.icon className="size-[18px] shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Footer: User + Logout ───────────────────────────────────── */}
          <div className="border-t border-gray-100 p-2">
            {/* User info */}
            {authUser && !collapsed && (
              <Link
                href="/profile"
                onClick={() => isMobile && setIsOpen(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-dark text-[11px] font-black text-white">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-dark">
                    {authUser.name}
                  </p>
                  <p className="truncate text-[10px] font-semibold text-dark-5">
                    {authUser.role}
                  </p>
                </div>
              </Link>
            )}
            {authUser && collapsed && (
              <Link
                href="/profile"
                onClick={() => isMobile && setIsOpen(false)}
                title={authUser.name}
                className="mb-1 flex justify-center rounded-lg py-2 hover:bg-gray-50"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-dark text-[11px] font-black text-white">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            )}
            <Link
              href="/auth/sign-in"
              title={collapsed ? "Keluar" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg py-2 text-[13px] font-semibold text-dark-5 transition-colors hover:bg-red-50 hover:text-red-500",
                collapsed ? "justify-center px-2" : "px-3",
              )}
            >
              <Icons.Logout className="size-[18px] shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
