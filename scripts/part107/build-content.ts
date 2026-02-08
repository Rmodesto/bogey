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

  const { references, acsRefs, figures, modules, lessons, questions, blueprints } = result.data;

  // Build reference lookup
  const refMap = new Map(references.map((r) => [r.id, r]));

  // Denormalize questions: resolve FAA refs inline
  const denormalizedQuestions = questions.map((q) => ({
    ...q,
    explanation: {
      ...q.explanation,
      resolvedReferences: q.explanation.references.map((rid) => refMap.get(rid)).filter(Boolean),
    },
  }));

  // Denormalize modules: embed lessons
  const denormalizedModules = modules.map((m) => ({
    ...m,
    lessons: lessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.order - b.order),
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
  write("blueprints.json", blueprints);
  write("references.json", references);
  write("acs.json", acsRefs);
  write("figures.json", figures);

  const manifest = {
    generatedAt: new Date().toISOString(),
    contentVersion: "1.0.0",
    counts: {
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
