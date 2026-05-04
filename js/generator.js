/**
 * n8n Workflow JSON Template Generator
 * Produces valid n8n workflow JSON that can be imported directly.
 */

function generateN8nTemplate(workflowName, triggerDef, triggerValues, nodeEntries) {
  const nodes = [];
  const connections = {};

  // Position layout constants
  const startX = 250;
  const startY = 300;
  const gapX = 250;

  // Helper to create a unique node name
  function uniqueName(baseName, existingNames) {
    if (!existingNames.has(baseName)) {
      existingNames.add(baseName);
      return baseName;
    }
    let i = 1;
    while (existingNames.has(`${baseName} ${i}`)) i++;
    const name = `${baseName} ${i}`;
    existingNames.add(name);
    return name;
  }

  const usedNames = new Set();

  // Build trigger node
  const triggerName = uniqueName(triggerDef.name, usedNames);
  const triggerNode = {
    parameters: triggerDef.buildParams(triggerValues),
    id: generateUUID(),
    name: triggerName,
    type: triggerDef.n8nType,
    typeVersion: triggerDef.n8nTypeVersion,
    position: [startX, startY]
  };
  nodes.push(triggerNode);

  // Build action nodes
  let prevNodeName = triggerName;
  nodeEntries.forEach((entry, i) => {
    const def = NODE_TYPES.find(n => n.id === entry.typeId);
    if (!def) return;

    const nodeName = uniqueName(def.name, usedNames);
    const node = {
      parameters: def.buildParams(entry.values),
      id: generateUUID(),
      name: nodeName,
      type: def.n8nType,
      typeVersion: def.n8nTypeVersion,
      position: [startX + (i + 1) * gapX, startY]
    };
    nodes.push(node);

    // Connect previous node to this node
    if (!connections[prevNodeName]) {
      connections[prevNodeName] = { main: [[]] };
    }
    connections[prevNodeName].main[0].push({
      node: nodeName,
      type: 'main',
      index: 0
    });

    prevNodeName = nodeName;
  });

  // Assemble workflow
  const workflow = {
    name: workflowName || 'My Workflow',
    nodes: nodes,
    connections: connections,
    active: false,
    settings: {
      executionOrder: 'v1'
    },
    versionId: generateUUID(),
    meta: {
      templateCredsSetupCompleted: true,
      instanceId: generateUUID()
    },
    tags: []
  };

  return workflow;
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
