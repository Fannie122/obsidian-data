#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const zlib = require("zlib");

const NODE = "C:\\nvm4w\\nodejs\\node.exe";
const LARK_RUNNER = "C:\\nvm4w\\nodejs\\node_modules\\@larksuite\\cli\\scripts\\run.js";

const args = parseArgs(process.argv.slice(2));
const targetRoot = args.target || "D:\\yl-os\\3业务输出\\企业大脑";
const syncRoot = path.join(targetRoot, "飞书云文档同步");
const entryDir = path.join(syncRoot, "00入口");
const listDir = path.join(syncRoot, "01清单");
const cardDir = path.join(syncRoot, "02资料卡片");
const exportDir = path.join(syncRoot, "03原始导出");
const logDir = path.join(syncRoot, "04同步日志");
const limit = args.limit ? Number(args.limit) : Infinity;
const query = Object.prototype.hasOwnProperty.call(args, "query") ? args.query : "";
const dryRun = Boolean(args["dry-run"]);
const resume = Boolean(args.resume);

const stats = {
  searched: 0,
  exported: 0,
  cards: 0,
  skipped: 0,
  failed: 0,
  unsupported: 0,
};

main().catch((err) => {
  console.error(err && err.stack ? err.stack : String(err));
  process.exit(1);
});

async function main() {
  ensureDirs();
  console.log(`[1/4] Searching Feishu docs query="${query}" limit=${Number.isFinite(limit) ? limit : "all"}`);
  const docs = await searchAllDocs(query, limit);
  stats.searched = docs.length;
  console.log(`[1/4] Found ${docs.length} unique records`);

  const manifest = [];
  const failures = [];
  const existingCards = resume ? buildExistingCardIndex() : new Map();

  for (let i = 0; i < docs.length; i += 1) {
    const record = docs[i];
    const title = cleanTitle(record.title) || `Untitled ${i + 1}`;
    const id = String(i + 1).padStart(4, "0");
    process.stdout.write(`[2/4] ${id}/${docs.length} ${title}\n`);

    try {
      if (resume) {
        const existing = existingCards.get(record.url || "");
        if (existing && existing.status !== "failed") {
          stats.skipped += 1;
          stats.cards += 1;
          if (existing.exportPath) stats.exported += 1;
          manifest.push(toManifestRow({
            ...record,
            resolvedTitle: existing.title || title,
            resolvedType: inferType(record),
            resolvedToken: record.token,
          }, {
            status: "skipped",
            filePath: existing.exportPath || "",
            fileName: existing.exportPath ? path.basename(existing.exportPath) : "",
            sizeBytes: existing.exportPath ? fileSize(existing.exportPath) : "",
          }, existing.cardPath));
          continue;
        }
      }
      const resolved = await resolveRecord(record);
      const exportResult = dryRun ? { status: "dry-run" } : await exportOrDownload(resolved, id, title);
      const cardPath = writeCard(resolved, exportResult, id, title);
      stats.cards += 1;
      if (exportResult.status === "exported" || exportResult.status === "downloaded") stats.exported += 1;
      if (exportResult.status === "unsupported") stats.unsupported += 1;
      if (exportResult.status === "skipped") stats.skipped += 1;
      manifest.push(toManifestRow(resolved, exportResult, cardPath));
    } catch (err) {
      stats.failed += 1;
      failures.push({
        title,
        url: record.url,
        entity_type: record.entityType,
        error: err && err.message ? err.message : String(err),
      });
      const failedRecord = { ...record, resolvedType: "unknown", resolvedToken: record.token };
      const exportResult = { status: "failed", error: err && err.message ? err.message : String(err) };
      const cardPath = writeCard(failedRecord, exportResult, id, title);
      stats.cards += 1;
      manifest.push(toManifestRow(failedRecord, exportResult, cardPath));
    }
  }

  writeManifest(manifest);
  writeFailures(failures);
  writeEntry(manifest, failures);
  writeRootPointer();
  console.log(`[4/4] Done. searched=${stats.searched} exported=${stats.exported} cards=${stats.cards} failed=${stats.failed}`);
  console.log(`Entry: ${path.join(targetRoot, "飞书云文档入口.md")}`);
}

function parseArgs(argv) {
  const out = {};
  for (const item of argv) {
    if (!item.startsWith("--")) continue;
    const eq = item.indexOf("=");
    if (eq === -1) {
      out[item.slice(2)] = true;
    } else {
      out[item.slice(2, eq)] = item.slice(eq + 1);
    }
  }
  return out;
}

function ensureDirs() {
  for (const dir of [entryDir, listDir, cardDir, exportDir, logDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function searchAllDocs(searchQuery, maxItems) {
  const found = [];
  const seen = new Set();
  let pageToken = "";
  let page = 1;

  while (found.length < maxItems) {
    const cliArgs = [
      "docs",
      "+search",
      "--as=user",
      `--query=${searchQuery}`,
      "--page-size=20",
      "--format=json",
    ];
    if (pageToken) cliArgs.push(`--page-token=${pageToken}`);

    const json = runCliJson(cliArgs, { retries: 6, retryDelayMs: 3000 });
    const results = (((json || {}).data || {}).results || []);
    for (const item of results) {
      const meta = item.result_meta || {};
      const key = `${item.entity_type || ""}|${meta.url || ""}|${meta.token || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      found.push({
        entityType: item.entity_type || "",
        docTypes: meta.doc_types || "",
        title: item.title_highlighted || "",
        summary: item.summary_highlighted || "",
        token: meta.token || "",
        url: meta.url || "",
        ownerName: meta.owner_name || "",
        ownerId: meta.owner_id || "",
        editUserName: meta.edit_user_name || "",
        createTime: meta.create_time_iso || "",
        updateTime: meta.update_time_iso || "",
        lastOpenTime: meta.last_open_time_iso || "",
        isCrossTenant: Boolean(meta.is_cross_tenant),
        iconInfo: meta.icon_info || "",
      });
      if (found.length >= maxItems) break;
    }

    const data = json.data || {};
    pageToken = data.page_token || "";
    console.log(`  page ${page}: +${results.length}, total_so_far=${found.length}, has_more=${Boolean(data.has_more)}`);
    page += 1;
    if (!data.has_more || !pageToken || results.length === 0) break;
  }
  return found;
}

async function resolveRecord(record) {
  const out = { ...record };
  if (record.entityType === "WIKI" || /\/wiki\//.test(record.url)) {
    try {
      const json = runCliJson([
        "wiki",
        "+node-get",
        "--as=user",
        `--node-token=${record.url || record.token}`,
        "--format=json",
      ], { retries: 6, retryDelayMs: 3000 });
      const data = json.data || {};
      out.wikiNodeToken = data.node_token || record.token;
      out.wikiSpaceId = data.space_id || "";
      out.resolvedToken = data.obj_token || iconToken(record.iconInfo) || record.token;
      out.resolvedType = normalizeObjType(data.obj_type || record.docTypes);
      out.resolvedTitle = data.title || cleanTitle(record.title);
      out.hasChild = Boolean(data.has_child);
    } catch (err) {
      out.wikiResolveError = err.message;
      out.resolvedToken = iconToken(record.iconInfo) || record.token;
      out.resolvedType = inferType(record);
      out.resolvedTitle = cleanTitle(record.title);
    }
  } else {
    out.resolvedToken = record.token;
    out.resolvedType = inferType(record);
    out.resolvedTitle = cleanTitle(record.title);
  }
  return out;
}

function normalizeObjType(value) {
  const v = String(value || "").toLowerCase();
  if (v.includes("docx")) return "docx";
  if (v === "doc") return "doc";
  if (v.includes("sheet")) return "sheet";
  if (v.includes("bitable") || v.includes("base")) return "bitable";
  if (v.includes("slide")) return "slides";
  if (v.includes("file")) return "file";
  if (v.includes("mind")) return "mindnote";
  return v || "unknown";
}

function inferType(record) {
  const url = String(record.url || "").toLowerCase();
  if (url.includes("/docx/")) return "docx";
  if (url.includes("/doc/")) return "doc";
  if (url.includes("/sheets/")) return "sheet";
  if (url.includes("/base/") || url.includes("/bitable/")) return "bitable";
  if (url.includes("/slides/")) return "slides";
  return normalizeObjType(record.docTypes);
}

function iconToken(iconInfo) {
  try {
    const parsed = JSON.parse(iconInfo || "{}");
    return parsed.token || "";
  } catch {
    return "";
  }
}

async function exportOrDownload(record, id, title) {
  const type = normalizeObjType(record.resolvedType);
  const baseTitle = type === "file" ? stripKnownExtension(title) : title;
  const safeBase = `${id}-${safeFileName(baseTitle)}-${shortToken(record.resolvedToken)}`;

  if (type === "docx" || type === "doc") {
    return exportDrive(record, type, "docx", safeBase);
  }
  if (type === "sheet") {
    return exportDrive(record, "sheet", "xlsx", safeBase);
  }
  if (type === "bitable") {
    return exportDrive(record, "bitable", "base", safeBase);
  }
  if (type === "slides") {
    return exportDrive(record, "slides", "pptx", safeBase);
  }
  if (type === "file") {
    return downloadDrive(record, safeBase);
  }
  return { status: "unsupported", type, reason: "No supported export mapping" };
}

function exportDrive(record, docType, extension, safeBase) {
  const before = new Set(listFiles(exportDir));
  const json = runCliJson([
    "drive",
    "+export",
    "--as=user",
    `--token=${record.resolvedToken}`,
    `--doc-type=${docType}`,
    `--file-extension=${extension}`,
    `--file-name=${safeBase}`,
    "--output-dir=.",
    "--overwrite",
  ], { cwd: exportDir, retries: 8, retryDelayMs: 5000, timeoutMs: 180000 });

  const data = json.data || {};
  const saved = data.saved_path || findNewFile(before, safeBase, extension) || path.join(exportDir, `${safeBase}.${extension}`);
  const snapshot = extension === "docx" && fs.existsSync(saved) ? docxToMarkdown(saved) : "";
  return {
    status: "exported",
    exportType: docType,
    extension,
    filePath: saved,
    fileName: path.basename(saved),
    fileToken: data.file_token || "",
    sizeBytes: data.size_bytes || fileSize(saved),
    contentSnapshot: snapshot,
  };
}

function downloadDrive(record, safeBase) {
  const ext = fileExtensionFromRecord(record);
  const fileName = ext ? `${safeBase}.${ext}` : safeBase;
  const json = runCliJson([
    "drive",
    "+download",
    "--as=user",
    `--file-token=${record.resolvedToken}`,
    `--output=${fileName}`,
    "--overwrite",
  ], { cwd: exportDir, retries: 8, retryDelayMs: 5000, timeoutMs: 180000 });

  const data = json.data || {};
  const saved = data.saved_path || path.join(exportDir, fileName);
  return {
    status: "downloaded",
    exportType: "file",
    extension: path.extname(saved).replace(/^\./, ""),
    filePath: saved,
    fileName: path.basename(saved),
    fileToken: data.file_token || record.resolvedToken,
    sizeBytes: data.size_bytes || fileSize(saved),
    contentSnapshot: "",
  };
}

function runCliJson(cliArgs, options = {}) {
  const text = runCli(cliArgs, options);
  const jsonText = extractJson(text);
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`Failed to parse CLI JSON for ${cliArgs.join(" ")}: ${err.message}\n${text.slice(-1000)}`);
  }
}

function runCli(cliArgs, options = {}) {
  const retries = options.retries || 1;
  const retryDelayMs = options.retryDelayMs || 1000;
  const timeoutMs = options.timeoutMs || 90000;
  let last = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const res = spawnSync(NODE, [LARK_RUNNER, ...cliArgs], {
      cwd: options.cwd || process.cwd(),
      encoding: "utf8",
      timeout: timeoutMs,
      windowsHide: true,
      maxBuffer: 20 * 1024 * 1024,
    });
    const stdout = res.stdout || "";
    const stderr = res.stderr || "";
    const combined = `${stdout}${stderr ? `\n${stderr}` : ""}`;
    last = { status: res.status, error: res.error, combined };
    if (res.status === 0) return combined;
    if (!/EOF|timeout|transport|network|rate|processing/i.test(combined) && attempt >= 2) break;
    if (attempt < retries) sleep(retryDelayMs * attempt);
  }
  const message = last && last.error ? last.error.message : (last ? last.combined : "unknown CLI failure");
  throw new Error(message.slice(-4000));
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON object found in CLI output: ${text.slice(-1000)}`);
  }
  return text.slice(start, end + 1);
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Math.min(100, end - Date.now()));
  }
}

function listFiles(dir) {
  try {
    return fs.readdirSync(dir).map((name) => path.join(dir, name));
  } catch {
    return [];
  }
}

function findNewFile(before, safeBase, extension) {
  const files = listFiles(exportDir);
  const candidates = files.filter((file) => !before.has(file) && path.basename(file).startsWith(safeBase));
  const extCandidates = candidates.filter((file) => path.extname(file).toLowerCase() === `.${extension.toLowerCase()}`);
  return (extCandidates[0] || candidates[0] || "");
}

function findFileByPrefix(dir, prefix) {
  try {
    const files = fs.readdirSync(dir).map((name) => path.join(dir, name));
    return files.find((file) => path.basename(file).startsWith(prefix)) || "";
  } catch {
    return "";
  }
}

function buildExistingCardIndex() {
  const index = new Map();
  let files = [];
  try {
    files = fs.readdirSync(cardDir).filter((name) => name.toLowerCase().endsWith(".md"));
  } catch {
    return index;
  }
  for (const name of files) {
    const cardPath = path.join(cardDir, name);
    let text = "";
    try {
      text = fs.readFileSync(cardPath, "utf8");
    } catch {
      continue;
    }
    const source = (text.match(/^source:\s*"([^"]*)"/m) || [])[1] || "";
    if (!source) continue;
    const title = (text.match(/^title:\s*"([^"]*)"/m) || [])[1] || path.basename(name, ".md");
    const status = (text.match(/^sync_status:\s*"([^"]*)"/m) || [])[1] || "";
    const exportRel = (text.match(/Exported file:\s+\[[^\]]+\]\(<([^>]+)>\)/) || [])[1] || "";
    const exportPath = exportRel ? path.resolve(path.dirname(cardPath), exportRel.replace(/\//g, path.sep)) : "";
    index.set(source, { cardPath, title, status, exportPath });
  }
  return index;
}

function fileSize(file) {
  try {
    return fs.statSync(file).size;
  } catch {
    return "";
  }
}

function writeCard(record, exportResult, id, title) {
  const cardName = `${id}-${safeFileName(title)}.md`;
  const cardPath = path.join(cardDir, cardName);
  const localExportLink = exportResult.filePath
    ? relLink(cardPath, exportResult.filePath, exportResult.fileName || path.basename(exportResult.filePath))
    : "";

  const sourceTitle = escapeYaml(title);
  const lines = [];
  lines.push("---");
  lines.push(`title: "${sourceTitle}"`);
  lines.push("created: 2026-06-02");
  lines.push("circle: shared");
  lines.push("tags: [飞书同步, 云文档, 企业大脑]");
  lines.push(`source: "${escapeYaml(record.url || "")}"`);
  lines.push(`entity_type: "${escapeYaml(record.entityType || "")}"`);
  lines.push(`doc_type: "${escapeYaml(record.resolvedType || record.docTypes || "")}"`);
  lines.push(`owner: "${escapeYaml(record.ownerName || "")}"`);
  lines.push(`updated_at: "${escapeYaml(record.updateTime || "")}"`);
  lines.push(`sync_status: "${escapeYaml(exportResult.status || "")}"`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${title}`);
  lines.push("");
  lines.push("## Source");
  lines.push("");
  lines.push(`- Feishu: ${record.url ? `[${title}](${record.url})` : ""}`);
  lines.push(`- Type: ${record.entityType || ""} / ${record.resolvedType || record.docTypes || ""}`);
  lines.push(`- Owner: ${record.ownerName || ""}`);
  lines.push(`- Updated: ${record.updateTime || ""}`);
  if (record.isCrossTenant) lines.push("- Cross tenant: true");
  if (record.wikiSpaceId) lines.push(`- Wiki space: ${record.wikiSpaceId}`);
  if (record.wikiResolveError) lines.push(`- Wiki resolve warning: ${record.wikiResolveError}`);
  lines.push("");
  lines.push("## Local Copy");
  lines.push("");
  if (localExportLink) {
    lines.push(`- Exported file: ${localExportLink}`);
    lines.push(`- Size bytes: ${exportResult.sizeBytes || ""}`);
  } else {
    lines.push(`- Status: ${exportResult.status || "unknown"}`);
    if (exportResult.reason) lines.push(`- Reason: ${exportResult.reason}`);
    if (exportResult.error) lines.push(`- Error: ${exportResult.error}`);
  }
  lines.push("");
  lines.push("## Search Snippet");
  lines.push("");
  lines.push(cleanInline(record.summary || "") || "(empty)");
  lines.push("");
  if (exportResult.contentSnapshot) {
    lines.push("## Content Snapshot");
    lines.push("");
    lines.push(exportResult.contentSnapshot);
    lines.push("");
  }
  fs.writeFileSync(cardPath, lines.join("\n"), "utf8");
  return cardPath;
}

function toManifestRow(record, exportResult, cardPath) {
  return {
    title: cleanTitle(record.resolvedTitle || record.title),
    entity_type: record.entityType || "",
    doc_type: record.resolvedType || record.docTypes || "",
    status: exportResult.status || "",
    owner: record.ownerName || "",
    updated_at: record.updateTime || "",
    feishu_url: record.url || "",
    token: record.resolvedToken || record.token || "",
    local_card: cardPath || "",
    local_export: exportResult.filePath || "",
    error: exportResult.error || exportResult.reason || "",
  };
}

function writeManifest(rows) {
  const headers = ["title", "entity_type", "doc_type", "status", "owner", "updated_at", "feishu_url", "token", "local_card", "local_export", "error"];
  const tsv = [headers.join("\t")].concat(rows.map((row) => headers.map((h) => tsvCell(row[h])).join("\t"))).join("\n");
  fs.writeFileSync(path.join(listDir, "飞书云文档全量清单.tsv"), tsv, "utf8");
  fs.writeFileSync(path.join(logDir, "last-manifest.json"), JSON.stringify({ stats, rows }, null, 2), "utf8");
}

function writeFailures(failures) {
  const lines = [];
  lines.push("# 飞书云文档同步失败清单");
  lines.push("");
  lines.push(`- Failed count: ${failures.length}`);
  lines.push("");
  for (const item of failures) {
    lines.push(`## ${item.title}`);
    lines.push("");
    lines.push(`- URL: ${item.url || ""}`);
    lines.push(`- Entity: ${item.entity_type || ""}`);
    lines.push(`- Error: ${item.error || ""}`);
    lines.push("");
  }
  fs.writeFileSync(path.join(listDir, "飞书云文档同步失败清单.md"), lines.join("\n"), "utf8");
}

function writeEntry(rows, failures) {
  const byStatus = groupCount(rows, "status");
  const byType = groupCount(rows, "doc_type");
  const lines = [];
  lines.push("---");
  lines.push("title: 飞书云文档同步入口");
  lines.push("created: 2026-06-02");
  lines.push("circle: shared");
  lines.push("tags: [企业大脑, 飞书同步, Obsidian]");
  lines.push("---");
  lines.push("");
  lines.push("# 飞书云文档同步入口");
  lines.push("");
  lines.push("本目录用于把飞书云文档复制到本地 Obsidian 企业大脑。同步过程保留飞书原链接，并为每个云文档生成资料卡片。");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Records found: ${stats.searched}`);
  lines.push(`- Local cards: ${stats.cards}`);
  lines.push(`- Exported/downloaded files: ${stats.exported}`);
  lines.push(`- Unsupported: ${stats.unsupported}`);
  lines.push(`- Failed: ${stats.failed}`);
  lines.push("");
  lines.push("## Status");
  lines.push("");
  for (const [key, count] of Object.entries(byStatus)) lines.push(`- ${key || "(empty)"}: ${count}`);
  lines.push("");
  lines.push("## Types");
  lines.push("");
  for (const [key, count] of Object.entries(byType)) lines.push(`- ${key || "(empty)"}: ${count}`);
  lines.push("");
  lines.push("## Files");
  lines.push("");
  lines.push(`- [[../01清单/飞书云文档全量清单.tsv|飞书云文档全量清单.tsv]]`);
  lines.push(`- [[../01清单/飞书云文档同步失败清单|飞书云文档同步失败清单]]`);
  lines.push("");
  lines.push("## Recent Cards");
  lines.push("");
  rows.slice(0, 80).forEach((row) => {
    const cardBase = path.basename(row.local_card || "", ".md");
    if (cardBase) lines.push(`- [[../02资料卡片/${cardBase}|${row.title}]]`);
  });
  if (rows.length > 80) lines.push(`- ...plus ${rows.length - 80} more cards in [[../02资料卡片]]`);
  if (failures.length) {
    lines.push("");
    lines.push("## Attention");
    lines.push("");
    lines.push("Some documents could not be exported. Open the failure list and retry later; most observed failures were transient Feishu API EOF/network errors.");
  }
  fs.writeFileSync(path.join(entryDir, "飞书云文档同步入口.md"), lines.join("\n"), "utf8");
}

function writeRootPointer() {
  const pointer = [];
  pointer.push("---");
  pointer.push("title: 飞书云文档入口");
  pointer.push("created: 2026-06-02");
  pointer.push("circle: shared");
  pointer.push("tags: [企业大脑, 飞书同步, 统一入口]");
  pointer.push("---");
  pointer.push("");
  pointer.push("# 飞书云文档入口");
  pointer.push("");
  pointer.push("- [[飞书云文档同步/00入口/飞书云文档同步入口|飞书云文档同步入口]]");
  pointer.push("- [[飞书云文档同步/01清单/飞书云文档全量清单.tsv|飞书云文档全量清单]]");
  pointer.push("- [[飞书云文档同步/01清单/飞书云文档同步失败清单|飞书云文档同步失败清单]]");
  pointer.push("- [[飞书云文档同步/02资料卡片|资料卡片文件夹]]");
  pointer.push("- [[飞书云文档同步/03原始导出|原始导出文件夹]]");
  pointer.push("");
  pointer.push("说明：飞书原始云文档没有被删除或移动；本地只保存导出副本、资料卡片和清单。");
  fs.writeFileSync(path.join(targetRoot, "飞书云文档入口.md"), pointer.join("\n"), "utf8");
}

function groupCount(rows, field) {
  return rows.reduce((acc, row) => {
    const key = row[field] || "";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function relLink(fromFile, toFile, label) {
  const rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
  return `[${label}](<${rel}>)`;
}

function safeFileName(value) {
  const cleaned = cleanTitle(value)
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || "untitled").slice(0, 90);
}

function cleanTitle(value) {
  return cleanInline(value || "").replace(/\s+/g, " ").trim();
}

function cleanInline(value) {
  return decodeXml(String(value || "").replace(/<\/?h>/g, "").replace(/<[^>]+>/g, ""));
}

function escapeYaml(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function tsvCell(value) {
  return String(value == null ? "" : value).replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function shortToken(token) {
  return String(token || "no-token").slice(0, 8);
}

function stripKnownExtension(value) {
  return String(value || "").replace(/\.(docx?|xlsx?|pptx?|pdf|csv|txt|md|html?|png|jpe?g|svg|zip|rar|7z)$/i, "");
}

function fileExtensionFromRecord(record) {
  try {
    const parsed = JSON.parse(record.iconInfo || "{}");
    if (parsed.file_type) return String(parsed.file_type).replace(/^\./, "").toLowerCase();
  } catch {
    // Ignore invalid icon_info and fall back to title/url parsing.
  }
  const title = cleanTitle(record.resolvedTitle || record.title || "");
  const fromTitle = (title.match(/\.([a-zA-Z0-9]{2,8})$/) || [])[1];
  if (fromTitle) return fromTitle.toLowerCase();
  const fromUrl = (String(record.url || "").match(/\.([a-zA-Z0-9]{2,8})(?:\?|$)/) || [])[1];
  return fromUrl ? fromUrl.toLowerCase() : "";
}

function docxToMarkdown(file) {
  try {
    const buf = fs.readFileSync(file);
    const xml = readZipEntry(buf, "word/document.xml");
    if (!xml) return "";
    const paragraphs = [];
    const re = /<w:p[\s\S]*?<\/w:p>/g;
    let match;
    while ((match = re.exec(xml))) {
      const p = match[0];
      let text = "";
      const tRe = /<w:t[^>]*>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g;
      let tMatch;
      while ((tMatch = tRe.exec(p))) {
        if (tMatch[0].startsWith("<w:tab")) text += "\t";
        else if (tMatch[0].startsWith("<w:br")) text += "\n";
        else text += decodeXml(tMatch[1] || "");
      }
      text = text.replace(/\s+\n/g, "\n").trim();
      if (text) paragraphs.push(text);
      if (paragraphs.join("\n\n").length > 50000) break;
    }
    return paragraphs.join("\n\n").slice(0, 50000);
  } catch (err) {
    return `Could not extract DOCX text snapshot: ${err.message}`;
  }
}

function readZipEntry(buf, name) {
  const eocd = findEocd(buf);
  if (eocd < 0) return "";
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const entries = buf.readUInt16LE(eocd + 10);
  let ptr = cdOffset;
  for (let i = 0; i < entries; i += 1) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break;
    const method = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const fileName = buf.slice(ptr + 46, ptr + 46 + nameLen).toString("utf8");
    if (fileName === name) {
      const localNameLen = buf.readUInt16LE(localOffset + 26);
      const localExtraLen = buf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLen + localExtraLen;
      const data = buf.slice(dataStart, dataStart + compSize);
      if (method === 0) return data.toString("utf8");
      if (method === 8) return zlib.inflateRawSync(data).toString("utf8");
      return "";
    }
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return "";
}

function findEocd(buf) {
  const sig = 0x06054b50;
  const max = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= max; i -= 1) {
    if (buf.readUInt32LE(i) === sig) return i;
  }
  return -1;
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
