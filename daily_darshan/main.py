import os
import json
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

OUTPUT_DIR = os.getenv('OUTPUT_DIR', 'assets/daily')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Verified Official Temple Portals List
DEITIES = [
    {
        "id": "shiva",
        "name": "श्री महाकालेश्वर ज्योतिर्लिंग (उज्जैन)",
        "temple": "Shri Mahakaleshwar Temple, Ujjain",
        "scrape_url": "https://www.shrimahakaleshwar.mp.gov.in/",
        "live_url": "https://www.shrimahakaleshwar.mp.gov.in/live-darshan",
        "mantra": "ॐ नमः शिवाय | कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम्।"
    },
    {
        "id": "kashi",
        "name": "श्री काशी विश्वनाथ ज्योतिर्लिंग (वाराणसी)",
        "temple": "Shri Kashi Vishwanath Temple, Varanasi",
        "scrape_url": "https://www.shrikashivishwanath.org/",
        "live_url": "https://www.shrikashivishwanath.org/",
        "mantra": "ॐ नमः पार्वती पतये हर हर महादेव।"
    },
    {
        "id": "somnath",
        "name": "श्री सोमनाथ ज्योतिर्लिंग (गुजरात)",
        "temple": "Shree Somnath Jyotirlinga Temple",
        "scrape_url": "https://somnath.org/",
        "live_url": "https://somnath.org/",
        "mantra": "जय सोमनाथ | ॐ नमः शिवाय।"
    },
    {
        "id": "shirdi",
        "name": "श्री साईं बाबा (शिर्डी)",
        "temple": "Shree Saibaba Samadhi Mandir, Shirdi",
        "scrape_url": "https://sai.org.in/",
        "live_url": "https://sai.org.in/",
        "mantra": "अनन्तकोटि ब्रह्माण्डनायक राजाधिराज योगीराज परब्रह्म श्री सच्चिदानन्द सद्गुरु साईंनाथ महाराज की जय।"
    },
    {
        "id": "vaishnodevi",
        "name": "श्री माता वैष्णो देवी (कटरा)",
        "temple": "Shri Mata Vaishno Devi Shrine Board",
        "scrape_url": "https://www.maavaishnodevi.org/",
        "live_url": "https://www.maavaishnodevi.org/",
        "mantra": "सर्वमङ्गलमगल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥"
    },
    {
        "id": "siddhivinayak",
        "name": "श्री सिद्धिविनायक (मुंबई)",
        "temple": "Shree Siddhivinayak Temple, Mumbai",
        "scrape_url": "https://www.siddhivinayak.org/",
        "live_url": "https://www.siddhivinayak.org/",
        "mantra": "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"
    }
]

def fetch_live_darshan_photo(deity_info):
    """
    Scrape official daily photos from verified temple portal
    """
    print(f"🔍 Attempting web scraping for {deity_info['name']} from {deity_info['scrape_url']}...")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        res = requests.get(deity_info['scrape_url'], headers=headers, timeout=8)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            img_tags = soup.find_all('img')
            for img in img_tags:
                src = img.get('src', '')
                alt = img.get('alt', '').lower()
                if any(kw in src.lower() or kw in alt for kw in ['darshan', 'today', 'daily', 'live', 'banner', 'hero', 'slider']):
                    if not src.startswith('http'):
                        src = requests.compat.urljoin(deity_info['scrape_url'], src)
                    
                    img_res = requests.get(src, headers=headers, timeout=8)
                    if img_res.status_code == 200 and len(img_res.content) > 30000:
                        file_path = os.path.join(OUTPUT_DIR, f"{deity_info['id']}_today.jpg")
                        with open(file_path, 'wb') as f:
                            f.write(img_res.content)
                        print(f"✅ Web Scraping Successful: Saved {file_path}")
                        return file_path, "official_portal_scraped"
    except Exception as e:
        print(f"⚠️ Scraping warning for {deity_info['name']}: {e}")
    
    return None, None

def run_daily_darshan_sync():
    print(f"=== 🚩 Daily Darshan Engine Started [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ===")
    
    manifest = {
        "updated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "date_str": datetime.now().strftime('%d %B %Y'),
        "deities": []
    }

    for deity in DEITIES:
        photo_path, source = fetch_live_darshan_photo(deity)
        manifest["deities"].append({
            "id": deity["id"],
            "name": deity["name"],
            "temple": deity["temple"],
            "mantra": deity["mantra"],
            "live_url": deity["live_url"],
            "image_path": f"assets/daily/{deity['id']}_today.jpg",
            "source_type": source or "verified_temple_stream",
            "last_updated": datetime.now().isoformat()
        })

    json_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    print(f"🎉 Daily Darshan Sync Completed! Manifest written to {json_path}")

if __name__ == "__main__":
    run_daily_darshan_sync()
