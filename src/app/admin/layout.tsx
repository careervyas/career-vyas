import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebarLayout from "@/components/admin/AdminLayout";

export default async function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get current pathname from middleware header
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    // Login page is exempt from auth check
    if (!pathname.startsWith("/admin/login")) {
        const cookieStore = await cookies();
        const adminAuth = cookieStore.get("adminAuth");

        if (!adminAuth || adminAuth.value !== "true") {
            redirect("/admin/login");
        }
    }

    return <AdminSidebarLayout>{children}</AdminSidebarLayout>;
}
