# Dockerfile

# Giai đoạn 1: Xây dựng ứng dụng
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install --legacy-peer-deps

COPY . .

# Chạy lệnh prisma generate
RUN npx prisma generate

# Giai đoạn 2: Chạy ứng dụng
FROM node:18

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

# Không cần chỉ định cổng ở đây, chỉ cần chạy lệnh
CMD ["npm", "run", "start:prod"]
