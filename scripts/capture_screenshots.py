import os
import time
from playwright.sync_api import sync_playwright

def capture_dashboard_screenshots():
    output_dir = os.path.abspath("screenshots")
    os.makedirs(output_dir, exist_ok=True)
    print(f"[CultOS Automation] Output directory: {output_dir}")

    with sync_playwright() as p:
        print("[CultOS Automation] Launching Chromium browser (Retina 1920x1080 @ 2x)...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=2,
            color_scheme="dark"
        )
        page = context.new_page()

        # Step 1: Navigate to CultOS Mission Control
        print("[CultOS Automation] Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000", wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(3000)

        # Ensure header, landmarks banner, and console elements are visible
        page.wait_for_selector("text=CultOS: Cultural Intelligence Engine", timeout=15000)
        page.wait_for_selector("text=Console: Entity Target & Governance", timeout=15000)

        # Step 2: Capture Screenshot 1 - Full Dashboard Overview
        screenshot_1_path = os.path.join(output_dir, "01_full_dashboard_overview.png")
        print(f"[CultOS Automation] Capturing: {screenshot_1_path}")
        page.screenshot(path=screenshot_1_path, full_page=False)
        print(" -> Screenshot 1 captured successfully!")

        # Step 3: Trigger the Khruangbin preset / audit
        print("[CultOS Automation] Triggering 'Khruangbin — London' preset & audit...")
        # Click on Khruangbin preset button if available
        preset_btn = page.locator("button:has-text('Khruangbin')").first
        if preset_btn.is_visible():
            preset_btn.click()
            page.wait_for_timeout(1000)

        # Trigger audit button
        audit_btn = page.locator("button:has-text('Run Cultural Taste Audit')").first
        if audit_btn.is_visible():
            print("[CultOS Automation] Clicking '1. Run Cultural Taste Audit'...")
            audit_btn.click()
            # Wait for audit response or CCI badge
            page.wait_for_timeout(4000)

        # Wait for Qloo graph and congruence index (~95%)
        page.wait_for_selector("text=Cultural Congruence Index", timeout=15000)
        page.wait_for_timeout(2000)

        # Step 4: Capture Screenshot 2 - Split-Screen Comparator (Middle & Right Columns)
        screenshot_2_path = os.path.join(output_dir, "02_split_screen_comparator.png")
        print(f"[CultOS Automation] Capturing: {screenshot_2_path}")
        
        # Scroll slightly to center the comparator and 3-column grid
        page.evaluate("window.scrollTo(0, 140)")
        page.wait_for_timeout(1000)
        page.screenshot(path=screenshot_2_path, full_page=False)
        print(" -> Screenshot 2 captured successfully!")

        # Step 5: Capture Screenshot 3 - Taste Graph and Valuation Bottom Deck
        screenshot_3_path = os.path.join(output_dir, "03_taste_graph_and_valuation.png")
        print(f"[CultOS Automation] Capturing: {screenshot_3_path}")
        
        # Scroll down to bottom deck (valuation cards and run-of-show)
        page.evaluate("window.scrollTo(0, 680)")
        page.wait_for_timeout(1200)
        page.screenshot(path=screenshot_3_path, full_page=False)
        print(" -> Screenshot 3 captured successfully!")

        # Bonus: Full Page Capture for archival
        fullpage_path = os.path.join(output_dir, "cultos_fullpage_dashboard.png")
        page.screenshot(path=fullpage_path, full_page=True)
        print(f" -> Full-page screenshot captured at {fullpage_path}!")

        browser.close()
        print("[CultOS Automation] All screenshots captured successfully!")

if __name__ == "__main__":
    capture_dashboard_screenshots()
