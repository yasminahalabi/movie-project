FROM node:22-alpine

# Set working directory
WORKDIR /frontend

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package.json package-lock.json ./

COPY . .

# Install dependencies
RUN npm install


RUN npm run build

EXPOSE 3000

CMD ["npm" , "start"]