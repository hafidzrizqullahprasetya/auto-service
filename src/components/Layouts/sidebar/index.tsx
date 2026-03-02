"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { Icons } from "@/components/icons";
import { useSidebarContext } from "./sidebar-context";
import Link from "next/link";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    if (!isOpen && !isMobile) setIsOpen(true);
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items?.length) {
          item.items.forEach((subItem: any) => {
            if (subItem.url === pathname && !expandedItems.includes(item.title)) {
              setExpandedItems((prev) => [...prev, item.title]);
            }
          });
        }
      });
    });
  }, [pathname]);

  const collapsed = !isOpen && !isMobile;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      <aside
        style={{
          width: isMobile
            ? isOpen ? 280 : 0
            : isOpen ? 260 : 68,
        }}
        className="overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear"
        aria-label="Main navigation"
      >
        <div
          style={{ width: isMobile ? 280 : isOpen ? 260 : 68 }}
          className="flex h-screen flex-col"
        >

          {/* ── Logo Header ───────────────────────────────────────────── */}
          <div className={cn(
            "flex border-b border-gray-100 py-5 transition-all duration-200",
            collapsed ? "flex-col items-center gap-4 px-0" : "items-center gap-3 px-4"
          )}>
            <Link href="/" className="shrink-0 flex items-center justify-center" onClick={() => isMobile && setIsOpen(false)}>
              <div className={cn(
                "flex items-center justify-center rounded-lg bg-dark text-white transition-all duration-200",
                collapsed ? "size-10" : "size-10"
              )}>
                <Icons.Repair size={collapsed ? 20 : 22} />
              </div>
            </Link>

            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black uppercase tracking-tighter text-dark">
                  Auto Service
                </p>
                <p className="truncate text-[10px] font-bold uppercase tracking-widest text-dark-5 -mt-0.5">
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
                  collapsed && "mt-1"
                )}
                title={isOpen ? "Tutup" : "Buka"}
              >
                {isOpen ? (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                )}
              </button>
            )}

            {/* Mobile close */}
            {isMobile && isOpen && (
              <button
                onClick={toggleSidebar}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-dark-5"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Nav items ─────────────────────────────────────────────── */}
          <div className="custom-scrollbar flex-1 overflow-y-auto py-3">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-4 last:mb-0">
                {/* Section label */}
                {!collapsed && (
                  <p className="mb-2 px-4 pt-4 text-[10px] font-black uppercase tracking-[0.2em] text-dark-5">
                    {section.label}
                  </p>
                )}
                {collapsed && (
                  <div className="my-2 mx-3 h-px bg-gray-200" />
                )}

                <ul className="space-y-1 px-2">
                  {section.items.map((item) => {
                    const href =
                      "url" in item
                        ? (item.url as string)
                        : "/" + (item as any).title.toLowerCase().split(" ").join("-");

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
                                    : "text-dark-5 hover:bg-gray-100 hover:text-dark"
                                )}
                            >
                              <item.icon className="size-[18px] shrink-0" />
                              {!collapsed && (
                                <>
                                  <span className="flex-1 text-left">{item.title}</span>
                                  <Icons.ChevronUp
                                    className={cn(
                                      "size-3.5 rotate-180 transition-transform",
                                      isExpanded && "rotate-0"
                                    )}
                                  />
                                </>
                              )}
                            </button>

                            {/* Sub items */}
                            {!collapsed && isExpanded && (
                              <ul className="ml-7 mt-1 space-y-1 border-l border-gray-100 pl-3 pb-2">
                                {item.items.map((sub: any) => (
                                  <li key={sub.title}>
                                      <Link
                                        href={sub.url}
                                        onClick={() => isMobile && setIsOpen(false)}
                                        className={cn(
                                          "flex items-center gap-2 rounded-md px-2 py-2 text-[13px] font-bold tracking-tight transition-none",
                                          pathname === sub.url
                                            ? "font-black text-dark dark:text-white"
                                            : "text-dark-5 hover:text-dark dark:hover:text-white"
                                        )}
                                      >
                                        {sub.icon && <sub.icon size={14} className="shrink-0" />}
                                        <span className="truncate">{sub.title}</span>
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
                                : "text-dark-5 hover:bg-gray-100 hover:text-dark"
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

          {/* ── Footer: Logout ──────────────────────────────────────────── */}
          <div className="border-t border-gray-100 p-2">
            <Link
              href="/auth/sign-in"
              title={collapsed ? "Keluar" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg py-2 text-[13px] font-semibold text-dark-5 transition-colors hover:bg-red-50 hover:text-red-500",
                collapsed ? "justify-center px-2" : "px-3"
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
