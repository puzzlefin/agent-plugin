---
name: puzzle-books
description: Work with a company's books in Puzzle through the connected Puzzle tools. Use when the user asks about their company's finances or accounting — cash, burn, runway, balance sheet, income statement, cash flow, transactions, categorization, bills, invoices, vendors, customers, payroll, reconciliation, revenue recognition, ARR, or closing a month. Not for general accounting questions that don't need the user's own books.
---

# Puzzle books

Puzzle keeps a startup's double-entry books from its bank, card, payroll and payment data. The
Puzzle tools read and manage those books for the companies the user connected.

## Pick the company first

- Every tool acts on one company and takes `companyId`. Call `list_companies` once per
  conversation and reuse the ids.
- If the connection covers several companies and the user hasn't said which, ask. Don't guess
  from a partial name match.
- A company that isn't listed isn't in this connection. The user adds it in Puzzle under
  Settings → Connected apps.

## Follow Puzzle's playbooks for multi-step work

Puzzle serves its own playbooks, and they are kept current on the server. Before closing a
month, working through bills, reconciling an account, or any other multi-step job, call
`list_skills` for the company, then `get_skill` for the matching one, and follow it. Prefer it
over improvising the procedure.

## Read before you write

- The connection starts read-only. Tools that change the books aren't listed until the user
  allows write access.
- When the user asks for a change on a read-only connection, call `request_write_access`. Show
  the disclaimer it returns to the user word for word, and call it again with
  `acknowledgedDisclaimer: true` only after the user explicitly agrees. Then list tools again.
- With write access, state exactly what will change (which records, which accounts, which
  amounts) and get a yes before each change. Batch-confirm a set of similar changes rather than
  asking one at a time.
- For the `propose…` tools: show the proposal, record the user's reply with `user_ack`, then
  apply. Applying without a recorded reply is refused.
- When the work is done, offer `disable_write_access`.

## Get the numbers right

- Reports have a cash and an accrual view. Say which one a number comes from, and use the one
  the user asked for. If they didn't say, the tool's default applies (cash for the balance
  sheet and cash activity, accrual for the income statement and trial balance); name it.
- State the period for every figure ("March 2026", "Q1 2026 through March 31").
- Money comes back as exact decimals. Don't round mid-calculation; round only for display, and
  keep the currency.
- Recent transactions may still be uncategorized or unreconciled. When a figure depends on them,
  say so instead of presenting it as final.
- Fetch reference data — chart of accounts, accounts, reporting classes — once and reuse it.
  Tools are rate-limited; a limit error includes `retryAfterSeconds`.

## When a tool refuses

- **Plan limit:** the company's plan doesn't include the tool. Tell the user what isn't available.
  `upgrade_puzzle` returns the billing link if they ask how to get it.
- **AI features off:** someone at the company has to turn on AI features in Puzzle settings.
  Relay the link the error gives.
- **Locked period:** the books are closed for that date. Tell the user. Bypass a lock only when
  the tool offers it and the user explicitly asks for that change in the closed period.

## Reference

`puzzle://docs/overview` covers companies, write access, plans and rate limits.
