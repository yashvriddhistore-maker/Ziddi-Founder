import math
import wave
import struct
import os

def generate_pure_om_chant(filename="assets/audio/pure_om.wav", duration=10.0, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    num_samples = int(duration * sample_rate)
    
    # 136.1 Hz Sacred Earth Om Tuning (C# Frequency used for Meditation & Divine Peace)
    om_pitch = 136.1
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        
        # Pure vocal formant harmonics creating a deep, soothing "OOOOOOMMMMM" chant
        # Warm, harmonic sine waves mimicking deep monk chanting
        f1 = math.sin(2 * math.pi * om_pitch * t)
        f2 = 0.35 * math.sin(2 * math.pi * om_pitch * 2 * t + 0.1)
        f3 = 0.18 * math.sin(2 * math.pi * om_pitch * 3 * t + 0.3)
        f4 = 0.10 * math.sin(2 * math.pi * om_pitch * 4 * t + 0.5)
        f5 = 0.05 * math.sin(2 * math.pi * om_pitch * 5 * t + 0.7)
        
        raw_signal = f1 + f2 + f3 + f4 + f5
        
        # Breathing envelope (Slow 0.2 Hz swell like deep meditative breathing)
        swell = 0.5 * (1.0 + math.sin(2 * math.pi * 0.2 * t - math.pi/2))
        signal = raw_signal * (0.6 + 0.4 * swell) * 0.65
        
        # Soft envelope attack at start & fade out at end
        if t < 0.2:
            signal *= (t / 0.2)
        if t > duration - 1.2:
            signal *= ((duration - t) / 1.2)
            
        int_sample = int(max(-32767, min(32767, signal * 28000)))
        samples.append(int_sample)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for s in samples:
            wav_file.writeframes(struct.pack('<h', s))
            
    print(f"Generated Pure Om Chant: {filename}")

generate_pure_om_chant("h:/Antigravity/ziddifounder/daily_darshan/assets/audio/pure_om.wav")
generate_pure_om_chant("h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/audio/pure_om.wav")
