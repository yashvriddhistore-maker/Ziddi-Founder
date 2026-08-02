"""
Remove white/light backgrounds from bhog images using PIL
Creates PNG with transparency for clean cutout effect
"""
from PIL import Image
import os

def remove_white_background(input_path, output_path, threshold=220):
    """Remove near-white background pixels and make them transparent"""
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        # If pixel is near-white (background), make it transparent
        if r > threshold and g > threshold and b > threshold:
            newData.append((r, g, b, 0))  # Fully transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Processed: {output_path}")

# Source images
brain_dir = "C:/Users/ihdrg/.gemini/antigravity/brain/e28559f2-e54f-4d0f-bc7f-967a264d24f5"
source_map = {
    "makhana": f"{brain_dir}/bhog_makhana_clean_1785672277945.png",  # new white bg version
    "laddu":   f"{brain_dir}/bhog_laddu_1785671911880.png",           # original
    "rituphal":f"{brain_dir}/bhog_rituphal_1785671923848.png",        # original
    "panchamrit": f"{brain_dir}/bhog_panchamrit_1785671935975.png",   # original
}

dest_dirs = [
    "h:/Antigravity/ziddifounder/daily_darshan/assets/bhog",
    "h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/bhog"
]

for name, src in source_map.items():
    for dest_dir in dest_dirs:
        os.makedirs(dest_dir, exist_ok=True)
        out = f"{dest_dir}/{name}.png"
        
        # Use stricter threshold for dark-bg originals (laddu, rituphal, panchamrit)
        thresh = 220 if name == "makhana" else 30  # For dark bg images, remove very dark corners
        remove_white_background(src, out, threshold=thresh)

print("All done!")
