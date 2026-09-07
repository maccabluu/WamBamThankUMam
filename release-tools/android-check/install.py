"""Install the real APKs on the disposable CI Android device, retaining errors."""
from pathlib import Path
import json
import subprocess
import sys
import time

base, current, output = sys.argv[1:]
output = Path(output)
output.mkdir(parents=True, exist_ok=True)
package = 'com.macca.wambamthankumam'
results = []


def adb(label, *args, binary=False):
    proc = subprocess.run(['adb', *args], capture_output=True, timeout=150)
    if binary:
        (output / (label + '.png')).write_bytes(proc.stdout)
    else:
        text = (proc.stdout + proc.stderr).decode('utf-8', errors='replace')
        (output / (label + '.txt')).write_text(text)
        print(label, 'exit=' + str(proc.returncode), text[:3000], flush=True)
    return proc


def install(label, apk, update=False):
    args = ['install', '--no-streaming'] + (['-r'] if update else []) + [apk]
    proc = adb(label, *args)
    ok = proc.returncode == 0 and b'Success' in proc.stdout
    results.append({'check': label, 'passed': ok})
    return ok


def launch(label):
    adb(label + '-clear-log', 'logcat', '-c')
    proc = adb(label + '-launch', 'shell', 'am', 'start', '-W', '-n', package + '/.MainActivity')
    time.sleep(8)
    adb(label + '-screen', 'exec-out', 'screencap', '-p', binary=True)
    log = adb(label + '-logcat', 'logcat', '-d')
    activity = adb(label + '-activity', 'shell', 'dumpsys', 'activity', 'activities')
    running = package.encode() in activity.stdout
    crashed = b'FATAL EXCEPTION' in log.stdout and package.encode() in log.stdout
    results.append({'check': label + '-launch', 'passed': proc.returncode == 0 and running and not crashed})
    adb(label + '-stop', 'shell', 'am', 'force-stop', package)


try:
    adb('android-version', 'shell', 'getprop', 'ro.build.version.release')
    adb('android-api', 'shell', 'getprop', 'ro.build.version.sdk')
    adb('device-size', 'shell', 'wm', 'size', '720x1280')
    base_ok = install('base-install', base)
    if base_ok:
        launch('base')
        adb('write-preserved-data', 'shell', 'run-as ' + package + " sh -c 'mkdir -p files && echo wam-preserve > files/install-check'")
        if install('update-install', current, update=True):
            preserved = adb('preserved-data', 'shell', 'run-as', package, 'cat', 'files/install-check')
            results.append({'check': 'update-preserves-app-data', 'passed': preserved.returncode == 0 and b'wam-preserve' in preserved.stdout})
            launch('updated')
    # This device and its game data were created above for this isolated test.
    adb('clear-test-installation', 'uninstall', package)
    if install('fresh-install', current):
        launch('fresh')
    adb('final-package', 'shell', 'dumpsys', 'package', package)
finally:
    (output / 'results.json').write_text(json.dumps(results, indent=2))
    print(json.dumps(results, indent=2), flush=True)

if not results or not all(result['passed'] for result in results):
    raise SystemExit(1)
