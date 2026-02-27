"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { Icons } from "@/components/icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items && item.items.length > 0) {
          item.items.forEach((subItem: any) => {
            if (subItem.url === pathname) {
              if (!expandedItems.includes(item.title)) {
                toggleExpanded(item.title);
              }
            }
          });
        }
      });
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-[290px]" : "w-[90px]",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <div className={cn("px-0 py-2.5", !isOpen && "hidden", "min-[850px]:py-0")}>
              <Logo onClick={() => isMobile && toggleSidebar()} />
            </div>

            {/* Logo icon when collapsed */}
            {!isOpen && !isMobile && (
              <div className="flex items-center justify-center py-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto"
                >
                  <path
                    d="M3 9L12 3L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
                    stroke="#5750F1"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 14H17"
                    stroke="#F87117"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute right-4.5 top-1/2 -translate-y-1/2"
              >
                <span className="sr-only">Close Menu</span>
                <Icons.Logout className="ml-auto size-7 rotate-180" />
              </button>
            )}
          </div>

          {/* Navigation - only show when sidebar is open */}
          {isOpen && (
            <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {NAV_DATA.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />

                              <span>{item.title}</span>

                              <Icons.ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem: any) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                  (item as any).title.toLowerCase().split(" ").join("-");

                            return (
                              <MenuItem
                                className="flex items-center gap-3 py-3"
                                as="link"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{item.title}</span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
          )}
        </div>
      </aside>
    </>
  );
}
