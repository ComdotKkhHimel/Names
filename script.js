
let maleNames = [];
let femaleNames = [];

async function loadNames() {
  const maleData = await fetch('male_names.txt').then(res => res.text());
  const femaleData = await fetch('female_names.txt').then(res => res.text());
  maleNames = maleData.split('\n').filter(Boolean);
  femaleNames = femaleData.split('\n').filter(Boolean);
}

loadNames();

document.getElementById('generateBtn').addEventListener('click', () => {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const count = Math.min(parseInt(document.getElementById('nameCount').value, 10), 100000);
  const namesList = gender === 'male' ? maleNames : femaleNames;

  const generatedNames = [];
  for (let i = 0; i < count; i++) {
    const randomName = namesList[Math.floor(Math.random() * namesList.length)];
    generatedNames.push(randomName);
  }

  document.getElementById('nameResult').textContent = generatedNames.join('\n');
});

document.getElementById('nameResult').addEventListener('click', () => {
  const text = document.getElementById('nameResult').textContent;
  if (text !== 'Click Generate') {
    navigator.clipboard.writeText(text).catch(err => console.error('Copy failed:', err));
  }
});


const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 33);
window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
