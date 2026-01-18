import * as fs from 'fs'
import * as path from 'path'

interface Target {
    name: 'appImage' | 'deb' | 'rpm' | string
}

interface Context {
    appOutDir: string
    targets: Target[]
    packager: {
        appInfo: {
            productFilename: string
        }
    }
}

/**
 * electron-builder afterPack hook
 *
 * Creates a wrapper script for Linux AppImage builds that passes --no-sandbox
 * to avoid the 60-second startup delay on distributions where
 * kernel.unprivileged_userns_clone is disabled (Fedora, Arch, Debian, etc.)
 *
 * See: https://docs.appimage.org/user-guide/troubleshooting/electron-sandboxing.html
 */
export default async function afterPack(context: Context): Promise<void> {
    const isAppImage = context.targets.some((target) => target.name === 'appImage')

    if (!isAppImage) {
        console.log('[afterPack] Skipping - not an AppImage build')
        return
    }

    const appName = context.packager.appInfo.productFilename
    const executablePath = path.join(context.appOutDir, appName)
    const wrappedExecutablePath = path.join(context.appOutDir, `${appName}.bin`)

    console.log('[afterPack] Creating no-sandbox wrapper for AppImage')
    console.log(`[afterPack] Executable: ${executablePath}`)

    if (!fs.existsSync(executablePath)) {
        console.error(`[afterPack] Executable not found: ${executablePath}`)
        return
    }

    // Rename the original executable to .bin
    fs.renameSync(executablePath, wrappedExecutablePath)
    console.log(`[afterPack] Renamed ${appName} -> ${appName}.bin`)

    // Create wrapper script that passes --no-sandbox
    const wrapperScript = `#!/bin/bash
# Wrapper script to fix AppImage startup delay on Linux distributions
# where kernel.unprivileged_userns_clone is disabled (Fedora, Arch, etc.)
# See: https://docs.appimage.org/user-guide/troubleshooting/electron-sandboxing.html

SCRIPT_DIR="$(dirname "$(readlink -f "\${BASH_SOURCE[0]}")")"
exec "\${SCRIPT_DIR}/${appName}.bin" --no-sandbox "$@"
`

    fs.writeFileSync(executablePath, wrapperScript, { mode: 0o755 })
    console.log(`[afterPack] Created wrapper script: ${executablePath}`)

    // Remove chrome-sandbox since we're disabling it
    const chromeSandboxPath = path.join(context.appOutDir, 'chrome-sandbox')
    if (fs.existsSync(chromeSandboxPath)) {
        fs.unlinkSync(chromeSandboxPath)
        console.log('[afterPack] Removed chrome-sandbox')
    }

    console.log('[afterPack] AppImage no-sandbox wrapper created successfully')
}
