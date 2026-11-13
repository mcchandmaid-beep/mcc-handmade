import sys
import time
from playwright.sync_api import sync_playwright

if sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

def test_interactive_gallery():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("--> 1. Navigating to http://localhost:3000/fr...")
        page.goto("http://localhost:3000/fr", wait_until="networkidle")

        stage_wrapper = page.locator(".domino-stage-wrapper")
        assert stage_wrapper.is_visible(), "Gallery stage wrapper must be visible"

        cards = page.locator(".domino-card")
        card_count = cards.count()
        print(f"    Found {card_count} domino cards.")
        assert card_count == 6, f"Expected 6 domino cards, found {card_count}"

        # 1. Verify initial stability: default index 1, NO automatic rotation after waiting
        active_card = page.locator(".domino-card--active")
        initial_title = active_card.locator(".domino-card__title").inner_text()
        print(f"    Initial active card: '{initial_title}'")
        assert "Ensemble Capuche" in initial_title, f"Expected Model 02 at start, got '{initial_title}'"

        print("    Waiting 5.5 seconds to verify autoplay is completely removed...")
        time.sleep(5.5)
        current_title = page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Card title after waiting 5.5s: '{current_title}'")
        assert current_title == initial_title, "Gallery must NOT auto-rotate! Autoplay must be completely disabled."
        print("    [PASS] Autoplay is disabled. Gallery remained stable.")

        # 2. Test hover focus and manual card selection: hover and click Card 0 (Model 01 Ensemble sport femme)
        print("--> 2. Testing hover focus & manual card selection (Card 0)...")
        stage_wrapper.scroll_into_view_if_needed()
        time.sleep(0.3)
        
        # Test mouse sweep across cards 01 to 06
        print("    Testing mouse sweep across French gallery (Card 01 to 06)...")
        stage_box = stage_wrapper.bounding_box()
        assert stage_box is not None
        for frac in [0.08, 0.25, 0.42, 0.58, 0.75, 0.92]:
            page.mouse.move(stage_box["x"] + stage_box["width"] * frac, stage_box["y"] + stage_box["height"] * 0.5)
            time.sleep(0.15)
            c_num = page.locator(".domino-card--active .domino-card__num").inner_text()
            c_title = page.locator(".domino-card--active .domino-card__title").inner_text()
            print(f"    Mouse at frac {frac:.2f} -> Card {c_num}: {c_title}")

        card_0 = cards.nth(0)
        card_0_title = card_0.locator(".domino-card__title").inner_text()
        
        # Move mouse to Card 0 position
        page.mouse.move(stage_box["x"] + stage_box["width"] * 0.08, stage_box["y"] + stage_box["height"] * 0.5)
        time.sleep(0.5)
        hovered_title = page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Active card upon hovering Card 0: '{hovered_title}'")
        assert hovered_title == card_0_title, f"Expected '{card_0_title}' on hover, got '{hovered_title}'"

        # Click to manually select Card 0
        card_0.click(force=True)
        time.sleep(0.5)

        new_active_title = page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Active card after clicking Card 0: '{new_active_title}'")
        assert new_active_title == card_0_title, f"Expected '{card_0_title}' to be selected, got '{new_active_title}'"

        # Move mouse out of the gallery and verify Card 0 remains selected at rest
        page.mouse.move(10, 10)
        time.sleep(1.0)
        resting_after_click = page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Active card at rest after selecting Card 0: '{resting_after_click}'")
        assert resting_after_click == card_0_title, "Selected card must remain selected even when mouse leaves."

        # Verify it stays selected after waiting 3 seconds
        time.sleep(3.0)
        still_active = page.locator(".domino-card--active .domino-card__title").inner_text()
        assert still_active == card_0_title, "Selected card must remain selected without auto-advance."
        print("    [PASS] Manual selection locks the card.")

        # 3. Test CTA button navigation: on active card 0, click 'VOIR LA PIÈCE'
        print("--> 3. Testing CTA button navigation...")
        cta_btn = page.locator(".domino-card--active .domino-card__action-btn")
        assert cta_btn.is_visible(), "CTA button must be visible on the active card"
        cta_href = cta_btn.get_attribute("href")
        print(f"    CTA button href: {cta_href}")
        assert cta_href == "/fr/model-01", f"Expected '/fr/model-01', got '{cta_href}'"

        cta_btn.click()
        page.wait_for_url("**/model-01", timeout=5000)
        print(f"    Current URL after clicking CTA: {page.url}")
        assert "/fr/model-01" in page.url, f"Expected to land on /fr/model-01, got {page.url}"
        print("    [PASS] Product CTA opens the correct product page.")

        # 4. Test Arabic RTL version & Mouse movement
        print("--> 4. Testing Arabic RTL gallery at http://localhost:3000/ar...")
        page.goto("http://localhost:3000/ar", wait_until="networkidle")
        
        ar_stage = page.locator(".domino-stage-wrapper")
        assert ar_stage.is_visible(), "Arabic gallery stage must be visible"
        ar_stage.scroll_into_view_if_needed()
        
        ar_cards = page.locator(".domino-card")
        assert ar_cards.count() == 6, "Expected 6 cards in Arabic"
        
        initial_ar_title = page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Arabic initial active card: '{initial_ar_title}'")
        assert "طقم بقبعة" in initial_ar_title, f"Expected Arabic Model 02, got '{initial_ar_title}'"

        # Test hovering / mouse movement across the stage in Arabic (RTL: right to left)
        print("    Simulating mouse sweep across Arabic gallery (right to left)...")
        box = ar_stage.bounding_box()
        assert box is not None
        
        for frac in [0.92, 0.75, 0.58, 0.42, 0.25, 0.08]:
            page.mouse.move(box["x"] + box["width"] * frac, box["y"] + box["height"] * 0.5)
            time.sleep(0.2)
            card_num = page.locator(".domino-card--active .domino-card__num").inner_text()
            card_title = page.locator(".domino-card--active .domino-card__title").inner_text()
            print(f"    Mouse at frac {frac:.2f} -> Card {card_num}: {card_title}")
        
        # Move mouse out of gallery -> should return smoothly to resting selected card
        page.mouse.move(10, 10)
        time.sleep(0.8)
        rested_title = page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Card after mouse leaves Arabic stage: '{rested_title}'")
        assert rested_title == initial_ar_title, f"Expected return to '{initial_ar_title}', got '{rested_title}'"
        print("    [PASS] Arabic mouse movement & return to rest works smoothly.")

        # 5. Mobile swipe test
        print("--> 5. Testing mobile touch swipe...")
        mobile_context = browser.new_context(viewport={"width": 375, "height": 812}, has_touch=True)
        m_page = mobile_context.new_page()
        m_page.goto("http://localhost:3000/fr", wait_until="networkidle")

        m_stage = m_page.locator(".domino-stage-wrapper")
        m_box = m_stage.bounding_box()
        assert m_box is not None

        m_initial_title = m_page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Mobile initial title: '{m_initial_title}'")

        # Swipe left: from x=300 to x=50
        start_x = m_box["x"] + m_box["width"] * 0.8
        end_x = m_box["x"] + m_box["width"] * 0.2
        y = m_box["y"] + m_box["height"] * 0.5

        # Dispatch touch swipe sequence from right to left (swiping to next item)
        m_page.evaluate("""({ startX, endX, y }) => {
            const el = document.querySelector('.domino-stage-wrapper');
            const touchId = Date.now();
            const touchStart = new Touch({ identifier: touchId, target: el, clientX: startX, clientY: y });
            el.dispatchEvent(new TouchEvent('touchstart', { touches: [touchStart], targetTouches: [touchStart], changedTouches: [touchStart], bubbles: true, cancelable: true }));
            const touchEnd = new Touch({ identifier: touchId, target: el, clientX: endX, clientY: y });
            el.dispatchEvent(new TouchEvent('touchend', { touches: [], targetTouches: [], changedTouches: [touchEnd], bubbles: true, cancelable: true }));
        }""", {"startX": start_x, "endX": end_x, "y": y})

        time.sleep(0.6)
        m_swiped_title = m_page.locator(".domino-card--active .domino-card__title").inner_text()
        print(f"    Mobile title after swipe: '{m_swiped_title}'")
        assert m_swiped_title != m_initial_title, "Swiping on mobile must advance the card!"
        print("    [PASS] Mobile swipe gesture functions naturally.")

        assert len(console_errors) == 0, f"Console errors detected: {console_errors}"
        print("ALL INTERACTIVE GALLERY TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_interactive_gallery()
