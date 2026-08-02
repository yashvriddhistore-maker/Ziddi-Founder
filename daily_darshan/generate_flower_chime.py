import math
import wave
import struct
import os

def generate_flower_shower_chime(filename="assets/audio/flower_chime.wav", duration=2.5, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    num_samples = int(duration * sample_rate)
    
    # Light, delicate, high crystal chime notes (Pentatonic floral frequencies in Hz)
    chime_freqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02] # C6, E6, G6, C7, E7
    chime_times = [0.0, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90, 1.05]
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        sample_val = 0.0
        
        # Soft crystalline chime bursts
        for idx, start_t in enumerate(chime_times):
            if t >= start_t:
                dt = t - start_t
                freq = chime_freqs[idx % len(chime_freqs)]
                # Exponential fast decay for light airy touch
                env = 0.15 * math.exp(-6.0 * dt)
                sample_val += env * math.sin(2 * math.pi * freq * dt)
                
        # Gentle air/breeze whisper background
        breeze = 0.02 * (math.sin(2 * math.pi * 300 * t) + math.sin(2 * math.pi * 500 * t)) * math.exp(-1.5 * t)
        sample_val += breeze
        
        # Fade out towards end
        if t > duration - 0.5:
            sample_val *= ((duration - t) / 0.5)
            
        int_sample = int(max(-32767, min(32767, sample_val * 16000)))
        samples.append(int_sample)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for s in samples:
            wav_file.writeframes(struct.pack('<h', s))
            
    print(f"Generated Light Flower Chime: {filename}")

generate_flower_shower_chime("h:/Antigravity/ziddifounder/daily_darshan/assets/audio/flower_chime.wav")
generate_flower_shower_chime("h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/audio/flower_chime.wav")
