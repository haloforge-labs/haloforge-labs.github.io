---
title: System setup
description: Recommended Windows, memory, power, and driver settings for Halowin Bubo.
---

**Supported hardware:** Bubo is built and tested for AMD Strix Halo with 128 GB of memory on Windows, mainly laptops. It can work on other machines, but we make no promise.

Use these settings for an AMD Strix Halo laptop at about 70 W.

## GPU memory

Set GPU memory to **96 GB** in the BIOS or Armoury Crate. The setting can have the name “UMA frame buffer” or “carve-out”.

## Page file

Set a fixed page file of **128 GB** on the system drive. Set both the initial size and the maximum size to **131072 MB**.

## Power mode

Use **Performance** mode.

## Graphics driver

Use AMD graphics driver **32.0.31041.1004 (2026-08-16) or newer**.

## Windows

Use **Windows 11**. Halowin Bubo was tested on **build 26200**.

## Model

Use **Qwen3.8 Flash Next** in **GGUF** format with the **UD-Q4_K_XL** quant.
