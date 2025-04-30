// script.js
let maleNames = [];
let femaleNames = [];

async function loadNames() {
  try {
    const [maleResponse, femaleResponse] = await Promise.all([
      fetch('male_names.txt'),
      fetch('female_names.txt')
    ]);
    
    const [maleData, femaleData] = await Promise.all([
      maleResponse.text(),
      femaleResponse.text()
    ]);
    
    maleNames = maleData.split('\n').filter(name => name.trim() !== '');
    femaleNames = femaleData.split('\n').filter(name => name.trim() !== '');
    
    // Generate additional names to reach 100,000
    generateAdditionalNames(maleNames, 100000);
    generateAdditionalNames(femaleNames, 100000);
    
    console.log(`Loaded ${maleNames.length} male names and ${femaleNames.length} female names`);
  } catch (error) {
    console.error('Error loading names:', error);
    document.getElementById('nameResult').textContent = 'Error loading names';
  }
}

function generateAdditionalNames(namesArray, targetCount) {
  const originalLength = namesArray.length;
  if (originalLength >= targetCount) return;
  
  // Generate additional names by combining existing ones
  for (let i = originalLength; i < targetCount; i++) {
    const randomIndex1 = Math.floor(Math.random() * originalLength);
    const randomIndex2 = Math.floor(Math.random() * originalLength);
    const newName = `${namesArray[randomIndex1].split(' ')[0]} ${namesArray[randomIndex2].split(' ')[1]}`;
    namesArray.push(newName);
  }
}

loadNames();

document.getElementById('generateBtn').addEventListener('click', () => {
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const namesList = gender === 'male' ? maleNames : femaleNames;
  
  if (namesList.length === 0) {
    document.getElementById('nameResult').textContent = 'Loading names...';
    return;
  }
  
  const randomName = namesList[Math.floor(Math.random() * namesList.length)];
  document.getElementById('nameResult').textContent = randomName;
  
  // Add glowing animation
  const output = document.getElementById('nameResult');
  output.style.animation = 'glow 0.5s ease-out';
  setTimeout(() => {
    output.style.animation = '';
  }, 500);
});

document.getElementById('nameResult').addEventListener('click', () => {
  const text = document.getElementById('nameResult').textContent;
  if (text !== 'Click Generate' && text !== 'Loading names...' && text !== 'Error loading names') {
    navigator.clipboard.writeText(text)
      .then(() => {
        const originalText = document.getElementById('nameResult').textContent;
        document.getElementById('nameResult').textContent = 'Copied!';
        setTimeout(() => {
          document.getElementById('nameResult').textContent = originalText;
        }, 1000);
      })
      .catch(err => console.error('Copy failed:', err));
  }
});

// Add glow animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes glow {
    0% { text-shadow: 0 0 5px #00ff00; }
    50% { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
    100% { text-shadow: 0 0 5px #00ff00; }
  }
`;
document.head.appendChild(style);
