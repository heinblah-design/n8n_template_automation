# n8n Template Builder

A web-based tool to visually create n8n workflow templates. Users configure their automation workflow through a simple UI and generate valid n8n JSON templates ready for import.

## Features

- **Trigger Selection** — Choose from Webhook, Schedule, Manual, or Email triggers
- **Node Builder** — Add and configure action nodes:
  - HTTP Request, Send Email, Slack, Discord, Telegram
  - Google Sheets, Set Data, IF Condition, Code (JavaScript)
  - Respond to Webhook, Merge, Wait
- **Visual Preview** — See your workflow as a visual flow diagram
- **Template Generation** — Generate valid n8n-compatible JSON
- **Export** — Download as `.json` file or copy to clipboard
- **No Backend Required** — Runs entirely in the browser

## Usage

1. Open `index.html` in a browser (or deploy to any static hosting)
2. Enter a workflow name and optional description
3. Select a trigger type (e.g., Webhook, Schedule)
4. Add action nodes and configure their parameters
5. Click **Generate n8n Template**
6. Download the JSON or copy it to clipboard
7. Import the JSON into your n8n instance via **Settings → Import from File**

## Project Structure

```
├── index.html          # Main HTML page
├── css/
│   └── style.css       # Styles (dark theme)
├── js/
│   ├── nodes.js        # Trigger & node type definitions
│   ├── generator.js    # n8n JSON template generator
│   └── app.js          # Main application logic
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
