import { redirect } from "next/navigation";

/** Legacy route — admin lives at /admin */
export default function DashboardRedirect() {
  redirect("/admin");
}
