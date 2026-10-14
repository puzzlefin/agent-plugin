# Puzzle

Connects Claude to [Puzzle](https://puzzle.io), the accounting platform for startups, through
Puzzle's remote MCP server at `https://app.puzzle.io/mcp`.

Ask about cash, burn, runway, the income statement and balance sheet, transactions and their
categories, bills, invoices, vendors, customers, payroll, reconciliation, revenue recognition
and ARR, for any company you can access in Puzzle.

## Setup

1. Install the plugin.
2. Authenticate the `puzzle` MCP server and sign in to Puzzle. You choose which companies to share.
3. Ask "what can Puzzle do here?" to get started.

The connection is read-only until you allow changes, and every change is confirmed with you
first. Revoke access in Puzzle under Settings → Connected apps.

## Skills

- `get-started`: first run; lists the companies the connection can see and suggests what to try.
- `puzzle-books`: how to work with a company's books in Puzzle.

Docs: <https://app.puzzle.io/mcp/docs>. Support: support@puzzle.io.
