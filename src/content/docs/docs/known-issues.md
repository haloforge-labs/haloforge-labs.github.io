---
title: Known issues
description: Short notes on tracing, host memory, and the disk prompt cache.
---

- Tracing reduces decode speed. Keep tracing off for speed.
- More than two sessions at 262K context do not fit in 32 GB host RAM. Use no more than two sessions at this context size.
- The disk prompt cache is an option. It is off by default. When on, it writes about 3 GB to the SSD for each long saved session. See [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache).
- The exact profile stops with an error when an explicit flag or environment value would change an exact-profile value (for example `Error: profile=exact: explicit value re-enables GUFO_DENSE_TWIN_MAX_N`). Remove that setting, or do not combine it with `--profile exact`.
- Chat logprobs need thinking off, plain text (no tools or images) and no stop sequences. Otherwise the server returns 400. The `/debug/prompt` endpoint accepts plain text without tools only. See [options](/docs/options/#chat-api-limits).
- With the prompt cache on (default profile), a restore from the cache is not bit-identical to a fresh prefill of the same prompt. The `exact` profile turns the cache off for this reason.
- The NPU kernel file ships as the fork built it. The compiler toolchain that built it is not recorded. We plan a rebuild with the open-source Peano compiler in a later release.
- The disk prompt cache stages each snapshot in RAM before it writes it. With little free RAM at start (about 7 GiB), the staging area can be smaller than one long snapshot, and Bubo drops the snapshot. `start.cmd -CacheDisk` sets a 5 GiB staging area. If you run `bubo serve` directly, add `--cache-disk-staging-bytes 5368709120`. See [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache).
- Bubo v0.1.0 is not code-signed. SmartScreen can show a warning, and Smart App Control blocks the program. See [Windows security prompts](/docs/install/#windows-security-prompts).
