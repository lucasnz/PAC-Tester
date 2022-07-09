# What is my ip
Docker container running a flask web server that does proxy pac file validation.

## Parameters

Container images are configured using parameters passed at runtime.

| Parameter | Function |
| :----: | --- |
| `-e TZ=Europe/London` | (optional) Specify a time zone to use e.g. Europe/London. |
| `-e FLASK_RUN_PORT=5000` | (optional) Specify the port flask listens on (default: 5000) |

## docker-compose

Example docker-compose file.

```
---
version: '2'
services:
  pacparserweb:
    image: lucasnz/pacparserweb:latest
    container_name: pacparserweb
    environment:
      TZ: Europe/London
      FLASK_RUN_PORT: 5000
    ports:
      - 5000:5000
    restart: always
    healthcheck:
      test: ["CMD", "wget", "-S", "--spider", "http://127.0.0.1:5000/", "-O/dev/null"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## License

The MIT License applies to all components.

Copyright (c) 2020 Luke Broadbent

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
