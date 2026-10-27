---
title: Halowin Bubo docs
description: "Guides for Halowin Bubo, a local LLM server for AMD Strix Halo (Ryzen AI Max+ 395) on Windows: setup, install, quickstart, API, options, benchmarks."
head:
  - tag: title
    content: "Docs: install and run a local LLM server on Windows | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Docs: install and run a local LLM server on Windows | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Docs: install and run a local LLM server on Windows | Halowin Bubo" }
---

These guides cover how to install, run and tune Halowin Bubo on Windows.

## Start here

1. [Set up your system](/docs/system-setup/).
2. [Install Halowin Bubo](/docs/install/).
3. [Use the app](/docs/app/), or [read the quickstart](/docs/quickstart/) for the command line.

## Recommended settings

Use Qwen3.8 Flash Next in GGUF format with the UD-Q4_K_XL quant. Use Performance mode. The default profile uses optimal settings and medium reasoning effort.

## Reference

- [Supported models](/docs/models/): the models that were tested on Windows.
- [Profiles](/docs/profiles/): settings for each use.
- [Options](/docs/options/): every server option and environment value.
- [API reference](/docs/api/): every HTTP endpoint, with request fields, streaming, tool calls and errors.
- [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache): the optional disk prompt cache.
- [Known issues](/docs/known-issues/): memory, tracing, and the disk prompt cache.
- [Benchmarks](/benchmarks/): measured speeds and test conditions.
- [NPU prefill](/docs/npu/): an option, off by default, that uses the Ryzen AI NPU for part of the prompt processing.
- [How it works](/docs/under-the-hood/): the features behind the speed, with the measured numbers.
