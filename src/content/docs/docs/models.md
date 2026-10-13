---
title: Supported models
description: "Models for a local LLM server on AMD Strix Halo (Ryzen AI Max+ 395) under Windows: Qwen3.8 Flash Next, Qwen3.8 27B, DeepSeek V4 Flash and more."
head:
  - tag: title
    content: "Supported models: Qwen3.8 Flash Next and more | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Supported models: Qwen3.8 Flash Next and more | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Supported models: Qwen3.8 Flash Next and more | Halowin Bubo" }
---

Halowin Bubo keeps all model families of [gufo](https://github.com/gufo-org/gufo). Download the model weights separately. The weights are not part of the Bubo package.

<table>
<thead><tr><th scope="col">Model</th><th scope="col">Weights and inputs</th><th scope="col">Guide</th></tr></thead>
<tbody>
<tr><th scope="row">DeepSeek V4 Flash</th><td>Flash 0731 mixed IQ2/Q2/Q8 GGUF. Text.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/deepseek-v4-flash/README.md">Usage and modes</a></td></tr>
<tr><th scope="row">Qwen3.8 27B</th><td>Q4/Q8 GGUF. Text and images.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3.8-27b/README.md">Usage and modes</a></td></tr>
<tr><th scope="row">Qwen3.8 Flash Next</th><td>Sharded Q4 GGUF. Text and images.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3.8-flash-next/README.md">Usage and modes</a></td></tr>
<tr><th scope="row">Qwen3.6 35B-A3B</th><td>Q8 GGUF (<code>qwen35moe</code>) and fine-tunes. Text.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3.6-35b-a3b/README.md">Usage and modes</a></td></tr>
<tr><th scope="row">Qwen3-ASR 1.7B</th><td>BF16 safetensors. Audio to text.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3-asr/README.md">Usage</a></td></tr>
<tr><th scope="row">Qwen3-TTS 12Hz 1.7B</th><td>BF16 safetensors. Text and reference audio to speech.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3-tts/README.md">Voice modes</a></td></tr>
<tr><th scope="row">Qwen-Image-2.1</th><td>BF16 safetensors. Image generation and editing.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/qwen-image-2.1/README.md">Usage</a></td></tr>
<tr><th scope="row">MiniMax H3 FL2VA</th><td>Pinned safetensors. Text to audio and video.</td><td><a href="https://github.com/gufo-org/gufo/blob/main/docs/models/minimax-h3/README.md">Presets and usage</a></td></tr>
</tbody>
</table>

Bubo is tuned for Qwen3.8 Flash Next. It has 125B parameters with 6B active, plus a 51B n-gram embedding and a 4B MTP head (from the [Qwen model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)). The other models run with upstream gufo settings.

Base version: gufo v0.10.0 plus upstream main at commit 97b8645f.
