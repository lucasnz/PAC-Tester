import os
from flask import Flask, Response, render_template, request, redirect, url_for, send_from_directory
import pacparser
app = Flask(__name__)
app.jinja_env.lstrip_blocks = True
app.jinja_env.trim_blocks = True
import re
import py

@app.route('/', methods=['GET', 'POST'])
def index():
    print('Method: %s, Path: %s' % (request.method, request.path))
    src_ip = None
    pac_script = """function FindProxyForURL(url, host)
{
    if (isPlainHostName(host) ||
        dnsDomainIs(host, ".example.com") || host == "example.com" ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") || 
        isInNet(myIpAddress(), "192.168.0.0", "255.255.0.0"))
        	return "DIRECT";

    if (shExpMatch(url, "ftp:*"))
        return "PROXY ftp.proxy.com:3128";

    return "PROXY webcache.domain.com:8080";
}
"""
    url = "https://www.example.com"
    proxy = None
    err = None
    parserList = [('firefox', 'Firefox JS'), ('pacparser', 'Pacparser')]
    parserSelected = 'firefox'

    if request.method == 'GET':
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

    if request.method == 'POST':
        print('POST index')
        src_ip = request.form['src_ip']
        pac_script = request.form['pac_script']
        url = request.form['url']
        parserSelected = request.form['parser']
        pacparser.init()
        # we need to capture the output from pacparser is these is an error
        capture = py.io.StdCaptureFD(out=False, in_=False)
        try:
            pacparser.parse_pac_string(pac_script)
        except:
            out,err = capture.reset()
            proxy = err
        pacparser.setmyip(src_ip)
        if proxy == None:
            # we need to capture the output from pacparser is these is an error
            capture = py.io.StdCaptureFD(out=False, in_=False)
            try:
                proxy = pacparser.find_proxy(url)
            except:
                out,err = capture.reset()
                proxy = err
        pacparser.cleanup()

    return render_template('index.html', src_ip = src_ip, pac_script = pac_script, url = url, parserList = parserList, parserSelected = parserSelected, proxy = proxy, err = err)

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/', methods=['HEAD'])
def head():
        print('Method: %s, Path: %s' % (request.method, request.path))
        return True