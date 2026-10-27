---
title: Supported models
description: "Models for a local LLM server on AMD Strix Halo (Ryzen AI Max+ 395) under Windows: Qwen3.8 Flash Next, and the models that Bubo has been tested with."
head:
  - tag: title
    content: "Supported models: Qwen3.8 Flash Next and more | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Supported models: Qwen3.8 Flash Next and more | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Supported models: Qwen3.8 Flash Next and more | Halowin Bubo" }
---

The model weights are not part of the Bubo package. The app downloads them after you approve the files. The page [Models supported](/models/) lists every model in the app with its download size and the options that lower memory use.

Bubo is tuned for Qwen3.8 Flash Next. It has 125B parameters with 6B active, plus a 51B n-gram embedding and a 4B MTP head (from the [Qwen model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)).

Bubo also contains the code of the other model families of [gufo](https://github.com/gufo-org/gufo): DeepSeek V4 Flash, Qwen3.6 35B-A3B, Qwen3-ASR, Qwen3-TTS, Qwen-Image and MiniMax H3. These are not tested on Windows, and the Bubo app does not download them. They run with upstream gufo settings, if at all.

Base version: gufo v0.10.0 plus upstream main at commit 97b8645f.
