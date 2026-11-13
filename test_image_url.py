import sys
import os
import urllib.request
import urllib.parse
import socket
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

VERIFIED_VERCEL_DOMAIN = "https://mcc-handmade.vercel.app"
CUSTOM_DOMAIN = "https://mcchandmade.com"
WHATSAPP_PHONE = "212689532341"

def get_local_app_url():
    if os.environ.get("LOCAL_APP_URL"):
        return os.environ.get("LOCAL_APP_URL")
    for port in [3005, 3000]:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(0.5)
                if s.connect_ex(("127.0.0.1", port)) == 0:
                    return f"http://localhost:{port}"
        except Exception:
            pass
    return "http://localhost:3005"

LOCAL_APP_URL = get_local_app_url()

def test_domains_and_dns():
    print("=" * 70, flush=True)
    print("TEST 1: VERCEL DEPLOYMENT DOMAIN & CUSTOM DOMAIN DNS CHECK", flush=True)
    print("=" * 70, flush=True)

    # 1. Check verified Vercel domain
    print(f"Checking verified Vercel domain: {VERIFIED_VERCEL_DOMAIN}", flush=True)
    req = urllib.request.Request(VERIFIED_VERCEL_DOMAIN, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        server = res.headers.get("server")
        vercel_id = res.headers.get("x-vercel-id")
        status = res.status
        print(f"  -> HTTP Status: {status}", flush=True)
        print(f"  -> Server: {server}", flush=True)
        print(f"  -> X-Vercel-Id: {vercel_id}", flush=True)
        assert status == 200, f"Expected 200 from {VERIFIED_VERCEL_DOMAIN}, got {status}"
        assert server == "Vercel", f"Expected Server Vercel, got {server}"
    print("  [PASS] Verified Vercel deployment domain is live and active.\n", flush=True)

    # 2. Check custom domain DNS
    print(f"Checking custom domain DNS status: {CUSTOM_DOMAIN}", flush=True)
    custom_active = False
    try:
        socket.gethostbyname("mcchandmade.com")
        custom_active = True
        print("  -> DNS Resolution: ACTIVE (mcchandmade.com resolves)", flush=True)
    except socket.gaierror as e:
        print(f"  -> DNS Resolution: INACTIVE ({e})", flush=True)
        print("  -> Custom domain mcchandmade.com is NOT active yet (no DNS records).", flush=True)
    print(f"  [PASS] Verified custom domain status (active={custom_active}).\n", flush=True)

def test_product_images_http():
    print("=" * 70, flush=True)
    print("TEST 2: HTTP 200 & IMAGE INTEGRITY ON VERCEL DOMAIN", flush=True)
    print("=" * 70, flush=True)

    test_images = [
        # Model 01
        ("Model 01", "Bordeaux", "/products/model-01/burgundy-01.png"),
        ("Model 01", "Noir", "/products/model-01/black-01.png"),
        ("Model 01", "Vert fonce", "/products/model-01/dark-green-01.png"),
        ("Model 01", "Blanc", "/products/model-01/white-01.png"),
        # Model 02
        ("Model 02", "Bordeaux", "/products/model-02/bordeaux-01.png"),
        ("Model 02", "Vert kaki", "/products/model-02/vert-kaki-01.png"),
        ("Model 02", "Noir", "/products/model-02/noir-01.png"),
        ("Model 02", "Blanc ecru", "/products/model-02/blanc-ecru-01.png"),
        # Model 03
        ("Model 03", "Blanc casse", "/products/model-03/blanc-casse-01.png"),
        ("Model 03", "Marron", "/products/model-03/marron-01.png"),
        ("Model 03", "Vert kaki", "/products/model-03/vert-kaki-01.png"),
    ]

    png_magic = b"\x89PNG\r\n\x1a\n"

    for model_name, color, path in test_images:
        url = f"{VERIFIED_VERCEL_DOMAIN}{path}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as res:
            status = res.status
            content_type = res.headers.get("content-type")
            content_length = int(res.headers.get("content-length", 0))
            magic = res.read(8)
            is_valid_png = magic == png_magic

            assert status == 200, f"Expected 200 for {url}, got {status}"
            assert "image/png" in content_type, f"Expected image/png, got {content_type}"
            assert is_valid_png, f"Invalid PNG magic bytes for {url}"
            assert content_length > 100000, f"Unexpectedly small image size: {content_length} bytes"

            print(f"  [PASS] {model_name:8s} | {color:12s} | HTTP {status} | {content_type} | {content_length:,} bytes | {url}", flush=True)

    print("  [PASS] All 11 representative product images return HTTP 200 and valid PNG data.\n", flush=True)

def test_browser_e2e_whatsapp_urls():
    print("=" * 70, flush=True)
    print(f"TEST 3: E2E BROWSER VALIDATION ON {LOCAL_APP_URL}", flush=True)
    print("=" * 70, flush=True)

    test_scenarios = [
        {
            "model_id": "model-01",
            "locale": "fr",
            "color_name": "Noir",
            "size_prefix": "M",
            "customer_name": "Fatima Zahra",
            "city": "Rabat",
            "expected_img": f"{VERIFIED_VERCEL_DOMAIN}/products/model-01/black-01.png",
            "expected_label": "Photo du produit :",
            "expected_size_text": "M",
        },
        {
            "model_id": "model-02",
            "locale": "ar",
            "color_name": "أخضر كاكي",
            "size_prefix": "المقاس 1",
            "customer_name": "مريم العلمي",
            "city": "فاس",
            "expected_img": f"{VERIFIED_VERCEL_DOMAIN}/products/model-02/vert-kaki-01.png",
            "expected_label": "صورة المنتج:",
            "expected_size_text": "المقاس 1 (S/M)",
        },
        {
            "model_id": "model-03",
            "locale": "fr",
            "color_name": "Marron",
            "size_prefix": "L",
            "customer_name": "Salma Bennani",
            "city": "Marrakech",
            "expected_img": f"{VERIFIED_VERCEL_DOMAIN}/products/model-03/marron-01.png",
            "expected_label": "Photo du produit :",
            "expected_size_text": "L",
        },
        {
            "model_id": "model-03",
            "locale": "ar",
            "color_name": "بني",
            "size_prefix": "XL",
            "customer_name": "خديجة بنجلون",
            "city": "طنجة",
            "expected_img": f"{VERIFIED_VERCEL_DOMAIN}/products/model-03/marron-01.png",
            "expected_label": "صورة المنتج:",
            "expected_size_text": "XL",
        },
    ]

    png_magic = b"\x89PNG\r\n\x1a\n"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for s in test_scenarios:
            page = browser.new_page()
            url = f"{LOCAL_APP_URL}/{s['locale']}/{s['model_id']}"
            print(f"Testing {s['model_id']} ({s['locale'].upper()}) -> {url}", flush=True)
            page.goto(url)
            page.wait_for_selector(".product-layout")
            page.wait_for_selector(".product-actions__add-btn")

            # Click color
            if s.get("color_name"):
                for col in page.locator(".colour-option").all():
                    if s["color_name"] in col.inner_text():
                        col.click()
                        page.wait_for_timeout(150)
                        break

            # Click size with exact prefix match
            size_options = page.locator(".size-option").all()
            clicked_size = False
            for opt in size_options:
                opt_text = opt.inner_text().strip()
                if opt_text == s["size_prefix"] or opt_text.startswith(s["size_prefix"]):
                    opt.click()
                    clicked_size = True
                    page.wait_for_timeout(150)
                    break
            assert clicked_size, f"Could not find size matching {s['size_prefix']}"

            # Open WhatsApp order modal
            page.click(".product-actions__add-btn")
            page.wait_for_selector(".order-modal-backdrop")

            # Fill customer info
            page.fill("#order-customer-name", s["customer_name"])
            page.fill("#order-city", s["city"])

            # Submit Step 1
            page.click(".order-submit-btn")
            page.wait_for_selector(".order-step--review")

            # Inspect WhatsApp confirmation link
            confirm_link = page.locator(".order-confirm-btn")
            href = confirm_link.get_attribute("href")

            assert href is not None, "Missing href on WhatsApp confirm button"
            assert href.startswith(f"https://wa.me/{WHATSAPP_PHONE}?text="), f"Invalid WhatsApp base: {href}"

            # Parse decoded message
            encoded_text = href.split("?text=")[1]
            decoded_text = urllib.parse.unquote(encoded_text)

            # Assertions on message content
            assert s["expected_label"] in decoded_text, f"Missing label {s['expected_label']}"
            assert s["expected_img"] in decoded_text, f"Missing expected image URL {s['expected_img']}"
            assert s["expected_size_text"] in decoded_text, f"Missing size {s['expected_size_text']}"
            assert "localhost" not in decoded_text.lower(), "Localhost URL found in message!"
            assert "127.0.0.1" not in decoded_text, "127.0.0.1 found in message!"
            assert "0.0.0.0" not in decoded_text, "0.0.0.0 found in message!"

            # VERIFY LIVE ACCESSIBILITY OF THE EXACT EXTRACTED IMAGE URL
            print(f"  Verifying public HTTP accessibility for extracted URL: {s['expected_img']}", flush=True)
            img_req = urllib.request.Request(s["expected_img"], headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(img_req, timeout=10) as img_res:
                assert img_res.status == 200, f"Image {s['expected_img']} returned status {img_res.status}"
                assert "image/png" in img_res.headers.get("content-type"), "Not image/png"
                img_magic = img_res.read(8)
                assert img_magic == png_magic, "Invalid PNG signature"
                print(f"  -> Confirmed live HTTP 200 & valid PNG signature for: {s['expected_img']}", flush=True)

            page.close()
            print(f"  [PASS] {s['model_id']} ({s['locale'].upper()}) WhatsApp URL fully verified.\n", flush=True)

        browser.close()

if __name__ == "__main__":
    print("=" * 70, flush=True)
    print("MCC HANDMADE — FINAL WHATSAPP IMAGE URL VALIDATION SUITE", flush=True)
    print("=" * 70, flush=True)
    test_domains_and_dns()
    test_product_images_http()
    test_browser_e2e_whatsapp_urls()
    print("=" * 70, flush=True)
    print("ALL VALIDATION TESTS PASSED SUCCESSFULLY!", flush=True)
    print("=" * 70, flush=True)
