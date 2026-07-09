import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    needs_img = bool(re.search(r'<img\b', content))
    needs_video = bool(re.search(r'<video\b', content))

    if not needs_img and not needs_video:
        return

    if needs_img and 'ImageWithSkeleton' not in content:
        import_match = re.search(r'import .*?;?\n', content)
        if import_match:
            content = content[:import_match.end()] + "import { ImageWithSkeleton } from './ImageWithSkeleton';\n" + content[import_match.end():]

    if needs_video and 'LazyVideo' not in content:
        import_match = re.search(r'import .*?;?\n', content)
        if import_match:
            content = content[:import_match.end()] + "import { LazyVideo } from './LazyVideo';\n" + content[import_match.end():]

    content = re.sub(r'<img\b', r'<ImageWithSkeleton', content)
    content = re.sub(r'<video\b', r'<LazyVideo', content)
    content = re.sub(r'</video>', r'</LazyVideo>', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

FILES = [
    'src/components/ScreenVideos.tsx',
    'src/components/ScreenTreinamentos.tsx'
]

for f in FILES:
    process_file(f)
