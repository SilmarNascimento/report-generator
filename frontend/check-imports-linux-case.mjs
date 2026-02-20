import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");
const CODE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const ALL_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".d.ts"];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function parseImports(content) {
  const imports = [];
  const reFrom = /import\s+[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/g;
  const reBare = /import\s+['"]([^'"]+)['"]/g;
  const reExport = /export\s+[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/g;

  let m;
  while ((m = reFrom.exec(content))) imports.push(m[1]);
  while ((m = reBare.exec(content))) imports.push(m[1]);
  while ((m = reExport.exec(content))) imports.push(m[1]);

  return imports;
}

function existsExact(absPath) {
  const normalized = path.resolve(absPath);
  const parts = normalized.split(path.sep).filter(Boolean);

  let cur = path.isAbsolute(normalized) ? path.sep : "";
  if (process.platform === "win32") {
    cur = parts.shift() + path.sep;
  }

  for (const part of parts) {
    const base = cur || path.sep;
    if (!fs.existsSync(base)) return false;
    const names = fs.readdirSync(base);
    if (!names.includes(part)) return false;
    cur = path.join(base, part);
  }
  return true;
}

function resolveLikeNode(importerFile, spec) {
  if (!spec.startsWith(".")) return null; // só relativo

  const base = path.resolve(path.dirname(importerFile), spec);

  // se já tiver extensão
  if (path.extname(base)) {
    if (fs.existsSync(base)) return base;
    return null;
  }

  // tenta arquivo com extensões
  for (const ext of ALL_EXTS) {
    const p = base + ext;
    if (fs.existsSync(p)) return p;
  }

  // tenta pasta/index.ext
  for (const ext of ALL_EXTS) {
    const p = path.join(base, "index" + ext);
    if (fs.existsSync(p)) return p;
  }

  return null;
}

const files = walk(SRC_DIR);
const issues = [];
let checked = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const imports = parseImports(content);

  for (const spec of imports) {
    if (!spec.startsWith(".")) continue;
    checked++;

    const resolved = resolveLikeNode(file, spec);

    if (!resolved) {
      issues.push({
        type: "UNRESOLVED",
        file,
        spec,
        detail: "não encontrou arquivo/pasta alvo",
      });
      continue;
    }

    if (!existsExact(resolved)) {
      issues.push({
        type: "CASE_MISMATCH",
        file,
        spec,
        detail: resolved,
      });
    }
  }
}

if (issues.length === 0) {
  console.log(`OK: ${checked} imports relativos verificados, sem problemas.`);
  process.exit(0);
}

console.log(`Encontrados ${issues.length} problemas em imports relativos:\n`);
for (const i of issues) {
  console.log(`[${i.type}]`);
  console.log(`  arquivo: ${i.file}`);
  console.log(`  import : ${i.spec}`);
  console.log(`  detalhe: ${i.detail}\n`);
}
process.exit(1);
