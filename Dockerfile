FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Install npm dependencies
RUN npm install

# Expose port 8000
EXPOSE 8000

# Start the Node.js server
CMD npm start
