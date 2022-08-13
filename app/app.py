import os
import socket
from urllib import response
from flask import Flask, Response, render_template, request, send_from_directory
app = Flask(__name__)
app.jinja_env.lstrip_blocks = True
app.jinja_env.trim_blocks = True
import re

@app.route('/ip', methods=['GET'])
def ip():
    print('Method: %s, Path: %s' % (request.method, request.path))
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

    response = Response(src_ip)
    response.headers['Access-Control-Allow-Origin'] = 'https://pactester.brdbnt.com'
    response.headers['Cache-Control'] = 'no-store'
    return response;

@app.route('/', methods=['GET', 'POST'])
@app.route('/index.html', methods=['GET', 'POST'])
def index():
    print('Method: %s, Path: %s' % (request.method, request.path))
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

    return render_template('index.html', pac_script = pac_script, url = url)

@app.route('/pacfunctions.html', methods=['GET'])
def pacfunctions():
    print('Method: %s, Path: %s' % (request.method, request.path))
    return render_template('pacfunctions.html')

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

# @app.route('/proxy.pac', methods=['GET'])
# def proxypac():
#     return send_from_directory(os.path.join(app.root_path, 'static'),
#                                'proxy.pac', mimetype='application/x-ns-proxy-autoconfig')
#
@app.route('/sitemap.txt', methods=['GET'])
def sitemap():
    hostname = request.headers['Host']
    return Response(render_template('sitemap.txt', hostname = hostname), mimetype='text/plain')

@app.route('/resolve', methods=['GET'])
def resolve():
    print('Method: %s, Path: %s' % (request.method, request.path))
    name = request.args.get('name')
    ips = []
    try:
        ips = list(
            i        # raw socket structure
                [4]  # internet protocol info
                [0]  # address
                for i in socket.getaddrinfo(name, None) # 2nd param port, required
                if i[0] is socket.AddressFamily.AF_INET  # ipv4
        )
    except:
        pass
    answer = ''
    length = len(ips)
    if length > 0:
        names = ''
        for i in range(length):
            names = names + '{"name":"%s","data":"%s"}' % (name, ips[i])
            if i < length-1 and length-1 > 0: #don't put the coma on the last entry
                names = names + ','
        answer = ',"Answer":[%s]' % names

    response = '{"Question":[{"name":"%s"}]%s}' % (name, answer)
    return Response(response, mimetype='application/json; charset=UTF-8')

@app.route('/', methods=['HEAD'])
def head():
        print('Method: %s, Path: %s' % (request.method, request.path))
        return True

@app.after_request
def add_header(response):
    if 'Cache-Control' not in response.headers:
        response.headers['Cache-Control'] = 'public, max-age=14400'
    return response