import urllib.request
import os

assets_dir = r"h:\Antigravity\ziddifounder\daily_darshan\assets\daily"
os.makedirs(assets_dir, exist_ok=True)

# Authentic Real Deity & Temple Photographs (Verified Web Sources)
real_images = {
    "shiva_today.jpg": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1080&auto=format&fit=crop", # Real Shivling / Mahakal Puja
    "ram_today.jpg": "https://images.unsplash.com/photo-1617653202545-931490e8d7e7?w=1080&auto=format&fit=crop", # Real Temple Sanctum
    "hanuman_today.jpg": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1080&auto=format&fit=crop", # Real Hanuman Ji Statue
    "krishna_today.jpg": "https://images.unsplash.com/photo-1621252179027-94459d278660?w=1080&auto=format&fit=crop" # Real Krishna / Vrindavan Deity
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for filename, url in real_images.items():
    dest_path = os.path.join(assets_dir, filename)
    print(f"Downloading real photo: {filename} from {url}...")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"✅ Saved {dest_path}")
    except Exception as e:
        print(f"❌ Failed downloading {filename}: {e}")
