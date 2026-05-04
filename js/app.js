/**
 * n8n Template Builder - Main Application
 */

(function() {
  'use strict';

  // ── State ──
  let selectedTrigger = null;
  let triggerValues = {};
  let actionNodes = [];      // [{ id, typeId, values: {} }]
  let generatedJSON = null;
  let nodeIdCounter = 0;

  // ── DOM Refs ──
  const triggerGrid = document.getElementById('trigger-grid');
  const triggerConfig = document.getElementById('trigger-config');
  const nodesList = document.getElementById('nodes-list');
  const nodeTypeSelect = document.getElementById('node-type-select');
  const btnAddNode = document.getElementById('btn-add-node');
  const btnGenerate = document.getElementById('btn-generate');
  const btnCopy = document.getElementById('btn-copy');
  const btnDownload = document.getElementById('btn-download');
  const templatePreview = document.getElementById('template-preview');
  const templateJSON = document.getElementById('template-json');
  const visualFlow = document.getElementById('visual-flow');
  const flowPlaceholder = document.getElementById('flow-placeholder');

  // ── Initialize ──
  function init() {
    renderTriggers();
    populateNodeSelect();
    bindEvents();
  }

  // ── Render trigger options ──
  function renderTriggers() {
    triggerGrid.innerHTML = TRIGGERS.map(t => `
      <div class="trigger-card" data-trigger="${t.id}">
        <div class="trigger-icon">${t.icon}</div>
        <div class="trigger-name">${t.name}</div>
        <div class="trigger-desc">${t.desc}</div>
      </div>
    `).join('');
  }

  // ── Populate node type dropdown ──
  function populateNodeSelect() {
    const categories = {};
    NODE_TYPES.forEach(n => {
      if (!categories[n.category]) categories[n.category] = [];
      categories[n.category].push(n);
    });

    let html = '<option value="">-- Select a node --</option>';
    Object.entries(categories).forEach(([cat, nodes]) => {
      html += `<optgroup label="${cat}">`;
      nodes.forEach(n => {
        html += `<option value="${n.id}">${n.icon} ${n.name}</option>`;
      });
      html += '</optgroup>';
    });
    nodeTypeSelect.innerHTML = html;
  }

  // ── Bind events ──
  function bindEvents() {
    // Trigger selection
    triggerGrid.addEventListener('click', e => {
      const card = e.target.closest('.trigger-card');
      if (!card) return;
      selectTrigger(card.dataset.trigger);
    });

    // Add node
    btnAddNode.addEventListener('click', () => {
      const typeId = nodeTypeSelect.value;
      if (!typeId) return showToast('Please select a node type', 'warning');
      addNode(typeId);
      nodeTypeSelect.value = '';
    });

    // Generate
    btnGenerate.addEventListener('click', generateTemplate);

    // Copy
    btnCopy.addEventListener('click', () => {
      if (!generatedJSON) return;
      navigator.clipboard.writeText(JSON.stringify(generatedJSON, null, 2))
        .then(() => showToast('Copied to clipboard!'))
        .catch(() => {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = JSON.stringify(generatedJSON, null, 2);
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Copied to clipboard!');
        });
    });

    // Download
    btnDownload.addEventListener('click', () => {
      if (!generatedJSON) return;
      const name = (document.getElementById('workflow-name').value || 'workflow').replace(/\s+/g, '_');
      const blob = new Blob([JSON.stringify(generatedJSON, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Template downloaded!');
    });
  }

  // ── Select trigger ──
  function selectTrigger(triggerId) {
    selectedTrigger = TRIGGERS.find(t => t.id === triggerId);
    if (!selectedTrigger) return;

    // Highlight card
    document.querySelectorAll('.trigger-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.trigger-card[data-trigger="${triggerId}"]`).classList.add('selected');

    // Reset trigger values
    triggerValues = {};

    // Render config fields
    if (selectedTrigger.fields.length === 0) {
      triggerConfig.classList.add('hidden');
    } else {
      triggerConfig.classList.remove('hidden');
      triggerConfig.innerHTML = `<h4>${selectedTrigger.icon} ${selectedTrigger.name} Configuration</h4>` +
        renderFields(selectedTrigger.fields, 'trigger', triggerValues);
      bindFieldInputs(triggerConfig, 'trigger', triggerValues);
    }

    updateVisualFlow();
  }

  // ── Add action node ──
  function addNode(typeId) {
    const id = ++nodeIdCounter;
    const entry = { id, typeId, values: {} };

    // Set defaults
    const def = NODE_TYPES.find(n => n.id === typeId);
    if (def) {
      def.fields.forEach(f => {
        entry.values[f.key] = f.default !== undefined ? String(f.default) : '';
      });
    }

    actionNodes.push(entry);
    renderNodes();
    updateVisualFlow();
  }

  // ── Remove node ──
  function removeNode(id) {
    actionNodes = actionNodes.filter(n => n.id !== id);
    renderNodes();
    updateVisualFlow();
  }

  // ── Move node ──
  function moveNode(id, direction) {
    const idx = actionNodes.findIndex(n => n.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= actionNodes.length) return;
    [actionNodes[idx], actionNodes[newIdx]] = [actionNodes[newIdx], actionNodes[idx]];
    renderNodes();
    updateVisualFlow();
  }

  // ── Render all nodes ──
  function renderNodes() {
    if (actionNodes.length === 0) {
      nodesList.innerHTML = '<p class="helper-text">No nodes added yet. Add nodes above to build your workflow.</p>';
      return;
    }

    nodesList.innerHTML = actionNodes.map((entry, i) => {
      const def = NODE_TYPES.find(n => n.id === entry.typeId);
      if (!def) return '';
      return `
        <div class="node-item" data-node-id="${entry.id}">
          <div class="node-item-header" onclick="toggleNodeBody(${entry.id})">
            <div class="node-label">
              <span class="node-order">${i + 1}</span>
              <span class="node-icon">${def.icon}</span>
              <span>${def.name}</span>
            </div>
            <div class="node-actions">
              <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); moveNodeUp(${entry.id})" title="Move Up">&uarr;</button>
              <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); moveNodeDown(${entry.id})" title="Move Down">&darr;</button>
              <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); removeNodeById(${entry.id})" title="Remove">&times;</button>
            </div>
          </div>
          <div class="node-item-body" id="node-body-${entry.id}" style="display:none;">
            ${renderFields(def.fields, `node-${entry.id}`, entry.values)}
          </div>
        </div>
      `;
    }).join('');

    // Bind inputs
    actionNodes.forEach(entry => {
      const body = document.getElementById(`node-body-${entry.id}`);
      if (body) bindFieldInputs(body, `node-${entry.id}`, entry.values);
    });
  }

  // ── Render config fields HTML ──
  function renderFields(fields, prefix, values) {
    return fields.map(f => {
      const id = `${prefix}-${f.key}`;
      const val = values[f.key] !== undefined ? values[f.key] : (f.default !== undefined ? f.default : '');
      let input;

      if (f.type === 'select') {
        input = `<select id="${id}" data-key="${f.key}">
          ${f.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}
        </select>`;
      } else if (f.type === 'textarea') {
        input = `<textarea id="${id}" data-key="${f.key}" rows="3" placeholder="${f.placeholder || ''}">${val}</textarea>`;
      } else if (f.type === 'number') {
        input = `<input type="number" id="${id}" data-key="${f.key}" value="${val}" placeholder="${f.placeholder || ''}">`;
      } else {
        input = `<input type="text" id="${id}" data-key="${f.key}" value="${val}" placeholder="${f.placeholder || ''}">`;
      }

      return `<div class="form-group">
        <label for="${id}">${f.label}</label>
        ${input}
      </div>`;
    }).join('');
  }

  // ── Bind field inputs to values ──
  function bindFieldInputs(container, prefix, values) {
    container.querySelectorAll('input, select, textarea').forEach(el => {
      const key = el.dataset.key;
      if (!key) return;
      // Initialize value
      if (values[key] === undefined) {
        values[key] = el.value;
      }
      el.addEventListener('input', () => { values[key] = el.value; });
      el.addEventListener('change', () => { values[key] = el.value; });
    });
  }

  // ── Generate template ──
  function generateTemplate() {
    if (!selectedTrigger) {
      return showToast('Please select a trigger first!', 'warning');
    }

    const workflowName = document.getElementById('workflow-name').value || 'My Workflow';
    generatedJSON = generateN8nTemplate(workflowName, selectedTrigger, triggerValues, actionNodes);

    // Show preview
    templateJSON.textContent = JSON.stringify(generatedJSON, null, 2);
    templatePreview.classList.remove('hidden');
    btnCopy.classList.remove('hidden');
    btnDownload.classList.remove('hidden');

    // Smooth scroll to preview
    templatePreview.scrollIntoView({ behavior: 'smooth', block: 'start' });

    showToast('Template generated successfully!');
  }

  // ── Update visual flow ──
  function updateVisualFlow() {
    if (!selectedTrigger) {
      visualFlow.innerHTML = '<p class="helper-text" id="flow-placeholder">Select a trigger to see the workflow preview.</p>';
      return;
    }

    let html = '';

    // Trigger node
    html += `<div class="flow-node">
      <div class="flow-node-box trigger">${selectedTrigger.icon} ${selectedTrigger.name}</div>
      <div class="flow-node-type">Trigger</div>
    </div>`;

    // Action nodes
    actionNodes.forEach(entry => {
      const def = NODE_TYPES.find(n => n.id === entry.typeId);
      if (!def) return;
      html += `<div class="flow-arrow"></div>`;
      html += `<div class="flow-node">
        <div class="flow-node-box action">${def.icon} ${def.name}</div>
        <div class="flow-node-type">${def.category}</div>
      </div>`;
    });

    visualFlow.innerHTML = html;
  }

  // ── Toast notification ──
  function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'warning' ? 'var(--warning)' : 'var(--success)';
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
  }

  // ── Global functions for inline event handlers ──
  window.toggleNodeBody = function(id) {
    const body = document.getElementById(`node-body-${id}`);
    if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
  };

  window.removeNodeById = function(id) {
    removeNode(id);
  };

  window.moveNodeUp = function(id) {
    moveNode(id, -1);
  };

  window.moveNodeDown = function(id) {
    moveNode(id, 1);
  };

  // ── Boot ──
  init();
})();
