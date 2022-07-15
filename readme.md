# PAC Tester
PAC Tester is Python flask web server for testing Proxy Auto-Config (PAC) and Web Proxy Auto-Discovery (WPAD) scripts.  It outputs the resulting proxy based on the specified: URL, Web Server IP, or Source IP. You can see it running at https://pactester.brdbnt.com/

### Features:
* Proxy pac and WPAD script tester, parser and validator 
* Editor coloring and error highlighting 
* Leverages the proxy auto-config JavaScript in Firefox. https://hg.mozilla.org/mozilla-central/raw-file/tip/netwerk/base/ascii_pac_utils.js 

### Options
The web interface has the following options:
| Option | Details |
| :----: | --- |
| URL | The full URL including protocol (e.g. https or ftp), domain, and path (port is optional). E.g. https://en.wikipedia.org/wiki/Proxy_auto-config or https://example.com:8443/ |
| Source IP Address | MyIpAddress() will return this IP address. Change this if you want to simulate an internal user’s IP address. |
| Override dnsResolve | (Optional) if specified, dnsResolve(host) will return this IP address. This enables you to simulate an internal webserver. |

# Docker
### Parameters

Container images are configured using parameters passed at runtime.

| Parameter | Function |
| :----: | --- |
| `-e TZ=Europe/London` | (optional) Specify a time zone to use e.g. Europe/London. |
| `-e FLASK_RUN_PORT=5000` | (optional) Specify the port flask listens on (default: 5000) |

### docker-compose

Example docker-compose file:

```
---
version: '2'
services:
  pac-tester:
    image: lucasnz/pac-tester:latest
    container_name: pac-tester
    environment:
      TZ: Europe/London
      FLASK_RUN_PORT: 5000
    ports:
      - 5000:5000
    restart: always
```

# License

The MIT License applies to all components.

Copyright (c) 2020 Luke Broadbent

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.