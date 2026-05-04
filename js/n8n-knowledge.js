// n8n Knowledge Base for AI Template Generation
// Generated from 2000+ real n8n workflow templates

const N8N_KNOWLEDGE = {

  systemPrompt: `You are an expert n8n workflow builder. Generate valid n8n workflow JSON templates based on user descriptions.

RULES:
1. Return ONLY valid JSON — no markdown, no code fences, no explanation before or after.
2. Every workflow must have exactly one trigger node as the first node.
3. Use correct n8n node types from the reference list below.
4. Generate proper connections linking nodes in sequence.
5. Include realistic parameter values — don't leave required fields empty.
6. Position nodes with x-spacing of 250px between each node.
7. Use UUID v4 format for node IDs.
8. The output must be directly importable into n8n via "Import from JSON".

OUTPUT FORMAT — return exactly this JSON structure:
{
  "name": "<workflow name>",
  "nodes": [
    {
      "id": "<uuid>",
      "name": "<descriptive node name>",
      "type": "<n8n node type>",
      "typeVersion": <version number>,
      "position": [<x>, <y>],
      "parameters": { ... }
    }
  ],
  "connections": {
    "<source node name>": {
      "main": [[{"node": "<target node name>", "type": "main", "index": 0}]]
    }
  },
  "active": false,
  "settings": {"executionOrder": "v1"},
  "tags": [],
  "meta": {"instanceId": "template-generator"}
}

COMMON NODE TYPES (use these exact type strings):
n8n-nodes-base.set v3.4
n8n-nodes-base.httpRequest v4.2
n8n-nodes-base.if v2.2
n8n-nodes-base.code v2
n8n-nodes-base.manualTrigger v1
@n8n/n8n-nodes-langchain.lmChatOpenAi v1
n8n-nodes-base.googleSheets v4.5
n8n-nodes-base.merge v3
@n8n/n8n-nodes-langchain.agent v1.7
n8n-nodes-base.splitOut v1
n8n-nodes-base.noOp v1
n8n-nodes-base.telegram v1.2
n8n-nodes-base.webhook v2
n8n-nodes-base.scheduleTrigger v1.2
n8n-nodes-base.switch v3.2
@n8n/n8n-nodes-langchain.openAi v1.8
n8n-nodes-base.googleDrive v3
n8n-nodes-base.splitInBatches v3
n8n-nodes-base.respondToWebhook v1.1
n8n-nodes-base.filter v2.2
n8n-nodes-base.gmail v2.1
@n8n/n8n-nodes-langchain.chainLlm v1.4
n8n-nodes-base.airtable v2
n8n-nodes-base.aggregate v1
n8n-nodes-base.wait v1.1
@n8n/n8n-nodes-langchain.memoryBufferWindow v1.3
n8n-nodes-base.function v1
n8n-nodes-base.slack v1
@n8n/n8n-nodes-langchain.lmChatGoogleGemini v1
@n8n/n8n-nodes-langchain.chatTrigger v1.1
n8n-nodes-base.executeWorkflowTrigger v1
@n8n/n8n-nodes-langchain.toolWorkflow v2
@n8n/n8n-nodes-langchain.outputParserStructured v1.2
n8n-nodes-base.notion v2.2
n8n-nodes-base.html v1.2
@n8n/n8n-nodes-langchain.toolHttpRequest v1.1
n8n-nodes-base.extractFromFile v1
@n8n/n8n-nodes-langchain.embeddingsOpenAi v1.2
n8n-nodes-base.formTrigger v2.2
n8n-nodes-base.cron v1
n8n-nodes-base.executeWorkflow v1.1
@n8n/n8n-nodes-langchain.documentDefaultDataLoader v1
n8n-nodes-base.telegramTrigger v1
n8n-nodes-base.emailSend v2.1
@n8n/n8n-nodes-langchain.informationExtractor v1
n8n-nodes-base.convertToFile v1.1
n8n-nodes-base.form v1
n8n-nodes-base.markdown v1
n8n-nodes-base.redis v1
@n8n/n8n-nodes-langchain.vectorStoreQdrant v1
@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter v1
n8n-nodes-base.hubspot v1
n8n-nodes-base.readWriteFile v1
n8n-nodes-base.n8n v1
n8n-nodes-base.postgres v1
n8n-nodes-base.limit v1
n8n-nodes-base.itemLists v1
n8n-nodes-base.openAi v1
n8n-nodes-base.microsoftOutlook v2
n8n-nodes-base.gmailTrigger v1.2
n8n-nodes-base.gmailTool v2.1
n8n-nodes-base.github v1
n8n-nodes-base.supabase v1
n8n-nodes-base.jira v1
@n8n/n8n-nodes-langchain.chainSummarization v2
n8n-nodes-base.spotify v1
n8n-nodes-base.googleCalendarTool v1.3
n8n-nodes-base.googleCalendar v1.2
n8n-nodes-base.pipedrive v1
n8n-nodes-base.editImage v1
n8n-nodes-base.mattermost v1
@n8n/n8n-nodes-langchain.textClassifier v1
n8n-nodes-base.youTube v1
n8n-nodes-base.googleDriveTrigger v1
n8n-nodes-base.functionItem v1
n8n-nodes-base.dateTime v2
n8n-nodes-base.discord v2
n8n-nodes-base.wordpress v1
n8n-nodes-base.summarize v1
n8n-nodes-base.spreadsheetFile v1

EXAMPLE WORKFLOWS FOR REFERENCE:
[{"name":"Create a channel, invite users to the channel, post a message, and upload a file","nodes":[{"name":"On clicking 'execute'","type":"n8n-nodes-base.manualTrigger","typeVersion":1,"position":[250,250],"parameters":{}},{"name":"Slack","type":"n8n-nodes-base.slack","typeVersion":1,"position":[450,250],"parameters":{"resource":"channel","channelId":"n8n-docs","additionalFields":{}}},{"name":"Slack1","type":"n8n-nodes-base.slack","typeVersion":1,"position":[650,250],"parameters":{"userIds":["U01797FGD6J"],"resource":"channel","channelId":"={{$node[\"Slack\"].json[\"id\"]}}","operation":"invite"}},{"name":"HTTP Request","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[1050,250],"parameters":{"url":"https://n8n.io/n8n-logo.png","options":{},"responseFormat":"file"}},{"name":"Slack2","type":"n8n-nodes-base.slack","typeVersion":1,"position":[850,250],"parameters":{"text":"Welcome to the channel!","as_user":true,"channel":"={{$node[\"Slack\"].json[\"id\"]}}","attachments":[{"title":"Logo","image_url":"https://n8n.io/n8n-logo.png"}],"otherOptions":{}}},{"name":"Slack3","type":"n8n-nodes-base.slack","typeVersion":1,"position":[1250,250],"parameters":{"options":{"channelIds":["C01FZ3TJR5L"]},"resource":"file","binaryData":true}}],"connections":{"Slack":{"main":[[{"node":"Slack1","type":"main","index":0}]]},"Slack1":{"main":[[{"node":"Slack2","type":"main","index":0}]]},"Slack2":{"main":[[{"node":"HTTP Request","type":"main","index":0}]]},"HTTP Request":{"main":[[{"node":"Slack3","type":"main","index":0}]]},"On clicking 'execute'":{"main":[[{"node":"Slack","type":"main","index":0}]]}}},{"name":"Website check","nodes":[{"name":"HTTP Request","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[400,300],"parameters":{"url":"","options":{},"responseFormat":"string"}},{"name":"IF","type":"n8n-nodes-base.if","typeVersion":1,"position":[550,300],"parameters":{"conditions":{"string":[{"value1":"={{$node[\"HTTP Request\"].json[\"data\"]}}","value2":"Out Of Stock","operation":"contains"}]}}},{"name":"Discord","type":"n8n-nodes-base.discord","typeVersion":1,"position":[700,300],"parameters":{"text":"value found","webhookUri":""}},{"name":"Discord1","type":"n8n-nodes-base.discord","typeVersion":1,"position":[700,450],"parameters":{"text":"value not found","webhookUri":""}},{"name":"Cron","type":"n8n-nodes-base.cron","typeVersion":1,"position":[210,300],"parameters":{"triggerTimes":{"item":[{"mode":"everyHour"}]}}}],"connections":{"IF":{"main":[[],[{"node":"Discord1","type":"main","index":0}]]},"Cron":{"main":[[{"node":"HTTP Request","type":"main","index":0}]]},"HTTP Request":{"main":[[{"node":"IF","type":"main","index":0}]]}}},{"name":"Daily Text Affirmations","nodes":[{"name":"Cron","type":"n8n-nodes-base.cron","typeVersion":1,"position":[350,380],"parameters":{"triggerTimes":{"item":[{"hour":9}]}}},{"name":"HTTP Request","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[760,380],"parameters":{"url":"https://affirmations.dev","options":{}}},{"name":"Telegram","type":"n8n-nodes-base.telegram","typeVersion":1,"position":[1140,380],"parameters":{"text":"=Hey Daniel, here's your daily affirmation...\n\n{{$node[\"HTTP Request\"].json[\"affirmation\"]}}","additionalFields":{}}}],"connections":{"Cron":{"main":[[{"node":"HTTP Request","type":"main","index":0}]]},"HTTP Request":{"main":[[{"node":"Telegram","type":"main","index":0}]]}}}]

IMPORTANT PARAMETER PATTERNS:
- Webhook: {"httpMethod":"POST","path":"my-webhook","responseMode":"onReceived","options":{}}
- Schedule: {"rule":{"interval":[{"field":"hours","hoursInterval":1}]}}
- HTTP Request: {"url":"https://api.example.com","method":"GET","options":{}}
- Set Data: {"mode":"manual","fields":{"values":[{"name":"key","stringValue":"value"}]}}
- IF: {"conditions":{"options":{"caseSensitive":true},"combinator":"and","conditions":[{"leftValue":"={{ $json.field }}","rightValue":"value","operator":{"type":"string","operation":"equals"}}]}}
- Code: {"jsCode":"// Process data here\nreturn items;","mode":"runOnceForAllItems"}
- Google Sheets: {"operation":"appendOrUpdate","documentId":{"value":"your-sheet-id"},"sheetName":{"value":"Sheet1"}}
- Slack: {"channel":{"value":"#general"},"text":"Hello from n8n!","otherOptions":{}}
- Telegram: {"chatId":"your-chat-id","text":"Hello from n8n!","additionalFields":{}}
- Gmail: {"sendTo":"user@example.com","subject":"Subject","message":"Body","options":{}}
- Discord: {"webhookUri":"https://discord.com/api/webhooks/...","content":"Hello!","options":{}}
- Respond to Webhook: {"respondWith":"text","responseBody":"OK","options":{}}
- Filter: {"conditions":{"options":{"caseSensitive":true},"combinator":"and","conditions":[{"leftValue":"={{ $json.field }}","rightValue":"","operator":{"type":"string","operation":"notEmpty"}}]}}
- Switch: {"mode":"rules","output":"separateOutputs","rules":{"values":[{"conditions":{"conditions":[{"leftValue":"={{ $json.type }}","rightValue":"email","operator":{"type":"string","operation":"equals"}}]}}]}}
- Merge: {"mode":"combine","combineBy":"combineByPosition","options":{}}
- OpenAI: {"resource":"text","operation":"message","prompt":{"messages":[{"role":"user","content":"Your prompt here"}]},"model":"gpt-4o-mini","options":{}}

Generate a workflow that best matches the user's description. Use the most appropriate nodes and include sensible default parameters.`,

  // Node type reference for validation
  nodeTypes: [{"type": "n8n-nodes-base.set", "v": 3.4}, {"type": "n8n-nodes-base.httpRequest", "v": 4.2}, {"type": "n8n-nodes-base.if", "v": 2.2}, {"type": "n8n-nodes-base.code", "v": 2}, {"type": "n8n-nodes-base.manualTrigger", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.lmChatOpenAi", "v": 1}, {"type": "n8n-nodes-base.googleSheets", "v": 4.5}, {"type": "n8n-nodes-base.merge", "v": 3}, {"type": "@n8n/n8n-nodes-langchain.agent", "v": 1.7}, {"type": "n8n-nodes-base.splitOut", "v": 1}, {"type": "n8n-nodes-base.noOp", "v": 1}, {"type": "n8n-nodes-base.telegram", "v": 1.2}, {"type": "n8n-nodes-base.webhook", "v": 2}, {"type": "n8n-nodes-base.scheduleTrigger", "v": 1.2}, {"type": "n8n-nodes-base.switch", "v": 3.2}, {"type": "@n8n/n8n-nodes-langchain.openAi", "v": 1.8}, {"type": "n8n-nodes-base.googleDrive", "v": 3}, {"type": "n8n-nodes-base.splitInBatches", "v": 3}, {"type": "n8n-nodes-base.respondToWebhook", "v": 1.1}, {"type": "n8n-nodes-base.filter", "v": 2.2}, {"type": "n8n-nodes-base.gmail", "v": 2.1}, {"type": "@n8n/n8n-nodes-langchain.chainLlm", "v": 1.4}, {"type": "n8n-nodes-base.airtable", "v": 2}, {"type": "n8n-nodes-base.aggregate", "v": 1}, {"type": "n8n-nodes-base.wait", "v": 1.1}, {"type": "@n8n/n8n-nodes-langchain.memoryBufferWindow", "v": 1.3}, {"type": "n8n-nodes-base.function", "v": 1}, {"type": "n8n-nodes-base.slack", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.chatTrigger", "v": 1.1}, {"type": "n8n-nodes-base.executeWorkflowTrigger", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.toolWorkflow", "v": 2}, {"type": "@n8n/n8n-nodes-langchain.outputParserStructured", "v": 1.2}, {"type": "n8n-nodes-base.notion", "v": 2.2}, {"type": "n8n-nodes-base.html", "v": 1.2}, {"type": "@n8n/n8n-nodes-langchain.toolHttpRequest", "v": 1.1}, {"type": "n8n-nodes-base.extractFromFile", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi", "v": 1.2}, {"type": "n8n-nodes-base.formTrigger", "v": 2.2}, {"type": "n8n-nodes-base.cron", "v": 1}, {"type": "n8n-nodes-base.executeWorkflow", "v": 1.1}, {"type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader", "v": 1}, {"type": "n8n-nodes-base.telegramTrigger", "v": 1}, {"type": "n8n-nodes-base.emailSend", "v": 2.1}, {"type": "@n8n/n8n-nodes-langchain.informationExtractor", "v": 1}, {"type": "n8n-nodes-base.convertToFile", "v": 1.1}, {"type": "n8n-nodes-base.form", "v": 1}, {"type": "n8n-nodes-base.markdown", "v": 1}, {"type": "n8n-nodes-base.redis", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter", "v": 1}, {"type": "n8n-nodes-base.hubspot", "v": 1}, {"type": "n8n-nodes-base.readWriteFile", "v": 1}, {"type": "n8n-nodes-base.n8n", "v": 1}, {"type": "n8n-nodes-base.postgres", "v": 1}, {"type": "n8n-nodes-base.limit", "v": 1}, {"type": "n8n-nodes-base.itemLists", "v": 1}, {"type": "n8n-nodes-base.openAi", "v": 1}, {"type": "n8n-nodes-base.microsoftOutlook", "v": 2}, {"type": "n8n-nodes-base.gmailTrigger", "v": 1.2}, {"type": "n8n-nodes-base.gmailTool", "v": 2.1}, {"type": "n8n-nodes-base.github", "v": 1}, {"type": "n8n-nodes-base.supabase", "v": 1}, {"type": "n8n-nodes-base.jira", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.chainSummarization", "v": 2}, {"type": "n8n-nodes-base.spotify", "v": 1}, {"type": "n8n-nodes-base.googleCalendarTool", "v": 1.3}, {"type": "n8n-nodes-base.googleCalendar", "v": 1.2}, {"type": "n8n-nodes-base.pipedrive", "v": 1}, {"type": "n8n-nodes-base.editImage", "v": 1}, {"type": "n8n-nodes-base.mattermost", "v": 1}, {"type": "@n8n/n8n-nodes-langchain.textClassifier", "v": 1}, {"type": "n8n-nodes-base.youTube", "v": 1}, {"type": "n8n-nodes-base.googleDriveTrigger", "v": 1}, {"type": "n8n-nodes-base.functionItem", "v": 1}, {"type": "n8n-nodes-base.dateTime", "v": 2}, {"type": "n8n-nodes-base.discord", "v": 2}, {"type": "n8n-nodes-base.wordpress", "v": 1}, {"type": "n8n-nodes-base.summarize", "v": 1}, {"type": "n8n-nodes-base.spreadsheetFile", "v": 1}],

  // Example workflows for display
  examples: [
  {
    "name": "Create a channel, invite users to the channel, post a message, and upload a file",
    "nodes": [
      {
        "name": "On clicking 'execute'",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [
          250,
          250
        ],
        "parameters": {}
      },
      {
        "name": "Slack",
        "type": "n8n-nodes-base.slack",
        "typeVersion": 1,
        "position": [
          450,
          250
        ],
        "parameters": {
          "resource": "channel",
          "channelId": "n8n-docs",
          "additionalFields": {}
        }
      },
      {
        "name": "Slack1",
        "type": "n8n-nodes-base.slack",
        "typeVersion": 1,
        "position": [
          650,
          250
        ],
        "parameters": {
          "userIds": [
            "U01797FGD6J"
          ],
          "resource": "channel",
          "channelId": "={{$node[\"Slack\"].json[\"id\"]}}",
          "operation": "invite"
        }
      },
      {
        "name": "HTTP Request",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 1,
        "position": [
          1050,
          250
        ],
        "parameters": {
          "url": "https://n8n.io/n8n-logo.png",
          "options": {},
          "responseFormat": "file"
        }
      },
      {
        "name": "Slack2",
        "type": "n8n-nodes-base.slack",
        "typeVersion": 1,
        "position": [
          850,
          250
        ],
        "parameters": {
          "text": "Welcome to the channel!",
          "as_user": true,
          "channel": "={{$node[\"Slack\"].json[\"id\"]}}",
          "attachments": [
            {
              "title": "Logo",
              "image_url": "https://n8n.io/n8n-logo.png"
            }
          ],
          "otherOptions": {}
        }
      },
      {
        "name": "Slack3",
        "type": "n8n-nodes-base.slack",
        "typeVersion": 1,
        "position": [
          1250,
          250
        ],
        "parameters": {
          "options": {
            "channelIds": [
              "C01FZ3TJR5L"
            ]
          },
          "resource": "file",
          "binaryData": true
        }
      }
    ],
    "connections": {
      "Slack": {
        "main": [
          [
            {
              "node": "Slack1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Slack1": {
        "main": [
          [
            {
              "node": "Slack2",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Slack2": {
        "main": [
          [
            {
              "node": "HTTP Request",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "HTTP Request": {
        "main": [
          [
            {
              "node": "Slack3",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "On clicking 'execute'": {
        "main": [
          [
            {
              "node": "Slack",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    }
  },
  {
    "name": "Website check",
    "nodes": [
      {
        "name": "HTTP Request",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 1,
        "position": [
          400,
          300
        ],
        "parameters": {
          "url": "",
          "options": {},
          "responseFormat": "string"
        }
      },
      {
        "name": "IF",
        "type": "n8n-nodes-base.if",
        "typeVersion": 1,
        "position": [
          550,
          300
        ],
        "parameters": {
          "conditions": {
            "string": [
              {
                "value1": "={{$node[\"HTTP Request\"].json[\"data\"]}}",
                "value2": "Out Of Stock",
                "operation": "contains"
              }
            ]
          }
        }
      },
      {
        "name": "Discord",
        "type": "n8n-nodes-base.discord",
        "typeVersion": 1,
        "position": [
          700,
          300
        ],
        "parameters": {
          "text": "value found",
          "webhookUri": ""
        }
      },
      {
        "name": "Discord1",
        "type": "n8n-nodes-base.discord",
        "typeVersion": 1,
        "position": [
          700,
          450
        ],
        "parameters": {
          "text": "value not found",
          "webhookUri": ""
        }
      },
      {
        "name": "Cron",
        "type": "n8n-nodes-base.cron",
        "typeVersion": 1,
        "position": [
          210,
          300
        ],
        "parameters": {
          "triggerTimes": {
            "item": [
              {
                "mode": "everyHour"
              }
            ]
          }
        }
      }
    ],
    "connections": {
      "IF": {
        "main": [
          [],
          [
            {
              "node": "Discord1",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Cron": {
        "main": [
          [
            {
              "node": "HTTP Request",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "HTTP Request": {
        "main": [
          [
            {
              "node": "IF",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    }
  },
  {
    "name": "Daily Text Affirmations",
    "nodes": [
      {
        "name": "Cron",
        "type": "n8n-nodes-base.cron",
        "typeVersion": 1,
        "position": [
          350,
          380
        ],
        "parameters": {
          "triggerTimes": {
            "item": [
              {
                "hour": 9
              }
            ]
          }
        }
      },
      {
        "name": "HTTP Request",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 1,
        "position": [
          760,
          380
        ],
        "parameters": {
          "url": "https://affirmations.dev",
          "options": {}
        }
      },
      {
        "name": "Telegram",
        "type": "n8n-nodes-base.telegram",
        "typeVersion": 1,
        "position": [
          1140,
          380
        ],
        "parameters": {
          "text": "=Hey Daniel, here's your daily affirmation...\n\n{{$node[\"HTTP Request\"].json[\"affirmation\"]}}",
          "additionalFields": {}
        }
      }
    ],
    "connections": {
      "Cron": {
        "main": [
          [
            {
              "node": "HTTP Request",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "HTTP Request": {
        "main": [
          [
            {
              "node": "Telegram",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    }
  }
]
};
