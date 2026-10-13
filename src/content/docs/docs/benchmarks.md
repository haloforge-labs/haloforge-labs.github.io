---
title: Benchmarks
description: "Qwen3.8 Flash Next speed on AMD Strix Halo (Ryzen AI Max+ 395) at 70 W under Windows: decode and prefill tok/s, reasoning checks, engine comparison."
head:
  - tag: title
    content: "Benchmarks: Strix Halo decode and prefill tok/s | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Benchmarks: Strix Halo decode and prefill tok/s | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Benchmarks: Strix Halo decode and prefill tok/s | Halowin Bubo" }
---

Halowin Bubo on the ASUS ProArt PX13 with Radeon 8060S. Every number comes from a 13-inch laptop at its normal plugged-in Performance setting, approximately 70 W. That is full-speed local inference at laptop power: about half of what a desktop Strix Halo draws, so less heat and fan noise than a desktop or an overclocked laptop, on a machine you can carry. [How to reach this power](/docs/system-setup/#power-mode). Desktops and Manual mode have more headroom: see the [140 W estimate](#estimated-at-140-w). Model: Qwen3.8 Flash Next UD-Q4_K_XL with a Q8_0 MTP draft head. Windows 11. Performance power mode. Every measured number comes from our own logs.

Tests: 8–12 October 2026. tok/s means tokens per second.


## Reasoning check: Halowin Bubo and gufo (pixmaate’s Windows port)

Both engines answered the same 35 requests on the same laptop in Performance mode. The requests came from GPQA Diamond, AIME 2026, HMMT 2026 and IMO 2026. Both engines used the same request bodies and seeds. The score counts final answers only. An answer that never arrives counts as wrong.

<table>
<thead><tr><th scope="col">Set</th><th scope="col">Halowin Bubo correct</th><th scope="col">gufo (pixmaate’s Windows port) correct</th><th scope="col">Bubo decode tok/s</th><th scope="col">gufo (pixmaate’s Windows port) decode tok/s</th></tr></thead>
<tbody>
<tr><th scope="row">GPQA Diamond</th><td><strong>20/24</strong></td><td>19/24</td><td><strong>58.7</strong></td><td>46.8</td></tr>
<tr><th scope="row">AIME 2026</th><td><strong>3/4</strong></td><td>2/4</td><td><strong>67.0</strong></td><td>54.2</td></tr>
<tr><th scope="row">HMMT 2026</th><td>3/4</td><td><strong>4/4</strong></td><td><strong>49.2</strong></td><td>39.8</td></tr>
<tr><th scope="row">IMO 2026 (final answer)</th><td><strong>3/3</strong></td><td>2/3</td><td><strong>51.4</strong></td><td>40.9</td></tr>
<tr><th scope="row">Total</th><td><strong>29/35</strong></td><td>27/35</td><td><strong>52.6</strong></td><td>42.6</td></tr>
</tbody>
</table>

Halowin Bubo gives the same or better accuracy than gufo (pixmaate’s Windows port) and decodes about 24% faster on these requests. The 95% intervals of the two engines overlap in every set, and each set has few items. Read the result as "no loss of accuracy", not as "more accurate".

In the gufo run (pixmaate’s Windows port), 3 requests ended without a final answer. In the Halowin Bubo run, 1 did: a long repeating loop that its next build cuts short.

### Tokens used

Completion tokens are the tokens each engine generated, reasoning included, for the same 35 requests.

<table>
<thead><tr><th scope="col">Set</th><th scope="col">Requests</th><th scope="col">Halowin Bubo tokens (per request)</th><th scope="col">gufo (pixmaate’s Windows port) tokens (per request)</th></tr></thead>
<tbody>
<tr><th scope="row">GPQA Diamond</th><td>24</td><td>102,707 (4,279)</td><td>144,531 (6,022)</td></tr>
<tr><th scope="row">AIME 2026</th><td>4</td><td>424,762 (106,190)</td><td>168,862 (42,216)</td></tr>
<tr><th scope="row">HMMT 2026</th><td>4</td><td>203,936 (50,984)</td><td>152,039 (38,010)</td></tr>
<tr><th scope="row">IMO 2026 (final answer)</th><td>3</td><td>148,449 (49,483)</td><td>146,603 (48,868)</td></tr>
<tr><th scope="row">Total</th><td>35</td><td>879,854 (25,139)</td><td>612,035 (17,487)</td></tr>
</tbody>
</table>

Halowin Bubo used more tokens in total. One request, AIME item 29, repeated text until the context limit and used 261,913 tokens. Without it, Halowin Bubo used 617,941 tokens over 34 requests (18,175 per request), close to the other engine. On GPQA Diamond, Halowin Bubo used fewer tokens.

AIME item 29 (aime26-29): the first run, on an earlier build, repeated text until the context limit. A re-run on the release build answered in 70,776 tokens, and the answer was wrong. The table keeps the first run. The re-run does not change the totals.

Decode speed is the total completion tokens divided by the engine decode seconds, on the requests that ran in Performance mode on both engines (33 of 35 for the total; AIME uses 2 of 4). The first table scores the IMO final answer only.

### IMO 2026 write-ups

Halowin Bubo solves IMO 2026 P4 and P5. A model judge (GPT-6.1 Sol) gave full marks (7/7) to its P4 write-up and to one of its two P5 write-ups. The judge graded the final write-up only, on a scale of 0 to 7. The prompts asked for the final answer, not a proof.

<table>
<thead><tr><th scope="col">Problem and seed</th><th scope="col">Halowin Bubo (0–7)</th><th scope="col">gufo (pixmaate’s Windows port) (0–7)</th></tr></thead>
<tbody>
<tr><th scope="row">P4</th><td>7</td><td>7</td></tr>
<tr><th scope="row">P5, seed 1001</th><td>7</td><td>7</td></tr>
<tr><th scope="row">P5, seed 1002</th><td>2</td><td>3</td></tr>
<tr><th scope="row">Sum</th><td>16/21</td><td>17/21</td></tr>
</tbody>
</table>

The sums differ by one point. That is within noise. The final-answer count in the first table is the reverse (Bubo 3/3, gufo 2/3). Three write-ups per engine are too few to rank the two engines.

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
<tr><th scope="row">Prefill pp2048, without MTP</th><td><strong>1,364</strong></td><td>Upstream’s prompt recipe, greedy. Median of 3. Release build v0.1.0. 2026-10-12.</td></tr>
<tr><th scope="row">Prefill pp2048, MTP</th><td><strong>1,218</strong></td><td>Same prompt recipe, MTP drafting. Median of 3. Release build v0.1.0. 2026-10-12. The MTP server also prefills the draft head.</td></tr>
<tr><th scope="row">Decode tg128, without MTP</th><td><strong>32.19</strong></td><td>Upstream’s benchmark program, greedy. Median of 3. Release build v0.1.0. 2026-10-12.</td></tr>
<tr><th scope="row">Decode tg128, MTP</th><td><strong>37.15</strong></td><td>Same program, MTP drafting. Median of 3. Release build v0.1.0. 2026-10-12.</td></tr>
<tr><th scope="row">Natural-text prefill, 2K / 8K / 32K</th><td><strong>1,240 / 1,292 / 1,287</strong></td><td>Research-notes text. Median of 2 to 3 rounds. Release build v0.1.0. 2026-10-12.</td></tr>
<tr><th scope="row">Six short greedy prompts</th><td><strong>54.2</strong></td><td>Mean across six probes with the production launcher. 2026-10-10.</td></tr>
<tr><th scope="row">Copy-heavy code edit</th><td><strong>Up to 97.4</strong></td><td>96.5 on the first request; 97.4 on the second request with the same prompt cached. Rename-and-rewrite task, prompt lookup + MTP, release build v0.1.0. Lookup acceptance: 99%. 2026-10-12. The same run is in the comparison table below.</td></tr>
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

Free host memory affects speed. These numbers were measured with more than 11.8 GB of memory available. In one run with 5.4 GB available, plain decode at 4 users was 4.5% lower.


## Estimated at 140 W

These are estimates. They are not measurements at 140 W.

<table>
<thead><tr><th scope="col">Workload</th><th scope="col">Measured at 70 W</th><th scope="col">Estimated tok/s at 140 W</th><th scope="col">Method and date</th></tr></thead>
<tbody>
<tr><th scope="row">Prefill pp2048, without MTP</th><td>1,364</td><td><strong>1,665–1,814</strong></td><td>70 W measurement times the gain of the power fit (1.22 to 1.33). Release build v0.1.0. 2026-10-12.</td></tr>
<tr><th scope="row">Decode tg128, MTP</th><td>37.15</td><td><strong>38.7–39.7</strong></td><td>70 W measurement times the gain of the power fit (1.04 to 1.07). Release build v0.1.0. 2026-10-12.</td></tr>
</tbody>
</table>

<p class="benchmark-small-print">The gains come from a two-point power fit on this laptop at about 70 W and 95 W. Memory bandwidth does not scale with power. The high end uses the larger fitted gain. These rows are estimated at 140 W; not measured.</p>

At 140 W, Halowin Bubo is estimated at **1,665–1,814 tok/s prefill (pp2048)**, level with upstream’s published rate. Upstream gufo publishes **1,700 tok/s on full-power Strix Halo hardware**.

## Where the speed comes from

Three tests give three different gains, because they measure different things.

<table>
<thead><tr><th scope="col">Test</th><th scope="col">Gain</th><th scope="col">What differs between the two runs</th></tr></thead>
<tbody>
<tr><th scope="row">Upstream pp2048 and tg128 program</th><td>None. Same speed.</td><td>Only the kernels. The twin, the draft head, prompt lookup, the survival policy, draft vocabulary trimming, lenient acceptance and the behavior set are off in both runs. MTP is on in both MTP columns.</td></tr>
<tr><th scope="row">Six task probes, 49.35 to 52.28 tok/s</th><td>+5.9% decode</td><td>The twin and the draft head. Both runs use the full MTP stack (survival policy, prompt lookup, draft vocabulary trimming).</td></tr>
<tr><th scope="row">35 long reasoning requests, 42.60 to 52.64 tok/s</th><td>About +24% decode</td><td>The whole stack against plain upstream MTP. That run used upstream defaults with MTP: length policy, full draft vocabulary, no prompt lookup, no twin or draft head, no lenient acceptance, no behavior set.</td></tr>
</tbody>
</table>

The first test shows that Bubo does not slow the kernels down. The other two show what the extra features add. Long generations gain most, because prompt lookup and the draft policies pay off the more the model writes. The 24% figure is token-weighted decode on the requests that ran in Performance mode on both engines.

## Same-protocol comparisons

<table>
<thead><tr><th scope="col">Protocol</th><th scope="col">Result</th><th scope="col">Conditions and date</th></tr></thead>
<tbody>
<tr><th scope="row">Upstream pp2048 / tg128 program</th><td>Halowin Bubo and gufo (pixmaate’s Windows port) gave the same speed within test noise: prefill 1,372 against 1,363 tok/s, and decode with MTP 35.48 against 35.39 tok/s.</td><td>Same laptop, files, and commands. Paired test on 2026-10-10.</td></tr>
</tbody>
</table>

## Same-laptop comparison: Rulith (tuned llama.cpp fork), gufo and Halowin Bubo

<table>
<thead><tr><th scope="col">Test, tok/s</th><th scope="col">Rulith 0.5.7 (tuned llama.cpp fork, batch 4096)</th><th scope="col">gufo (pixmaate’s Windows port)</th><th scope="col">Bubo v0.1.0</th></tr></thead>
<tbody>
<tr><th scope="row">Model files</th><td>Unsloth UD-IQ4_XS, mmproj-F16, own draft</td><td>Huihui UD-Q4_K_XL, shared Q8_0 MTP</td><td>Huihui UD-Q4_K_XL, shared Q8_0 MTP, twin, draft head</td></tr>
<tr><th scope="row">Prefill pp2048, without / with MTP</th><td>1,183 / 1,164</td><td>1,227 / 1,203</td><td>1,364 / 1,218</td></tr>
<tr><th scope="row">Prefill, natural text, 2K / 8K / 32K</th><td>1,117 / 1,126 / 796</td><td>1,196 / 1,156 / 1,126</td><td>1,240 / 1,292 / 1,287</td></tr>
<tr><th scope="row">Decode tg128, without / with MTP</th><td>26.83 / 35.69</td><td>27.21 / 34.06</td><td>32.19 / 37.15</td></tr>
<tr><th scope="row">Decode tg128, no speculation</th><td>27.75</td><td>28.67</td><td>32.69</td></tr>
<tr><th scope="row">Six agent, code and prose requests, thinking on, temperature 1.0</th><td>44.5</td><td>39.6</td><td>59.1</td></tr>
<tr><th scope="row">Code edit that renames, first / second request</th><td>58.0 / 58.4</td><td>60.1 / 60.5</td><td>96.5 / 97.4</td></tr>
<tr><th scope="row">Code edit that changes a comment, first / second request</th><td>56.0 / 56.1</td><td>54.0 / 54.3</td><td>90.8 / 91.3</td></tr>
<tr><th scope="row">Prose, first / second request</th><td>33.9 / 35.0</td><td>44.5 / 45.5</td><td>43.9 / 44.1</td></tr>
</tbody>
</table>

Same laptop, about 70 W, one pass per engine, measured on 12 and 13 October 2026.

The gufo column is pixmaate’s Windows port, release `windows-2026-10-03`. It is the newest Windows build that exists: the newest gufo release has no Windows port.

Lookup drafting is in Bubo only.

## Test conditions

<table>
<thead><tr><th scope="col">Item</th><th scope="col">Test condition</th></tr></thead>
<tbody>
<tr><th scope="row">Dates</th><td>8 to 13 October 2026.</td></tr>
<tr><th scope="row">System</th><td>ASUS ProArt PX13, Radeon 8060S, Windows 11, Performance mode.</td></tr>
<tr><th scope="row">Model</th><td>Qwen3.8 Flash Next, GGUF, UD-Q4_K_XL, Q8_0 MTP draft head.</td></tr>
<tr><th scope="row">Measured power</th><td>Mean GPU power: about 70–71 W.</td></tr>
<tr><th scope="row">Real-session rows</th><td>Converted public coding-agent sessions. Temperature 1.0, thinking on.</td></tr>
<tr><th scope="row">Benchmark-program rows</th><td>Greedy decode. Upstream’s pp2048 / tg128 program uses about 2,040 prompt tokens and 128 new tokens.</td></tr>
<tr><th scope="row">Units</th><td>tok/s = tokens per second. Prefill reads the prompt. Decode generates the output.</td></tr>
<tr><th scope="row">Estimates</th><td>All 140 W results are estimates. No 140 W run was measured on this laptop.</td></tr>
</tbody>
</table>
