# yuanli-narrative-strategy-map

把**原力创业学员的逐字稿** → 一份**高奢侈感、高信息密度**的单文件 H5 战略地图，骨架与术语对齐《原力创业通关地图》MECE 知识图谱。

这是一个 [Claude Agent Skill](https://docs.claude.com/en/docs/claude-code/skills)。同时提供一份**自包含可移植 system prompt**（[`agent-prompt-export.md`](agent-prompt-export.md)），可整段粘贴到 Coze / 扣子 / Dify / 智谱 AgentBuilder / FastGPT / Claude Projects，让任意平台的智能体复刻同样能力。

## 它做什么

学员把自己相关的逐字稿丢进来 —— **不必整理**，一堆原始口语录音转写即可 —— 智能体自动：

1. **判定输入模式**：检测到 `Q1…Q20` 题号 → 结构化快路；否则 → free-form 摄取（字段驱动捞取）。
2. **抽取**：逐字稿是唯一信源，每个字段配 30-80 字逐字原话做防伪溯源；free-form 额外报置信度 H/M/L + 缺口账本。
3. **渲染**：输出与 V8 范本同源的单文件 H5 —— 四关绑定四主色（觉醒红 / 独创蓝 / 升维绿 / 锁定紫）+ ~30 个 CSS 模块 + 顶层乘法公式 `财富 = 借势 × 合力`。

## 知识图谱本体

产出结构严格对齐《原力创业通关地图》——四关串行、每关 MECE：

| 关 | 第一性问题 | MECE 骨架 |
|---|---|---|
| 壹 · 原力觉醒 | 我是谁（输入端） | 三圈交集 |
| 貳 · 品类独创 | 我为谁（市场端） | 三角定位 |
| 叁 · 模式升维 | 我怎么赚（变现端） | 三链贯通 |
| 肆 · 壁垒锁定 | 我怎么守（防御端） | 四维护城 |

详见 [`references/tongguan-map-v3-alignment.md`](references/tongguan-map-v3-alignment.md)。

## 核心契约（防 AI 编造）

- **逐字稿是唯一信源**，语料里找不到证据的内容一律留白，绝不用训练先验补。
- **缺信息降级**：没料的字段 → 渲染时直接砍掉对应模块；free-form 推断项必标「⊙ 待学员确认」脚注。
- **宁可成稿偏空，也不虚高满版** —— 半真的奢侈感 HTML 比诚实的留白更危险。
- **CSS 模板 byte-identical**：LLM 只填内容，不动样式。

## 安装（Claude Code / Claude Agent SDK）

```bash
git clone https://github.com/moonstachain/yuanli-narrative-strategy-map.git
ln -s "$(pwd)/yuanli-narrative-strategy-map" ~/.claude/skills/yuanli-narrative-strategy-map
```

## 不在仓库里的两个文件

为保护**学员隐私**与**课程 IP**，两个完整 HTML 不入库（见 [`.gitignore`](.gitignore)）：
- `examples/narrative-strategy-map-V8-reference.html` —— 含真实学员战略全文的 gold-standard。
- `examples/tongguan-map-V3-reference.html` —— 原力创业通关地图完整母图。

仓库已含**蒸馏后的方法论文本**（`references/`）+ **client-clean 的 CSS 全文**（`agent-prompt-export.md` 第 4 节）+ **骨架**（`templates/`），足以独立运行。

## License

MIT © 2026 moonstachain
