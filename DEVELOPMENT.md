# Development & Release Process

## Working on Features

All development happens in **this repository only** (`il90il90/hass-requester`).  
The HACS repository (`hacs/default`) is just a list — you never touch it again after the initial submission.

```
Develop locally
     ↓
git push → il90il90/hass-requester
     ↓
HACS pulls from your repo automatically
     ↓
Users see the update
```

---

## Publishing a New Version

### 1. Make your changes and push
```bash
git add .
git commit -m "feat: your new feature"
git push
```

### 2. Update the version in `manifest.json`
```json
{
  "version": "1.1.0"
}
```

### 3. Create a GitHub Release
Go to **https://github.com/il90il90/hass-requester/releases/new**
- Tag: `v1.1.0`
- Title: `v1.1.0`
- Describe what changed

HACS will automatically detect the new release and offer users an update. ✅

---

## Repository Structure

| Path | Purpose |
|------|---------|
| `custom_components/hass_requester/` | Python integration (backend) |
| `custom_components/hass_requester/www/` | Built JS panel (do not edit manually) |
| `custom_components/hass_requester/brand/` | Brand assets (icon.png) |
| `frontend/src/` | TypeScript/Lit source for the panel |
| `.github/workflows/validate.yml` | HACS + Hassfest CI checks |

## Building the Frontend

```bash
cd frontend
npm install
npm run build
```

The built file is output to `custom_components/hass_requester/www/hass-requester-panel.js`.  
Always commit the built file alongside source changes.
