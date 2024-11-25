# Fetch Receipt Processor Implementation

## Install & Run - Manual

To install dependencies:

```bash
bun install
bun run src/index.ts
```

## Install & Run - Docker

```bash
docker build --pull -t <image_name> .
docker run -d -p 3000:3000 <image_name>
```

## Test
```bash
bun test
```

## Q&A

## Why TypeScript?
While I love learning new languages, I'm most comfortable in TS/JS. I want to demonstrate my best, and I can't do that while simultaneously picking up new language (at least not in a sane amount of time).

## Why Bun?
Bun was primarily selected for it's out-of-the-box TypeScript support, speed, and built-in testing framework. This makes it a reasonable choice for this type of exercise.

## Why use Express and not Bun's HTTP server?
The out-of-the-box HTTP server requires manual parsing of request objects and manual creation of response objects. It leaves a lot of room
for human error.

## Why not use HTTPS?
For the simplicity of running this exercise, HTTP is used. In production, HTTPS would be configured.