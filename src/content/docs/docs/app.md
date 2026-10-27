---
title: Use the app
description: "Start Halowin Bubo with the desktop app on Windows: download the engine files and a model, start the server, copy the connection address and read requests and logs."
head:
  - tag: title
    content: "Use the Bubo app on Windows | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "Use the Bubo app on Windows | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "Use the Bubo app on Windows | Halowin Bubo" }
---

The Bubo app prepares the files, starts the server and shows the requests and the log. The app starts the same `bubo serve` server as the command line. You can use the app, the command line, or both.

## Start the app

1. Do the steps in [Prepare the machine](/docs/install/#prepare-the-machine), and install the Microsoft Visual C++ Redistributable.
2. Extract the complete package into a folder. The folder name can have spaces and non-ASCII letters.
3. Double-click `start.cmd` in the package folder. It opens the app (`bin\Bubo.Control.Web.exe`).

If you prefer the command line, see [Install](/docs/install/) and the [quickstart](/docs/quickstart/).

## First run

The app has seven pages: Server, Models, Connect, Requests, Logs, Settings and About. On the first run, the Server entry reads **Get started** until the engine and a model are installed. Get started has two steps and then you start the server.

1. **Engine files.** The download approval says “To download: 967.2 MiB” and “Needs 3.2 GiB (includes unpacking)”, with the free space of the drive. It also shows the licenses. Approve it, and the app downloads the files.
2. **Model.** Select the model. The default is Qwen3.8 Flash Next from Huihui. Each option shows its download size and the GPU memory it needs at 200,000 tokens, for example “Download 108.6 GiB · Needs about 91 GiB of GPU memory at 200,000 tokens”. The approval says “Needs 110.6 GiB (108.6 GiB + 2 GiB spare)” and shows the free space of the drive and the licenses. Approve it, and the app downloads the model. One progress line shows the downloaded size, the speed and the time left.
3. **Start the server.** On the Server page, select **Start server**. The memory check tells you if the setup fits (see [Memory](#memory)).
4. **Connect a client.** On the Connect page, copy the address and the key, or copy a snippet for your client (OpenAI Python, PowerShell, Anthropic Python or Pi). The base URL is `http://127.0.0.1:8080/v1`. The snippets use the model name that the server shows on the Server page: the package id, for example `huihui-qwen38-flash-next-ud-q4-k-xl-v1`. The name `bubo` also works.
5. **Watch.** The Requests page shows each request while it runs and after it ends (see [Watch a request](#watch-a-request)). The Logs page shows the log of the server.

Nothing downloads before you approve it. You can run the steps again at any time: a file that is already correct is not downloaded again.

On a 96 GB computer, the app preselects the lower-memory build of Qwen3.8 Flash Next (“Download 83.7 GiB · Needs about 66 GiB of GPU memory at 200,000 tokens”). The two full-size options stay in the list but cannot be selected. They say: “Does not fit this computer: needs about 91 GiB of GPU memory. Use the lower-memory model.” See [Supported models](/docs/models/).

## Memory

Setup settings are on the Server page, in **Server setup**. **Context per session** and **Sessions** are always visible. The box **Memory and caches** is collapsed. It has these rows: **Disk cache**, **Disk cache limit**, **Disk cache staging memory**, **RAM cache size**, **Vision file**, **Disable disk cache**, **Disable image input** and **Image-token limit**. Select **Save server setup** to keep a change.

The memory check runs before the server starts. A setup that does not fit never starts. For a setup that fits only just, Server setup shows a box headed **Tight**. The server starts only after you tick the box: “Override: allow this tight setup. It may run out of memory, stop the server or freeze your computer.” When you have unsaved changes, the box is disabled and says “Save this setup before allowing the override.” **Check again** is below it.

## Watch a request

While the server runs, the header of the Server page shows one line, for example “Writing · 54 tok/s”, “Reading prompt · 62%” or “Idle”. With more than one active session it reads, for example, “Session 2 · Writing · 54 tok/s · 3 active sessions”.

The Requests page has a table headed **Live requests**. It has these columns: **Session**, **Phase**, **Progress**, **Live tok/s** and **Observed elapsed**. Next to it, a chart shows the rate for the last 60 seconds.

- While Bubo reads a prompt, Phase is “Reading”. Progress shows the tokens read and the total, with the cached part and a percent. Live tok/s is the reading speed.
- While Bubo writes, Phase is “Writing”. Progress shows “N tokens written”. Live tok/s is the writing speed.
- A value that is not known shows “-”, never 0.

Under the live table, the charts of finished requests (Decode, Prefill and time to first token) stay on the Requests page. The Server page keeps the line “Last request” with Decode tok/s and Prefill tok/s. The command `bubo status --watch` shows the same live facts in a terminal.

## Other models

The Models page shows the other models of the catalogue. See [Supported models](/docs/models/) for the models that were tested.

## Stop and close

- **Stop** and **Restart** are on the Server page. Stop is graceful. If the server has not stopped after 45 seconds, the app stops it by force.
- When you close the window, the server and the app stop. If you turn on **Keep this app in the tray when closing** in Settings, the window hides and the server keeps running. Select **Quit** in the tray menu to stop both.

## Settings and data

Settings has these options for the app: **Check for updates at start**, **Start this app at login**, **Keep this app in the tray when closing** (off by default) and **Start the server with this app**.

## Model download folder

Settings, in the App section, has a row **Model download folder**. It shows the folder and the free space of its drive, for example "S: has 538.2 GiB free". The row says: "New downloads go here. Models you already downloaded stay where they are and keep working."

1. In Settings, select **Change…** and choose a folder.
2. The row shows the new folder at once.
3. Select **Use default** to go back to the default folder (`models` in `%LOCALAPPDATA%\Bubo`).

The download approval shows the folder and the free space, in the form "Downloads to FOLDER · S: has 538.2 GiB free", with **Change folder…** beside it. **Change folder…** opens a folder picker (“Choose a folder for new model downloads”), saves the folder as the download folder (the same setting as above) and updates the space line at once. If you cancel the picker, nothing changes.

Settings also has a list **Model folders** with **Add folder** and **Remove folder** for extra folders. After you add a folder, the app lists the model packages in it, and you can select one for the Server page.

The app saves its data in `%LOCALAPPDATA%\Bubo`:

| Folder or file | Content |
| --- | --- |
| `gui\settings.json` | The settings of the app |
| `gui\logs\` | The logs of the app and the updater |
| `gui\webview2\` | The browser data of the app |
| `runtime\rocm-10.0.0-gfx1151\` | The engine files |
| `models\` | The models |

## Update check

The app checks for a new version once, when it starts. The check is on by default. It contacts the Bubo release feed on GitHub and sends only the installed version number in its User-Agent. It downloads nothing until you choose to update on the About page. To turn the check off, clear **Check for updates at start** in Settings.

## Update

When an update is available, **About**, **Updates** shows what the update downloads and what it keeps. For the update from 0.1.0 to 0.1.1 it says “Installed: 0.1.0 · Available: 0.1.1”, “Engine files: not redownloaded.”, “Models: not redownloaded.” and “Download size: 63.1 MiB.” The notes of the release are under a fold, headed “Update to 0.1.1”.

1. Select **Download update** (or **Later**). The app says “The update is downloaded and checked.”
2. Select **Install and restart**. Installing stops the server and restarts the app. Your models and settings stay.
