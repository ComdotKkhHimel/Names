async function generateNames(gender) {
  const response = await fetch(`${gender}_names.txt`);
  const text = await response.text();
  const names = text.trim().split('\n');
  const shuffled = names.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 100000);
  document.getElementById('output').textContent = selected.join('\n');
}