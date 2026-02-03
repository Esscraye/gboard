# Use Node.js with Bun installed for serving the built application
FROM node:24-alpine

# Install Bun globally
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies
RUN bun install --production

# Copy built files and public assets
COPY .next ./.next
COPY public ./public

# Expose the port the app runs on
EXPOSE 3000

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Command to run the application
CMD ["bun", "run", "start"]
