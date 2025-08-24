import { jsPDF } from "jspdf";


async function toDataURL(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Generate a landscape A4 certificate of participation and trigger a download.
 * @param {Object} o
 * @param {string} o.participantName
 * @param {string} o.eventTitle
 * @param {string} [o.eventDate]        // e.g., "Aug 24, 2025 • 4:00 PM"
 * @param {string} [o.location]
 * @param {string} [o.orgName="EVENTIFY"]
 * @param {string} [o.logoUrl]          // optional branding logo
 * @param {string} [o.bgUrl]            // optional background (event banner)
 */
export async function generateCertificate({
  participantName,
  eventTitle,
  eventDate,
  location,
  orgName = "EVENTIFY",
  logoUrl,
  bgUrl,
}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Background band
  doc.setFillColor(13, 18, 32); // slate-ish
  doc.rect(0, 0, W, H, "F");

  // Soft inner panel
  doc.setFillColor(22, 28, 45);
  doc.roundedRect(36, 36, W - 72, H - 72, 14, 14, "F");

  // Optional banner as faint background
  const bgData = await toDataURL(bgUrl);
  if (bgData) {
    try {
      // Fit image inside the inner panel
      const margin = 48;
      const innerW = W - margin * 2;
      const innerH = H - margin * 2;
      doc.addImage(bgData, "JPEG", margin, margin, innerW, innerH, "", "FAST");
      // Overlay translucent curtain to fade the banner
      doc.setFillColor(22, 28, 45);
      doc.setDrawColor(22, 28, 45);
      doc.setLineWidth(0);
      // semi-transparent overlay is tricky in jsPDF; emulate by drawing multiple times lightly
      for (let i = 0; i < 6; i++) doc.rect(margin, margin, innerW, innerH, "F");
    } catch {}
  }

  // White frame border
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2);
  doc.roundedRect(48, 48, W - 96, H - 96, 12, 12, "S");

  // Branding logo (optional)
  const logoData = await toDataURL(logoUrl);
  if (logoData) {
    const lw = 120;
    const lh = 120;
    doc.addImage(logoData, "PNG", 64, 56, lw, lh, "", "FAST");
  }

  // Org name (top right)
  doc.setTextColor(210, 220, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(orgName.toUpperCase(), W - 64, 78, { align: "right" });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(38);
  doc.setFont("helvetica", "bold");
  doc.text("Certificate of Participation", W / 2, H / 2 - 30, { align: "center" });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 205, 220);
  doc.text("This certifies that", W / 2, H / 2 + 2, { align: "center" });

  // Participant name
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text(participantName || "Participant", W / 2, H / 2 + 44, { align: "center" });

  // Event line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(210, 215, 230);
  const lines = [
    `for participating in "${eventTitle || "Event"}".`,
    eventDate ? `Held on ${eventDate}${location ? ` at ${location}` : ""}.` : "",
  ].filter(Boolean);
  let y = H / 2 + 78;
  lines.forEach((t) => {
    doc.text(t, W / 2, y, { align: "center" });
    y += 22;
  });

  // Footer: signatures / issued by
  const footerY = H - 100;
  doc.setDrawColor(180, 190, 210);
  doc.line(96, footerY, 276, footerY);
  doc.line(W - 276, footerY, W - 96, footerY);

  doc.setFontSize(12);
  doc.setTextColor(210, 220, 255);
  doc.text("Organizer", 186, footerY + 18, { align: "center" });
  doc.text("Dean / Head", W - 186, footerY + 18, { align: "center" });

  // Issue line (bottom center)
  doc.setFontSize(10);
  doc.setTextColor(170, 180, 200);
  doc.text(`Issued by ${orgName}`, W / 2, H - 48, { align: "center" });

  // Save
  const safeTitle = (eventTitle || "Event").replace(/[^\w\- ]+/g, "").slice(0, 40).trim().replace(/\s+/g, "_");
  const safeName = (participantName || "Participant").replace(/[^\w\- ]+/g, "").slice(0, 40).trim().replace(/\s+/g, "_");
  doc.save(`${safeTitle}_${safeName}_Certificate.pdf`);
}
