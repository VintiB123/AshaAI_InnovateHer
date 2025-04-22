import asyncio
import csv
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

OUTPUT_FILE = "job_list1.csv"
HEADLESS = False  # Set to True if you want to run without browser UI

# Function to close overlay modal if it appears
async def close_overlay_if_exists(page):
    try:
        await page.locator("#wzrk-cancel").click(timeout=5000)
        print("✔️ Closed overlay modal.")
    except PlaywrightTimeoutError:
        print("⚠️ No overlay modal found.")

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=HEADLESS)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto("https://www.herkey.com/jobs", timeout=60000)

        # Close overlay modal if it appears
        await close_overlay_if_exists(page)

        # Scroll to load job listings
        print("⏬ Scrolling to load job postings...")
        for _ in range(25):
            await page.mouse.wheel(0, 2000)
            await asyncio.sleep(1)

        jobs = page.locator('[data-test-id="job-title"]')
        count = await jobs.count()
        print(f"🔍 Found {count} job postings.")

        job_data = []

        for i in range(count):
            print(f"\n➡️ Visiting job {i + 1}/{count}")
            try:
                job = jobs.nth(i)

                # Scroll into view with retry fallback
                try:
                    await job.scroll_into_view_if_needed(timeout=5000)
                except PlaywrightTimeoutError:
                    print("⚠️ Scroll failed. Trying extra scroll and retrying...")
                    await page.mouse.wheel(0, 1000)
                    await asyncio.sleep(1)
                    await job.scroll_into_view_if_needed(timeout=5000)

                # Close overlay if it reappears
                await close_overlay_if_exists(page)

                await job.click(timeout=5000)

                # Wait for job details to load
                await page.wait_for_selector('[data-test-id="company-title"]', timeout=10000)

                # Extract job title, company, and link
                job_title = await page.locator('[data-test-id="company-title"]').text_content()
                company = await page.locator('[data-test-id="comapny-name"]').text_content()
                job_link = page.url

                # ✅ Step 1: Click Job Description tab
                try:
                    job_desc_tab = page.locator("button:has-text('Job Description')")
                    if await job_desc_tab.is_visible():
                        await job_desc_tab.click(timeout=5000)
                        await asyncio.sleep(1)
                        print("ℹ️ Clicked 'Job Description'")
                    else:
                        print("⚠️ 'Job Description' tab not visible")
                except Exception as e:
                    print(f"⚠️ Failed to click 'Job Description' tab: {e}")

                # ✅ Step 2: Expand "Read More" if present
                try:
                    read_more_buttons = page.locator("//span[contains(text(),'Read More')]")
                    if await read_more_buttons.count() > 0:
                        await read_more_buttons.first.click()
                        print("ℹ️ Clicked 'Read More'")
                except Exception as e:
                    print(f"⚠️ 'Read More' not clickable: {e}")

                # ✅ Step 3: Extract full description
                try:
                    await page.wait_for_selector("div.MuiBox-root.css-0", timeout=5000)
                    paragraphs = await page.locator("div.MuiBox-root.css-0 p").all_text_contents()
                    full_description = "\n".join([p.strip() for p in paragraphs if p.strip()])
                    print(f"📄 Extracted {len(full_description)} characters of job description.")
                except Exception as e:
                    print(f"❌ Failed to extract description: {e}")
                    full_description = "Description not found"

                # Save extracted data
                job_data.append((job_title.strip(), company.strip(), job_link, full_description))
                print(f"✅ Collected: {job_title.strip()}")

                # Go back to job listings
                try:
                    await page.locator('button[aria-label="Back"]').click(timeout=5000)
                except PlaywrightTimeoutError:
                    print("⚠️ Back arrow not found, using browser.go_back()")
                    await page.go_back()

                # Wait before continuing to next
                await page.wait_for_load_state("networkidle")
                await asyncio.sleep(1)
                jobs = page.locator('[data-test-id="job-title"]')

            except Exception as e:
                print(f"❌ Failed on job {i + 1}: {e}")
                continue

        # Save to CSV
        with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Job Title", "Company", "Link", "Job Description"])
            writer.writerows(job_data)

        print(f"\n📁 Job listings saved to '{OUTPUT_FILE}'")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
