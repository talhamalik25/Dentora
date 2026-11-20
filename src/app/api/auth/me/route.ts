import { NextRequest, NextResponse } from "next/server";
import { getAuthStaff } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const staff = await getAuthStaff(request);
  if (!staff) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      userId: staff.userId,
      email: staff.email,
      name: staff.name,
      role: staff.role,
    },
  });
}
