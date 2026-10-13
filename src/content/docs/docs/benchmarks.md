---
title: Benchmarks
description: Halowin Bubo measured benchmark results and separate estimates at 140 W.
---

Halowin Bubo on the ASUS ProArt PX13 with Radeon 8060S, about 70 W. Model: Qwen3.8 Flash Next UD-Q4_K_XL with a Q8_0 MTP draft head. Windows 11. Performance power mode. Every measured number comes from our own logs.

Tests: 8–10 October 2026. tok/s means tokens per second.


## Reasoning check: Halowin Bubo and stock gufo

Both engines answered the same 35 requests on the same laptop in Performance mode. The requests came from GPQA Diamond, AIME 2026, HMMT 2026 and IMO 2026. Both engines used the same request bodies and seeds. The score counts final answers only. An answer that never arrives counts as wrong.

<table>
<thead><tr><th scope="col">Set</th><th scope="col">Halowin Bubo correct</th><th scope="col">Stock gufo correct</th><th scope="col">Bubo decode tok/s</th><th scope="col">Stock decode tok/s</th></tr></thead>
<tbody>
<tr><th scope="row">GPQA Diamond</th><td><strong>20/24</strong></td><td>19/24</td><td><strong>58.7</strong></td><td>46.8</td></tr>
<tr><th scope="row">AIME 2026</th><td><strong>3/4</strong></td><td>2/4</td><td><strong>67.0</strong></td><td>54.2</td></tr>
<tr><th scope="row">HMMT 2026</th><td>3/4</td><td><strong>4/4</strong></td><td><strong>49.2</strong></td><td>39.8</td></tr>
<tr><th scope="row">IMO 2026 (final answer)</th><td><strong>3/3</strong></td><td>2/3</td><td><strong>51.4</strong></td><td>40.9</td></tr>
<tr><th scope="row">Total</th><td><strong>29/35</strong></td><td>27/35</td><td><strong>52.6</strong></td><td>42.6</td></tr>
</tbody>
</table>

Halowin Bubo gives the same or better accuracy than stock gufo and decodes about 24 % faster on these requests. The 95 % intervals of the two engines overlap in every set, and each set has few items. Read the result as "no loss of accuracy", not as "more accurate".

Stock gufo ended 3 requests without a final answer. Halowin Bubo ended 1: a long repeating loop that its next build cuts short.

AIME item 29 (aime26-29): the first run, on an earlier build, repeated text until the context limit. A re-run on the release build answered in 70,776 tokens, and the answer was wrong. The table keeps the first run. The re-run does not change the totals.

Decode speed is the total completion tokens divided by the engine decode seconds, on the requests that ran in Performance mode on both engines (33 of 35 for the total; AIME uses 2 of 4). The first table scores the IMO final answer only.

### IMO 2026 write-ups

Halowin Bubo solves IMO 2026 P4 and P5. A model judge (GPT-6.1 Sol) gave full marks (7/7) to its P4 write-up and to one of its two P5 write-ups. The judge graded the final write-up only, on a scale of 0 to 7. The prompts asked for the final answer, not a proof.

<table>
<thead><tr><th scope="col">Problem and seed</th><th scope="col">Halowin Bubo (0–7)</th><th scope="col">Stock gufo (0–7)</th></tr></thead>
<tbody>
<tr><th scope="row">P4</th><td>7</td><td>7</td></tr>
<tr><th scope="row">P5, seed 1001</th><td>7</td><td>7</td></tr>
<tr><th scope="row">P5, seed 1002</th><td>2</td><td>3</td></tr>
<tr><th scope="row">Sum</th><td>16/21</td><td>17/21</td></tr>
</tbody>
</table>

The sums differ by one point. That is within noise. The final-answer count in the first table is the reverse (Bubo 3/3, stock 2/3). Three write-ups per engine are too few to rank the two engines.

## Real work

<table>
<thead><tr><th scope="col">Workload</th><th scope="col">Measured tok/s</th><th scope="col">Conditions and date</th></tr></thead>
<tbody>
<tr><th scope="row">Real coding-agent sessions</th><td><strong>51.6</strong></td><td>90 requests, 28K–70K context. Temperature 1.0, thinking on. Converted public sessions, not synthetic prompts. 2026-10-10.</td></tr>
<tr><th scope="row">Long-context agent decode</th><td><strong>51–55</strong></td><td>Real sessions chained from 28K to 189K tokens. One to three sessions. 2026-10-08.</td></tr>
<tr><th scope="row">Cold agent prompt prefill</th><td><strong>1,190</strong></td><td>First prompt, 28K tokens. 2026-10-08.</td></tr>
</tbody>
</table>

## Standard formats

<table>
<thead><tr><th scope="col">Workload</th><th scope="col">Measured tok/s</th><th scope="col">Conditions and date</th></tr></thead>
<tbody>
<tr><th scope="row">Prefill pp2048, plain</th><td><strong>1,325</strong></td><td>Upstream’s prompt recipe, greedy. Median of five runs. 2026-10-10.</td></tr>
<tr><th scope="row">Prefill pp2048, MTP</th><td><strong>1,325</strong></td><td>Same prompt recipe, MTP drafting. Median. 2026-10-10.</td></tr>
<tr><th scope="row">Decode tg128, plain</th><td><strong>27.8</strong></td><td>Upstream’s benchmark program, greedy. Median. 2026-10-10.</td></tr>
<tr><th scope="row">Decode tg128, MTP</th><td><strong>34.5</strong></td><td>Same program, MTP drafting. Median of five runs. 2026-10-10.</td></tr>
<tr><th scope="row">Natural-text prefill, 2K / 8K / 32K</th><td><strong>1,288 / 1,201 / 1,268</strong></td><td>Research-notes text. Median of three runs. 2026-10-10.</td></tr>
<tr><th scope="row">Six short greedy prompts</th><td><strong>54.2</strong></td><td>Mean across six probes with the production launcher. 2026-10-10.</td></tr>
<tr><th scope="row">Copy-heavy code edit</th><td><strong>Up to 93.8</strong></td><td>85.9 on the first request; 93.8 on the second request with the same prompt cached. Rename-and-rewrite task, prompt lookup + MTP. Greedy, thinking on. Lookup acceptance: 99%. 2026-10-10.</td></tr>
<tr><th scope="row">Prose decode</th><td><strong>59–60</strong></td><td>Greedy, thinking on, 3,000 tokens. 2026-10-10.</td></tr>
</tbody>
</table>

## Many users

Combined decode speed with several users at the same time. Upstream gufo’s own benchmark program, 4K context per user, thinking off, Performance mode, about 70 W. For 4 and 8 users: median of six runs, with the range in brackets. 2026-10-12.

<table>
<thead><tr><th scope="col">Users</th><th scope="col">Halowin Bubo, plain decode</th><th scope="col">Halowin Bubo, MTP</th><th scope="col">Upstream gufo, plain decode</th><th scope="col">Upstream gufo, MTP</th></tr></thead>
<tbody>
<tr><th scope="row">1</th><td>27.7</td><td><strong>37.4</strong></td><td>25.84</td><td>31.28</td></tr>
<tr><th scope="row">4</th><td>74.3 (73.4–75.7)</td><td><strong>79.2</strong> (74.9–82.8)</td><td>76.33</td><td>76.16</td></tr>
<tr><th scope="row">8 (about 70 W against upstream full power)</th><td>102.2 (101.8–103.7)</td><td>about 100–107</td><td>108.68</td><td>107.77</td></tr>
</tbody>
</table>

Upstream figures are the numbers published in the gufo repository. With MTP, the speed depends on how many draft tokens are accepted, and this changes between starts of the same server. At 8 users, identical starts gave about 100 to 107 tok/s with identical outputs, so the table shows a range. Read the 4-user MTP result as level with upstream. At 1 user, Halowin Bubo with MTP is ahead. The upstream figures come from full-power hardware; the Halowin Bubo figures come from a laptop at about 70 W.

Free host memory affects speed. These numbers were measured with more than 11 GiB of memory available. In one run with 5 GiB available, plain decode at 4 users was 4.5 % lower.


## Estimated at 140 W

These are estimates. They are not measurements at 140 W.

<table>
<thead><tr><th scope="col">Workload</th><th scope="col">Estimated tok/s at 140 W</th><th scope="col">Method and date</th></tr></thead>
<tbody>
<tr><th scope="row">Prefill pp2048, plain</th><td><strong>1,617–1,762</strong></td><td>Two-point laptop power fit. 2026-10-10.</td></tr>
<tr><th scope="row">Decode tg128, MTP</th><td><strong>35.9–36.9</strong></td><td>Two-point laptop power fit. 2026-10-10.</td></tr>
<tr><th scope="row">Real agent decode</th><td><strong>53.7–55.2</strong></td><td>Two-point laptop power fit. 2026-10-10.</td></tr>
<tr><th scope="row">Single-user real agent decode</th><td><strong>52–58</strong></td><td>Separate power-scaling research range. 2026-10-10.</td></tr>
</tbody>
</table>

<p class="benchmark-small-print">The first three rows are estimated at 140 W from a two-point power fit on this laptop; not measured. The fit uses about 70 W and 95 W. Memory bandwidth does not scale with power. The high end uses the larger fitted gain. The last row is a separate estimate from power-scaling research; not measured.</p>

At 140 W, Halowin Bubo is estimated at **1,617–1,762 tok/s prefill (pp2048)**, level with upstream’s published rate. Upstream gufo publishes **1,700 tok/s on full-power Strix Halo hardware**. This comparison uses gufo v0.10.0 plus main at commit 97b8645f, the base of Halowin Bubo.

## Same-protocol comparisons

<table>
<thead><tr><th scope="col">Protocol</th><th scope="col">Result</th><th scope="col">Conditions and date</th></tr></thead>
<tbody>
<tr><th scope="row">Upstream pp2048 / tg128 program</th><td>Halowin Bubo and stock upstream gufo gave the same speed within test noise.</td><td>Same laptop, files, and commands. Paired test on 2026-10-10.</td></tr>
</tbody>
</table>

## Conditions

<table>
<thead><tr><th scope="col">Item</th><th scope="col">Test condition</th></tr></thead>
<tbody>
<tr><th scope="row">System</th><td>ASUS ProArt PX13, Radeon 8060S, Windows 11, Performance mode.</td></tr>
<tr><th scope="row">Model</th><td>Qwen3.8 Flash Next, GGUF, UD-Q4_K_XL, Q8_0 MTP draft head.</td></tr>
<tr><th scope="row">Measured power</th><td>Mean GPU power: about 70–71 W.</td></tr>
<tr><th scope="row">Real-session rows</th><td>Converted public coding-agent sessions. Temperature 1.0, thinking on.</td></tr>
<tr><th scope="row">Benchmark-program rows</th><td>Greedy decode. Upstream’s pp2048 / tg128 program uses about 2,040 prompt tokens and 128 new tokens.</td></tr>
<tr><th scope="row">Units</th><td>tok/s = tokens per second. Prefill reads the prompt. Decode generates the output.</td></tr>
<tr><th scope="row">Estimates</th><td>All 140 W results are estimates. No 140 W run was measured on this laptop.</td></tr>
</tbody>
</table>
