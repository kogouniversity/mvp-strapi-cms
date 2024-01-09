# ===================================
# Stage 1: Build Strapi
# ===================================
FROM node:18-alpine as stage-build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
# ====== Environment Variables ======
ARG APP_KEYS
RUN test -n "$APP_KEYS" || (echo "APP_KEYS not set" && false)
ARG TRANSFER_TOKEN_SALT
RUN test -n "$TRANSFER_TOKEN_SALT" || (echo "TRANSFER_TOKEN_SALT not set" && false)
ARG ADMIN_JWT_SECRET
RUN test -n "$ADMIN_JWT_SECRET" || (echo "ADMIN_JWT_SECRET not set" && false)
ARG API_TOKEN_SALT
RUN test -n "$API_TOKEN_SALT" || (echo "API_TOKEN_SALT not set" && false)
ARG JWT_SECRET
RUN test -n "$JWT_SECRET" || (echo "JWT_SECRET not set" && false)
# ===================================

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN if [ "$NODE_ENV" = "production" ]; then \
    npm config set fetch-retry-maxtimeout 600000 -g && npm install --only=production; \
  else \
    npm config set fetch-retry-maxtimeout 600000 -g && npm install; \
  fi
ENV PATH /opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN npm run build


# ===================================
# Stage 2: Run Strapi
# ===================================
FROM node:18-alpine as strage-run
RUN apk add --no-cache vips-dev

# ====== Environment Variables ======
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ARG APP_KEYS
ENV APP_KEYS=${APP_KEYS}
ARG TRANSFER_TOKEN_SALT
ENV TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}
ARG ADMIN_JWT_SECRET
ENV ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
ARG API_TOKEN_SALT
ENV API_TOKEN_SALT=${API_TOKEN_SALT}
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}
# ===================================

WORKDIR /opt/
COPY --from=stage-build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=stage-build /opt/app ./
ENV PATH /opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
