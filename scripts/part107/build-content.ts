import fs from "fs";
import path from "path";
import { validate } from "./validate";

const OUTPUT_DIR = path.resolve(__dirname, "../../generated/part107");

function main() {
  console.log("Validating content...");
  const result = validate();

  if (result.warnings.length > 0) {
    console.warn("\n⚠ Warnings:");
    result.warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  if (result.errors.length > 0 || !result.data) {
    console.error("\n✗ Validation failed, aborting build.");
    result.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  const { domains, references, acsRefs, figures, modules, lessons, questions, blueprints } = result.data;

  // Build reference lookups
  const refMap = new Map(references.map((r) => [r.id, r]));
  const domainMap = new Map(domains.map((d) => [d.id, d]));
  // Authored records hold a domain id; generated output carries the display
  // name in `domain` (so pages and tests see prose) plus the id in `domainId`.
  const resolveDomain = (id: string) => domainMap.get(id)!.name;

  // Denormalize questions: resolve FAA refs and domain inline
  const denormalizedQuestions = questions.map((q) => ({
    ...q,
    domain: resolveDomain(q.domain),
    domainId: q.domain,
    explanation: {
      ...q.explanation,
      resolvedReferences: q.explanation.references.map((rid) => refMap.get(rid)).filter(Boolean),
    },
  }));

  // Denormalize modules: embed lessons, resolve domain
  const denormalizedModules = modules.map((m) => ({
    ...m,
    domain: resolveDomain(m.domain),
    domainId: m.domain,
    lessons: lessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.order - b.order),
  }));

  // Denormalize blueprints: resolve domain on each weight so the generator's
  // question matching (q.domain === dw.domain) keeps working on names
  const denormalizedBlueprints = blueprints.map((bp) => ({
    ...bp,
    domainWeights: bp.domainWeights.map((dw) => ({
      ...dw,
      domain: resolveDomain(dw.domain),
      domainId: dw.domain,
    })),
  }));

  // Write output
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const write = (name: string, data: unknown) => {
    const filePath = path.join(OUTPUT_DIR, name);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  → ${name}`);
  };

  console.log("\nGenerating output...");
  write("questions.json", denormalizedQuestions);
  write("modules.json", denormalizedModules);
  write("blueprints.json", denormalizedBlueprints);
  write("domains.json", domains);
  write("references.json", references);
  write("acs.json", acsRefs);
  write("figures.json", figures);

  const manifest = {
    generatedAt: new Date().toISOString(),
    contentVersion: "1.0.0",
    counts: {
      domains: domains.length,
      questions: questions.length,
      modules: modules.length,
      lessons: lessons.length,
      references: references.length,
      acsRefs: acsRefs.length,
      figures: figures.length,
      blueprints: blueprints.length,
    },
  };
  write("manifest.json", manifest);

  console.log("\n✓ Build complete");
}

main();
