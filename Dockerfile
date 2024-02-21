# h/t https://stackoverflow.com/a/73067588/1991403

FROM node:20.11.1 as base
# Chrome dependency Instalation
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
#    libgtk-4-1 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1

 # Chrome instalation
 # was: 121.0.6167.184
ARG CHROME_VERSION="120.0.6099.199-1"
RUN wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb \
  && apt install -y /tmp/chrome.deb \
  && rm /tmp/chrome.deb

#   RUN curl -LO  https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
#     && apt-get install -y ./google-chrome-stable_current_amd64.deb \
#     && rm google-chrome-stable_current_amd64.deb

# Check chrome version
RUN echo "Chrome: " && google-chrome --version

WORKDIR /src
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .

ENV CACHE_TTL=86400
ENV LOG_REQUESTS=true
ENV CAPTURE_CONSOLE_LOG=true
CMD ["server.js"]
