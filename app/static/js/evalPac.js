/*
 * Override Proxy PAC function to provide logging
 */
function myIpAddress(){
    ret = document.getElementById("src_ip").value;
    appendLine('myIpAddress() = "' + ret + '";');
    return ret;
}
function dnsResolve(host) {
    console.log('dnsResolve("' + host + '")');
    // if we have an specificed IP, skip the next bit and return it.
    ip = document.getElementById("dst_ip").value;
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
        oReq.send();
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
var oPlainHostName = isPlainHostName;
isPlainHostName = function(str) {
    console.log('isPlainHostName("' + host + '")');
    ret = oPlainHostName(str);
    appendLine('isPlainHostName("' + host + '") = ' + ret + ';');
    return ret;
}
var odnsDomainIs = dnsDomainIs;
dnsDomainIs = function(str1, str2) {
    console.log('dnsDomainIs("' + str1 + '", "' + str2 + '")');
    ret = odnsDomainIs(str1, str2);
    appendLine('dnsDomainIs("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
var oisInNet = isInNet;
isInNet = function(str1, str2, str3) {
    console.log('isInNet("' + str1 + '", "' + str2 + '", "' + str3 + '")');
    ret = oisInNet(str1, str2, str3);
    appendLine('isInNet("' + str1 + '", "' + str2 + '", "' + str3 + '") = ' + ret + ';');
    return ret;
}
var outCodeMirror;
async function evalPac() {
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
    lineCount = outCodeMirror.lineCount();
    var pos = { // create a new object to avoid mutation of the original selection
        line: lineCount,
        ch: lineCount.length - 1 // set the character position to the end of the line
    }
    console.log(line);
    if (err) line = '// ' + line
    outCodeMirror.replaceRange(line+'\n', pos);
}