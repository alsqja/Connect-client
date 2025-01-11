# 1. Use official Node.js image as a base
FROM node:18

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package.json ./

# 4. Install dependencies
RUN npm install

COPY .env.local .env.local

# 5. Copy the rest of the application
COPY . .

# 6. Build the application
RUN npm run build

# 7. Use Nginx to serve the build files
FROM nginx:alpine

# 8. Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 9. Copy build files to Nginx's default HTML directory
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# 10. Expose port 3000
EXPOSE 3000

# 11. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
