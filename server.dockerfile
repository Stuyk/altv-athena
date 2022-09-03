FROM mcr.microsoft.com/dotnet/sdk:6.0
RUN mkdir /app
WORKDIR /app
COPY . .
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN apt update && apt install -y wget bash libatomic1 procps
RUN npm i
RUN npm run update
RUN chmod 777 altv-server
EXPOSE [7788,3000]
CMD ["npm", "run", "linux"]
