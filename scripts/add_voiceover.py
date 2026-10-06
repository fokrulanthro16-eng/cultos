import os
import sys
import asyncio
import subprocess
from pathlib import Path
import edge_tts

NARRATION_TEXT = (
    "Welcome to CultOS, the autonomous cultural intelligence engine grounding generative AI "
    "into empirical taste for the seventy-billion-dollar live entertainment industry. "
    "Generic LLMs routinely hallucinate clichés—defaulting to mass-market brands for niche indie artists. "
    "CultOS solves this by integrating the Qloo Taste Graph with Google Gemini 2.5 Flash. "
    "Watch as we trigger an empirical taste audit for Khruangbin in London. "
    "CultOS instantly calculates a 96.2% Cultural Congruence Index, isolating negative affinities "
    "and mapping multi-domain taste vectors across fashion, dining, and nightlife. "
    "Finally, our valuation engine algorithmically prices brand tiers—proposing a 250k Title Sponsor "
    "and 120k Stage Partner with an automated Run-of-Show. "
    "This is CultOS: empirical cultural intelligence for live sponsorships."
)

VOICE = "en-US-ChristopherNeural"

async def generate_narration_audio(audio_path: Path):
    print(f"[CultOS Voiceover] Generating AI voiceover with voice: {VOICE}...")
    communicate = edge_tts.Communicate(NARRATION_TEXT, VOICE, rate="+2%", pitch="+0Hz")
    await communicate.save(str(audio_path))
    print(f"[CultOS Voiceover] Narration audio saved to: {audio_path}")

def merge_audio_video(video_path: Path, audio_path: Path, output_path: Path):
    print(f"[CultOS Voiceover] Merging video ({video_path}) and narration ({audio_path})...")
    
    # Use ffmpeg for fast, lossless video multiplexing
    cmd = [
        "ffmpeg",
        "-y",
        "-i", str(video_path),
        "-i", str(audio_path),
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_path)
    ]
    
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"[CultOS Voiceover] FFmpeg mux complete -> {output_path}")
    except Exception as e:
        print(f"[CultOS Voiceover] FFmpeg mux error ({e}), falling back to moviepy...")
        from moviepy import VideoFileClip, AudioFileClip
        video_clip = VideoFileClip(str(video_path))
        audio_clip = AudioFileClip(str(audio_path))
        final_clip = video_clip.with_audio(audio_clip)
        final_clip.write_videofile(str(output_path), codec="libx264", audio_codec="aac")
        video_clip.close()
        audio_clip.close()

def main():
    root_dir = Path(__file__).resolve().parent.parent
    demo_dir = root_dir / "demo_video"
    demo_dir.mkdir(parents=True, exist_ok=True)

    audio_path = demo_dir / "narration.mp3"
    video_source = demo_dir / "cultos_demo_walkthrough_1080p.mp4"
    output_path = demo_dir / "cultos_final_demo.mp4"

    if not video_source.exists():
        # Fallback to any mp4 in demo_dir
        mp4_files = sorted(demo_dir.glob("*.mp4"), key=os.path.getmtime, reverse=True)
        if mp4_files:
            video_source = mp4_files[0]
        else:
            raise FileNotFoundError(f"No source video found in {demo_dir}")

    print(f"[CultOS Voiceover] Selected Source Video: {video_source}")
    print(f"[CultOS Voiceover] Target Output: {output_path}")

    # Step 1: Generate AI Narration
    asyncio.run(generate_narration_audio(audio_path))

    # Step 2: Merge audio and video
    merge_audio_video(video_source, audio_path, output_path)

    if output_path.exists():
        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print("\n" + "=" * 60)
        print("PROFESSIONAL AI VOICEOVER DEMO COMPLETED:")
        print(f"Path: {output_path}")
        print(f"Size: {file_size_mb:.2f} MB")
        print("=" * 60)
        return str(output_path)
    else:
        raise RuntimeError("Failed to create final demo video with voiceover.")

if __name__ == "__main__":
    main()
