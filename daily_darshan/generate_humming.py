import math
import wave
import struct
import os

def generate_smooth_hum(filename="assets/audio/humming.wav", duration=4.0, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    num_samples = int(duration * sample_rate)
    
    # 432 Hz Healing / Devotional Hum
    base_freq = 216.0 # Lower healing octave
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        
        # Smooth choral humming harmonics
        h1 = 0.50 * math.sin(2 * math.pi * base_freq * t)
        h2 = 0.25 * math.sin(2 * math.pi * base_freq * 2 * t + 0.1)
        h3 = 0.12 * math.sin(2 * math.pi * base_freq * 3 * t + 0.2)
        h4 = 0.08 * math.sin(2 * math.pi * base_freq * 4 * t + 0.3)
        h5 = 0.05 * math.sin(2 * math.pi * base_freq * 5 * t + 0.4)
        
        # Slight vibrato in frequency to make it sound human/natural
        vibrato = math.sin(2 * math.pi * 5.0 * t) * 0.002
        
        signal = (h1 + h2 + h3 + h4 + h5) * (1.0 + vibrato)
        
        # Smooth enveloping
        if t < 0.8:
            signal *= (t / 0.8) # Slow fade in
        elif t > duration - 1.2:
            signal *= ((duration - t) / 1.2) # Slow fade out
            
        signal *= 0.6 # Overall volume reduction
            
        int_sample = int(max(-32767, min(32767, signal * 20000)))
        samples.append(int_sample)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for s in samples:
            wav_file.writeframes(struct.pack('<h', s))
            
    print(f"Generated Smooth Humming Sound: {filename}")

generate_smooth_hum("h:/Antigravity/ziddifounder/daily_darshan/assets/audio/humming.wav")
generate_smooth_hum("h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/audio/humming.wav")
