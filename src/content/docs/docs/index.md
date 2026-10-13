---
title: Halowin Bubo docs
description: "Guides for Halowin Bubo, a local LLM server for AMD Strix Halo on Windows: system setup, install, quickstart, profiles, options and benchmarks."
head:
  - tag: title
    content: "Docs: install and run a local LLM server on Windows | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Docs: install and run a local LLM server on Windows | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Docs: install and run a local LLM server on Windows | Halowin Bubo" }
---

These guides cover how to install, run and tune [Halowin Bubo](/bubo/) on Windows.

## Start here

1. [Set up your system](/docs/system-setup/).
2. [Install Halowin Bubo](/docs/install/).
3. [Read the quickstart](/docs/quickstart/).

## Recommended settings

Use Qwen3.8 Flash Next in GGUF format with the UD-Q4_K_XL quant. Use Performance mode. The default profile uses optimal settings and medium reasoning effort.

## Reference

- [Supported models](/docs/models/): all gufo model families.
- [Profiles](/docs/profiles/): settings for each use.
- [Options](/docs/options/): every server option and environment value.
- [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache): the optional disk prompt cache.
- [Known issues](/docs/known-issues/): memory, tracing, and the disk prompt cache.
- [Benchmarks](/docs/benchmarks/): measured speeds and test conditions.
- [NPU prefill](/docs/npu/): use the Ryzen AI NPU for part of the prompt processing.
- [Under the hood](/docs/under-the-hood/): how Bubo gets its speed, with the measured numbers.
