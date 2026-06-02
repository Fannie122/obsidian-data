# V8 模块库索引 · 30+ 组件

每个组件：所在节 · 字段绑定 · 何时用 · 何时不用 · 最少/最多实例数。

LLM 在 Render 阶段按本表 **从 schema 字段反查** 应该用哪些模块；每个 GATE 至少调用 **3-5** 个模块，不够说明 Extract 信号偏弱。

---

## 全局 · 框架结构（必装）

| 模块 | CSS 类 | 何时用 | 字段 |
|---|---|---|---|
| HERO | `.hero` | 每份 H5 一次（顶部） | `meta.subject_name` + `meta.sealed_date` + `prologue.formula` |
| Sticky Nav | `nav.navbar` | 每份 H5 一次 | 固定 6 个锚链接，不可改 |
| Section Separator | `.sep` | GATE 之间用 | 装饰 |
| Gate Header | `.gh.g1/.g2/.g3/.g4` | 每个 GATE 头部一次 | gate 编号 + 名字 + 副标题 |
| Footer | `footer` | 每份 H5 一次 | `meta.sealed_date` + colophon-note（版本说明） |

---

## Prologue 节 · 借势合力

| 模块 | CSS 类 | 何时用 | 字段 | 最少 | 最多 |
|---|---|---|---|---|---|
| Intro Card | `.intro-card` | 2 张（借势 / 合力） | `prologue.borrowing_momentum`, `prologue.combining_forces` | 2 | 2 |
| Quote Box | `.qb` | 整篇 0-6 次（每个 GATE 0-2 个） | `prologue.quote` 等 | 0 | 6 |

---

## Gate 1 · 原力觉醒 模块（color g1 红）

| 模块 | CSS 类 | 何时用 | 字段 | 最少 |
|---|---|---|---|---|
| Card g1 | `.card.g1` | 双人格 / 非对称优势 / 非理性痴迷 / 生物结构三层 / 阴影 / 故事弧 | `g1.dual_personality`, `g1.asymmetric_advantage`, `g1.non_rational_obsession`, `g1.shadow_to_superpower`, `g1.founder_arc` | 4 |
| Founding Motif Block | 自定义 inline（参考 V8 line 587-593）| 母题大标题 | `g1.founding_motif` | 1 |
| AB Frame | `.ab-frame` | 双重动力（A 工具 / B 反射） | `g1.ab_frame` | 0-1 |
| AB Underline | `.ab-underline` | 紧跟 ab-frame 之后的合并解读 | `g1.ab_frame` follow-up | 0-1 |
| Case Box | `.case-box` | 代表作品/标志性故事 | `g1.signature_case` | 0-1 |

**Gate 1 渲染下限**：至少 4 个 `.card.g1` + 1 个 founding motif block。

---

## Gate 2 · 品类独创 模块（color g2 蓝）

| 模块 | CSS 类 | 何时用 | 字段 | 最少 |
|---|---|---|---|---|
| Four Word Card | `.four-word` | 12 字真言 | `g2.twelve_word_mantra` | 1 |
| Card g2 | `.card.g2` | 染黑启示 / 情绪经济 / 趋势观察 | g2 节 follow-up 上下文 | 0-2 |
| Profile Box | `.profile` | 甜用户画像 | `g2.sweet_user_profile` | 1 |
| Pyramid | `.pyramid` + `.pyramid-tier` | 客户母题金字塔（5-6 层）| `g2.value_pyramid` | 1 |
| Value Ladder | `.val-ladder` | 价值阶梯 4 层（功能/情绪/社交/意义） | `g2.value_pyramid` 派生 | 0-1 |
| One Liner | `.one-liner` | 一句入脑 | `g2.killer_one_liner` | 1 |
| Species Box | `.species` | 第四种物种比较 | `g2.fourth_species` | 1 |
| Validation Matrix | `.vmx` | 品类验证 4 象限 | `g2.validation_matrix` | 0-1 |
| Category Matrix | `.cmx` | 16 场景扩展矩阵 | `g2.category_extension` | 0-1 |

**Gate 2 渲染下限**：12 字真言 + 甜用户 profile + 客户金字塔 + 一句入脑 = 4 个核心模块。

---

## Gate 3 · 模式升维 模块（color g3 绿）

| 模块 | CSS 类 | 何时用 | 字段 | 最少 |
|---|---|---|---|---|
| Three Links | `.three-links` + `.link-card` × 3 | 前 / 后 / 财链路 | `g3.front_chain`, `g3.back_chain`, `g3.finance_chain` | 1（3 张） |
| Nine Grid | `.ninegrid` | 三链路 × 验证程度 | `g3.three_links_grid` | 0-1 |
| Pyramid Income | `.pyramid-income` | 5 层收入金字塔 | `g3.income_pyramid` | 0-1 |
| Five Layers | `.layers-list` + `.ly-row` × 5 | 主投/半投/机会主义/远景/工具 | `g3.five_layers_alloc` | 1（5 行） |
| Funnel Three | `.funnel-3` | 三层防白嫖咨询机制 | `g3.funnel_three_layer` | 0-1 |
| Bayesian Status | `.bayes` | C/B/A/S 四等级验证 | `g3.bayes_status` | 0-1 |
| KPI Cards | `.kpi` + `.kpi-card` × 4 | 关键数字面板 | `g3.kpi_panel` | 0-1 |
| Anchor Block | `.anchor-2026` | 当年着力点 | `g3.anchor_current_year` | 0-1 |
| Quote Box | `.qb` | 引用一句关键判断 | g3 节相关 quote | 0-2 |

**Gate 3 渲染下限**：Three Links 3 张 + Five Layers 5 行 = 2 个核心模块 + 至少 1 个辅助模块（grid / pyramid / kpi 任选）。

---

## Gate 4 · 壁垒锁定 模块（color g4 紫）

| 模块 | CSS 类 | 何时用 | 字段 | 最少 |
|---|---|---|---|---|
| Four Dim Cards | `.four-dim` + `.dim-card` × 4 | 虚实入出四维度 | `g4.four_dim_score` | 1 |
| Direction Table | `.dirtable` | 主攻方向变化（如有 V7 → V8） | `g4.main_focus` | 0-1 |
| Accordion 16 Items | `.acc-item` × 16+ | 16+1 控制点 | `g4.sixteen_controls` | 1（16 个） |
| Accordion Highlight | `.acc-item.highlight` | 最强单点 | `g4.strongest_single_lock` | 0-1 |
| Score Card | `.scorecard` + 雷达 SVG + bars | 总记分卡 | `g4.total_score` | 0-1 |
| Quote Box | `.qb` | 引用一句关键判断 | g4 节相关 quote | 0-1 |

**Gate 4 渲染下限**：四维度卡 + 16 accordion 全列 + 总记分卡 = 3 个核心模块。

---

## Closing · 远方

| 模块 | CSS 类 | 何时用 | 字段 | 最少 |
|---|---|---|---|---|
| Closing Pair | `.closing-pair` + `.closing-side` × 2 | 攻 / 守 双卡 | `closing.attack_side`, `closing.defend_side` | 1 |
| Vision Paint | `.vision-paint` | 千里江山图 | `closing.vision_paint` + `closing.next_anchor` | 1 |
| Closing Final | `.closing-final` | 终笔一句 | `closing.final_line` | 1 |

**Closing 渲染下限**：3 个全装。

---

## Animation 类（全局）

| 类 | 用法 |
|---|---|
| `.r` | 装到任何要 reveal 动画的元素上 |
| `.d1` / `.d2` / `.d3` | reveal 延迟 0.1s / 0.2s / 0.3s |

LLM 渲染时**所有内容块都自动加 `.r`**（JS 里有 IntersectionObserver 处理）。

---

## 黑名单 · 禁止行为

| 不许做 | 为什么 |
|---|---|
| 改 `:root{...}` CSS 变量 | 品牌色锁死 |
| 改字体声明（Manrope / Noto Serif SC / Inter / JetBrains Mono） | 品牌字体锁死 |
| 新增 V8 没有的 CSS 类 | 模板库封闭 |
| 用 `<style>` inline 覆盖颜色 | 同上 |
| 引入外部 JS / CSS（除 Google Fonts） | 单文件原则 |
| 在 GATE 之间切换色系（如 g1 用绿色） | 色系绑定四周期不可动 |
| 留空模块占位（"待补充"/"TBD"） | 缺信息就砍模块 |
| 编纯虚构内容（无逐字稿证据） | 失真红线 |

---

## 模块选择决策树

```
拿到 extract JSON：
├─ Prologue 节
│  ├─ borrowing_momentum + combining_forces 都有 → 2 张 .intro-card
│  └─ 任一缺 → 警告+留空，要求二次访谈
│
├─ Gate 1 觉醒
│  ├─ founding_motif 必有 → 中央母题块
│  ├─ dual_personality 有 → .card.g1 双人格
│  ├─ asymmetric_advantage 有 → .card.g1 5 维度列表
│  ├─ non_rational_obsession 有 → .card.g1 6 信号列表
│  ├─ shadow_to_superpower 有 → .card.g1 阴影翻转
│  ├─ founder_arc 有 → .card.g1 故事弧
│  ├─ ab_frame 有 → .ab-frame + .ab-underline
│  └─ signature_case 有 → .case-box
│
├─ Gate 2 品类
│  ├─ twelve_word_mantra 默认装 → .four-word
│  ├─ sweet_user_profile 有 → .profile
│  ├─ value_pyramid 有 → .pyramid 5-6 层
│  ├─ killer_one_liner 必有 → .one-liner
│  ├─ fourth_species 有 → .species
│  ├─ validation_matrix 有 → .vmx
│  └─ category_extension 有 → .cmx
│
├─ Gate 3 模式
│  ├─ front+back+finance_chain 三者并 → .three-links 3 张
│  ├─ three_links_grid 有 → .ninegrid
│  ├─ income_pyramid 有 → .pyramid-income
│  ├─ five_layers_alloc 必有 → .layers-list 5 行
│  ├─ funnel_three_layer 有 → .funnel-3
│  ├─ bayes_status 有 → .bayes
│  ├─ kpi_panel 有 → .kpi
│  └─ anchor_current_year 有 → .anchor-2026
│
├─ Gate 4 壁垒
│  ├─ four_dim_score 必有 → .four-dim
│  ├─ main_focus 有 → .dirtable
│  ├─ sixteen_controls 必有（即使部分 score 用占位）→ 16 个 .acc-item
│  ├─ strongest_single_lock 有 → 对应 .acc-item 加 .highlight
│  └─ total_score 有 → .scorecard 含雷达 SVG
│
└─ Closing 远方
   ├─ attack_side + defend_side → .closing-pair
   ├─ vision_paint + next_anchor → .vision-paint
   └─ final_line → .closing-final
```
