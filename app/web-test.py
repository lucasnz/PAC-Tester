import SimpleRequest
import sys
import getopt

def main(argv):
    method='GET'
    url=None
    code=1
    
    try:
        opts, args = getopt.getopt(argv,"hu:m:",["help", "url=", "method="])
    except getopt.GetoptError:
        print('Error: Incorrect parameters. use -h for help.')
        sys.exit(2)
    for opt, arg in opts:
        #print("opt: %s" % opt)
        #print("arg: %s" % arg)
        if opt in ('-h', '--help'):
            print(usage_options())
            sys.exit()
        elif opt in ('-u', '--url'):
            url = arg
        elif opt in ('-m', '--method'):
            method = arg

    if url == None:
        print('Error: Incorrect parameters. use -h for help.')
        sys.exit(2)

    try:
        response = SimpleRequest.request(url=url, method=method)
        print(response)
        code = response.status
    except Exception as e:
        print(e)

    if code == 200:
        print('OK')
        sys.exit(0)
    else:
        print('ERROR')
        sys.exit(code)

def usage_options():
    return   "Usage: web-test.py [<options>]\n" + \
             "  -h, --help              Print usage information\n" + \
             "  -u, --url=<url>         URL to poll, e.g. https://example.com/\n" + \
             "  -m, --method=<method>   (Optional) HTTP method, e.g. HEAD\n" + \
             "                              * if not specified, defaults to GET"

if __name__ == "__main__":
    main(sys.argv[1:])
