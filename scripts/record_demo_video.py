import os
import sys
import time
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

def record_platform_walkthrough():
    video_dir = Path("demo_video").resolve()
    video_dir.mkdir(parents=True, exist_ok=True)
    mp4_target = video_dir / "cultos_demo_walkthrough_1080p.mp4"

    target_url = "https://frontend-alpha-pied-13.vercel.app"
    print(f"[CultOS Video Recorder] Target URL: {target_url}")
    print(f"[CultOS Video Recorder] Video Output Directory: {video_dir}")

    with sync_playwright() as p:
        print("[CultOS Video Recorder] Launching Chromium (1920x1080 @ 60fps)...")
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--window-size=1920,1080"
            ]
        )
        context = browser.new_context(
            record_video_dir=str(video_dir),
            record_video_size={"width": 1920, "height": 1080},
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
            color_scheme="dark"
        )
        page = context.new_page()

        # Step 1: Navigate to CultOS Platform
        print(f"[CultOS Video Recorder] Step 1: Navigating to {target_url}...")
        page.goto(target_url, wait_until="networkidle", timeout=60000)
        
        # Initial view: Showcase executive mission control header & atmosphere
        print("[CultOS Video Recorder] Showcasing mission control overview & landmarks banner (3s)...")
        page.wait_for_timeout(3500)

        # Smooth mouse movement to preset button
        preset_btn = page.locator("button:has-text('Khruangbin — London')").first
        if preset_btn.is_visible():
            print("[CultOS Video Recorder] Hovering and selecting Khruangbin preset...")
            box = preset_btn.bounding_box()
            if box:
                page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=20)
                page.wait_for_timeout(600)
            preset_btn.click()
            page.wait_for_timeout(1000)

        # Step 2: Trigger Empirical Audit
        print("[CultOS Video Recorder] Step 2: Smoothly clicking 'Run Cultural Taste Audit'...")
        audit_btn = page.locator("button:has-text('Run Cultural Taste Audit')").first
        if audit_btn.is_visible():
            box = audit_btn.bounding_box()
            if box:
                page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=25)
                page.wait_for_timeout(500)
            audit_btn.click()
            print("[CultOS Video Recorder] Awaiting live Qloo Taste Graph audit payload...")
            page.wait_for_selector("text=Cultural Congruence Index", timeout=20000)
            page.wait_for_timeout(2500)

        # Step 3: Smoothly scroll down to Split-Screen Comparator
        print("[CultOS Video Recorder] Step 3: Smoothly scrolling to Split-Screen Comparator...")
        for y in range(0, 220, 15):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(35)

        # Step 4: Pause on the Cultural Congruence Index (CCI) card & Comparator
        print("[CultOS Video Recorder] Step 4: Pausing on 96.2% Cultural Congruence Index (CCI) card...")
        # Hover over the 96% CCI circle badge
        cci_badge = page.locator("text=Cultural Congruence Index").first
        if cci_badge.is_visible():
            box = cci_badge.bounding_box()
            if box:
                page.mouse.move(box["x"] + 50, box["y"] + 20, steps=25)
        page.wait_for_timeout(3500)

        # Step 5: Smoothly scroll down to Financial Sponsorship Valuation & Taste Graph
        print("[CultOS Video Recorder] Step 5: Smoothly scrolling to Financial Sponsorship Valuation & Taste Graph...")
        for y in range(220, 680, 20):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(35)

        # Step 6: Interactive mouse movement across Financial Valuation Tiers & Graph
        print("[CultOS Video Recorder] Step 6: Exploring Financial Valuation Tiers ($250k Title, Stage Partner)...")
        page.mouse.move(960, 480, steps=25)
        page.wait_for_timeout(1200)
        page.mouse.move(1200, 520, steps=20)
        page.wait_for_timeout(1200)
        page.mouse.move(780, 560, steps=20)
        page.wait_for_timeout(1200)

        # Scroll to view Sensory Timeline & Network nodes
        for y in range(680, 920, 20):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(35)
        page.wait_for_timeout(2000)

        # Smooth scroll back up to overview of the platform
        print("[CultOS Video Recorder] Step 7: Smooth scrolling back up to Mission Control overview...")
        for y in range(920, 0, -30):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(30)

        # Final pause of 4 seconds to conclude walkthrough
        print("[CultOS Video Recorder] Pausing 4 seconds for clean ending...")
        page.wait_for_timeout(4000)

        # Close page & context to flush video file to disk
        print("[CultOS Video Recorder] Finalizing video capture...")
        video_handle = page.video
        page.close()
        context.close()
        browser.close()

        raw_video_path = video_handle.path() if video_handle else None
        print(f"[CultOS Video Recorder] Raw Playwright recording: {raw_video_path}")

    # Step 8: Encode to pristine MP4 using FFmpeg
    if raw_video_path and os.path.exists(raw_video_path):
        print(f"[CultOS Video Recorder] Converting to H.264 MP4: {mp4_target}...")
        ffmpeg_cmd = [
            "ffmpeg",
            "-y",
            "-i", str(raw_video_path),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "medium",
            "-crf", "18",
            str(mp4_target)
        ]
        try:
            subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print(f"[CultOS Video Recorder] MP4 Encoding Complete: {mp4_target}")
            file_size_mb = os.path.getsize(mp4_target) / (1024 * 1024)
            print(f"[CultOS Video Recorder] File Size: {file_size_mb:.2f} MB")
            return str(mp4_target)
        except Exception as e:
            print(f"[CultOS Video Recorder] FFmpeg conversion notice: {e}")
            return str(raw_video_path)
    else:
        raise RuntimeError("No video file was created during execution.")

if __name__ == "__main__":
    saved_video = record_platform_walkthrough()
    print("\n" + "=" * 60)
    print("CULTOS PLATFORM DEMO VIDEO SAVED AT:")
    print(saved_video)
    print("=" * 60)
