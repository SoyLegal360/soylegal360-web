import http.server
import os

os.chdir("/Users/josemotos/Documents/Claude/SoyLegal360.es/site")

port = int(os.environ.get("PORT", 8765))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

http.server.HTTPServer(("", port), Handler).serve_forever()
