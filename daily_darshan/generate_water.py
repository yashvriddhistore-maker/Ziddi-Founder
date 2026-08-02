import math
import wave
import struct
import os

def generate_water_pouring(filename="assets/audio/water_pour.wav", duration=5.0, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    num_samples = int(duration * sample_rate)
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        
        # White noise for rushing water
        noise = (os.urandom(1)[0] / 255.0 * 2.0 - 1.0)
        
        # Low frequency rumble (heavy water stream)
        rumble = 0.5 * math.sin(2 * math.pi * 40 * t) + 0.3 * math.sin(2 * math.pi * 120 * t)
        
        # Swirling/splashing modulation
        splash_mod = 0.5 * (1.0 + math.sin(2 * math.pi * 3.5 * t))
        
        # Combine noise, rumble and modulate it
        signal = (noise * 0.6 + rumble * 0.4) * (0.5 + 0.5 * splash_mod)
        
        # Envelope: Fast attack, hold, quick release
        if t < 0.2:
            signal *= (t / 0.2)
        elif t > duration - 0.5:
            signal *= ((duration - t) / 0.5)
            
        int_sample = int(max(-32767, min(32767, signal * 15000)))
        samples.append(int_sample)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for s in samples:
            wav_file.writeframes(struct.pack('<h', s))
            
    print(f"Generated Water Pouring Sound: {filename}")

generate_water_pouring("h:/Antigravity/ziddifounder/daily_darshan/assets/audio/water_pour.wav")
generate_water_pouring("h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/audio/water_pour.wav")
