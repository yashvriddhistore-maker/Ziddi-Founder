import urllib.request
import re
import os

url = "https://www.shrimahakaleshwar.mp.gov.in/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        print("HTML length:", len(html))
        # Find all img src or background image URLs
        imgs = re.findall(r'src=["\']([^"\']+\.(?:jpg|png|jpeg|webp))["\']', html, re.I)
        print("Found images:", imgs[:10])
except Exception as e:
    print("Error:", e)
