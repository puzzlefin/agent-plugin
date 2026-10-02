---
name: get-started
description: First run with Puzzle. Use right after the user connects Puzzle, or when they ask what Puzzle can do here or how to get started.
---

# Get started with Puzzle

1. Call `list_companies`. If it fails with an authorization error, ask the user to connect their
   Puzzle account and sign in.
2. Tell the user, briefly:
   - which companies the connection can see (name, and plan if it limits anything);
   - that the connection is read-only until they allow changes, and that every change is
     confirmed with them first;
   - that they can add companies or revoke access in Puzzle under Settings → Connected apps.
3. Offer three things to try, picked for what they likely need:
   - "What's our runway, and how has burn changed?"
   - "Show last month's income statement."
   - "Which transactions still need a category?"
4. When the user picks one, follow the `puzzle-books` skill.

Keep it short: a few lines, then the offers. Don't list every tool.
