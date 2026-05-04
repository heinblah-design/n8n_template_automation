# n8n AI Template Generator

A web-based tool to generate n8n workflow templates using AI. Describe what you want to automate in plain text, and the AI generates a ready-to-import n8n JSON template.

## Features

### AI Builder (Default)
- **Natural Language Input** — Describe your automation in plain text
- **Google Gemini AI** — Generates valid n8n workflow JSON using Gemini 2.0 Flash (free tier)
- **Knowledge Base** — Trained on 2000+ real n8n workflow templates for accurate output
- **Example Prompts** — Quick-start chips for common automation patterns
- **Client-Side Only** — API key stored in browser localStorage, never sent to any server

### Manual Builder
- **Trigger Selection** — Choose from Webhook, Schedule, Manual, or Email triggers
- **Node Builder** — Add and configure action nodes:
  - HTTP Request, Send Email, Slack, Discord, Telegram
  - Google Sheets, Set Data, IF Condition, Code (JavaScript)
  - Respond to Webhook, Merge, Wait
- **Visual Preview** — See your workflow as a visual flow diagram

### Shared
- **Template Generation** — Generate valid n8n-compatible JSON
- **Export** — Download as `.json` file or copy to clipboard
- **No Backend Required** — Runs entirely in the browser

## Usage

### AI Builder
1. Open the site and get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Paste and save your API key (stored in browser only)
3. Describe what you want to automate (e.g., "When a webhook receives data, save to Google Sheets and send Slack notification")
4. Click **Generate n8n Template**
5. Copy or download the JSON and import into n8n

### Manual Builder
1. Switch to **Manual Builder** tab
2. Select a trigger type and configure it
3. Add action nodes and set parameters
4. Click **Generate n8n Template**
5. Download or copy the JSON

## Project Structure

```
├── index.html              # Main HTML page
├── css/
│   └── style.css           # Styles (dark theme)
├── js/
│   ├── n8n-knowledge.js    # AI knowledge base (node types, examples)
│   ├── ai-engine.js        # Gemini API client
│   ├── nodes.js            # Trigger & node type definitions
│   ├── generator.js        # n8n JSON template generator
│   └── app.js              # Main application logic
└── README.md
```

## Development

No build tools required. Open `index.html` directly in a browser or serve with any static file server:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

## Deployment

Deploy to any static hosting (GitHub Pages, Netlify, Vercel, etc.) — just upload all files.

## License

MIT
