/*
 * Override Proxy PAC function to provide logging
 */
function myIpAddress(){
    ret = document.getElementById("src_ip").value;
    console.log('myIpAddress(), ' + ret + ';');
    appendLine('myIpAddress(), ' + ret + ';');
    return ret;
}
function dnsResolve(host) {
    console.log('dnsResolve(' + host + ')');
    ip = null;
    var oReq = new XMLHttpRequest();
    oReq.onload = function () {
        var json = JSON.parse(this.responseText);
        console.log(json);
        if (json.Answer) {
            //console.log(json.Answer[json.Answer.length-1].data);
            ip = json.Answer[json.Answer.length-1].data;
        }
    }
    oReq.open("get", 'https://8.8.8.8/resolve?name=' + host, false);
    oReq.send();
    /*
    const response = await fetch('https://8.8.8.8/resolve?name=' + host);
    const json = await response.json();
    console.log(json);
    ip = json.Answer[0].data;
    */
    console.log('dnsResolve(' + host + ') = ' + ip);
    appendLine('dnsResolve(' + host + ') = ' + ip);
    return ip;
}
var oPlainHostName = isPlainHostName;
isPlainHostName = function(str) {
    console.log('isPlainHostName(' + host + ')');
    ret = oPlainHostName(str);
    console.log('isPlainHostName(' + host + ') = ' + ret + ';');
    appendLine('isPlainHostName(' + host + ') = ' + ret + ';');
    return ret;
}
var odnsDomainIs = dnsDomainIs;
dnsDomainIs = function(str1, str2) {
    console.log('dnsDomainIs(' + str1 + ', ' + str2 + ')');
    ret = odnsDomainIs(str1, str2);
    console.log('dnsDomainIs(' + str1 + ', ' + str2 + ') = ' + ret + ';');
    appendLine('dnsDomainIs(' + str1 + ', ' + str2 + ') = ' + ret + ';');
    return ret;
}
var oisInNet = isInNet;
isInNet = function(str1, str2, str3) {
    console.log('isInNet(' + str1 + ', ' + str2 + ', ' + str3 + ')');
    ret = oisInNet(str1, str2, str3);
    console.log('isInNet(' + str1 + ', ' + str2 + ', ' + str3 + ') = ' + ret + ';');
    appendLine('isInNet(' + str1 + ', ' + str2 + ', ' + str3 + ') = ' + ret + ';');
    return ret;
}
var outCodeMirror;
async function evalPac() {
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
            readonly: true,
            mode: "javascript"
         });
    }
    var script = document.createElement('script');
    script.innerHTML = myCodeMirror.getValue();
    document.getElementById('pac_file').appendChild(script);
    url = document.getElementById("url").value;
    _URL_REGEX = new RegExp('^[^:]*:\/\/([^\/:]+)')
    match = _URL_REGEX.exec(url);
    if (match == null)
        console.log('URLError: ' + url);
    else if (match.length != 2)
        console.log('URLError: ' + url);
    else {
        host = match[1];
        console.log('FindProxyForURL(' + url + ', ' + host + ')');
        result = FindProxyForURL(url, host);
        console.log(result);
        document.getElementById("result").innerHTML = result;
    }
    document.getElementById("pac_file").innerHTML = '';
    return false;
}
function appendLine(line) {
    lineCount = outCodeMirror.lineCount();
    var pos = { // create a new object to avoid mutation of the original selection
        line: lineCount,
        ch: lineCount.length - 1 // set the character position to the end of the line
    }
    outCodeMirror.replaceRange(line+"\n", pos);
}