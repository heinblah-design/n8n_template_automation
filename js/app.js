// n8n Template Builder — Main Application
(function () {
  'use strict';

  // ══════════════════════════════════════
  // Shared utilities
  // ══════════════════════════════════════

  function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background =
      type === 'warning' ? 'var(--warning)' :
      type === 'error'   ? 'var(--danger)'  : 'var(--success)';
    toast.classList.remove('hidden');
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast('Copied to clipboard!'),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Copied to clipboard!'); }
    catch { showToast('Copy failed — please copy manually', 'warning'); }
    document.body.removeChild(ta);
  }

  function downloadJSON(json, filename) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!');
  }

  // ══════════════════════════════════════
  // Mode switching (AI / Manual)
  // ══════════════════════════════════════

  const navAI = document.getElementById('nav-ai');
  const navManual = document.getElementById('nav-manual');
  const aiMode = document.getElementById('ai-mode');
  const manualMode = document.getElementById('manual-mode');

  navAI.addEventListener('click', (e) => {
    e.preventDefault();
    aiMode.classList.remove('hidden');
    manualMode.classList.add('hidden');
    navAI.classList.add('nav-active');
    navManual.classList.remove('nav-active');
  });

  navManual.addEventListener('click', (e) => {
    e.preventDefault();
    manualMode.classList.remove('hidden');
    aiMode.classList.add('hidden');
    navManual.classList.add('nav-active');
    navAI.classList.remove('nav-active');
  });

  // ══════════════════════════════════════
  // AI Builder Mode
  // ══════════════════════════════════════

  const apiKeyInput = document.getElementById('api-key');
  const btnToggleKey = document.getElementById('btn-toggle-key');
  const btnSaveKey = document.getElementById('btn-save-key');
  const keyStatus = document.getElementById('key-status');
  const userPrompt = document.getElementById('user-prompt');
  const btnAiGenerate = document.getElementById('btn-ai-generate');
  const resultCard = document.getElementById('result-card');
  const aiSummary = document.getElementById('ai-summary');
  const aiTemplateJson = document.getElementById('ai-template-json');
  const aiVisualFlow = document.getElementById('ai-visual-flow');
  const btnCopyAi = document.getElementById('btn-copy-ai');
  const btnDownloadAi = document.getElementById('btn-download-ai');
  const btnRegenerate = document.getElementById('btn-regenerate');

  let aiGeneratedJSON = null;

  // Load saved API key
  function updateKeyStatus() {
    if (AIEngine.hasApiKey()) {
      keyStatus.textContent = 'Saved';
      keyStatus.className = 'key-status saved';
      apiKeyInput.value = AIEngine.getApiKey();
      btnAiGenerate.disabled = !userPrompt.value.trim();
    } else {
      keyStatus.textContent = 'Not set';
      keyStatus.className = 'key-status missing';
      btnAiGenerate.disabled = true;
    }
  }
  updateKeyStatus();

  btnToggleKey.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    btnToggleKey.textContent = isPassword ? 'Hide' : 'Show';
  });

  btnSaveKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showToast('Please enter an API key', 'warning');
      return;
    }
    AIEngine.saveApiKey(key);
    updateKeyStatus();
    showToast('API key saved to browser');
  });

  userPrompt.addEventListener('input', () => {
    btnAiGenerate.disabled = !userPrompt.value.trim() || !AIEngine.hasApiKey();
  });

  // Example chips
  document.querySelectorAll('.chip[data-prompt]').forEach(chip => {
    chip.addEventListener('click', () => {
      userPrompt.value = chip.dataset.prompt;
      userPrompt.dispatchEvent(new Event('input'));
      userPrompt.focus();
    });
  });

  // Generate with AI
  async function aiGenerate() {
    const prompt = userPrompt.value.trim();
    if (!prompt) return showToast('Please describe what you want to automate', 'warning');
    if (!AIEngine.hasApiKey()) return showToast('Please save your OpenAI API key first', 'warning');

    // Show loading state
    const btnText = btnAiGenerate.querySelector('.btn-text');
    const btnLoading = btnAiGenerate.querySelector('.btn-loading');
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    btnAiGenerate.disabled = true;

    try {
      aiGeneratedJSON = await AIEngine.generate(prompt);
      displayAiResult(aiGeneratedJSON);
      showToast('Workflow generated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
      resultCard.classList.add('hidden');
    } finally {
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
      btnAiGenerate.disabled = false;
    }
  }

  btnAiGenerate.addEventListener('click', aiGenerate);
  btnRegenerate.addEventListener('click', aiGenerate);

  // Display AI result
  function displayAiResult(workflow) {
    resultCard.classList.remove('hidden');

    // Summary
    const nodes = workflow.nodes || [];
    const trigger = nodes.find(n => n.type && (n.type.toLowerCase().includes('trigger') || n.type.includes('webhook') || n.type.includes('cron')));
    let summaryHTML = `<h3>${escapeHTML(workflow.name)}</h3>`;
    summaryHTML += `<p style="color:var(--text-muted);margin-bottom:12px">${nodes.length} nodes in this workflow</p>`;
    summaryHTML += '<ul class="node-list">';
    nodes.forEach(n => {
      const shortType = (n.type || '').replace('n8n-nodes-base.', '').replace('@n8n/n8n-nodes-langchain.', '');
      summaryHTML += `<li><strong>${escapeHTML(n.name)}</strong> <span style="color:var(--text-muted)">(${escapeHTML(shortType)})</span></li>`;
    });
    summaryHTML += '</ul>';
    aiSummary.innerHTML = summaryHTML;

    // Visual flow
    renderAiVisualFlow(nodes);

    // JSON preview
    aiTemplateJson.textContent = JSON.stringify(workflow, null, 2);

    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderAiVisualFlow(nodes) {
    if (!nodes.length) {
      aiVisualFlow.innerHTML = '<p class="helper-text">No nodes in workflow</p>';
      return;
    }
    let html = '';
    nodes.forEach((node, i) => {
      if (i > 0) html += '<div class="flow-arrow"></div>';
      const isTrigger = node.type && (node.type.toLowerCase().includes('trigger') || node.type.includes('webhook') || node.type.includes('cron'));
      const cls = isTrigger ? 'trigger' : 'action';
      const shortType = (node.type || '').replace('n8n-nodes-base.', '').replace('@n8n/n8n-nodes-langchain.', '');
      html += `<div class="flow-node">
        <div class="flow-node-box ${cls}">${escapeHTML(node.name)}</div>
        <span class="flow-node-type">${escapeHTML(shortType)}</span>
      </div>`;
    });
    aiVisualFlow.innerHTML = html;
  }

  // Copy / Download AI result
  btnCopyAi.addEventListener('click', () => {
    if (!aiGeneratedJSON) return;
    copyToClipboard(JSON.stringify(aiGeneratedJSON, null, 2));
  });

  btnDownloadAi.addEventListener('click', () => {
    if (!aiGeneratedJSON) return;
    const name = (aiGeneratedJSON.name || 'workflow').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadJSON(JSON.stringify(aiGeneratedJSON, null, 2), `${name}.json`);
  });

  // ══════════════════════════════════════
  // Manual Builder Mode (existing functionality)
  // ══════════════════════════════════════

  let selectedTrigger = null;
  let triggerValues = {};
  let actionNodes = [];
  let generatedJSON = null;

  // Render triggers
  const triggerGrid = document.getElementById('trigger-grid');
  const triggerConfig = document.getElementById('trigger-config');
  if (typeof TRIGGERS !== 'undefined') {
    TRIGGERS.forEach(t => {
      const card = document.createElement('div');
      card.className = 'trigger-card';
      card.dataset.id = t.id;
      card.innerHTML = `<div class="trigger-icon">${t.icon}</div>
        <div class="trigger-name">${escapeHTML(t.name)}</div>
        <div class="trigger-desc">${escapeHTML(t.desc)}</div>`;
      card.addEventListener('click', () => selectTrigger(t));
      triggerGrid.appendChild(card);
    });
  }

  function selectTrigger(t) {
    selectedTrigger = t;
    triggerValues = {};
    triggerGrid.querySelectorAll('.trigger-card').forEach(c => c.classList.remove('selected'));
    triggerGrid.querySelector(`[data-id="${t.id}"]`).classList.add('selected');

    if (t.fields && t.fields.length) {
      triggerConfig.innerHTML = `<h4>${escapeHTML(t.name)} Configuration</h4>` + renderFields(t.fields, 'trigger', triggerValues);
      triggerConfig.classList.remove('hidden');
      bindFieldInputs(triggerConfig, 'trigger', triggerValues);
    } else {
      triggerConfig.innerHTML = '';
      triggerConfig.classList.add('hidden');
    }
    updateVisualFlow();
  }

  // Render node type selector
  const nodeTypeSelect = document.getElementById('node-type-select');
  if (typeof NODE_TYPES !== 'undefined') {
    NODE_TYPES.forEach(nt => {
      const opt = document.createElement('option');
      opt.value = nt.id;
      opt.textContent = `${nt.icon} ${nt.name}`;
      nodeTypeSelect.appendChild(opt);
    });
  }

  // Add node
  document.getElementById('btn-add-node').addEventListener('click', () => {
    const id = nodeTypeSelect.value;
    if (!id) return showToast('Please select a node type', 'warning');
    const def = NODE_TYPES.find(n => n.id === id);
    if (!def) return;
    actionNodes.push({ id: Date.now(), def, values: {} });
    renderNodes();
    updateVisualFlow();
    nodeTypeSelect.value = '';
  });

  function renderNodes() {
    const list = document.getElementById('nodes-list');
    list.innerHTML = '';
    actionNodes.forEach((entry, idx) => {
      const div = document.createElement('div');
      div.className = 'node-item';
      div.innerHTML = `
        <div class="node-item-header" data-idx="${idx}">
          <div class="node-label">
            <span class="node-icon">${entry.def.icon}</span>
            <span>${escapeHTML(entry.def.name)}</span>
            <span class="node-order">#${idx + 1}</span>
          </div>
          <div class="node-actions">
            ${idx > 0 ? `<button class="btn btn-sm btn-secondary" data-move="up" data-idx="${idx}" title="Move up">↑</button>` : ''}
            ${idx < actionNodes.length - 1 ? `<button class="btn btn-sm btn-secondary" data-move="down" data-idx="${idx}" title="Move down">↓</button>` : ''}
            <button class="btn btn-sm btn-danger" data-remove="${idx}" title="Remove">×</button>
          </div>
        </div>
        <div class="node-item-body" id="node-body-${entry.id}">
          ${entry.def.fields.length ? renderFields(entry.def.fields, `node-${entry.id}`, entry.values) : '<p class="helper-text">No configuration needed</p>'}
        </div>`;
      list.appendChild(div);
    });

    // Bind events
    list.querySelectorAll('[data-move]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const i = +btn.dataset.idx;
        const dir = btn.dataset.move === 'up' ? -1 : 1;
        [actionNodes[i], actionNodes[i + dir]] = [actionNodes[i + dir], actionNodes[i]];
        renderNodes();
        updateVisualFlow();
      });
    });
    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        actionNodes.splice(+btn.dataset.remove, 1);
        renderNodes();
        updateVisualFlow();
      });
    });
    list.querySelectorAll('.node-item-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const body = hdr.nextElementSibling;
        body.style.display = body.style.display === 'none' ? '' : 'none';
      });
    });

    actionNodes.forEach(entry => {
      const body = document.getElementById(`node-body-${entry.id}`);
      if (body) bindFieldInputs(body, `node-${entry.id}`, entry.values);
    });
  }

  function renderFields(fields, prefix, values) {
    return fields.map(f => {
      const id = `${prefix}-${f.key}`;
      const rawVal = values[f.key] !== undefined ? values[f.key] : (f.default !== undefined ? f.default : '');
      const val = escapeHTML(rawVal);
      let input;

      if (f.type === 'select') {
        input = `<select id="${id}" data-key="${f.key}">
          ${f.options.map(o => `<option value="${escapeHTML(o)}" ${o === rawVal ? 'selected' : ''}>${escapeHTML(o)}</option>`).join('')}
        </select>`;
      } else if (f.type === 'textarea') {
        input = `<textarea id="${id}" data-key="${f.key}" rows="3" placeholder="${escapeHTML(f.placeholder || '')}">${val}</textarea>`;
      } else if (f.type === 'number') {
        input = `<input type="number" id="${id}" data-key="${f.key}" value="${val}" placeholder="${escapeHTML(f.placeholder || '')}">`;
      } else {
        input = `<input type="text" id="${id}" data-key="${f.key}" value="${val}" placeholder="${escapeHTML(f.placeholder || '')}">`;
      }

      return `<div class="form-group">
        <label for="${id}">${escapeHTML(f.label)}</label>
        ${input}
      </div>`;
    }).join('');
  }

  function bindFieldInputs(container, prefix, values) {
    container.querySelectorAll('input, select, textarea').forEach(el => {
      const key = el.dataset.key;
      if (!key) return;
      if (values[key] === undefined) {
        values[key] = el.value;
      }
      el.addEventListener('input', () => { values[key] = el.value; });
      el.addEventListener('change', () => { values[key] = el.value; });
    });
  }

  // Generate template (manual mode)
  function generateTemplate() {
    if (!selectedTrigger) {
      return showToast('Please select a trigger first!', 'warning');
    }

    const workflowName = document.getElementById('workflow-name').value || 'My Workflow';
    generatedJSON = generateN8nTemplate(workflowName, selectedTrigger, triggerValues, actionNodes);

    const jsonStr = JSON.stringify(generatedJSON, null, 2);
    document.getElementById('template-json').textContent = jsonStr;
    document.getElementById('template-preview').classList.remove('hidden');
    document.getElementById('btn-copy').classList.remove('hidden');
    document.getElementById('btn-download').classList.remove('hidden');

    showToast('Template generated!');
  }

  document.getElementById('btn-generate').addEventListener('click', generateTemplate);

  document.getElementById('btn-copy').addEventListener('click', () => {
    if (!generatedJSON) return;
    copyToClipboard(JSON.stringify(generatedJSON, null, 2));
  });

  document.getElementById('btn-download').addEventListener('click', () => {
    if (!generatedJSON) return;
    const name = (generatedJSON.name || 'workflow').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadJSON(JSON.stringify(generatedJSON, null, 2), `${name}.json`);
  });

  // Visual flow (manual mode)
  function updateVisualFlow() {
    const container = document.getElementById('visual-flow');
    const placeholder = document.getElementById('flow-placeholder');
    if (!selectedTrigger) {
      container.innerHTML = '';
      container.appendChild(placeholder);
      placeholder.classList.remove('hidden');
      return;
    }

    let html = `<div class="flow-node">
      <div class="flow-node-box trigger">${escapeHTML(selectedTrigger.name)}</div>
      <span class="flow-node-type">${escapeHTML(selectedTrigger.n8nType.replace('n8n-nodes-base.', ''))}</span>
    </div>`;

    actionNodes.forEach(entry => {
      html += `<div class="flow-arrow"></div>
        <div class="flow-node">
          <div class="flow-node-box action">${escapeHTML(entry.def.name)}</div>
          <span class="flow-node-type">${escapeHTML(entry.def.n8nType.replace('n8n-nodes-base.', ''))}</span>
        </div>`;
    });

    container.innerHTML = html;
  }

})();
