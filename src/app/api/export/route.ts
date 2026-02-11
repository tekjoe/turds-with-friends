import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Premium check disabled - all users have access
  // const premium = await isPremium(user.id);

  const format = request.nextUrl.searchParams.get("format") ?? "csv";

  const { data: logs, error } = await supabase
    .from("movement_logs")
    .select("logged_at, bristol_type, pre_weight, post_weight, weight_unit, xp_earned")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (logs ?? []).map((log) => ({
    date: new Date(log.logged_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    bristolType: log.bristol_type,
    preWeight: log.pre_weight ?? "",
    postWeight: log.post_weight ?? "",
    weightUnit: log.weight_unit,
    xpEarned: log.xp_earned,
  }));

  if (format === "pdf") {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bowel Buddies - Movement Log", 14, 20);
    doc.setFontSize(10);
    doc.text(`Exported on ${new Date().toLocaleDateString("en-US")}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Date", "Bristol Type", "Pre-Weight", "Post-Weight", "Unit", "XP"]],
      body: rows.map((r) => [
        r.date,
        String(r.bristolType),
        String(r.preWeight),
        String(r.postWeight),
        r.weightUnit,
        String(r.xpEarned),
      ]),
    });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="movement-logs.pdf"',
      },
    });
  }

  // CSV
  const header = "Date,Bristol Type,Pre-Weight,Post-Weight,Weight Unit,XP Earned";
  const csvRows = rows.map(
    (r) =>
      `"${r.date}",${r.bristolType},${r.preWeight},${r.postWeight},${r.weightUnit},${r.xpEarned}`
  );
  const csv = [header, ...csvRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="movement-logs.csv"',
    },
  });
}
