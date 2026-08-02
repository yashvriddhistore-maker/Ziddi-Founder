import re

path = 'h:/Antigravity/ziddifounder/daily_darshan/index.html'
content = open(path, 'r', encoding='utf-8').read()

# Replace each bhog button - find via regex and replace
# Pattern replaces emoji-based buttons with image-based ones
bhog_replacements = [
    (
        r'<button class="bhog-option-btn" data-bhog="\U0001F367" data-name="मिश्री-मखाना">\s*<span class="bhog-icon">\U0001F367</span>',
        '<button class="bhog-option-btn" data-bhog="assets/bhog/makhana.png" data-name="मिश्री-मखाना" data-is-img="true">\n                    <img class="bhog-icon-img" src="assets/bhog/makhana.png" alt="मिश्री-मखाना">'
    ),
    (
        r'<button class="bhog-option-btn" data-bhog="\U0001F36C" data-name="लड्डू-पेड़ा">\s*<span class="bhog-icon">\U0001F36C</span>',
        '<button class="bhog-option-btn" data-bhog="assets/bhog/laddu.png" data-name="लड्डू-पेड़ा" data-is-img="true">\n                    <img class="bhog-icon-img" src="assets/bhog/laddu.png" alt="लड्डू / पेड़ा">'
    ),
    (
        r'<button class="bhog-option-btn" data-bhog="\U0001F34E" data-name="ऋतु फल">\s*<span class="bhog-icon">\U0001F34E</span>',
        '<button class="bhog-option-btn" data-bhog="assets/bhog/rituphal.png" data-name="ऋतु फल" data-is-img="true">\n                    <img class="bhog-icon-img" src="assets/bhog/rituphal.png" alt="ऋतु फल">'
    ),
    (
        r'<button class="bhog-option-btn" data-bhog="\U0001F95B" data-name="पञ्चामृत">\s*<span class="bhog-icon">\U0001F95B</span>',
        '<button class="bhog-option-btn" data-bhog="assets/bhog/panchamrit.png" data-name="पञ्चामृत" data-is-img="true">\n                    <img class="bhog-icon-img" src="assets/bhog/panchamrit.png" alt="पञ्चामृत">'
    ),
]

for pattern, replacement in bhog_replacements:
    content = re.sub(pattern, replacement, content)

content = content.replace('app.js?v=16.0', 'app.js?v=17.0')

open(path, 'w', encoding='utf-8').write(content)

# Copy to repo
repo_path = 'h:/Antigravity/Ziddi-Founder-repo/daily_darshan/index.html'
open(repo_path, 'w', encoding='utf-8').write(content)

print("Done! bhog-icon-img count:", content.count('bhog-icon-img'))
