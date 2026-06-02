# 逐字稿 → JSON Schema · v0.1

LLM 在 Step 2 必须按本 schema 抽取。**每个字段必须配 `evidence`**（30-80 字逐字稿原话，作为防伪溯源）。

缺失字段 → `null` + `evidence: null`，**绝不**编内容。

---

## 顶层结构

```json
{
  "meta": {
    "subject_name": "string · 受访人/项目名",
    "subject_motif": "string · 1-3 字动词（如「看见」），来自 Q7 或 LLM 提取",
    "version_tag": "string · 默认 v1",
    "sealed_date": "string · YYYY.MM.DD"
  },
  "prologue": {...},
  "g1": {...},
  "g2": {...},
  "g3": {...},
  "g4": {...},
  "closing": {...}
}
```

---

## prologue · 借势合力

| 字段 | 类型 | 来源 | 渲染到 |
|---|---|---|---|
| `prologue.borrowing_momentum` | `{value, evidence}` | Q1 | `.intro-card` 第 1 张（借势） |
| `prologue.combining_forces` | `{value, evidence}` | Q2 | `.intro-card` 第 2 张（合力） |
| `prologue.formula` | `string` | 默认 "借势 × 合力 = 复利"（不变） | `.hero-formula` |
| `prologue.quote` | `{text, cite}` | 可选，从逐字稿引一句最有力的话 | `.qb` |

---

## g1 · 原力觉醒（color g1 红）

| 字段 | 类型 | 来源 | 渲染到 |
|---|---|---|---|
| `g1.non_rational_obsession` | `{value, signals[6], evidence}` | Q3 | `.card.g1`（非理性痴迷 6 信号） |
| `g1.asymmetric_advantage` | `{value, five_dim_scores, evidence}` | Q4 | `.card.g1`（非对称优势 5 维度） |
| `g1.dual_personality` | `{rider, elephant, evidence}` | Q5 | `.card.g1`（双人格结构） |
| `g1.shadow_to_superpower` | `{shadow, superpower, evidence}` | Q6 | `.card.g1`（阴影→超能力） |
| `g1.founding_motif` | `{verb, sentence, evidence}` | Q7 | 大标题 `.founding-motif` 区 |
| `g1.ab_frame` | `{a_tool, b_reflex, evidence}` | Q6 follow-up | `.ab-frame`（A 工具 / B 反射） |
| `g1.signature_case` | `{title, quote, meaning, evidence}` | 整段逐字稿挖最具代表性的 1 个故事 | `.case-box` |
| `g1.founder_arc` | `{start, turn, now, evidence}` | 整段逐字稿挖创始人故事弧 | `.card.g1`（创始人故事弧） |

---

## g2 · 品类独创（color g2 蓝）

| 字段 | 类型 | 来源 | 渲染到 |
|---|---|---|---|
| `g2.twelve_word_mantra` | `{word1, word2, word3, word4}` | 默认 "无法分类/重新定义/自带预算/品类独创"，特例可改 | `.four-word` |
| `g2.sweet_user_profile` | `{age, profession, family_tier, ticket, decision_style, evidence}` | Q8 | `.profile` |
| `g2.value_pyramid` | `[surface, scene1, scene2, deep, ultimate, base_motif]`（5-6 层） | Q9 | `.pyramid` |
| `g2.killer_one_liner` | `{text, evidence}` | Q10 | `.one-liner` |
| `g2.fourth_species` | `[{name, gap}] × 3 + {name: "你=", gap: ...}` | Q11 | `.species` |
| `g2.validation_matrix` | `{customer, search, peer, media}` 4 象限各 status + evidence | Q15 推断 + LLM 判断 | `.vmx`（4 象限） |
| `g2.category_extension` | `{verified[], strong_signal[], hypothesis[], speculation[]}` | LLM 从逐字稿挖出"还没做但提过"的场景 | `.cmx`（16 场景品类扩展矩阵） |

---

## g3 · 模式升维（color g3 绿）

| 字段 | 类型 | 来源 | 渲染到 |
|---|---|---|---|
| `g3.front_chain` | `{current, target, key_moves[], evidence}` | Q12 | `.link-card` 第 1 张 |
| `g3.back_chain` | `{tiers: [S/A+/A/伙伴/AI], evidence}` | Q13 | `.link-card` 第 2 张 |
| `g3.finance_chain` | `{main, second_curve, funnel, asset, evidence}` | Q14 | `.link-card` 第 3 张 |
| `g3.three_links_grid` | 9 格：链路 × 验证程度（已验证/在建/待建）| 综合 Q12-14 | `.ninegrid` |
| `g3.income_pyramid` | 5 层金字塔 | Q14 + LLM 推断 | `.pyramid-income` |
| `g3.five_layers_alloc` | `[{name, items, tag}] × 5`（主投/半投/机会主义/远景/工具）| Q14 + Q20 推断 | `.layers-list` |
| `g3.funnel_three_layer` | 三层防白嫖咨询（如适用）| Q12 follow-up | `.funnel-3` |
| `g3.bayes_status` | `C/B/A/S` 中的位置 | Q15 推断 | `.bayes` |
| `g3.kpi_panel` | `[{num, label}] × 4` | Q15 | `.kpi` |
| `g3.anchor_current_year` | `{main, half, opportunistic, vision}` | Q20 | `.anchor-2026`（当年着力点） |

---

## g4 · 壁垒锁定（color g4 紫）

| 字段 | 类型 | 来源 | 渲染到 |
|---|---|---|---|
| `g4.four_dim_score` | `{V: {now, target}, R: ..., I: ..., O: ...}` | Q16 | `.four-dim` + `.scorecard` 雷达图 |
| `g4.main_focus` | `{primary, secondary, maintain, weakness, evidence}` | Q17 | `.dirtable`（主攻方向变化） |
| `g4.strongest_single_lock` | `{type, name, score, description, evidence}` | Q18 | `.acc-item.highlight` |
| `g4.sixteen_controls` | `[{code, name, score_now, score_target, direction}] × 16+`（V1-V4 / S1-S4 / I1-I4 / O1-O4） | LLM 综合 Q16-18 推断 + 缺信息填占位评分 | `.acc-item` accordion |
| `g4.total_score` | `{current, target, strategy_line}` | LLM 综合 | `.total-score` |

---

## closing · 远方

| 字段 | 类型 | 来源 | 渲染到 |
|---|---|---|---|
| `closing.attack_side` | `[bullet] × 3-4` 攻 · 创富（前三关赚到钱）| LLM 总结 g1-g3 | `.closing-side` 左 |
| `closing.defend_side` | `[bullet] × 3-4` 守 · 守富（第四关守住钱）| LLM 总结 g4 | `.closing-side` 右 |
| `closing.vision_paint` | `[paragraph] × 4-6` 千里江山图段落 | Q19 | `.vision-paint` |
| `closing.next_anchor` | `string` 下一个 S 级动作 | Q20 | `.vision-paint` 最后一段 |
| `closing.final_line` | `string · 一句收尾`（如 V8 "那是你的世界 / 我们只是看见你，翻译它"）| LLM 从 Q7 母题 + Q19 远方派生 | `.closing-final` |

---

## 缺字段降级规则

| 缺失情况 | 处理 |
|---|---|
| `g1.signature_case` 缺 | 渲染时砍 `.case-box` 整块 |
| `g1.ab_frame` 缺 | 渲染时砍 `.ab-frame` + `.ab-underline` 两块 |
| `g2.validation_matrix` 缺 | 渲染时砍 `.vmx` 整块 |
| `g2.category_extension` 缺 | 渲染时砍 `.cmx` 整块 |
| `g3.bayes_status` 缺 | 渲染时砍 `.bayes` 整块 |
| `g3.funnel_three_layer` 缺 | 渲染时砍 `.funnel-3` 整块 |
| `g4.total_score` 缺 | 渲染时砍 `.scorecard` 整块（雷达图也砍） |
| 任何一节超过 50% 字段缺 | 在该 GATE 末尾追加 `<p class="note">本节信号较弱，待二次访谈深挖</p>` |

**绝对不许做**：用通用模板话术（"伟大公司都需要..."）填充空字段。
