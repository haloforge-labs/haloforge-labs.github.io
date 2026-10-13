---
title: Halowin Bubo docs
description: System settings and guides for Halowin Bubo on Windows.
---

Halowin Bubo is a fork of [gufo](https://github.com/gufo-org/gufo), the open-source LLM server under the MIT license. It runs on native Windows with AMD HIP. It is tuned for AMD Strix Halo laptops at about 70 W and for Windows users in general.

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
