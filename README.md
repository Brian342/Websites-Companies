# My App (Flask)

A Flask app with a modern, friendly UI: Home, Upload, Dashboard, and Settings. Sign in with your name and see **"Welcome [name], let's see how it works"** on the home page.

## Run the app

```bash
cd "mpesa app"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## Features

- **Home** – Personalized welcome when signed in
- **Upload** – Upload page (add your file logic in app.py)
- **Dashboard** – Overview page
- **Settings** – Change your display name
- **Sign in / Sign out** – Session-based; name appears in header and on home
