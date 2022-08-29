FROM mcr.microsoft.com/dotnet/sdk:6.0
RUN mkdir /app
WORKDIR /app
COPY . .
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN apt update && apt install -y wget bash libatomic1 procps
RUN wget -q "https://cdn.altv.mp/server/release/x64_linux/altv-server"
RUN wget -q "https://cdn.altv.mp/coreclr-module/release/x64_linux/modules/libcsharp-module.so" -P modules/
RUN wget -q "https://cdn.altv.mp/js-bytecode-module/release/x64_linux/modules/libjs-bytecode-module.so" -P modules/
RUN wget -q "https://cdn.altv.mp/js-module/release/x64_linux/modules/js-module/libjs-module.so" -P modules/js-module/
RUN wget -q "https://cdn.altv.mp/js-module/release/x64_linux/modules/js-module/libnode.so.102" -P modules/js-module/
RUN chmod 777 altv-server
RUN npm i
EXPOSE 7788
CMD ["npm", "run", "dev"]
