import math
import wave
import struct
import os

def generate_om_namah_shivaya_chant(filename="assets/audio/om_chant.wav", duration=8.0, sample_rate=44100):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    num_samples = int(duration * sample_rate)
    
    # Fundamental Om Drone pitch at 108 Hz (Deep Sacred Indian Tanpura / Om tuning)
    om_pitch = 108.0
    bell_pitch = 523.25 # C5 Temple Bell
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        
        # 1. OM CHANT DRONE (Harmonics mimicking deep voice chanting ॐ)
        # Formant frequencies for "Ommm" vowel resonance
        om_vowel = (
            0.45 * math.sin(2 * math.pi * om_pitch * t) +
            0.30 * math.sin(2 * math.pi * om_pitch * 2 * t + 0.2) +
            0.20 * math.sin(2 * math.pi * om_pitch * 3 * t + 0.4) +
            0.15 * math.sin(2 * math.pi * om_pitch * 4 * t + 0.6) +
            0.10 * math.sin(2 * math.pi * om_pitch * 5 * t)
        )
        
        # 4.32 Hz slow breathing amplitude swell for Om chant
        om_envelope = 0.5 * (1.0 + math.sin(2 * math.pi * 0.25 * t - math.pi/2))
        om_signal = om_vowel * om_envelope * 0.6
        
        # 2. TEMPLE BELL CHIME (Rings gently at t=0, t=2.5, t=5.0 sec)
        bell_signal = 0.0
        bell_triggers = [0.0, 2.5, 5.0]
        
        for trig in bell_triggers:
            if t >= trig:
                t_bell = t - trig
                bell_env = math.exp(-2.2 * t_bell)
                bell_wave = (
                    0.4 * math.sin(2 * math.pi * bell_pitch * t_bell) +
                    0.2 * math.sin(2 * math.pi * bell_pitch * 2.76 * t_bell) +
                    0.1 * math.sin(2 * math.pi * bell_pitch * 3.42 * t_bell)
                )
                bell_signal += bell_wave * bell_env
                
        # Combine Om Chant + Bell Signal
        total_signal = om_signal + bell_signal * 0.35
        
        # Fade out at the end (last 1 sec)
        if t > duration - 1.0:
            fade = (duration - t) / 1.0
            total_signal *= fade
            
        # Soft attack start
        if t < 0.05:
            total_signal *= (t / 0.05)
            
        int_sample = int(max(-32767, min(32767, total_signal * 22000)))
        samples.append(int_sample)
        
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)
        for s in samples:
            wav_file.writeframes(struct.pack('<h', s))
            
    print(f"Generated Om Namah Shivaya Mantra Chant: {filename}")

generate_om_namah_shivaya_chant("h:/Antigravity/ziddifounder/daily_darshan/assets/audio/om_chant.wav")
generate_om_namah_shivaya_chant("h:/Antigravity/Ziddi-Founder-repo/daily_darshan/assets/audio/om_chant.wav")
