/*
 * Main Functions
 */
var outCodeMirror;
async function evalPac() {
    // clear output
    FindProxyForURL = undefined;
    result = undefined;
    err = false;
    proxyStr = '';
    document.getElementById("pac_file").innerHTML = '';
    document.getElementById("result").innerHTML = '';
    document.getElementById("result").classList.remove('err');
    // if output CodeMirror is already defined, then blank it otherwise create it...
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
    // normally the script will be in the codeMirror, but if it's disabled for some reason get it from the textarea.
    var pac_script;
    if (myCodeMirror)
        pac_script = myCodeMirror.getValue();
    else
        pac_script = document.getElementById("pac_script").value;
    // check script for errors
    JSHINT(pac_script);
    for (i = 0; i < JSHINT.errors.length; ++i) {
      lintErr = JSHINT.errors[i];
      if (!lintErr)
        console.log(lintErr);
      else
        appendLine('Error, line: ' + lintErr.line + ', ' + lintErr.reason, true);
    }
    // load script
    var html_script = document.createElement('script');
    html_script.innerHTML = pac_script;
    try {
        document.getElementById('pac_file').appendChild(html_script);
    }
    catch(e) {
        proxyStr = result = 'Error: ' + e.message;
        err = true;
    }
    if (typeof FindProxyForURL != 'function') {
        proxyStr = result = "Error: FindProxyForURL is not defined or errors in it mean it can't be imported.";
        err = true;
    }
    if (!err) {
        // define host variable
        url = document.getElementById("url").value;
        var {host, url} = normalizeHostUrl(url);
        if (host == null) {
            result = 'URLError: "' + url + '". URL must contain protocol prefix, e.g. https://';
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
                proxyStr = result;
                err = true;
            }
        }
    }
    if (result == undefined)
        err = true;
    if (result != '')
        appendLine(result, err);
    updateResult(proxyStr, err);
    FindProxyForURL = undefined;
    return false;
}
function normalizeHostUrl(url) {
    // Browsers always have a lower case host name
    host = null;
    _URL_REGEX = new RegExp('(^[^:]*:\/\/)([^\/:]+)(.*)')
    match = _URL_REGEX.exec(url);
    if (match != null && match.length == 4) {
        host = match[2].toLowerCase();
        url = match[1] + host + match[3];
    }
    return {host, url};
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
        if (json && json.Answer)
            ip = json.Answer[json.Answer.length-1].data;
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
var alert = function(str) {
    appendLine('alert("' + str +'");');
}

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