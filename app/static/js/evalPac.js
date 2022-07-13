/*
 * Main Functions
 */
var outCodeMirror;
async function evalPac() {
    parser = document.getElementById("parser").value;
    if (parser == 'pacparser') {
        //submit and return
        document.getElementById('mainForm').submit();
        return false;
    }
    // clear output
    result = '';
    err = false;
    proxyStr = '';
    document.getElementById("pac_file").innerHTML = '';
    document.getElementById("result").innerHTML = '';
    document.getElementById("result").classList.remove('err');
    if (outCodeMirror) {
        outCodeMirror.setValue('');
    }
    else {
        document.getElementById("output").classList.add('script');
        outCodeMirror = CodeMirror(document.getElementById("output"), {
            lineNumbers: false,
            readOnly: 'nocursor',
            mode: "javascript"
         });
    }
    // check script for errors
    JSHINT(myCodeMirror.getValue());
    for (i = 0; i < JSHINT.errors.length; ++i) {
      lintErr = JSHINT.errors[i];
      if (!lintErr)
        console.log(lintErr);
      else
        appendLine('Error, line: ' + lintErr.line + ', ' + lintErr.reason, true);
    }
    // load script
    var script = document.createElement('script');
    script.innerHTML = myCodeMirror.getValue();
    try {
        document.getElementById('pac_file').appendChild(script);
    }
    catch(e) {
        result = 'Error: ' + e.message;
        proxyStr = result;
        err = true;
    }
    if (!err) {
        // define host entry
        url = document.getElementById("url").value;
        host = getHost(url);
        if (host == null) {
            result = 'URLError: ' + url;
            proxyStr = result;
            err = true;
        }
        else {
            // execute FindProxyForURL
            appendLine('FindProxyForURL("' + url + '", "' + host + '")');
            try {
                proxyStr = FindProxyForURL(url, host);
                result = 'FindProxyForURL("' + url + '", "' + host + '") = "' + proxyStr + '";'
            }
            catch(e) {
                result = 'Error: ' + e.message;
                err = true;
            }
        }
    }
    if (result != '')
        appendLine(result, err);
    updateResult(proxyStr, err);
    return false;
}
function updateParserDiv(){
    if (document.getElementById("parser").value == 'pacparser')
        document.getElementById("dns_div").style.display = 'none';
    else
        document.getElementById("dns_div").style.display = 'block';
}
function getHost(url) {
    host = null;
    _URL_REGEX = new RegExp('^[^:]*:\/\/([^\/:]+)')
    match = _URL_REGEX.exec(url);
    if (match != null || match.length == 2) {
        host = match[1];
    }
    return host;
}
function updateResult(text, err) {
    document.getElementById("result").innerHTML = text;
    if (err) {
        document.getElementById("result").classList.add("err");
    }
}
function appendLine(line, err) {
    console.trace();
    lineCount = outCodeMirror.lineCount();
    var pos = { // create a new object to avoid mutation of the original selection
        line: lineCount,
        ch: lineCount.length - 1 // set the character position to the end of the line
    }
    console.log(line);
    if (err) line = '// ' + line
    outCodeMirror.replaceRange(line+'\n', pos);
}
/*
 * Override Proxy PAC function to provide logging
 */
function myIpAddress(){
    ret = document.getElementById("src_ip").value;
    appendLine('myIpAddress() = "' + ret + '";');
    return ret;
}
function dnsResolve(host) {
    if (host == null)
        return null;
    console.log('dnsResolve("' + host + '")');
    // if we have an specificed IP, skip the next bit and return it.
    ip = (document.getElementById("dst_ip").value).trim();
    if (ip == '') {
        ip = null;
        var oReq = new XMLHttpRequest();
        oReq.onload = function () {
            json = JSON.parse(this.responseText);
            console.log(json);
            if (json.Answer) {
                //console.log(json.Answer[json.Answer.length-1].data);
                ip = json.Answer[json.Answer.length-1].data;
            }
        }
        oReq.open("get", 'https://8.8.8.8/resolve?name=' + host, false);
        try {
            oReq.send();
        }
        catch(e) {
            appendLine('Error: DNS lookup failed: ' + e.message, true);
        }
        /*
        request = async () => {
            const response = await fetch('https://8.8.8.8/resolve?name=' + host);
            const json = await response.json();
            return json;
        }
        const json = request();
        console.log(json);
        if (json.Answer)
            ip = json.Answer[json.Answer.length-1].data;
        */
    }
    appendLine('dnsResolve("' + host + '") = "' + ip + '";');
    return ip;
}
var dnsDomainIs = functionLogging(dnsDomainIs);
var dnsDomainLevels = functionLogging(dnsDomainLevels);
var isInNet = functionLogging(isInNet);
var isPlainHostName = functionLogging(isPlainHostName);
var isResolvable = functionLogging(isResolvable);
var localHostOrDomainIs = functionLogging(localHostOrDomainIs);
var shExpMatch = functionLogging(shExpMatch);
var weekdayRange = functionLogging(weekdayRange);
var dateRange = functionLogging(dateRange);
var timeRange = functionLogging(timeRange);

function functionLogging(orginalFunction) {
    newFunction = function(...args) {
        logStr = orginalFunction.name + '('
        for(i = 0; i < args.length ;i++) {
            // if not the last item
            if (i < args.length-1)
                logStr = logStr + '"' + args[i] + '", ';
            else
                logStr = logStr + '"' + args[i] + '")';
        };
        console.log(logStr);
        ret = orginalFunction(...args);
        appendLine(logStr + ' = ' + ret + ';');
        return ret;
    };
    return newFunction;
}