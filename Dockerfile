# # 1. Use official Node.js image as a base
# FROM node:18

# # 2. Set working directory
# WORKDIR /usr/src/app

# # 3. Copy package.json and package-lock.json
# COPY package.json ./

# # 4. Install dependencies
# RUN npm install

# COPY .env.local .env.local

# # 5. Copy the rest of the application
# COPY . .

# # 6. Build the application
# RUN npm run build

# # 7. Use Nginx to serve the build files
# FROM nginx:alpine

# # 8. Copy custom Nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # 9. Copy build files to Nginx's default HTML directory
# COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# # 10. Expose port 3000
# EXPOSE 3000

# # 11. Start Nginx
# CMD ["nginx", "-g", "daemon off;"]

# Node.js 공식 이미지 사용 (최신 LTS 버전 권장)
FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json 및 package-lock.json 복사 후 npm install 실행
COPY package*.json ./
RUN npm install

# 프로젝트의 나머지 소스 코드 복사
COPY . .

# 포트 노출 (React 기본 포트)
EXPOSE 3000

# React 앱 실행 명령어
CMD ["npm", "start"]
