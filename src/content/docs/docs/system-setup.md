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

**Supported hardware:** Bubo is built and tested for AMD Strix Halo with 128 GB of memory on Windows, mainly laptops. It can work on other machines, but we make no promise.

Use these settings for an AMD Strix Halo laptop at about 70 W. Each section gives the reason for the setting and a read-only check.

## Check everything with one command

Run `.\bubo.exe diagnose --section gpu` in the package folder. The `gpu` line must show `Detected: gfx1151` and a `[supported]` verdict. The command does not check the settings below, so use the checks in each section.

## GPU memory

Set GPU memory to **96 GB** in the BIOS or in Armoury Crate. The setting can have the name “UMA frame buffer size” or “carve-out”. Armoury Crate is an ASUS program. On other Strix Halo machines, use the BIOS setting or the tool of the maker of your machine.

Why: the GPU holds the model, the dense twin and the draft head, the context cache and the compute buffers. The model files are 111 GB on disk, and the twin and the draft head add 1.6 GB. With the default profile (one session, 262,144 tokens of context), the server reports 92,675 MiB of GPU memory in use after the load. Task Manager shows this as about 90 GB.

The rest of the 128 GB stays with Windows. It holds your applications and the host memory of the server: the server process (about 4.5 GB), the RAM snapshot cache (6.4 GB by default) and the disk-cache staging area (5.4 GB, only when you turn on the disk cache). Free host memory affects speed. Our benchmark runs had more than 11.8 GB free. In one run with 5.4 GB free, plain decode at 4 users was 4.5% slower. More than two sessions at 262,144 tokens do not fit in 32 GB of host memory. We tested only the 96 GB setting, so we do not know how other splits behave.

Check that it took effect:

1. Open Task Manager, then **Performance**, then **GPU**. **Dedicated GPU memory** must show about 96 GB.
2. Run this command in PowerShell. Windows must show about 32 GB of memory.

```powershell
(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
```

## Page file

Set a fixed page file of **128 GB** on the system drive. Set both the initial size and the maximum size to **131072 MB**.

Why: Windows counts GPU memory against its commit limit, about 1 byte of commit for each byte of GPU memory (measured on our laptop). The commit limit is the memory that Windows sees plus the page files. With 96 GB set as GPU memory, Windows sees only about 32 GB, so a large page file gives the headroom. Windows writes little to the page file (about 3.9 GB in use in our measurement). Without the headroom, the commit charge reached 98% to 99% of the limit and gave stalls, failed allocations and aborted starts.

Check that it took effect:

```powershell
Get-CimInstance Win32_PageFileSetting | Select-Object Name, InitialSize, MaximumSize
Get-CimInstance Win32_PageFileUsage | Select-Object Name, AllocatedBaseSize, CurrentUsage
```

The first command must show `InitialSize` and `MaximumSize` of 131072, and the second must show `AllocatedBaseSize` of 131072. If the first command prints nothing, Windows manages the page file automatically. You can also open **System Properties**, **Advanced**, **Performance Settings**, **Advanced**, **Virtual memory**.

## Power mode

Use **Performance** mode. Armoury Crate sets it on ASUS laptops. On other machines, use the power mode of your maker's tool.

Why: the mode sets the power limit of the chip. All our benchmarks ran in Performance mode at about 70 W.

Check that it took effect: the tool of your maker must show Performance. Run a long request, and then read the GPU power in a monitor such as the Adrenalin performance overlay. It must show about 70 W.

## Graphics driver

Use AMD graphics driver **32.0.31041.1004 (2026-08-16) or newer**.

Why: this is the driver of our tests. We do not know how older drivers behave.

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
