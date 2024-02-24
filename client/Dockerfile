# Stage 1: Build stage
FROM node:alpine as builder

WORKDIR '/app'

# Copy package.json first to leverage Docker cache
COPY ./package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build command
RUN npm run build

# Stage 2: Production stage
FROM nginx

# Expose the port on which nginx will run
EXPOSE 3000

# Copy nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the builder stage to the nginx directory
COPY --from=builder /app/build /usr/share/nginx/html
