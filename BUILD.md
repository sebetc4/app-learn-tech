# Build & Release Guide

## Local Development Builds

To create development builds **without publishing**:

```bash
# Build for your current platform (no publish)
pnpm run build:win      # Windows
pnpm run build:mac      # macOS
pnpm run build:linux    # Linux

# Unpacked build for quick testing
pnpm run build:unpack
```

These commands include `--publish never` and do **not** require a GitHub token.

## GitHub Actions Workflows

### Automatic Build (Pull Requests & Push to main)

The `.github/workflows/build.yml` workflow triggers automatically on:
- Push to `main` branch
- Pull requests to `main`

It builds for all 3 platforms and uploads artifacts, but **does not publish** a release.

### Automatic Release (Tags)

The `.github/workflows/release.yml` workflow triggers on version tags:

```bash
# 1. Update version in package.json
npm version patch   # or minor, or major

# 2. Create tag and push it
git push origin main
git push origin --tags
```

This will:
1. Build for Windows, macOS, and Linux
2. Create a GitHub release automatically
3. Publish files to the release

## Available Scripts

### Build (local, no publishing)
- `pnpm run build:win` - Build Windows (.exe) without publishing
- `pnpm run build:mac` - Build macOS (.dmg) without publishing
- `pnpm run build:linux` - Build Linux (.AppImage, .deb) without publishing

### Release (with GitHub publishing)
- `pnpm run release:win` - Build Windows and publish to GitHub
- `pnpm run release:mac` - Build macOS and publish to GitHub
- `pnpm run release:linux` - Build Linux and publish to GitHub

⚠️ **The `release:*` commands require the `GH_TOKEN` environment variable**

## Configuration

Build configuration is in:
- `electron-builder.yml` - electron-builder configuration
- `package.json` - Build scripts
- `.github/workflows/build.yml` - CI for builds
- `.github/workflows/release.yml` - CI for releases

## Supported Platforms

| Platform | Format | Architecture |
|----------|--------|--------------|
| Windows  | NSIS (.exe) | x64 |
| macOS    | DMG | Universal |
| Linux    | AppImage, DEB | x64 |

## Important Notes

- Local builds **never** attempt to publish thanks to the `--publish never` flag
- Only GitHub workflows with `GH_TOKEN` can publish
- WASM files (sql.js) are automatically included and unpacked
- Compression is set to "normal" for a good balance between size and speed
