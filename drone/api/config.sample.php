<?php
/**
 * Copy this file to config.php (same folder) and fill in your real API key.
 * config.php is git-ignored — it is never committed and only ever lives on
 * the live server. Get an API key at https://console.anthropic.com/settings/keys
 * (you'll need billing set up there — the chat widget costs real API usage).
 */

// Your Anthropic API key (starts with "sk-ant-...").
define('ANTHROPIC_API_KEY', 'YOUR_ANTHROPIC_API_KEY_HERE');

// Model used for the chat widget. See https://console.anthropic.com for available models.
define('ANTHROPIC_MODEL', 'claude-opus-5');

// Max chat messages allowed per visitor (by IP) per RATE_LIMIT_WINDOW_SECONDS.
// Protects against runaway API costs from abuse or bots.
define('RATE_LIMIT_MAX_REQUESTS', 15);
define('RATE_LIMIT_WINDOW_SECONDS', 600); // 10 minutes
