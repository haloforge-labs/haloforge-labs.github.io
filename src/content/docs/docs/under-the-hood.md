---
title: How it works
description: "How a local Qwen3.8 Flash Next server gets its speed on AMD Strix Halo: dense twin, draft head, MTP drafting, NPU prefill, disk cache and exact mode."
head:
  - tag: title
    content: "How it works: MTP drafting, NPU prefill, disk cache | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "How it works: MTP drafting, NPU prefill, disk cache | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "How it works: MTP drafting, NPU prefill, disk cache | Halowin Bubo" }
---

Bubo is tuned for one chip, AMD Strix Halo.

Bubo starts from gufo and a Windows port. The rest is added by HaloForge Labs: a 4-bit twin of the model, a draft head, an MTP drafting stack, fixes for long reasoning, an NPU prefill option, a disk cache and an exact mode. Most of it runs by default. NPU prefill is off by default. All numbers come from one 70 W Strix Halo laptop in Performance mode ([power setup](/docs/system-setup/#power-mode)).

## Janus dense twin: a 4-bit copy for decode

In an earlier build, decode ran 5.9% faster: 52.28 tok/s against 49.35 tok/s on six agent and coding prompts. The twin and the draft head together gave this gain.

Bubo keeps two copies of 252 dense weights: the original 8-bit set and a 4-bit twin. Decode and draft checking read the small twin. Prefill and `exact` mode read the original.

The name is Janus, the Roman god with two faces: the model has a second, faster copy for decode.

Pygmy owls have eye-like patches on the back of the head, a second "face". The twin follows the same idea: one copy for decode, one for prefill and `exact`.

The twin stays close to the reference. Against a 6-bit reference, the perplexity ratio is 1.0014 on agent text and 1.0050 on code. The twin agrees with the reference on the top token in 96.7% of positions (teacher-forced text check).

The twin is not byte-exact, so `exact` mode does not use it. The twin copies the tensors that Huihui abliterated (the shared-expert down projection and the SSM output projection), so it matches the Huihui `UD-Q4_K_XL` shards. A twin for the plain Unsloth shards needs its own build.

## Draft head: cheaper drafts

MTP drafts several tokens at once. The main model then checks them. Bubo gives the draft step a Q4_K copy of the output head. The main model checks every token with its original 8-bit output head.

The draft head is part of the 5.9% decode gain above. It was not measured alone. `exact` mode does not use it. It was built and tested with the Huihui shards.

## The MTP stack: up to 107.5 tok/s on code edits

On a copy-heavy code edit (a rename, greedy), MTP reaches 107.5 tok/s. On a long agent session of 31K to 37K tokens, decode runs at 68.5 tok/s (sampled, thinking on, Bubo 0.1.1 at about 70 W). See [Benchmarks](/benchmarks/).

Three parts work together:

- The survival policy sets how many tokens to draft at each step.
- Prompt lookup proposes tokens that already appeared in the conversation. It helps most when the model copies text.
- Bounded lenient acceptance accepts near-miss drafts inside the thinking text. It does not apply to the answer.

Lenient acceptance changes outputs, so `exact` mode turns all drafting off. The edit number is for one copy-heavy task. Other tasks give less.

## Fixes for long answers

In a test of 15 long answers at temperature 1.0, 14 stopped in the middle without the end-of-turn fix. With the fix, 1 stopped. Decode speed did not change.

Long reasoning can fail in three ways. Bubo has a fix for each:

- The loop breaker detects repeated text. In reasoning it first adds a nudge, then ends the thinking span if the repeat continues. In the answer it stops the answer.
- The thinking guard blocks the end-of-turn token inside an unfinished thinking span.
- The end-of-turn fix allows that token only at a text boundary, and only when it is likely enough.

Bubo also sets a thinking marker bias from the reasoning effort. Low, medium and xhigh effort use different biases.

The test used one model and 15 prompts. The loop breaker finds repeat periods up to 128 tokens in thinking and up to 16 tokens in the answer. Longer repeats in the answer can continue. See [Known issues](/docs/known-issues/).

## NPU prefill

NPU prefill is off by default. To turn it on, add `--npu-prefill on` to the server command. After the prompt-reading speed-ups in v0.1.1, it adds less than 1 %, so it stays off. Decode does not change.

The Ryzen AI chip has an NPU. With the option on, Bubo sends part of the prompt work to it while the GPU does the rest:

- The NPU job queues in the order of the GPU stream. The GPU does not wait for each NPU job.
- The NPU holds its weights (about 1.2 GB) in memory. They do not move for each job.
- The NPU takes full blocks of 4,096 prompt tokens.

Prompts under 4,096 tokens do not use the NPU. Most agent turns are shorter, so the gain shows on the first turn of a session and on large pasted files. The NPU needs the AMD NPU driver. The output is not byte-exact, so `exact` and `stock` keep it off. See [NPU prefill](/docs/npu/).

## The disk cache: faster restarts

In v0.1.0 tests, a 30K-token conversation continued after a restart in about 2 seconds. Without the cache, the prompt took about 25 seconds.

Bubo saves the computed prompt state to the disk. The cache is off by default. It writes to your SSD: a snapshot is about 954 MB for 30K tokens. See [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache).

## Exact mode: the same tokens

In the proof, `exact` mode gave the same tokens as the stock reference on 24 fixed test cases. Five exact passes and one retained pass matched in every case.

`exact` turns off everything that changes the numbers: drafting, the twin, the caches, NPU prefill and the grouped expert kernel. The proof covers one machine and one source tree. See [Profiles](/docs/profiles/#what-was-tested) for the full list.
