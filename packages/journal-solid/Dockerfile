# syntax=docker/dockerfile:1

FROM node:25 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN npm install --global --force corepack@latest && corepack enable && pnpm --help


FROM base AS build

WORKDIR /src

COPY --link . .

RUN \
  --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile \
  && pnpm run build \
  && pnpm deploy --filter=journal-solid --prod /prod/journal-solid


FROM base

COPY --from=build /prod/journal-solid /prod/journal-solid

ENV PORT=3000 \
    NODE_ENV=production

EXPOSE 3000
WORKDIR /prod/journal-solid

CMD [ "pnpm", "start" ]

# TODO: healthcheck
