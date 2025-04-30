let maleNames = [];
let femaleNames = [];

fetch('male_names.txt')
  .then(response => response.text())
  .then(data => {
    maleNames = data.split('\n').map(name => name.trim()).filter(Boolean);
  });

fetch('female_names.txt')
  .then(response => response.text())
  .then(data => {
    femaleNames = data.split('\n').map(name => name.trim()).filter(Boolean);
  });

function generateName(gender) {
  let nameList = gender === 'male' ? maleNames : femaleNames;
  const randomName = nameList[Math.floor(Math.random() * nameList.length)] || 'Loading...';
  document.getElementById("nameBox").innerText = randomName;
}

function copyName() {
  const name = document.getElementById("nameBox").innerText;
  navigator.clipboard.writeText(name).then(() => {
    alert("Name copied to clipboard!");
  });
}
