---
title: System setup
description: "Set GPU memory, page file, power mode and driver on an AMD Strix Halo laptop for a local LLM server on Windows, and check that each setting took effect."
head:
  - tag: title
    content: "Windows and BIOS setup for AMD Strix Halo | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Windows and BIOS setup for AMD Strix Halo | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Windows and BIOS setup for AMD Strix Halo | Halowin Bubo" }
---

**Supported hardware:** Bubo is built and tested for AMD Strix Halo with 128 GB of memory on Windows, mainly laptops. It can work on other machines, with no promise.

**96 GB machines:** use the lower-memory model. Set Variable Graphics Memory (AMD Software: Adrenalin Edition > Performance > Tuning) to the largest value offered (72 GB if available, at least 64 GB), then restart Windows. At 72 GB, Bubo uses the default 200,000-token context for one session. At 64 GB it does too when about 16 GB of system memory is free, and picks a smaller context when less is free. These values are calculated: Bubo has not yet run on a 96 GB machine.

Use these settings for an AMD Strix Halo laptop. Each section gives the reason for the setting and a read-only check.

## Check everything with one command

Run `.\bubo.exe diagnose --section gpu` in the `bin` folder of the package. The `gpu` line must show `Detected: gfx1151` and a `[supported]` verdict.

From v0.1.1, `bubo diagnose` also shows three rows for the settings below:

- `gpu_reservation` warns when the GPU memory reservation is less than 96 GB.
- `page_file` warns when no page file is set, or when the page file is not a fixed size.
- `power_mode` shows the Windows power mode. It is a reading and never a warning, because the Windows value does not show the profile that the laptop control app sets.

A row is absent when Bubo cannot read the setting. `bubo serve` writes one `WARN` line at the start when the GPU reservation or the page file differs. A warning does not change the exit code and does not stop the server. Use the checks in each section to confirm a setting.

## GPU memory

Set GPU memory to **96 GB** in the BIOS or in Armoury Crate. The setting can have the name “UMA frame buffer size” or “carve-out”. Armoury Crate is an ASUS program. On other Strix Halo machines, use the BIOS setting or the tool of the maker of your machine.

Why: the GPU holds the model, the dense twin and the draft head, the context cache and the compute buffers. The model files are 111 GB on disk, and the twin and the draft head add 1.6 GB. With one session at the default context of 200,000 tokens, Bubo 0.1.1 estimates about 91 GiB of GPU memory for the standard Q4 model. `bubo models estimate` prints the estimate for any model.

The rest of the 128 GB stays with Windows. It holds your applications and the host memory of the server: the server process (about 4.5 GB), the RAM snapshot cache (8.6 GB by default) and the disk-cache staging area (5.4 GB, only when you turn on the disk cache). Free host memory affects speed. More than two sessions at 262,144 tokens do not fit in 32 GB of host memory. Only the 96 GB setting was tested, so other splits are untested.

Check that it took effect:

1. Open Task Manager, then **Performance**, then **GPU**. **Dedicated GPU memory** must show about 96 GB.
2. Run this command in PowerShell. Windows must show about 32 GB of memory.

```powershell
(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
```

## Memory guard

Bubo keeps free memory above a floor of 4,096 MiB. It checks this before it starts a request, and while requests run. The guard looks at the memory of the whole machine, so it also counts the memory that your other applications use. The server writes `event=memory_guard action=enabled` to the log at the start.

**Before a request starts.** A request that needs new memory, and cannot get it above the floor, is refused. Bubo needs new memory for image buffers that are not yet in memory, for scratch memory and for a prompt-scoring session. Before Bubo refuses a request, it drops saved cache snapshots to make room. A plain text chat needs no new memory: Bubo serves it, and skips the cache snapshots that would take free memory below the floor.

A refused request gets one of two errors:

- HTTP 503, `code` `insufficient_memory`, and a `Retry-After` header of 5 seconds. The shortage is temporary. Free memory, then send the request again. The message reads: "not enough free memory to start this request: it needs about X GiB; Y GiB is free above the Z GiB keep-free floor. Free memory and retry."
- HTTP 507, `code` `insufficient_memory_permanent`, and no `Retry-After` header. The computer can never give this memory, so a retry does not help. The message ends with: "Shorten the prompt or remove the image."

**While requests run.** Bubo reads the memory of the machine twice a second.

- Free memory below the floor: Bubo reports it in the log (`action=level level=soft`). Each cache snapshot that would take free memory below the floor is skipped.
- Windows reports low memory, or the GPU memory budget is used up: Bubo stops saving new snapshots and drops the saved snapshots, step by step (`action=trim_snapshots`).
- Memory is still low 2 seconds later and no snapshot is left to drop: Bubo stops one running request at a time (`action=cancel`). The stopped request gets HTTP 503, `code` `memory_pressure`, and a `Retry-After` header of 5 seconds.
- Windows no longer reports low memory for 5 seconds: the pause ends (`action=level level=ok reason=recovered`).

Bubo does not touch anything outside its own process.

If Bubo refuses or stops a request, use one of these actions:

- Close applications that use much memory, then send the request again.
- Send a shorter prompt, or remove the image.
- Use fewer sessions.

At the start, `bubo serve` stops with an error (`memory_insufficient` in the machine-readable output) when the sessions at the chosen context do not fit in the free GPU memory plus all available RAM. Use fewer `--sessions` or a smaller `--context`. If the sessions fit only with part of their state in system RAM, the server starts and writes a warning with `action=load_spill`.

To turn the guard off, set `GUFO_CACHE_HOST_FLOOR_MB=0`. This also turns off the floor of the RAM snapshot cache. A negative value, or a value that is not a number, also turns it off, and the log shows one `action=disabled` line. If Windows gives no low-memory signal, the log shows `action=signal_unavailable` once, and the other checks still work.

## Page file

Set a fixed page file of **128 GB** on the system drive. Set both the initial size and the maximum size to **131072 MB**.

Why: Windows counts GPU memory against its commit limit, about 1 byte of commit for each byte of GPU memory (measured on the test laptop). The commit limit is the memory that Windows sees plus the page files. With 96 GB set as GPU memory, Windows sees only about 32 GB, so a large page file gives the headroom. Windows writes little to the page file (about 3.9 GB in use in the measurement). Without the headroom, the commit charge reached 98% to 99% of the limit and gave stalls, failed allocations and aborted starts.

Check that it took effect:

```powershell
Get-CimInstance Win32_PageFileSetting | Select-Object Name, InitialSize, MaximumSize
Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize, CurrentUsage
```

The first command must show `InitialSize` and `MaximumSize` of 131072, and the second must show `AllocatedBaseSize` of 131072. If the first command prints nothing, Windows manages the page file automatically. You can also open **System Properties**, **Advanced**, **Performance Settings**, **Advanced**, **Virtual memory**.

## Power mode

Use the full-power adapter and the **Performance** profile. Every speed number on this site comes from a 13-inch laptop at this setting: full-speed inference at laptop power, approximately 70 W on the GPU.

How to reach it:

1. Plug in the laptop's own full-power adapter (the ASUS 200 W adapter on the ProArt PX13). Do not use a USB-C dock. A dock cannot hold full power under sustained load.
2. Set the performance profile of your maker. On ASUS laptops, open Armoury Crate and choose **Performance**. On other brands, use the equivalent profile.
3. Set the Windows power mode to **Best performance**.

Why: the profile sets the power limit of the chip. Quiet profiles such as Whisper, and battery power, cap the power lower and run slower.

Check that it took effect: run a long generation and watch the GPU power in the AMD Adrenalin metrics overlay or in HWiNFO.

- The first 6 seconds or so read higher, 74 to 83 W. This is the boost after an idle gap.
- After that, GPU power must hold approximately 70 W, at a clock of about 2,030 to 2,200 MHz.
- A lower value means a quiet profile, battery power or a dock.

Manual mode on the same laptop can go higher (SPL 85 W, SPPT 95 W, fans at 100%). About 95 W on the GPU and a clock 11% higher were measured. Bubo was not tested in Manual mode. Desktop Strix Halo machines run up to about 140 W: see the [140 W estimate](/benchmarks/#power).

## Graphics driver

Use AMD graphics driver **32.0.31041.1004 (2026-08-16) or newer**.

Why: this is the driver of the tests. Older drivers are untested.

Check that it took effect:

```powershell
Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion, DriverDate
```

`DriverVersion` must show 32.0.31041.1004 or newer. You can also read the version in AMD Software: Adrenalin Edition, **System**.

## Windows

Use **Windows 11**. Halowin Bubo was tested on **build 26200**.

Check that it took effect: run `winver`, or run this command.

```powershell
(Get-CimInstance Win32_OperatingSystem).BuildNumber
```

## Model

Use **Qwen3.8 Flash Next** in **GGUF** format with the **UD-Q4_K_XL** quant. The `bubo prepare` command downloads and checks the files. See [Install](/docs/install/).
