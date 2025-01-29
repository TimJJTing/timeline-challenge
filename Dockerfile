# ---------- dev stage ---------- #
FROM node:20-slim AS development

ENV CI=true
ENV PORT=3000

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
CMD [ "npm", "start" ]

# frequently modified contents
COPY --chown=node:node yarn.lock package.json ./
RUN yarn install
COPY --chown=node:node . .

# ---------- build stage ---------- #
FROM development AS builder
RUN npm run build

# ---------- production stage ---------- #
FROM nginx:1.20-alpine AS production
ENV PORT 80
COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf.template /nginx.conf.template
CMD ["/bin/sh" , "-c" , "envsubst '$PORT' < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
