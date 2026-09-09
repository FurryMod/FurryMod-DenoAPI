FROM denoland/deno:debian

WORKDIR /app

COPY deno.json deno.lock ./


COPY src ./src
RUN deno cache src/main.ts

EXPOSE 8000

CMD ["deno", "run", "--cached-only" "--allow-net", "--allow-read", "--allow-env", "src/main.ts"]
