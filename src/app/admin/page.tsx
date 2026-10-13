import { Admin } from "@/screens/Admin/Admin";
import { AdminLogin } from "@/screens/AdminLogin/AdminLogin";
import { isAdminAuthed } from "@/services/server/adminAuth";
import { getAdminData } from "@/services/server/photos";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthed())) {
    return <AdminLogin />;
  }

  const data = await getAdminData();
  return <Admin initialData={data} />;
}
