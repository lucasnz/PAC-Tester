import os
from flask import Flask, render_template, request, send_from_directory
app = Flask(__name__)
app.jinja_env.lstrip_blocks = True
app.jinja_env.trim_blocks = True
import re

@app.route('/', methods=['GET', 'POST'])
def index():
    print('Method: %s, Path: %s' % (request.method, request.path))
    src_ip = None
    pac_script = """function FindProxyForURL(url, host)
{
    if (isPlainHostName(host) ||
        dnsDomainIs(host, ".example.com") || host == "example.com" ||
        shExpMatch(host, "(*.|)google.com") ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") || 
        isInNet(myIpAddress(), "192.168.0.0", "255.255.0.0"))
        	return "DIRECT";

    if (shExpMatch(url, "ftp:*"))
        return "PROXY ftp.proxy.com:3128";

    return "PROXY webcache.domain.com:8080";
}
"""
    url = "https://wikipedia.org/wiki/Proxy_auto-config"

    if request.method == 'POST':
        pac_script = (request.form['pac_script']).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')

    src_ip = request.remote_addr
    for name, value in request.headers:
        if name.lower() == 'x-forwarded-for':
            # examples:
            #   '163.116.194.20'
            #   '163.116.194.20, 172.68.146.77:39550'
            #   '163.116.194.20:27482'
            #   '2104:440c:13a3:3100::10, 172.68.146.77:39550'
            value = value.lstrip()
            matches = re.search('^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', value)
            if matches:
                src_ip = matches.group(0)
            else:
                src_ip = value.split(',')[0]

    return render_template('index.html', src_ip = src_ip, pac_script = pac_script, url = url)

@app.route('/pacfunctions.html', methods=['GET'])
def pacfunctions():
    print('Method: %s, Path: %s' % (request.method, request.path))
    return render_template('pacfunctions.html')

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/', methods=['HEAD'])
def head():
        print('Method: %s, Path: %s' % (request.method, request.path))
        return True