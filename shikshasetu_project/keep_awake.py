import sys
import time
import urllib.request
import urllib.error
import os

def main():
    # Read URL from command line arg or environment variable or prompt
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = os.environ.get('RENDER_EXTERNAL_URL')
        if not url:
            print("ShikshaSetu Keep-Awake Script")
            print("=============================")
            print("Usage: python keep_awake.py <server_url>")
            print("Or set RENDER_EXTERNAL_URL environment variable.")
            try:
                url = input("\nEnter server URL to ping (e.g., https://shikshasetu.onrender.com): ").strip()
            except KeyboardInterrupt:
                print("\nExiting.")
                return
            if not url:
                print("Error: No URL provided. Exiting.")
                return

    # Ensure URL has protocol
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url

    print(f"Starting keep-awake ping loops for: {url}")
    print("Interval: 30 seconds. Press Ctrl+C to terminate.")
    
    count = 1
    while True:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 ShikshaSetuKeepAlive/1.0'}
            )
            # Use a short timeout of 10s so it doesn't hang
            with urllib.request.urlopen(req, timeout=10) as response:
                print(f"[{count}] Pinged {url} - Response Status: {response.getcode()}")
        except urllib.error.HTTPError as e:
            # An HTTP error (like 404 or 403) still means the server is awake!
            print(f"[{count}] Pinged {url} - Server responded with HTTP Error: {e.code}")
        except urllib.error.URLError as e:
            print(f"[{count}] Ping failed (Network/DNS Error): {e.reason}")
        except Exception as e:
            print(f"[{count}] Ping failed with error: {e}")
        
        count += 1
        time.sleep(30)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nKeep-awake script stopped by user. Goodbye!")
