import os
import signal
import subprocess
import sys


def main():
    if len(sys.argv) < 3:
        print('usage: run_with_timeout.py <timeout_seconds> <command...>', file=sys.stderr)
        sys.exit(2)

    timeout_s = int(sys.argv[1])
    cmd = sys.argv[2:]

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        start_new_session=True,
    )

    try:
        out, _ = proc.communicate(timeout=timeout_s)
        if out:
            sys.stdout.write(out)
        sys.exit(proc.returncode)
    except subprocess.TimeoutExpired:
        sys.stderr.write(f'[run_with_timeout] TIMEOUT after {timeout_s}s\n')
        try:
            os.killpg(proc.pid, signal.SIGTERM)
        except Exception:
            pass
        try:
            out, _ = proc.communicate(timeout=5)
            if out:
                sys.stdout.write(out)
        except Exception:
            pass
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except Exception:
            pass
        sys.exit(124)


if __name__ == '__main__':
    main()
