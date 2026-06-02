---
name: yuanli-narrative-strategy-map
description: 原力创业通关地图战略地图 H5 生成器。学员把自己相关的逐字稿（一堆原始口语录音转写，或按 Q1-Q20 锚定的结构化访谈，皆可）丢进来，自动参照「原力创业通关地图」MECE 知识图谱，产出与叙世者 V8 同源的高奢侈感、高信息密度单文件 H5 战略地图（Prologue 借势合力 + Gate 1 原力觉醒 + Gate 2 品类独创 + Gate 3 模式升维 + Gate 4 壁垒锁定 + Closing 远方）。逐字稿是唯一信源、缺信息降级、CSS 模板 byte-identical 锁死，LLM 只填内容不动样式。触发词：通关地图、战略地图、把逐字稿做成HTML、原力创业四关、叙事战略地图、学员战略图。
---

# yuanli-narrative-strategy-map

把原力学员的逐字稿 → 单文件 H5 战略地图。**两种输入皆可**：① 一堆原始口语逐字稿（多份、无结构）；② 按 Q1-Q20 锚定的结构化访谈。结构、配色、字体、组件库与叙世者 V8（`narrative-strategy-map-V8.html`，1300 行）byte-level 一致；骨架与术语对齐「通关地图 V3」知识图谱。

> **v2（2026-06-01）**：① 新增 free-form 摄取层，学员可直接丢一堆原始口语逐字稿（不必先整理成 Q1-Q20）；② 骨架本体对齐「通关地图 V3 绿皮书对齐版」；③ 可发布到 GitHub。

## 核心契约

1. **逐字稿是唯一信源**——所有内容必须能在用户提供的逐字稿里找到证据。LLM 不许编造、不许从训练数据补"看起来合理"的填充。
2. **V8 模板严格不可改**——`<style>...</style>` 节 byte-identical 拷贝。CSS 唯一权威源 = [agent-prompt-export.md](agent-prompt-export.md) 第 4 节（client-clean，可公开）；本地另有 `examples/narrative-strategy-map-V8-reference.html` 作 gold-standard（含真实学员案例，**仅本地、不入库**）。`:root` CSS tokens、字体声明、模块类名一律不改，LLM 只换 body 内容。
3. **本体对齐通关地图 V3**——四关骨架（三圈/三角/三链/四维）+ 顶层乘法公式 `财富 = 借势 × 合力` 见 [references/tongguan-map-v3-alignment.md](references/tongguan-map-v3-alignment.md)；四周期权威定义见 [references/four-cycles-doctrine.md](references/four-cycles-doctrine.md)。渲染时术语/骨架必须对齐，不准漂移。
4. **缺信息降级**——逐字稿没覆盖/没答清的字段，留空 → render 阶段直接砍掉对应模块。绝不强行编内容。free-form 模式额外强制**置信度 + 缺口账本**（见 Step 2）。

## 三步管线

### Step 1 · Pre-flight 输入校验 + 模式判定

用户必须提供：

| 参数 | 必填 | 说明 |
|---|---|---|
| `transcript_path` | ✅ | 学员逐字稿路径，**可多个**（一堆原始口语稿）或单个结构化稿，.md/.txt |
| `subject_name` | ✅ | 受访人姓名或项目名（替换 V8 里的"叙世者"） |
| `output_path` | ✅ | 输出 H5 单文件绝对路径 |
| `subject_motif` | 可选 | 创始人母题，1-3 字（默认由 LLM 提取） |
| `version_tag` | 可选 | 版本标签（默认 v1） |

**模式判定（自动）**：扫描全部输入——
- 检测到 `## Q` / `Q1`…`Q20` 题号标记 **≥ 10 处** → **结构化快路**（顺题对位）。
- 否则 → **free-form 路**（字段驱动捞取，见 [references/freeform-ingestion.md](references/freeform-ingestion.md)）。这是学员"丢一堆原始逐字稿"的默认路径。

**拒绝/警示场景**：
- 全语料净字数 `< 1500 字` → 拒绝（信号不足，无法填 6 节）。
- free-form 模式且 `< 3000 字` → 警示可继续但成稿偏空，建议补录。
- 语料含多个说话人且无法确定 subject → 停下来问"要做战略地图的是谁"。

### Step 2 · Extract 逐字稿 → 结构化 JSON

1. 加载 [references/extraction-schema.md](references/extraction-schema.md)，拿到完整 JSON schema（约 40 字段，按 6 节分组）。
2. 加载 [references/four-cycles-doctrine.md](references/four-cycles-doctrine.md) + [references/tongguan-map-v3-alignment.md](references/tongguan-map-v3-alignment.md)，确保抽取时的术语、骨架、阈值与通关地图本体对齐。
3. **按模式抽取**：
   - 结构化快路 → 加载 [references/interview-questions.md](references/interview-questions.md)，逐题（Q1→Q20）对位抽取。
   - free-form 路 → 走 [references/freeform-ingestion.md](references/freeform-ingestion.md)：语料归并 → **字段驱动捞取**（拿 40 字段去全语料捞，不顺读）→ 证据绑定 + **置信度 H/M/L + inferred 标记** → **缺口账本**。
4. 每个字段 **同时记录证据片段**（30-80 字逐字稿原话 + 来源标号，作为防伪溯源）。
5. 缺字段策略：直接留 `null`。**不许猜、不许补默认值**。free-form 推断项一律 `inferred:true` + 成稿脚注，绝不冒充原话。

输出形如：

```json
{
  "subject_name": "...",
  "subject_motif": "看见",
  "prologue": {
    "borrowing_momentum": {"value": "...", "evidence": "..."},
    "combining_forces": {"value": "...", "evidence": "..."}
  },
  "g1": {
    "non_rational_obsession": {...},
    "asymmetric_advantage": {...},
    "dual_personality": {...},
    "shadow_to_superpower": {...},
    "founding_motif": {...}
  },
  "g2": {...}, "g3": {...}, "g4": {...},
  "closing": {...}
}
```

### Step 3 · Render JSON → H5

1. 加载 [templates/v8-skeleton.html](templates/v8-skeleton.html) 拿到骨架。
2. 加载 [references/module-library.md](references/module-library.md)，根据 schema 填充情况选用模块——**每个 GATE 至少用 3 个 V8 模块组件**（不够则该 GATE 偏空，给用户警示）。
3. 把每个字段值填入骨架占位符 `{{...}}`。null 字段对应的整块模块直接删除（不留空架子）。
4. 写入 `output_path`，输出单文件 self-contained HTML（Google Fonts 走 CDN 例外）。

**Render 阶段失真护栏**：
- 不许动 `<style>...</style>` 节（diff 应该零变化）
- 不许加 V8 没有的 CSS 类
- 不许引入外部 JS/CSS 文件
- 写入后立即 `grep ":root" output.html` 验真 CSS tokens 还在

## 输出验证（每次必跑）

```bash
# 1. 文件存在 + 体量合理（≥ 800 行说明结构齐全）
test -f "$output_path" && wc -l "$output_path"

# 2. CSS tokens byte-identical（应输出与 V8 完全相同的 :root 块）
diff <(sed -n '/:root{/,/}/p' "$output_path") \
     <(sed -n '/:root{/,/}/p' ~/.claude/skills/yuanli-narrative-strategy-map/examples/narrative-strategy-map-V8-reference.html)

# 3. 六节齐全
grep -c 'id="intro"\|id="gate1"\|id="gate2"\|id="gate3"\|id="gate4"\|id="closing"' "$output_path"
# 期望输出 6

# 4. 浏览器打开人工验真
open "$output_path"
```

## 已确认的 Out of Scope

- 叙之工作台里 `cockpit-*.html` / `project-*.html` → 不同任务族，本 skill 不覆盖
- 逐字稿采集（用户用录音 + 飞书妙记/get笔记/whisper 自取，本 skill 只接受 .md/.txt 文本输入）
- 飞书多维表回写（输出仅单文件 H5）
- 自动学员访谈（本 skill 不做对话，只做转换）

## References

- [references/tongguan-map-v3-alignment.md](references/tongguan-map-v3-alignment.md) — **v2 新增**：通关地图 V3 本体对齐（乘法公式 + 三圈/三角/三链/四维 MECE 骨架 + V3 阈值命名）
- [references/freeform-ingestion.md](references/freeform-ingestion.md) — **v2 新增**：一堆原始口语逐字稿的 free-form 摄取协议（字段驱动捞取 + 置信度 + 缺口账本）
- [references/four-cycles-doctrine.md](references/four-cycles-doctrine.md) — 四周期权威定义（蒸馏自 LLM-Wiki concepts/）
- [references/interview-questions.md](references/interview-questions.md) — 20 题访谈问卷 frozen 清单（结构化快路用）
- [references/extraction-schema.md](references/extraction-schema.md) — 逐字稿 → JSON 字段 schema
- [references/module-library.md](references/module-library.md) — V8 ~30 个 CSS 模块索引 + 字段绑定 + 何时用
- [agent-prompt-export.md](agent-prompt-export.md) — **可移植版**：自包含 system prompt（含 byte-identical CSS 全文，client-clean），整段粘贴到 Coze/Dify/Claude Projects 即复刻本 skill
- [templates/v8-skeleton.html](templates/v8-skeleton.html) — V8 骨架（body 占位符；CSS 引 agent-prompt-export §4）
- `examples/narrative-strategy-map-V8-reference.html` — 叙世者 V8 原件 gold-standard（**含真实学员案例，仅本地、`.gitignore` 不入库**）

## 兄弟 skill

- `yuanli-investment-pulse` — 投资观点 pulse skill（同前缀 frozen-reference 范式）
- `feishu-expert-brain-architect` — 飞书专家大脑构建 skill（同家族目录组织）
- `yuanli-knowledge` — 原力生态域知识路由（如需调用 LLM-Wiki 上下文做内容补强）
