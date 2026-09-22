# 开发服务器：强制 no-store，避免改完样式浏览器还吃磁盘缓存
# 用法：python tools/serve.py  （在仓库根目录或任意位置执行均可）
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    with HTTPServer(('127.0.0.1', 8123), NoCacheHandler) as httpd:
        print('ACID dev server → http://127.0.0.1:8123 (Cache-Control: no-store)')
        httpd.serve_forever()
