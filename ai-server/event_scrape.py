import asyncio
import pandas as pd
from playwright.async_api import async_playwright

async def scrape_herkey_events():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)  # Set to False to watch it
        page = await browser.new_page()
        await page.goto("https://events.herkey.com/events", timeout=60000)
        await page.wait_for_selector(".event-details-card")

        # Click "More" button repeatedly until it's gone
        while True:
            try:
                more_button = await page.query_selector('#my-event-load-more')
                if more_button:
                    await more_button.click()
                    await page.wait_for_timeout(2000)  # Wait for content to load
                else:
                    break
            except:
                break  # No button or no more events

        # Scrape all loaded event cards
        cards = await page.query_selector_all(".event-details-card")
        events = []

        for card in cards:
            title_el = await card.query_selector("a.card-heading")
            title = await title_el.inner_text() if title_el else "N/A"
            event_url = await title_el.get_attribute("href") if title_el else "N/A"

            image_el = await card.query_selector("img.card-logo-img")
            image_url = await image_el.get_attribute("src") if image_el else "N/A"

            categories = await card.query_selector_all(".card-body-data a.text-black")
            category_text = ", ".join([await c.inner_text() for c in categories]) if categories else "N/A"

            mode_icon = await card.query_selector(".fa-bullseye")
            mode = await page.evaluate('(el) => el.nextSibling.textContent.trim()', mode_icon) if mode_icon else "N/A"

            date_el = await card.query_selector('img[src*="calendar"]')
            date = await page.evaluate('(el) => el.nextSibling.textContent.trim()', date_el) if date_el else "N/A"

            time_el = await card.query_selector('img[src*="clock"]')
            time = await page.evaluate('(el) => el.nextSibling.textContent.trim()', time_el) if time_el else "N/A"

            location_el = await card.query_selector('img[src*="placeholder"]')
            location = await page.evaluate('(el) => el.nextSibling.textContent.trim()', location_el) if location_el else "N/A"

            register_el = await card.query_selector("a.btn.register")
            register_url = await register_el.get_attribute("href") if register_el else "N/A"

            events.append({
                "Title": title,
                "Event URL": event_url,
                "Image URL": image_url,
                "Categories": category_text,
                "Mode": mode,
                "Date": date,
                "Time": time,
                "Location": location,
                "Register Link": register_url
            })

        # Save to CSV
        df = pd.DataFrame(events)
        df.to_csv("herkey_events.csv", index=False)
        print(f"✅ Done. Scraped {len(events)} events. Data saved to herkey_events.csv")

        await browser.close()

asyncio.run(scrape_herkey_events())

