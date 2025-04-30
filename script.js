
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
    document.getElementById('nameOutput').value = name;
}

function copyToClipboard() {
    const textArea = document.getElementById('nameOutput');
    navigator.clipboard.writeText(textArea.value).then(() => {
        alert('Name copied to clipboard!');
    });
}
