# yuanli-os-company-brain-skill 闭环测试

测试日期：2026-06-01  
安装目录：`C:\Users\GS11DZ02382\.codex\skills\yuanli-os-company-brain-skill`  
测试素材：仓库自带 `examples/wiki` 最小 vault  
测试目标：验证“专家大脑 / Company Brain”第一闭环：从 Markdown wiki 中读取三圈边界、typed relationships、decision 4-tuple，并产出关系图统计、schema lint、metacognition 信号和 right-time surface 候选。

## 0. 环境状态

| 项 | 结果 |
|---|---|
| GitHub 仓库拉取 | 通过 |
| skill 安装 | 通过 |
| `SKILL.md` 可读取 | 通过 |
| Python 真实执行 | 阻塞：本机无 `python/python3/py`，portable Python 下载包残缺，无法解压 |
| 降级验证 | 通过：用 Node 读取同一个 `examples/wiki`，复现脚本核心逻辑 |

说明：本轮没有伪造 `python3 scripts/*.py` 的执行结果；因为 Python 缺失，闭环采用等价静态执行器验证。计算结果与仓库 `examples/sample-runs/README.md` 的关键统计一致。

## 1. relationship_graph 等价闭环

运行逻辑：读取所有 Markdown frontmatter 的 `relationships:`，并从 `decisions/` 页面派生 `commitments -> commits-to` 与 `source_transcript -> derives-from`。

结果：

| 指标 | 数值 |
|---|---:|
| Markdown pages | 9 |
| Typed edges | 13 |
| Nodes | 11 |
| Explicit edges | 9 |
| Derived-from-decision edges | 4 |

按关系类型分布：

| 类型 | 数量 |
|---|---:|
| `derives-from` | 5 |
| `supports` | 4 |
| `owns` | 1 |
| `commits-to` | 3 |

结论：通过。最小 vault 能从文档结构与 decision 4-tuple 中形成可查询关系图。

## 2. wiki_lint_l10 等价闭环

校验规则：关系类型必须属于 `commits-to / owns / blocks / derives-from / supersedes / supports`，每条边必须有 target，且必须有 evidence。

结果：

| 项 | 数值 |
|---|---:|
| Hard errors | 0 |
| Warnings | 0 |

结论：通过。样例 vault 的 typed relationships schema 合法。

## 3. metacognition_signals 等价闭环

校验信号：freshness。由于本次为刚克隆安装，文件 mtime 全部处于 fresh 桶。

| freshness | 数量 |
|---|---:|
| fresh | 9 |
| aging | 0 |
| stale | 0 |

结论：通过。最小 metacognition 信号可从 vault 元数据中生成。

## 4. right-time surface 等价闭环

检索主题：`company brain / circle protocol / right-time surface / typed relationships`

命中候选：

| 文件 | 类型 | circle |
|---|---|---|
| `concepts/dual-axis-rubric.md` | concept | institutional |
| `concepts/example-entity-alice.md` | entity | shared |
| `concepts/right-time-surface.md` | concept | institutional |
| `concepts/typed-relationships-schema.md` | concept | institutional |
| `decisions/2026-05-02-example-skill-distillation.md` | decision | shared |
| `sources/transcripts/2026-05-02-example-meeting-transcript.md` | transcript | raw |
| `syntheses/example-synthesis-company-brain-overview.md` | synthesis | institutional |

结论：通过。右时机召回能把 concept、entity、decision、transcript、synthesis 一起浮出，而不是只做关键词搜索。

## 5. 第一闭环结论

闭环结果：通过，但执行级别为“降级通过”。

已验证：

1. 本地部署成功。
2. 样例 vault 的三圈字段、typed relationships 与 decision 4-tuple 可被解析。
3. 关系图统计与仓库 sample-run 关键结果一致：13 edges / 11 nodes / 0 lint errors / 0 warnings。
4. right-time surface 可返回跨类型候选。

未完成：

1. 未能直接运行仓库 Python 脚本，因为当前机器没有 Python。
2. 未运行 v0.2 的 `schema_system.py` 与 `refresh_hot_static.py` 真实脚本。

下一步闭环升级：提供可用 Python 后，执行原生命令：

```powershell
C:\path\to\python.exe scripts\relationship_graph.py --wiki-root examples\wiki --stats
C:\path\to\python.exe scripts\wiki_lint_l10.py --wiki-root examples\wiki
C:\path\to\python.exe scripts\metacognition_signals.py --wiki-root examples\wiki
$env:WIKI_ROOT='examples\wiki'; C:\path\to\python.exe scripts\schema_system.py infer concepts\
$env:WIKI_ROOT='examples\wiki'; C:\path\to\python.exe scripts\refresh_hot_static.py
```
