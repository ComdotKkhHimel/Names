
let maleNames = [];
let femaleNames = [];

fetch('male_names.txt')
    .then(response => response.text())
    .then(text => maleNames = text.trim().split('\n'));

fetch('female_names.txt')
    .then(response => response.text())
    .then(text => femaleNames = text.trim().split('\n'));

function generateNames(gender) {
    const namesArray = gender === 'male' ? maleNames : femaleNames;
    const name = namesArray[Math.floor(Math.random() * namesArray.length)];
    document.getElementById('generatedNameBox').textContent = name;
}

function copyToClipboard() {
    const name = document.getElementById('generatedNameBox').textContent;
    navigator.clipboard.writeText(name);
}

document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('background');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDuration = (5 + Math.random() * 5) + 's';
        bg.appendChild(particle);
    }
});
