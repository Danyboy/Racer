import json
import requests
import datetime
import os
import sys

import config
from bs4 import BeautifulSoup

LINKS_PATH = 'links.json'
TRACKS_PATH = 'track.json'
EVENTS_PATH = 'events.json'

def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def backup_events():
    if os.path.exists(EVENTS_PATH):
        dt = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        os.rename(EVENTS_PATH, f'events_{dt}.json')

def get_track_id_by_name(track_name, tracks):
    for t in tracks['tracks']:
        if t['name'].lower() == track_name.lower():
            return t['id']
    return None

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = config.DEEPSEEK_API_KEY

def call_deepseek(prompt):
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are an expert at extracting structured event data from HTML and returning only valid JSON. With track event, date, racetrack name."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 8048
    }
    response = requests.post(DEEPSEEK_API_URL, headers=headers, json=data, timeout=160)
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    print("=== DeepSeek raw content ===")
    print(content)  # log first 1000 characters
    import re, json
    match = re.search(r'```json\s*(.*?)```', content, re.DOTALL)
    if match:
        content = match.group(1)
    content = content.strip()
    if not content:
        print("DeepSeek returned empty response!")
        return []
    try:
        return json.loads(content)
    except Exception as e:
        print("Error parsing JSON from DeepSeek:", e)
        print("Content was:", content)
        return []

def extract_text_from_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    # Remove all script and style
    for tag in soup(['script', 'style']):
        tag.decompose()
    text = soup.get_text(separator=' ', strip=True)
    # Remove extra spaces
    import re
    text = re.sub(r'\s+', ' ', text)
    return text

def main():
    links = load_json(LINKS_PATH)
    tracks = load_json(TRACKS_PATH)
    all_events = []

    for club in links:
        print(f'Processing {club["club"]}...')
        try:
            resp = requests.get(club['website'], timeout=20)
            html = resp.text
        except Exception as e:
            print(f'Error downloading {club["website"]}: {e}')
            continue

        event_html = html

        # Clean HTML, leaving only text
        if club['club'] == 'Tandas Privadas' or club['club'] == 'Sprint track league':
            event_text = event_html
        else:
            event_text = extract_text_from_html(event_html)

        prompt = (
            f"Extract all upcoming racing events from this HTML block:\n"
            f"Return JSON array with fields: track_id (from this list: {[t['id'] for t in tracks['tracks']]}, "
            f"track, event, country (where track placed), flag (country flag), day (YYYY-MM-DD), price (if any), organizer_url (use {club['website']}). "
            f"Very important: use only track_id from the provided list, do not invent new ids."
            f"\nDates may be in DD/MM/YYYY format. Parse them as YYYY-MM-DD.\n\n"
            f"{event_text}"
        )
        print('=== PROMPT ===')
        print(prompt[:2000])

        # Get structured data from DeepSeek
        try:
            events = call_deepseek(prompt)
            # events = [{"track_id": "...", "day": "...", "price": "...", "organizer_url": "..."}]
            for ev in events:
                ev['organizer'] = club['club']
                all_events.append(ev)
        except Exception as e:
            print(f'DeepSeek error for {club["club"]}: {e}')

    # Backup old events.json
    backup_events()

    # Save new events.json
    with open(EVENTS_PATH, 'w', encoding='utf-8') as f:
        json.dump(all_events, f, ensure_ascii=False, indent=2)

    print(f'Saved {len(all_events)} events to {EVENTS_PATH}')

if __name__ == '__main__':
    main()
