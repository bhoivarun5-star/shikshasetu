from django.apps import AppConfig
import os
import threading
import time
import urllib.request
import urllib.error

def ping_loop(url):
    print(f"[KeepAlive] Starting automatic background ping loop for {url}")
    # Wait 10 seconds to allow the web server to fully bind and start accepting connections
    time.sleep(10)
    
    # Normalize URL
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url

    count = 1
    while True:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ShikshaSetuAutoKeepAlive/1.0'}
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                status = response.getcode()
                print(f"[KeepAlive] [{count}] Automatic ping to {url} - Status: {status}")
        except urllib.error.HTTPError as e:
            print(f"[KeepAlive] [{count}] Automatic ping to {url} - Server responded with HTTP Error: {e.code}")
        except urllib.error.URLError as e:
            print(f"[KeepAlive] [{count}] Automatic ping to {url} - Ping failed (Network/DNS Error): {e.reason}")
        except Exception as e:
            print(f"[KeepAlive] [{count}] Automatic ping to {url} - Error: {e}")
        
        count += 1
        time.sleep(30)

class ShikshasetuAppConfig(AppConfig):
    name = 'shikshasetu_app'

    def ready(self):
        url = os.environ.get('RENDER_EXTERNAL_URL')
        if url:
            # In development autoreload mode, avoid running in the parent reload monitor
            if os.environ.get('RUN_MAIN') != 'true' and os.environ.get('RUN_MAIN') is not None:
                return
            # Start background keep-alive ping thread
            t = threading.Thread(target=ping_loop, args=(url,), daemon=True)
            t.start()
