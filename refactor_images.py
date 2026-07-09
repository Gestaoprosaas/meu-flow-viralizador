import os
import re

FILES = [
    'src/components/ScreenProdutos.tsx',
    'src/components/ScreenMovimentos.tsx',
    'src/components/ScreenLanding.tsx'
]

for file_path in FILES:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if we need imports
    needs_img = '<img' in content
    needs_video = '<video' in content
    
    if needs_img and 'ImageWithSkeleton' not in content:
        # Add import after last import
        import_match = re.search(r'(import .*?;?\n)(?!import)', content, re.DOTALL)
        if import_match:
            end = import_match.end()
            content = content[:end] + "import { ImageWithSkeleton } from './ImageWithSkeleton';\n" + content[end:]
            
    if needs_video and 'LazyVideo' not in content:
        import_match = re.search(r'(import .*?;?\n)(?!import)', content, re.DOTALL)
        if import_match:
            end = import_match.end()
            content = content[:end] + "import { LazyVideo } from './LazyVideo';\n" + content[end:]

    # Replace <img ... />
    # We'll just replace <img with <ImageWithSkeleton but wait, we need to handle props and closing tag.
    # It might be easier to do manually or with simple regex if the tags are single line.
