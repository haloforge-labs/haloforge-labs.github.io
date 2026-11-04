---
title: Known issues
description: "Known issues of the Halowin Bubo v0.1.2 local LLM server for AMD Strix Halo on Windows: tracing, host memory, the disk prompt cache and unsigned builds."
head:
  - tag: title
    content: "Known issues on Windows with Strix Halo | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Known issues on Windows with Strix Halo | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Known issues on Windows with Strix Halo | Halowin Bubo" }
---

- Tracing reduces decode speed. Keep tracing off for speed.
- More than two sessions at 262K context do not fit in 32 GB host RAM. Use no more than two sessions at this context size. Bubo refuses a request that needs new memory when free memory is below the floor. See [Memory guard](/docs/system-setup/#memory-guard).
- The disk prompt cache is an option. It is off by default. When on, it writes about 3 GB to the SSD for each long saved session. See [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache).
- The exact profile stops with an error when an explicit flag or environment value would change an exact-profile value (for example `Error: profile=exact: explicit value re-enables GUFO_DENSE_TWIN_MAX_N`). Remove that setting, or do not combine it with `--profile exact`.
- Chat logprobs need thinking off, plain text (no tools or images) and no stop sequences. Otherwise the server returns 400. The `/debug/prompt` endpoint accepts plain text without tools only. See [options](/docs/options/#chat-api-limits).
- With the prompt cache on (default profile), a restore from the cache is not bit-identical to a fresh prefill of the same prompt. The `exact` profile turns the cache off for this reason.
- If you use `--cache-disk`, the first start of v0.1.2 deletes the disk-cache files of v0.1.1 in that folder (`*.kvc` and temporary files, top level only), and the first requests after that run cold. Use a separate folder for each server.
- The option `--cache-disk-staging-bytes` is ignored on Qwen3.8 Flash Next, and the server logs a warning.
- If the GPU stops responding, the server logs `event=device_lost remedy=restart_process exit_status=75` and exits with status 75. A lost GPU context cannot recover inside the process. The Bubo app starts the server again once, after 5 seconds, with the same setup, and shows "The GPU stopped responding. Bubo restarted the server." If the GPU stops again within 5 minutes, the app shows "The graphics device stopped responding." and you select **Start** to start the server again. Without the app, nothing restarts the server by itself: `start.cmd` runs it once, so start the server again, or run it under a supervisor that restarts it on failure. `bubo diagnose` shows if the GPU memory reservation and the page file match the tested setup. See [system setup](/docs/system-setup/). This error has not been seen on the tested setup.
- Like many open-source Windows builds, Bubo v0.1.2 is not code-signed. SmartScreen can show a warning, and Smart App Control blocks unsigned programs. See [Windows security prompts](/docs/install/#windows-security-prompts).
