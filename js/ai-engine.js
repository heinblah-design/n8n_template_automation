// AI Engine — calls OpenAI API to generate n8n workflows

const AIEngine = (() => {
  const STORAGE_KEY = 'n8n_openai_key';

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function saveApiKey(key) {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function hasApiKey() {
    return !!getApiKey();
  }

  async function generate(userPrompt) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No API key configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: N8N_KNOWLEDGE.systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error('Invalid API key. Please check your OpenAI key.');
      if (response.status === 429) throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      throw new Error(err.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from AI');

    return parseWorkflowJSON(content);
  }

  function parseWorkflowJSON(raw) {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    let workflow;
    try {
      workflow = JSON.parse(cleaned);
    } catch (e) {
      // Try to find JSON in the response
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        workflow = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    // Validate basic structure
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      throw new Error('Invalid workflow: missing nodes array');
    }
    if (!workflow.connections || typeof workflow.connections !== 'object') {
      workflow.connections = {};
    }

    // Ensure required fields
    workflow.name = workflow.name || 'AI Generated Workflow';
    workflow.active = false;
    workflow.settings = workflow.settings || { executionOrder: 'v1' };
    workflow.tags = workflow.tags || [];
    workflow.meta = workflow.meta || { instanceId: 'template-generator' };

    // Ensure each node has an ID
    workflow.nodes.forEach(node => {
      if (!node.id) node.id = generateUUID();
      if (!node.position) node.position = [250, 300];
      if (!node.parameters) node.parameters = {};
    });

    return workflow;
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  return { getApiKey, saveApiKey, hasApiKey, generate };
})();
