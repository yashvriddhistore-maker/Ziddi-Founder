import math
import wave
import struct
import os

def generate_soothing_temple_bell(filename="assets/audio/temple_bell.wav", duration=6.0, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    num_samples = int(duration * sample_rate)
    
    # 432 Hz Sacred tuning for ultimate divine soothing resonance
    fundamental = 432.0 
    
    # Authentic heavy brass temple bell harmonics (Ratio, Amplitude, Decay Constant)
    harmonics = [
        (1.00, 0.45, 1.2),   # Deep fundamental hum (lasts long 6 sec)
        (2.00, 0.25, 1.6),   # Octave resonance
        (2.76, 0.18, 2.2),   # Sacred brass overtone
        (3.42, 0.12, 2.8),   # High bell shimmer
        (4.88, 0.08, 3.5),   # Strike transient
        (5.40, 0.04, 4.5),   # Top sparkle
    ]
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        sample_val = 0.0
        
        # Gentle tremolo/beating effect (2.5 Hz amplitude modulation for warm acoustic feel)
        tremolo = 1.0 + 0.12 * math.sin(2 * math.pi * 2.5 * t)
        
        for mult, amp, decay_rate in harmonics:
            freq = fundamental * mult
            # Exponential decay formula
            env = amp * math.exp(-decay_rate * t) * tremolo
            sample_val += env * math.sin(2 * math.pi * freq * t)
        
        # Soft attack envelope (prevents clicking sound at start)
        attack_time = 0.01
        if t < attack_time:
            sample_val *= (t / attack_time)
            
        # Normalize to 16-bit PCM integer range (-32767 to 32767)
        int_sample = int(max(-32767, min(32767, sample_val * 30000)))
        samples.append(int_sample)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)
        
        for s in samples:
            wav_file.writeframes(struct.pack('<h', s))
            
    print(f"✅ Generated 6-second soothing temple bell sound: {filename}")

generate_soothing_temple_bell("h:/Antigravity/ziddifounder/daily_darshan/assets/audio/temple_bell.wav")
generate_soothing_temple_bell("h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/audio/temple_bell.wav")
