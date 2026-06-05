import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { withBrowserPage } from "./browserPool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../../uploads/tailored");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSection(title, lines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return "";
  }

  const items = lines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("\n");

  return `
    <section>
      <h3>${escapeHtml(title)}</h3>
      <ul>${items}</ul>
    </section>
  `;
}

function resumeToHtml(schema) {
  const personal = schema.personal || {};
  const experience = Array.isArray(schema.experience) ? schema.experience : [];
  const skills = Array.isArray(schema.skills) ? schema.skills : [];

  const experienceBlocks = experience
    .map((entry) => {
      const bullets = Array.isArray(entry.description) ? entry.description : [];
      return `
        <article>
          <h4>${escapeHtml(entry.position || "Role")} - ${escapeHtml(entry.company || "Company")}</h4>
          <p class="duration">${escapeHtml(entry.duration || "")}</p>
          <ul>
            ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("\n")}
          </ul>
        </article>
      `;
    })
    .join("\n");

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: "Helvetica", "Arial", sans-serif;
            margin: 36px;
            color: #111827;
            font-size: 12px;
            line-height: 1.35;
          }
          h1, h2, h3, h4 { margin: 0; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          .meta { color: #4b5563; margin-bottom: 14px; }
          section { margin-top: 14px; }
          h3 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.7px;
            border-bottom: 1px solid #d1d5db;
            margin-bottom: 8px;
            padding-bottom: 3px;
          }
          article { margin-bottom: 10px; }
          h4 { font-size: 13px; margin-bottom: 2px; }
          .duration { margin: 0 0 5px; color: #6b7280; }
          ul { margin: 0; padding-left: 18px; }
          li { margin-bottom: 3px; }
          .skills { display: flex; flex-wrap: wrap; gap: 6px; }
          .skills span {
            border: 1px solid #d1d5db;
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>${escapeHtml(personal.name || "Candidate")}</h1>
          <p class="meta">
            ${escapeHtml(personal.email || "")} ${personal.phone ? " | " + escapeHtml(personal.phone) : ""}
            ${personal.location ? " | " + escapeHtml(personal.location) : ""}
          </p>
          ${schema.summary ? `<p>${escapeHtml(schema.summary)}</p>` : ""}
        </header>

        <section>
          <h3>Experience</h3>
          ${experienceBlocks}
        </section>

        ${renderSection(
          "Education",
          (schema.education || []).map((e) => `${e.degree || ""} ${e.field ? "in " + e.field : ""} - ${e.institution || ""}`.trim())
        )}

        ${skills.length > 0 ? `<section><h3>Skills</h3><div class="skills">${skills.map((s) => `<span>${escapeHtml(s)}</span>`).join("")}</div></section>` : ""}
      </body>
    </html>
  `;
}

export async function compileTailoredResumePdf(tailoredSchema, outputName) {
  const html = resumeToHtml(tailoredSchema);
  const safeName = outputName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const outputPath = path.join(outputDir, `${safeName}.pdf`);

  await withBrowserPage(async (page) => {
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", right: "14mm", bottom: "18mm", left: "14mm" },
    });
  });

  return outputPath;
}
