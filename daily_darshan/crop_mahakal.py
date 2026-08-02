from PIL import Image
import os

screenshot_path = r"C:\Users\ihdrg\.gemini\antigravity\brain\e28559f2-e54f-4d0f-bc7f-967a264d24f5\media__1785667484085.png"
output_path = r"h:\Antigravity\ziddifounder\daily_darshan\assets\daily\shiva_today.jpg"

if os.path.exists(screenshot_path):
    img = Image.open(screenshot_path)
    width, height = img.size
    print("Screenshot dimensions:", width, height)

    # Crop the central top Mahakaleshwar Bhasma Aarti Shringar card
    # Normalized coordinates based on screenshot layout
    left = int(width * 0.36)
    top = int(height * 0.27)
    right = int(width * 0.62)
    bottom = int(height * 0.52)

    crop_img = img.crop((left, top, right, bottom))
    crop_img.convert('RGB').save(output_path, 'JPEG', quality=95)
    print("✅ Cropped authentic Mahakaleshwar image saved to:", output_path)
else:
    print("❌ Screenshot path not found:", screenshot_path)
