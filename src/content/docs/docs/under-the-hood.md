---
title: Under the hood
description: "How a local Qwen3.8 Flash Next server gets its speed on AMD Strix Halo: dense twin, draft head, MTP drafting, NPU prefill, disk cache and exact mode."
head:
  - tag: title
    content: "Under the hood: MTP drafting, NPU prefill, disk cache | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Under the hood: MTP drafting, NPU prefill, disk cache | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Under the hood: MTP drafting, NPU prefill, disk cache | Halowin Bubo" }
---

One chip. One package. Every layer tuned for it.

Bubo starts from gufo and a Windows port. The rest is our work: a 4-bit twin of the model, a draft head, an MTP drafting stack, fixes for long reasoning, NPU prefill, a disk cache and an exact mode. Most of it runs by default. All numbers come from one Strix Halo laptop in Performance mode ([power setup](/docs/system-setup/#power-mode)).

## Janus: a second face for decode

Decode runs 5.9% faster: 52.28 tok/s against 49.35 tok/s on six agent and coding prompts. The twin and the draft head together give this gain.

Bubo keeps two copies of 252 dense weights: the original 8-bit set and a 4-bit twin, named after the two-faced god Janus. Decode and draft checking read the small twin. Prefill and `exact` mode read the original.

Pygmy owls wear a second face on the back of the head: two dark spots that look like eyes. In a model study, owl decoys with the false eyes drew fewer close approaches from behind. The twin is the same idea. One face serves decode. The real face serves prefill and `exact`.

The twin stays close to the reference. Against a 6-bit reference, the perplexity ratio is 1.0014 on agent text and 1.0050 on code. The twin agrees with the reference on the top token in 96.7% of positions (teacher-forced text check).

The twin is not byte-exact, so `exact` mode does not use it. The twin copies the tensors that Huihui abliterated (the shared-expert down projection and the SSM output projection), so it matches the Huihui `UD-Q4_K_XL` shards. A twin for the plain Unsloth shards needs its own build.

## Draft head: cheaper drafts

MTP drafts several tokens at once. The main model then checks them. Bubo gives the draft step a Q4_K copy of the output head. The main model checks every token with its original 8-bit output head.

The draft head is part of the 5.9% decode gain above. We did not measure it alone. `exact` mode does not use it. We built and tested it with the Huihui shards.

## The MTP stack: up to 97.4 tok/s on code edits

Decode at 128 tokens runs at 37.15 tok/s with MTP and 32.19 tok/s without MTP (release build v0.1.0, upstream’s benchmark program). On a copy-heavy code edit, MTP reaches 97.4 tok/s on the second request, with the prompt cached. The first request runs at 96.5 tok/s. On real coding-agent sessions of 28K to 70K tokens, decode runs at 51.6 tok/s.

Three parts work together:

- The survival policy sets how many tokens to draft at each step.
- Prompt lookup proposes tokens that already appeared in the conversation. It helps most when the model copies text.
- Bounded lenient acceptance accepts near-miss drafts inside the thinking text. It does not apply to the answer.

Lenient acceptance changes outputs, so `exact` mode turns all drafting off. The edit number is for one copy-heavy task. Other tasks give less.

## Long answers that finish

In a test of 15 long answers at temperature 1.0, 14 stopped in the middle without the end-of-turn fix. With the fix, 1 stopped. Decode speed did not change.

Long reasoning can fail in three ways. Bubo has a fix for each:

- The loop breaker finds repeated text and moves the model on.
- The thinking guard blocks the end-of-turn token inside an unfinished thinking span.
- The end-of-turn fix allows that token only at a text boundary, and only when it is likely enough.

Bubo also sets a thinking marker bias from the reasoning effort. Low, medium and xhigh effort use different biases.

The test used one model and 15 prompts. The loop breaker finds repeat periods up to 128 tokens in thinking and up to 16 tokens in the answer. Longer repeats in the answer can continue. See [Known issues](/docs/known-issues/).

## NPU prefill: the GPU keeps working

Prefill runs about 5 to 7% faster on an 8K-token prompt and about 3.5 to 5.5% faster on a 16K-token prompt. Decode does not change.

The Ryzen AI chip has an NPU. Bubo sends part of the prompt work to it while the GPU does the rest:

- The NPU job queues in the order of the GPU stream. The GPU keeps working instead of stopping to wait for each NPU job.
- The NPU keeps its weights (about 1.2 GB) in memory. They do not move for each job.
- The NPU takes full blocks of 4,096 prompt tokens.

Prompts under 4,096 tokens do not use the NPU. Most agent turns are shorter, so the gain shows on the first turn of a session and on large pasted files. The NPU needs the AMD NPU driver. The output is not byte-exact, so `exact` and `stock` turn it off. See [NPU prefill](/docs/npu/).

## The disk cache: seconds, not minutes

A 30K-token conversation continues after a restart in about 2 seconds. Without the cache, the prompt takes about 25 seconds. A 109K-token conversation continues in 3.5 seconds instead of 88.8 seconds.

Bubo saves the computed prompt state to the disk. The cache is off by default. It writes to your SSD: a snapshot is about 954 MB for 30K tokens. See [Fast restarts with the disk cache](/docs/quickstart/#fast-restarts-with-the-disk-cache).

## Exact mode: the same tokens

In our proof, `exact` mode gave the same tokens as the stock reference on 24 fixed test cases. Five exact passes and one retained pass matched in every case.

`exact` turns off everything that changes the numbers: drafting, the twin, the caches, NPU prefill and the grouped expert kernel. The proof covers one machine and one source tree. See [Profiles](/docs/profiles/#what-was-tested) for the full list.

## Many users at once

With 8 users and 4K of context each, plain decode gives 102.2 tok/s in total (range 101.8 to 103.7). With MTP, the total is about 100 to 107 tok/s. One real coding agent decodes at 51.6 tok/s.

These are combined speeds for all users, not per user. The MTP total changes between starts because the number of accepted drafts changes. Free host memory also affects speed. See [Benchmarks](/docs/benchmarks/#many-users).
