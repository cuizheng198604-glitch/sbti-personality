import subprocess

content = subprocess.check_output(['git', 'show', '6e1b112:public/animal_quiz.html'])
lines = content.split(b'\n')

fixed_lines = []
for i, line in enumerate(lines):
    li = i + 1
    if li == 186:
        fixed_lines.append(line.replace(b'  body.innerHTML = \\`', b'  body.innerHTML = `'))
    elif li == 204:
        fixed_lines.append(line.replace(b'  \\`;', b'  `;'))
    elif li == 219:
        fixed_lines.append(line.replace(b'      adContainer.innerHTML = \\`<div class="quiz-ad">', b'      adContainer.innerHTML = `<div class="quiz-ad">'))
    elif li == 225:
        fixed_lines.append(line.replace(b'      </div>\\`;', b'      </div>`;'))
    else:
        fixed_lines.append(line)

new_content = b'\n'.join(fixed_lines)
print('Original size:', len(content))
print('New size:', len(new_content))
print('Escaped backticks remaining:', new_content.count(b'\\`'))

with open('public/animal_quiz.html', 'wb') as f:
    f.write(new_content)
print('Done!')
