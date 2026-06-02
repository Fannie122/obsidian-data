const panelButtons = document.querySelectorAll(".segment");
const panels = document.querySelectorAll(".panel");

panelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.panel;
    panelButtons.forEach((item) => item.classList.toggle("active", item === button));
    panels.forEach((panel) => panel.classList.toggle("active", panel.id === target));
  });
});

const audienceCopy = {
  owner: "看到的是投入价值：风险被提前看见、资源被提前部署、事件来时直接激活已有能力。",
  builder: "看到的是建设路径：L1 本体、L2 监测、L3 研判、L4 预防、L5 响应逐层落地。",
  reviewer: "看到的是评审依据：平台是否形成闭环、AI 是否可解释、能力是否能回写沉淀。"
};

document.querySelectorAll(".audience").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".audience").forEach((item) => item.classList.toggle("active", item === button));
    document.getElementById("audienceCopy").textContent = audienceCopy[button.dataset.audience];
  });
});

const layerData = {
  l1: {
    title: "L1 风险本体",
    body: "L1 是平台的语义底座。风险源、承灾体、应对力量、决策主体、信息载体被统一建模，后续监测、研判、预防和响应才不是孤立功能。",
    input: "业务对象、空间网格、时间窗口、历史案例",
    output: "风险目录、关系图谱、动作规则、回写接口",
    quote: "先把风险世界建成可推理的城市底座。"
  },
  l2: {
    title: "L2 风险监测",
    body: "L2 的核心不是接入更多传感器，而是让多源数据都能落到本体对象上，形成可聚合、可去重、可触发研判的风险信号。",
    input: "物联感知、部门数据、社会数据、外部专业数据",
    output: "告警事件、质量评分、对象映射、阈值触发",
    quote: "让风险变得可感，而不是让数据堆得更多。"
  },
  l3: {
    title: "L3 风险研判",
    body: "L3 是平台智能心脏。级联推演回答“接下来会连锁发生什么”，决策可解释回答“为什么给出这个建议”。",
    input: "本体关系、监测信号、历史案例、规则阈值",
    output: "态势分析、趋势研判、相似案例、方案推荐",
    quote: "AI 不只给答案，还要给可追溯的解释链。"
  },
  l4: {
    title: "L4 风险预防",
    body: "L4 把 L3 研判变成行动：检查、前置、加强、重大活动保障。它决定事件来时是从零组织，还是激活已有部署。",
    input: "研判结果、风险等级、资源库存、预案模板",
    output: "主动部署、任务派发、资源前置、预防闭环",
    quote: "真正的价值在事件发生前已经开始产生。"
  },
  l5: {
    title: "L5 事件响应",
    body: "L5 是能量出口。它不是孤立的指挥大屏，而是激活 L1-L4 已有部署，并在处置后把实际偏差回写到本体。",
    input: "突发事件、既有部署、指挥资源、现场反馈",
    output: "处置闭环、复盘报告、本体版本更新",
    quote: "事件即激活，复盘即进化。"
  }
};

const detail = document.getElementById("layerDetail");

document.querySelectorAll(".layer-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".layer-card").forEach((item) => item.classList.toggle("active", item === button));
    const data = layerData[button.dataset.layer];
    detail.innerHTML = `
      <p class="detail-kicker">当前层级</p>
      <h3>${data.title}</h3>
      <p>${data.body}</p>
      <dl>
        <div>
          <dt>核心输入</dt>
          <dd>${data.input}</dd>
        </div>
        <div>
          <dt>关键输出</dt>
          <dd>${data.output}</dd>
        </div>
        <div>
          <dt>客户可听懂的话</dt>
          <dd>${data.quote}</dd>
        </div>
      </dl>
    `;
  });
});

const cycleData = {
  normal: {
    className: "focus-normal",
    label: "事前持续运转",
    title: "识别、监测预警、预警研判、预案",
    body: "常态环把风险维持在“被看见、被监测、被研判、被预防”的状态，平台价值沉淀在 L1-L4。"
  },
  emergency: {
    className: "focus-emergency",
    label: "事后快速激活",
    title: "突发事件、研判、处置、复盘",
    body: "应急环不是从零开始组织响应，而是调用常态环已经部署好的监测、预案、资源和研判能力。"
  },
  risk: {
    className: "focus-risk",
    label: "双环关联枢纽",
    title: "风险点 = 最小风险单元",
    body: "风险点是本体原子层，也是双环切换的锚点。颗粒度越细，城市治理就越深入。"
  },
  mobius: {
    className: "focus-mobius",
    label: "持续学习闭环",
    title: "常态即准备，应急即校正",
    body: "复盘结果穿越风险点回写 L1 本体，让平台从一次次实战里沉淀为可传承、可平移的资产。"
  }
};

const cycleViz = document.getElementById("cycleViz");
const cycleCopy = document.getElementById("cycleCopy");

document.querySelectorAll(".cycle-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".cycle-tab").forEach((item) => item.classList.toggle("active", item === button));
    const data = cycleData[button.dataset.cycle];
    cycleViz.className = `cycle-viz ${data.className}`;
    cycleCopy.innerHTML = `
      <span>${data.label}</span>
      <h3>${data.title}</h3>
      <p>${data.body}</p>
    `;
  });
});

const metricInputs = document.querySelectorAll("input[type='range'][data-metric]");
const scoreEl = document.getElementById("resilienceScore");
const statusEl = document.getElementById("resilienceStatus");

function updateResilience() {
  const values = Object.fromEntries(
    [...metricInputs].map((input) => {
      document.getElementById(`${input.dataset.metric}Value`).textContent = input.value;
      return [input.dataset.metric, Number(input.value)];
    })
  );
  const weighted = Math.round(values.resist * 0.38 + values.recover * 0.31 + values.elastic * 0.31);
  scoreEl.textContent = weighted;
  if (weighted >= 85) {
    statusEl.textContent = "强韧：资源厚度充足，跨类调度顺畅。";
    scoreEl.style.color = "var(--green)";
  } else if (weighted >= 70) {
    statusEl.textContent = "稳健：具备基础韧性，关键场景仍需加强前置部署。";
    scoreEl.style.color = "var(--blue)";
  } else if (weighted >= 55) {
    statusEl.textContent = "承压：冲击后恢复时间偏长，需要提升资源漂移效率。";
    scoreEl.style.color = "var(--amber)";
  } else {
    statusEl.textContent = "薄弱：球面厚度不足，跨部门资源弹性需要优先补齐。";
    scoreEl.style.color = "var(--coral)";
  }
}

metricInputs.forEach((input) => input.addEventListener("input", updateResilience));
updateResilience();

const iconLabels = {
  ontology: "本",
  monitoring: "感",
  judgement: "研",
  prevention: "防",
  response: "激",
  replication: "平"
};

const statusLabels = {
  live: "运行",
  building: "构建",
  planning: "规划",
  idle: "待启",
  "in-progress": "推进",
  blocked: "阻塞",
  done: "完成"
};

function statusClass(status) {
  return `status-${status}`.replace("_", "-");
}

function renderOpcDashboard(data) {
  const average = Math.round(
    data.theme_layer.reduce((sum, theme) => sum + theme.score, 0) / data.theme_layer.length
  );
  const blocked = data.task_layer.status_distribution.blocked || 0;
  const health = Math.max(0, average - blocked * 3);
  document.getElementById("opcHealth").textContent = health;

  document.getElementById("opcThemeGrid").innerHTML = data.theme_layer
    .map(
      (theme) => `
        <section class="opc-theme" data-tag="${theme.theme_tag}">
          <div class="opc-theme-top">
            <span class="opc-theme-icon">${iconLabels[theme.icon] || "项"}</span>
            <span class="status-pill ${statusClass(theme.status)}">${statusLabels[theme.status] || theme.status}</span>
          </div>
          <h3>${theme.name}</h3>
          <p>${theme.contract}</p>
          <div class="score-line" aria-label="${theme.name}成熟度 ${theme.score}">
            <span style="width:${theme.score}%"></span>
          </div>
        </section>
      `
    )
    .join("");

  const statLabel = {
    planning: "规划",
    in_progress: "推进",
    blocked: "阻塞",
    done: "完成"
  };
  document.getElementById("taskDistribution").innerHTML = Object.entries(data.task_layer.status_distribution)
    .map(
      ([key, value]) => `
        <div class="task-stat">
          <strong>${value}</strong>
          <span>${statLabel[key] || key}</span>
        </div>
      `
    )
    .join("");

  document.getElementById("opcTaskList").innerHTML = data.task_layer.active_pipeline
    .map(
      (task) => `
        <section class="opc-task">
          <div class="opc-task-top">
            <small>${task.theme}</small>
            <span class="priority-pill">${task.priority}</span>
          </div>
          <h3>${task.title}</h3>
          <p><strong>前置契约：</strong>${task.pre_task}</p>
          <p><strong>产物：</strong>${task.artifact}</p>
        </section>
      `
    )
    .join("");

  document.getElementById("brainList").innerHTML = data.brain_layer
    .map(
      (brain) => `
        <section class="brain-item">
          <div class="brain-top">
            <h3>${brain.name}</h3>
            <span>${brain.load}%</span>
          </div>
          <p>${brain.role}</p>
          <p><strong>输出：</strong>${brain.output}</p>
          <div class="brain-meter"><span style="width:${brain.load}%"></span></div>
        </section>
      `
    )
    .join("");

  const maxCost = Math.max(...data.cost_layer.weekly_cost);
  document.getElementById("costChart").innerHTML = data.cost_layer.weekly_cost
    .map((value) => `<span class="cost-bar" title="${value}" style="height:${Math.max(12, (value / maxCost) * 88)}px"></span>`)
    .join("");

  const maxBackflow = Math.max(...data.cost_layer.backflow_7d);
  document.getElementById("backflowChart").innerHTML = data.cost_layer.backflow_7d
    .map((value) => `<span class="backflow-bar" title="${value}" style="height:${Math.max(12, (value / maxBackflow) * 88)}px"></span>`)
    .join("");
  document.getElementById("costRisk").textContent = data.cost_layer.risk;

  const zoomButtons = document.getElementById("zoomButtons");
  const zoomPanel = document.getElementById("zoomPanel");
  function renderZoom(panel) {
    zoomPanel.innerHTML = `
      <h3>${panel.name}</h3>
      <ul>${panel.items.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  }
  zoomButtons.innerHTML = data.zoom_panels
    .map((panel, index) => `<button class="zoom-button ${index === 0 ? "active" : ""}" type="button" data-zoom="${panel.id}">${panel.name}</button>`)
    .join("");
  renderZoom(data.zoom_panels[0]);
  zoomButtons.querySelectorAll(".zoom-button").forEach((button) => {
    button.addEventListener("click", () => {
      zoomButtons.querySelectorAll(".zoom-button").forEach((item) => item.classList.toggle("active", item === button));
      renderZoom(data.zoom_panels.find((panel) => panel.id === button.dataset.zoom));
    });
  });

  document.getElementById("pipelineList").innerHTML = data.pipeline.map((step) => `<li>${step}</li>`).join("");
  document.getElementById("automationNote").innerHTML = `
    <strong>Cron：</strong>${data.automation.cron}<br>
    <strong>Hook：</strong>${data.automation.hooks}<br>
    <strong>护栏：</strong>${data.automation.guardrail}
  `;
  document.getElementById("registryList").innerHTML = data.registry_roadmap.map((item) => `<li>${item}</li>`).join("");
}

async function loadOpcDashboard() {
  try {
    const response = await fetch("data/emergency-opc-latest.json", { cache: "no-store" });
    if (!response.ok) throw new Error("OPC data unavailable");
    renderOpcDashboard(await response.json());
  } catch (error) {
    document.getElementById("opcHealth").textContent = "--";
    document.getElementById("opcThemeGrid").innerHTML = `
      <section class="opc-theme" data-tag="quant">
        <h3>数据未加载</h3>
        <p>请通过本地服务打开驾驶舱：node server.js，然后访问 http://127.0.0.1:8765/。</p>
      </section>
    `;
  }
}

loadOpcDashboard();
