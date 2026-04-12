import re

with open('public/animal_quiz.html', 'rb') as f:
    content = f.read()

# Replace script tags that have charset="UTF-8" to add ?v=2
def add_ver(m):
    tag = m.group(0)
    src = m.group(1)
    # If already has ?v=, don't modify
    if b'?v=' in src:
        return tag
    return b'<script src="' + src + b'?v=2" charset="UTF-8"></script>'

# Match <script src="..." charset="UTF-8"></script>
new_content = re.sub(b'<script src="([^"]+)" charset="UTF-8"></script>', add_ver, content)
changed = content.count(b'charset="UTF-8"')
print('Tags with charset:', changed)
# Verify the result
import re as re2
tags = re2.findall(b'<script src="[^"]+"[^>]*>', new_content)
for t in tags:
    print(repr(t.decode('utf-8')))
with open('public/animal_quiz.html', 'wb') as f:
    f.write(new_content)
print('Done')
