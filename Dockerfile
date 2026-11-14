FROM node:22-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM node:22-alpine AS server

WORKDIR /app/server
ENV NODE_ENV=production
ENV PORT=10000
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server/ ./
COPY --from=client-build --chown=node:node /app/client/dist /app/client/dist

USER node
EXPOSE 10000
CMD ["npm", "start"]
