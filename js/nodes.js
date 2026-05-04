/**
 * n8n Node Definitions
 * Each trigger/node defines its n8n type, icon, configurable fields, and defaults.
 */

const TRIGGERS = [
  {
    id: 'webhook',
    name: 'Webhook',
    icon: '🌐',
    desc: 'Triggered by HTTP request',
    n8nType: 'n8n-nodes-base.webhook',
    n8nTypeVersion: 1.1,
    fields: [
      { key: 'httpMethod', label: 'HTTP Method', type: 'select', options: ['GET','POST','PUT','PATCH','DELETE'], default: 'POST' },
      { key: 'path', label: 'Webhook Path', type: 'text', default: 'my-webhook', placeholder: 'e.g. my-webhook' },
      { key: 'responseMode', label: 'Response Mode', type: 'select', options: ['onReceived','lastNode'], default: 'onReceived' }
    ],
    buildParams(values) {
      return {
        httpMethod: values.httpMethod || 'POST',
        path: values.path || 'my-webhook',
        responseMode: values.responseMode || 'onReceived',
        options: {}
      };
    }
  },
  {
    id: 'schedule',
    name: 'Schedule',
    icon: '⏰',
    desc: 'Run on a cron schedule',
    n8nType: 'n8n-nodes-base.scheduleTrigger',
    n8nTypeVersion: 1.2,
    fields: [
      { key: 'rule_interval', label: 'Interval (minutes)', type: 'number', default: 60, placeholder: '60' }
    ],
    buildParams(values) {
      const interval = parseInt(values.rule_interval) || 60;
      return {
        rule: {
          interval: [{ field: 'minutes', minutesInterval: interval }]
        }
      };
    }
  },
  {
    id: 'manual',
    name: 'Manual',
    icon: '👆',
    desc: 'Triggered manually',
    n8nType: 'n8n-nodes-base.manualTrigger',
    n8nTypeVersion: 1,
    fields: [],
    buildParams() { return {}; }
  },
  {
    id: 'email_trigger',
    name: 'Email (IMAP)',
    icon: '📧',
    desc: 'Triggered by new email',
    n8nType: 'n8n-nodes-base.emailReadImap',
    n8nTypeVersion: 2,
    fields: [
      { key: 'mailbox', label: 'Mailbox', type: 'text', default: 'INBOX', placeholder: 'INBOX' }
    ],
    buildParams(values) {
      return {
        mailbox: values.mailbox || 'INBOX',
        options: {}
      };
    }
  }
];

const NODE_TYPES = [
  {
    id: 'http_request',
    name: 'HTTP Request',
    icon: '🔗',
    category: 'Core',
    n8nType: 'n8n-nodes-base.httpRequest',
    n8nTypeVersion: 4.2,
    fields: [
      { key: 'method', label: 'Method', type: 'select', options: ['GET','POST','PUT','PATCH','DELETE'], default: 'GET' },
      { key: 'url', label: 'URL', type: 'text', default: 'https://api.example.com/data', placeholder: 'https://api.example.com/data' },
      { key: 'authentication', label: 'Authentication', type: 'select', options: ['none','genericCredentialType','predefinedCredentialType'], default: 'none' }
    ],
    buildParams(values) {
      return {
        method: values.method || 'GET',
        url: values.url || 'https://api.example.com/data',
        authentication: values.authentication || 'none',
        options: {}
      };
    }
  },
  {
    id: 'send_email',
    name: 'Send Email',
    icon: '📤',
    category: 'Communication',
    n8nType: 'n8n-nodes-base.emailSend',
    n8nTypeVersion: 2.1,
    fields: [
      { key: 'fromEmail', label: 'From Email', type: 'text', default: '', placeholder: 'sender@example.com' },
      { key: 'toEmail', label: 'To Email', type: 'text', default: '', placeholder: 'recipient@example.com' },
      { key: 'subject', label: 'Subject', type: 'text', default: '', placeholder: 'Email subject' },
      { key: 'emailType', label: 'Email Type', type: 'select', options: ['text','html'], default: 'text' },
      { key: 'message', label: 'Message Body', type: 'textarea', default: '', placeholder: 'Email body content...' }
    ],
    buildParams(values) {
      return {
        fromEmail: values.fromEmail || '',
        toEmail: values.toEmail || '',
        subject: values.subject || '',
        emailType: values.emailType || 'text',
        message: values.message || '',
        options: {}
      };
    }
  },
  {
    id: 'slack',
    name: 'Slack Message',
    icon: '💬',
    category: 'Communication',
    n8nType: 'n8n-nodes-base.slack',
    n8nTypeVersion: 2.2,
    fields: [
      { key: 'channel', label: 'Channel', type: 'text', default: '#general', placeholder: '#general' },
      { key: 'text', label: 'Message Text', type: 'textarea', default: '', placeholder: 'Hello from n8n!' }
    ],
    buildParams(values) {
      return {
        resource: 'message',
        operation: 'post',
        channel: values.channel || '#general',
        text: values.text || '',
        options: {}
      };
    }
  },
  {
    id: 'discord',
    name: 'Discord Message',
    icon: '🎮',
    category: 'Communication',
    n8nType: 'n8n-nodes-base.discord',
    n8nTypeVersion: 2,
    fields: [
      { key: 'webhookUri', label: 'Webhook URL', type: 'text', default: '', placeholder: 'https://discord.com/api/webhooks/...' },
      { key: 'content', label: 'Message', type: 'textarea', default: '', placeholder: 'Hello from n8n!' }
    ],
    buildParams(values) {
      return {
        resource: 'message',
        operation: 'send',
        webhookUri: values.webhookUri || '',
        content: values.content || '',
        options: {}
      };
    }
  },
  {
    id: 'telegram',
    name: 'Telegram Message',
    icon: '✈️',
    category: 'Communication',
    n8nType: 'n8n-nodes-base.telegram',
    n8nTypeVersion: 1.2,
    fields: [
      { key: 'chatId', label: 'Chat ID', type: 'text', default: '', placeholder: 'Chat or channel ID' },
      { key: 'text', label: 'Message Text', type: 'textarea', default: '', placeholder: 'Hello from n8n!' }
    ],
    buildParams(values) {
      return {
        resource: 'message',
        operation: 'sendMessage',
        chatId: values.chatId || '',
        text: values.text || '',
        additionalFields: {}
      };
    }
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    icon: '📊',
    category: 'Data',
    n8nType: 'n8n-nodes-base.googleSheets',
    n8nTypeVersion: 4.5,
    fields: [
      { key: 'operation', label: 'Operation', type: 'select', options: ['append','read','update','delete'], default: 'append' },
      { key: 'sheetName', label: 'Sheet Name', type: 'text', default: 'Sheet1', placeholder: 'Sheet1' }
    ],
    buildParams(values) {
      return {
        resource: 'sheet',
        operation: values.operation || 'append',
        sheetName: { mode: 'name', value: values.sheetName || 'Sheet1' },
        options: {}
      };
    }
  },
  {
    id: 'set',
    name: 'Set Data',
    icon: '✏️',
    category: 'Core',
    n8nType: 'n8n-nodes-base.set',
    n8nTypeVersion: 3.4,
    fields: [
      { key: 'fieldName', label: 'Field Name', type: 'text', default: 'myField', placeholder: 'fieldName' },
      { key: 'fieldValue', label: 'Field Value', type: 'text', default: '', placeholder: 'value or {{ $json.field }}' }
    ],
    buildParams(values) {
      return {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
              name: values.fieldName || 'myField',
              value: values.fieldValue || '',
              type: 'string'
            }
          ]
        },
        options: {}
      };
    }
  },
  {
    id: 'if',
    name: 'IF Condition',
    icon: '🔀',
    category: 'Logic',
    n8nType: 'n8n-nodes-base.if',
    n8nTypeVersion: 2.2,
    fields: [
      { key: 'leftValue', label: 'Left Value', type: 'text', default: '', placeholder: '{{ $json.field }}' },
      { key: 'operation', label: 'Condition', type: 'select', options: ['equal','notEqual','contains','gt','lt','gte','lte','isEmpty','isNotEmpty'], default: 'equal' },
      { key: 'rightValue', label: 'Right Value', type: 'text', default: '', placeholder: 'comparison value' }
    ],
    buildParams(values) {
      return {
        conditions: {
          options: { caseSensitive: true, leftValue: '' },
          conditions: [
            {
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
              leftValue: values.leftValue || '',
              rightValue: values.rightValue || '',
              operator: {
                type: 'string',
                operation: values.operation || 'equal'
              }
            }
          ],
          combinator: 'and'
        },
        options: {}
      };
    }
  },
  {
    id: 'code',
    name: 'Code (JavaScript)',
    icon: '🧑‍💻',
    category: 'Core',
    n8nType: 'n8n-nodes-base.code',
    n8nTypeVersion: 2,
    fields: [
      { key: 'jsCode', label: 'JavaScript Code', type: 'textarea', default: "// Access input data\nconst items = $input.all();\n\n// Process and return\nreturn items;", placeholder: 'Write your JavaScript code...' }
    ],
    buildParams(values) {
      return {
        mode: 'runOnceForAllItems',
        jsCode: values.jsCode || 'return $input.all();',
        options: {}
      };
    }
  },
  {
    id: 'respond_webhook',
    name: 'Respond to Webhook',
    icon: '↩️',
    category: 'Core',
    n8nType: 'n8n-nodes-base.respondToWebhook',
    n8nTypeVersion: 1.1,
    fields: [
      { key: 'respondWith', label: 'Respond With', type: 'select', options: ['allIncomingItems','firstIncomingItem','text','json','noData'], default: 'firstIncomingItem' },
      { key: 'responseBody', label: 'Response Body (for text/json)', type: 'textarea', default: '', placeholder: 'Response content...' }
    ],
    buildParams(values) {
      const params = {
        respondWith: values.respondWith || 'firstIncomingItem',
        options: {}
      };
      if (values.respondWith === 'text' || values.respondWith === 'json') {
        params.responseBody = values.responseBody || '';
      }
      return params;
    }
  },
  {
    id: 'merge',
    name: 'Merge',
    icon: '🔗',
    category: 'Logic',
    n8nType: 'n8n-nodes-base.merge',
    n8nTypeVersion: 3,
    fields: [
      { key: 'mode', label: 'Mode', type: 'select', options: ['append','combine','chooseBranch'], default: 'append' }
    ],
    buildParams(values) {
      return {
        mode: values.mode || 'append',
        options: {}
      };
    }
  },
  {
    id: 'wait',
    name: 'Wait',
    icon: '⏳',
    category: 'Logic',
    n8nType: 'n8n-nodes-base.wait',
    n8nTypeVersion: 1.1,
    fields: [
      { key: 'amount', label: 'Wait Time (seconds)', type: 'number', default: 5, placeholder: '5' }
    ],
    buildParams(values) {
      return {
        resume: 'timeInterval',
        unit: 'seconds',
        amount: parseInt(values.amount) || 5,
        options: {}
      };
    }
  }
];
