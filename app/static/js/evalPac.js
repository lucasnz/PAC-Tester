/*
 * Main Functions
 */
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
var odnsDomainIs = dnsDomainIs;
dnsDomainIs = function(str1, str2) {
    console.log('dnsDomainIs("' + str1 + '", "' + str2 + '")');
    ret = odnsDomainIs(str1, str2);
    appendLine('dnsDomainIs("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
var odnsDomainLevels = dnsDomainLevels;
isdnsDomainLevels = function(str) {
    console.log('dnsDomainLevels("' + host + '")');
    ret = odnsDomainLevels(str);
    appendLine('dnsDomainLevels("' + host + '") = ' + ret + ';');
    return ret;
}
var oisInNet = isInNet;
isInNet = function(str1, str2, str3) {
    console.log('isInNet("' + str1 + '", "' + str2 + '", "' + str3 + '")');
    ret = oisInNet(str1, str2, str3);
    appendLine('isInNet("' + str1 + '", "' + str2 + '", "' + str3 + '") = ' + ret + ';');
    return ret;
}
var oisPlainHostName = isPlainHostName;
isPlainHostName = function(str) {
    console.log('isPlainHostName("' + host + '")');
    ret = oisPlainHostName(str);
    appendLine('isPlainHostName("' + host + '") = ' + ret + ';');
    return ret;
}
var oisResolvable = isResolvable;
isResolvable = function(str) {
    console.log('isResolvable("' + host + '")');
    ret = oisResolvable(str);
    appendLine('isResolvable("' + host + '") = ' + ret + ';');
    return ret;
}
var olocalHostOrDomainIs = localHostOrDomainIs;
localHostOrDomainIs = function(str1, str2) {
    console.log('localHostOrDomainIs("' + str1 + '", "' + str2 + '")');
    ret = olocalHostOrDomainIs(str1, str2);
    appendLine('localHostOrDomainIs("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
//var shExpMatch = overrideFunction(shExpMatch);
var oshExpMatch = shExpMatch;
shExpMatch = function(str1, str2) {
    console.log('shExpMatch("' + str1 + '", "' + str2 + '")');
    ret = oshExpMatch(str1, str2);
    appendLine('shExpMatch("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
var oweekdayRange = weekdayRange;
weekdayRange = function(str1, str2) {
    console.log('weekdayRange("' + str1 + '", "' + str2 + '")');
    ret = oweekdayRange(str1, str2);
    appendLine('weekdayRange("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
var odateRange = dateRange;
dateRange = function(str1, str2) {
    console.log('dateRange("' + str1 + '", "' + str2 + '")');
    ret = odateRange(str1, str2);
    appendLine('dateRange("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
var otimeRange = timeRange;
timeRange = function(str1, str2) {
    console.log('timeRange("' + str1 + '", "' + str2 + '")');
    ret = otimeRange(str1, str2);
    appendLine('timeRange("' + str1 + '", "' + str2 + '") = ' + ret + ';');
    return ret;
}
function overrideFunction(orginalFunction) {
    newFunction = function(arguments) {
        logStr = 'functionName('
        for(i = 0; i < arguments.length ;i++) {
            // if not the last item
            if (i < arguments.length-1)
                logStr = logStr + '"' + arguments[i] + '"';
            else
                logStr = logStr + '"' + arguments[i] + '")';
        };
        console.log(logStr);
        ret = orginalFunction(arguments);
        appendLine(logStr + ' = ' + ret + ';');
        return ret;
    };
    return newFunction;
}