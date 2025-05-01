"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Music2, Users } from "lucide-react";

const tabs = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Songs",
    href: "/songs",
    icon: Music2,
  },
  {
    name: "Artists",
    href: "/artists",
    icon: Users,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <motion.div
            className="flex items-center gap-2 text-xl font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              🎵
            </motion.div>
            <span>Music Analytics</span>
          </motion.div>
        </div>

        <nav className="flex-1 px-4 pb-4">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/" && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative flex items-center gap-3 px-4 py-3 my-1 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50"
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-50 rounded-lg -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
