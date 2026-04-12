import re

with open('public/animal_quiz.html', 'rb') as f:
    content = f.read()

# Add charset="UTF-8" to external script src tags
def fix_script_tag(m):
    src = m.group(1)
    return b'<script src="' + src + b'" charset="UTF-8"'

new_content = re.sub(b'<script src="([^"]+)"', fix_script_tag, content)
changed = content.count(b'<script src=')
print('Script tags found:', changed)
with open('public/animal_quiz.html', 'wb') as f:
    f.write(new_content)
print('Done!')
