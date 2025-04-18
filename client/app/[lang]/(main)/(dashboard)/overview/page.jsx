"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MentorDashboard from "@/components/Dashboard/MentorDashboard";
import MenteeDashboard from "@/components/Dashboard/MenteeDashboard";

export default function dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMentor, setIsMentor] = useState(false);

  // Determine if the current role is "mentor"
  useEffect(() => {
    setIsMentor(pathname.includes("/mentor/"));
  }, [pathname]);

  return (
    <>
      {/* Render the correct dashboard based on the role */}
      {isMentor ? <MentorDashboard /> : <MenteeDashboard />}
    </>
  );
}
