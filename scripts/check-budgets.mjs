// Performance budget check, run automatically after `next build` (postbuild).
// Fails the build when a route's first-load JS exceeds its budget or when any
// app route is server-rendered on demand instead of prerendered. Budgets are
// gzipped bytes, matching the "First Load JS" idea in the build output.
//
// Adopted from the 2026-11 security/cost review (docs/reviews/): content
// routes must stay static, and bundle regressions should fail loudly.

import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const NEXT_DIR = path.join(process.cwd(), ".next");

// Budgets in gzipped kilobytes of first-load JS. The first matching pattern
// wins; "default" covers anything unlisted.
const BUDGETS = [
  { pattern: /^\/learn\/\[moduleId\]\/\[lessonId\]$/, limitKb: 180, label: "lesson" },
  { pattern: /^\/(study|exam|results)$/, limitKb: 130, label: "app screens" },
  { pattern: /^\/(|learn|dashboard)$/, limitKb: 110, label: "marketing/nav" },
];
const DEFAULT_LIMIT_KB = 130;

function gzKb(file) {
  const full = path.join(NEXT_DIR, file);
  statSync(full);
  return gzipSync(readFileSync(full), { level: 9 }).length / 1024;
}

const buildManifest = JSON.parse(
  readFileSync(path.join(NEXT_DIR, "app-build-manifest.json"), "utf8")
);
const prerender = JSON.parse(
  readFileSync(path.join(NEXT_DIR, "prerender-manifest.json"), "utf8")
);
const appPaths = JSON.parse(
  readFileSync(path.join(NEXT_DIR, "app-path-routes-manifest.json"), "utf8")
);

const failures = [];
const rows = [];

// 1. Every app route must be prerendered: present in the prerender manifest's
// routes, or a dynamic route whose concrete paths were all generated at build
// time (generateStaticParams with dynamicParams=false).
const prerenderedRoutes = new Set(
  Object.values(prerender.routes ?? {}).map((r) => r.srcRoute ?? null).filter(Boolean)
);
const staticRoutes = new Set(Object.keys(prerender.routes ?? {}));
for (const route of Object.values(appPaths)) {
  if (route === "/_not-found") continue;
  const isStatic = staticRoutes.has(route) || prerenderedRoutes.has(route);
  const dyn = (prerender.dynamicRoutes ?? {})[route];
  const dynButUnfenced = dyn && dyn.fallback !== false;
  if (!isStatic || dynButUnfenced) {
    failures.push(
      `${route}: not fully prerendered — content routes must be static (no on-demand server rendering)`
    );
  }
}

// 2. First-load JS per route against its budget.
for (const [page, files] of Object.entries(buildManifest.pages ?? {})) {
  if (page === "/_not-found/page") continue;
  const route = page.replace(/\/page$/, "") || "/";
  const jsFiles = files.filter((f) => f.endsWith(".js"));
  const totalKb = jsFiles.reduce((sum, f) => sum + gzKb(f), 0);
  const budget = BUDGETS.find((b) => b.pattern.test(route));
  const limitKb = budget?.limitKb ?? DEFAULT_LIMIT_KB;
  rows.push({ route, totalKb, limitKb });
  if (totalKb > limitKb) {
    failures.push(
      `${route}: first-load JS ${totalKb.toFixed(1)} KB gz exceeds the ${limitKb} KB budget`
    );
  }
}

rows.sort((a, b) => b.totalKb - a.totalKb);
console.log("\nPerformance budgets (first-load JS, gzipped):");
for (const { route, totalKb, limitKb } of rows) {
  const flag = totalKb > limitKb ? "  ← OVER" : "";
  console.log(`  ${route.padEnd(36)} ${totalKb.toFixed(1).padStart(7)} KB / ${limitKb} KB${flag}`);
}

if (failures.length > 0) {
  console.error("\nBudget check FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("\nBudget check passed: all routes prerendered and within budget.\n");
