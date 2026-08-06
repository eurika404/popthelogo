import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already redirects, but keep the check here too.
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
