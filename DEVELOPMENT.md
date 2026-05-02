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

## Version Numbering

The project uses **Semantic Versioning**: `MAJOR.MINOR.PATCH`

| Segment | When to bump | Example |
|---|---|---|
| `PATCH` (last digit) | Bug fix — no new features, no breaking changes | `1.1.0` → `1.1.1` |
| `MINOR` (middle digit) | New feature — backwards compatible | `1.1.0` → `1.2.0` |
| `MAJOR` (first digit) | Breaking change — existing automations/configs may need updating | `1.1.0` → `2.0.0` |

**Quick rule:**
- Fixed a bug → bump **PATCH** (`1.1.0` → `1.1.1`)
- Added a feature → bump **MINOR** (`1.1.0` → `1.2.0`)
- Changed how existing things work (breaking) → bump **MAJOR** (`1.1.0` → `2.0.0`)

---

## Publishing a New Version

### Step 1 — Make your changes and push

```bash
git add .
git commit -m "feat: your new feature"   # or fix: / docs: / chore:
git push
```

**Commit message prefixes:**

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `chore:` | Maintenance (build, deps, version bump) |
| `refactor:` | Code cleanup with no behavior change |

### Step 2 — Build the frontend (if you changed any `.ts` files)

```bash
cd frontend
npm run build
git add .
git commit -m "chore: build frontend"
git push
```

### Step 3 — Update the version in `manifest.json`

```json
{
  "version": "1.1.1"
}
```

Bump according to the rule above:
- Bug fix → `1.1.0` → `1.1.1`
- New feature → `1.1.0` → `1.2.0`

```bash
git add custom_components/hass_requester/manifest.json
git commit -m "chore: bump version to 1.1.1"
git push
```

### Step 4 — Create a GitHub Release

Go to **https://github.com/il90il90/hass-requester/releases/new**

- **Tag:** `v1.1.1` (must match the version in `manifest.json`, prefixed with `v`)
- **Title:** `v1.1.1`
- **Description:** describe what changed (see example below)

Or via PowerShell (replace token and version):

```powershell
$credInput = "protocol=https`nhost=github.com`n"
$token = ($credInput | git credential fill) -join "`n" |
  Select-String "password=(.+)" |
  ForEach-Object { $_.Matches[0].Groups[1].Value }

$body = @{
  tag_name         = "v1.1.1"
  target_commitish = "main"
  name             = "v1.1.1"
  body             = "## What's new in v1.1.1`n`n### Bug Fixes`n- Fixed ..."
  draft            = $false
  prerelease       = $false
} | ConvertTo-Json -Depth 3

Invoke-RestMethod `
  -Uri "https://api.github.com/repos/il90il90/hass-requester/releases" `
  -Method Post `
  -Headers @{ Authorization = "token $token"; Accept = "application/vnd.github+json" } `
  -Body $body `
  -ContentType "application/json"
```

HACS will automatically detect the new release and offer users an update. ✅

---

## Release Description Template

```markdown
## What's new in vX.Y.Z

### New Features
- Description of new feature

### Improvements
- Description of improvement

### Bug Fixes
- Description of bug fix
```

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
