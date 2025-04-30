// Global variables
let maleNames = [];
let femaleNames = [];
let unisexNames = [];
let allNamesLoaded = false;
let currentName = "";

// DOM elements
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const currentResult = document.getElementById('currentResult');
const statusMessage = document.getElementById('statusMessage');
const genderRadios = document.querySelectorAll('input[name="gender"]');

// Initialize the app
function init() {
    updateStatus("> Loading name database...");
    
    Promise.all([
        loadNames('male_names.txt', 'male'),
        loadNames('female_names.txt', 'female'),
        loadNames('unisex_names.txt', 'unisex')
    ])
    .then(() => {
        allNamesLoaded = true;
        updateStatus(`> System ready: ${formatNumber(maleNames.length + femaleNames.length + unisexNames.length)} names loaded`);
    })
    .catch(error => {
        console.error('Error loading names:', error);
        updateStatus("> ERROR: Partial database loaded", true);
        showNotification("> Warning: Some names failed to load", true);
    });

    generateBtn.addEventListener('click', generateName);
    copyBtn.addEventListener('click', copyCurrentName);
}

function loadNames(filename, gender) {
    return fetch(filename)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${filename}`);
            return response.text();
        })
        .then(text => {
            const names = text.split('\n')
                .filter(name => name.trim() !== '')
                .map(name => name.trim());
            
            if (gender === 'male') maleNames = names;
            else if (gender === 'female') femaleNames = names;
            else unisexNames = names;
        });
}

function generateName() {
    if (!allNamesLoaded) {
        showNotification("> ERROR: Database not fully loaded", true);
        return;
    }
    
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    let source, genderText;
    
    switch(selectedGender) {
        case 'male':
            source = maleNames;
            genderText = "Male";
            break;
        case 'female':
            source = femaleNames;
            genderText = "Female";
            break;
        case 'unisex':
            source = unisexNames;
            genderText = "Unisex";
            break;
        case 'random':
            // Randomly select between male, female and unisex
            const randomChoice = Math.random();
            if (randomChoice < 0.33) {
                source = maleNames;
                genderText = "Male";
            } else if (randomChoice < 0.66) {
                source = femaleNames;
                genderText = "Female";
            } else {
                source = unisexNames;
                genderText = "Unisex";
            }
            break;
        default:
            source = [];
    }
    
    if (source.length === 0) {
        showNotification(`> ERROR: No ${genderText.toLowerCase()} names available`, true);
        return;
    }
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-cog fa-spin"></i> <span class="glow">PROCESSING...</span>';
    
    setTimeout(() => {
        currentName = source[Math.floor(Math.random() * source.length)];
        currentResult.textContent = currentName;
        currentResult.classList.add("glow");
        
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-terminal"></i> <span class="glow">GENERATE</span>';
        
        showNotification(`> Generated ${genderText} name`);
    }, 300);
}

function copyCurrentName() {
    if (!currentName) {
        showNotification("> ERROR: No name to copy", true);
        return;
    }
    
    navigator.clipboard.writeText(currentName)
        .then(() => {
            showNotification("> Copied to clipboard");
            copyBtn.innerHTML = '<i class="fas fa-check"></i> <span class="glow">COPIED!</span>';
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span class="glow">COPY</span>';
            }, 2000);
        })
        .catch(err => {
            console.error('Copy failed:', err);
            showNotification("> ERROR: Clipboard access denied", true);
        });
}

function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? '#ff5555' : 'var(--secondary-color)';
}

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (isError) {
        notification.style.color = '#ff5555';
        notification.style.borderColor = '#ff5555';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

document.addEventListener('DOMContentLoaded', init);
