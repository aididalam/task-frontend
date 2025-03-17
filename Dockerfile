# Step 1: Build the React app
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the source code and build the app
COPY . .


ENV VITE_API_URL=http://127.0.0.1:8330  
ENV VITE_WEB_SOCKET_URL=ws://127.0.0.1:8331

RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy the React build output from the build stage to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx.conf to configure routing for React SPA (client-side routing)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to access the frontend
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
