// Global variables
let maleNames = [];
let femaleNames = [];
let isLoading = true;
let nameHistory = [];

// DOM elements
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const nameResult = document.getElementById('nameResult');
const historyList = document.getElementById('historyList');

// Load names from text files
async function loadNames() {
  try {
    nameResult.textContent = "LOADING...";
    generateBtn.disabled = true;
    
    const [maleResponse, femaleResponse] = await Promise.all([
      fetch('male_names.txt'),
      fetch('female_names.txt')
    ]);
    
    if (!maleResponse.ok || !femaleResponse.ok) {
      throw new Error('Failed to load name files');
    }
    
    const maleText = await maleResponse.text();
    const femaleText = await femaleResponse.text();
    
    maleNames = maleText.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    femaleNames = femaleText.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (maleNames.length === 0 || femaleNames.length === 0) {
      throw new Error('Name files are empty');
    }
    
    isLoading = false;
    generateBtn.disabled = false;
    nameResult.textContent = "READY";
    
  } catch (error) {
    console.error('Error loading names:', error);
    nameResult.textContent = "ERROR: " + error.message;
    generateBtn.disabled = true;
  }
}

// Generate random name with typewriter effect
function generateName() {
  if (isLoading) return;
  
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const namesList = gender === 'male' ? maleNames : femaleNames;
  const randomName = namesList[Math.floor(Math.random() * namesList.length)].toUpperCase();
  
  // Typewriter effect
  let i = 0;
  nameResult.textContent = "";
  const typing = setInterval(() => {
    if (i < randomName.length) {
      nameResult.textContent += randomName[i];
      i++;
    } else {
      clearInterval(typing);
      addToHistory(randomName, gender);
    }
  }, 50);
}

// Add to history log
function addToHistory(name, gender) {
  const timestamp = new Date().toLocaleTimeString();
  nameHistory.unshift({ name, gender, timestamp });
  
  // Update history display
  historyList.innerHTML = nameHistory.slice(0, 10).map(entry => 
    `<div>[${entry.timestamp}] ${entry.gender.toUpperCase()}: ${entry.name}</div>`
  ).join('');
}

// Copy to clipboard with feedback
async function copyToClipboard() {
  const text = nameResult.textContent;
  if (!text || text === "READY" || text.startsWith("ERROR")) return;
  
  try {
    await navigator.clipboard.writeText(text);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "COPIED!";
    copyBtn.style.boxShadow = "0 0 15px #0f0";
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.boxShadow = "";
    }, 2000);
    
  } catch (err) {
    console.error('Failed to copy:', err);
    copyBtn.textContent = "COPY FAILED";
    setTimeout(() => {
      copyBtn.textContent = "COPY TO CLIPBOARD";
    }, 2000);
  }
}

// Initialize the app
function init() {
  loadNames();
  
  generateBtn.addEventListener('click', generateName);
  copyBtn.addEventListener('click', copyToClipboard);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === generateBtn) {
      generateName();
    }
    if (e.key === 'Enter' && document.activeElement === copyBtn) {
      copyToClipboard();
    }
  });
  
  const terminal = document.querySelector('.terminal');
  terminal.style.opacity = '0';
  terminal.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    terminal.style.transition = 'all 0.5s ease-out';
    terminal.style.opacity = '1';
    terminal.style.transform = 'scale(1)';
  }, 300);
}

// Start the app
init();
