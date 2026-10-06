"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, AlertTriangle, MessageCircle } from "lucide-react";
import TopBar from "./TopBar";

const tabs = [
  { href: "/tareas", label: "Tareas", Icon: ClipboardList },
  { href: "/reportes", label: "Reportar", Icon: AlertTriangle },
  { href: "/chat", label: "Chat", Icon: MessageCircle },
];

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-trenza-crema">
      <TopBar />
      <div className="flex-1 pb-20 pt-18">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 bg-trenza-indigo flex justify-around py-2.5"> 
        {tabs.map(({ href, label, Icon }) => {
          const activo = pathname === href;
          const esReportar = href === "/reportes";
          const color = esReportar
            ? "text-trenza-red/70"
            : activo
            ? "text-white"
            : "text-trenza-crema";

          return (
            <Link key={href} href={href} className={`flex flex-col items-center gap-1 ${color}`}>
              <Icon size={28} />
              <span className="text-[13px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}