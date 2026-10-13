---
title: API reference
description: "HTTP API of the Halowin Bubo local LLM server: OpenAI-compatible chat, completions and responses, Anthropic messages, streaming, tools and API key."
head:
  - tag: title
    content: "API reference: OpenAI-compatible local LLM server | Halowin Bubo"
  - tag: meta
    attrs: { property: "og:title", content: "API reference: OpenAI-compatible local LLM server | Halowin Bubo" }
  - tag: meta
    attrs: { name: "twitter:title", content: "API reference: OpenAI-compatible local LLM server | Halowin Bubo" }
---

This page lists every HTTP endpoint that the v0.1.0 server serves for a text model such as Qwen3.8 Flash Next. We checked each endpoint against a running server.

## Address and model name

- The server listens on `127.0.0.1:8080`. Change this with `--host` and `--port`.
- The model name is the value of `--served-model-name`. If you do not set it, the server uses the name in the model metadata. Read the name from `GET /v1/models`.
- A request with a `model` that the server does not serve gets error 404 `model_not_found`. A request with no `model` gets error 400 `missing_model`.

The examples use the base address `http://127.0.0.1:8080` and the model name `bubo`. See the [quickstart](/docs/quickstart/) to start the server.

## Endpoint list

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness. Also `/v1/health` and `/healthz`. |
| GET | `/ready` | Readiness and model name. Also `/v1/ready` and `/readyz`. |
| GET | `/v1/models` | The model that the server serves. Also `/models`. |
| POST | `/v1/chat/completions` | Chat. OpenAI format. |
| POST | `/v1/completions` | Text completion. OpenAI format. |
| POST | `/v1/responses` | OpenAI Responses format. |
| POST | `/v1/messages` | Anthropic Messages format. |
| POST | `/completion` | Text completion. llama-server format. |
| GET | `/props?model=NAME` | Model name and template. llama-server format. |
| GET | `/slots` | State of the session slot. Also `/v1/slots`. |
| GET | `/metrics` | Prometheus text metrics. Also `/v1/metrics`. |

These paths exist but answer 501 `not_implemented` on a text model: `POST /v1/embeddings`, `/v1/messages/count_tokens`, `/v1/rerank`, `/v1/reranking`, `/rerank`, `/infill` and the `/sdapi/v1/...` paths. Any other path answers 404 `not_found`.

When you serve an audio, image or video model, the server adds the endpoints for that model. This page does not cover them.

### Health, ready and models

```powershell
curl.exe -s http://127.0.0.1:8080/health
# {"status":"ok"}
curl.exe -s http://127.0.0.1:8080/ready
# {"status":"ready","model":"bubo"}
curl.exe -s http://127.0.0.1:8080/v1/models
# {"object":"list","data":[{"id":"bubo","object":"model","created":...,"owned_by":"gufo","context_length":262144,"architecture":{"input_modalities":["text","image"]}}]}
```

`/ready` answers 503 `not_ready` while the model loads. After a GPU context loss, `/health`, `/ready` and every POST answer 503 with `"status":"device_lost"`.

## Chat completions

`POST /v1/chat/completions` follows the OpenAI chat format.

```powershell
@'
{"model":"bubo","messages":[{"role":"user","content":"Say hi."}],"max_tokens":32}
'@ | curl.exe -s http://127.0.0.1:8080/v1/chat/completions -H "Content-Type: application/json" -d "@-"
```

### Main request fields

| Field | Meaning |
|---|---|
| `model` | Required. The served model name. |
| `messages` | Required. A non-empty array of messages with the roles `system`, `user`, `assistant` and `tool`. Content is a string or an array of parts, with image parts for models that take images. |
| `max_tokens`, `max_completion_tokens` | Limit on generated tokens. |
| `stream` | `true` returns server-sent events. |
| `stream_options` | `{"include_usage": true}` adds a final usage chunk. |
| `temperature`, `top_p`, `top_k`, `min_p`, `seed` | Sampling. |
| `presence_penalty`, `frequency_penalty`, `repeat_penalty`, `logit_bias` | Penalties and token bias. |
| `stop` | A string or an array of strings. |
| `logprobs` | Return token log probabilities. |
| `tools`, `tool_choice`, `parallel_tool_calls` | Function calling. See below. |
| `response_format` | Use `json_schema` to force output that matches a schema. |
| `reasoning_effort` | `off`, `minimal`, `low`, `medium`, `high`, `xhigh` or `max`. |
| `thinking` | `{"type":"enabled"}` or `{"type":"disabled"}`. |
| `chat_template_kwargs` | `enable_thinking` and `reasoning_effort`. They must agree with the top-level fields. |
| `n` | Only 1 is accepted. Other values give error 400 `unsupported_n`. |

### Response

A non-streaming response has the OpenAI shape:

```json
{
  "id": "chatcmpl-…",
  "object": "chat.completion",
  "created": 1791893817,
  "model": "bubo",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "reasoning_content": "The user wants me to say \"hi.\" …",
      "content": "Hi there! 👋"
    },
    "finish_reason": "length"
  }],
  "usage": { "prompt_tokens": 13, "completion_tokens": 32, "total_tokens": 45, … },
  "timings": { … }
}
```

- `reasoning_content` holds the reasoning text when thinking is on. Thinking is on by default. Set `reasoning_effort` to `off` to turn it off.
- `finish_reason` is `stop`, `length` or `tool_calls`.
- `usage` also reports `prompt_tokens_per_second`, `completion_tokens_per_second`, cached tokens, the draft tokens that MTP proposed and accepted, and prompt-cache details in `usage.gufo`.
- `timings` reports the time of the prompt and of each generated token.

### Streaming

Set `"stream": true`. The response has the content type `text/event-stream`. Each event is a line `data: {json}` followed by an empty line. Each chunk has the object `chat.completion.chunk` and a `delta`:

- The first chunk has `delta.role`.
- Reasoning text arrives in `delta.reasoning_content`, and answer text in `delta.content`.
- The last chunk with choices has an empty `delta` and the `finish_reason`. It also carries `timings`.
- With `stream_options.include_usage`, one more chunk follows with `"choices": []` and the `usage` object.
- The stream ends with `data: [DONE]`.

### Tool calls

Send the tools in `tools`, in the OpenAI function format. When the model calls a function, the message has `tool_calls` and the `finish_reason` is `tool_calls`:

```json
"message": {
  "role": "assistant",
  "content": null,
  "tool_calls": [{
    "id": "call_ehs0wunbyv65x5zy3woo",
    "type": "function",
    "function": { "name": "get_weather", "arguments": "{\"city\":\"Paris\"}" }
  }]
},
"finish_reason": "tool_calls"
```

`arguments` is a JSON string. Send the result back as a message with the role `tool` and the matching `tool_call_id`. In a stream, the calls arrive in `delta.tool_calls`.

## Text completions

`POST /v1/completions` takes `model`, `prompt` and the same sampling fields. The response has the object `text_completion` and `choices[].text`.

```powershell
@'
{"model":"bubo","prompt":"The capital of France is","max_tokens":8}
'@ | curl.exe -s http://127.0.0.1:8080/v1/completions -H "Content-Type: application/json" -d "@-"
```

## Responses

`POST /v1/responses` takes `model`, `input` (a string or an array of items) and `max_output_tokens`. The response has the object `response`, a `status` of `completed` or `incomplete`, and an `output` array. The array holds a `reasoning` item and a `message` item with `output_text` content. The `usage` object has `input_tokens`, `output_tokens` and `output_tokens_details.reasoning_tokens`.

## Anthropic messages

`POST /v1/messages` takes the Anthropic Messages request: `model`, `max_tokens` and `messages`. The response has `type: "message"`, a `content` array with `thinking` and `text` blocks, a `stop_reason` (`end_turn`, `max_tokens`, `stop_sequence` or `tool_use`) and `usage` with `input_tokens` and `output_tokens`.

## llama-server endpoints

- `POST /completion` takes `prompt` and `n_predict`, and needs no `model`. The response has `content`, `stop`, `tokens_predicted`, `tokens_evaluated`, `timings` and `usage`.
- `GET /props?model=NAME` needs the `model` query parameter. The response has `model`, `template` and `model_info`.
- `GET /slots` returns an array with one object for the session slot: `id`, `n_ctx`, `is_processing`, `state` and the prompt token counts.
- `GET /metrics` returns Prometheus text. It includes `llamacpp:prompt_tokens_total`, `llamacpp:tokens_predicted_total`, `llamacpp:prompt_tokens_seconds`, `llamacpp:predicted_tokens_seconds`, the speculative decoding counters, `llamacpp:requests_processing`, `llamacpp:requests_deferred` and `llamacpp:kv_cache_usage_ratio`.

## API key

Start the server with `--api-key KEY`. Then every request, health checks included, needs the header:

```text
Authorization: Bearer KEY
```

A missing or wrong key gives 401 with the header `WWW-Authenticate: Bearer`. Without `--api-key`, the server asks for no key. Keep `--host 127.0.0.1` unless remote clients must connect.

## Errors

Errors use one JSON shape:

```json
{"error":{"message":"model 'nope' is not served by this process","type":"invalid_request_error","code":"model_not_found"}}
```

| Status | `type` | Common `code` values |
|---|---|---|
| 400 | `invalid_request_error` | `parse_error`, `missing_model`, `missing_messages`, `unsupported_n` |
| 401 | `authentication_error` | `invalid_api_key` |
| 404 | `invalid_request_error` | `model_not_found`, `not_found` |
| 501 | `server_error` | `not_implemented` |
| 503 | `server_error` | `not_ready`, `device_lost` |

## Debug endpoints, not for normal use

`POST /debug/prompt`, `GET /debug/cache` and `GET /debug/settings` exist only when the server starts with `--debug-hooks` and listens on a loopback address. Do not use them in normal operation.
