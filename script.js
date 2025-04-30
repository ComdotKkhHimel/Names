// Global variables
let maleNames = [];
let femaleNames = [];
let allNamesLoaded = false;
let isGenerating = false;
let generatedCount = 0;

// DOM elements
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsDiv = document.getElementById('results');
const resultCount = document.getElementById('resultCount');
const statusMessage = document.getElementById('statusMessage');
const genderRadios = document.querySelectorAll('input[name="gender"]');

// Initialize the app
function init() {
    updateStatus("> Loading name database...");
    
    Promise.all([
        loadNames('male_names.txt', 'male'),
        loadNames('female_names.txt', 'female')
    ])
    .then(() => {
        allNamesLoaded = true;
        updateStatus(`> System ready: ${formatNumber(maleNames.length + femaleNames.length)} identities loaded`);
        console.log(`Loaded ${maleNames.length} male and ${femaleNames.length} female names`);
    })
    .catch(error => {
        console.error('Error loading names:', error);
        updateStatus("> ERROR: Partial database loaded", true);
        showNotification("> Warning: Some names failed to load", true);
    });

    generateBtn.addEventListener('click', generateName);
    clearBtn.addEventListener('click', clearResults);
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
            else femaleNames = names;
        });
}

function generateName() {
    if (!allNamesLoaded) {
        showNotification("> ERROR: Database not fully loaded", true);
        return;
    }
    
    if (isGenerating) return;
    isGenerating = true;
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-cog fa-spin"></i> <span class="glow">PROCESSING...</span>';
    
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const source = selectedGender === 'male' ? maleNames : femaleNames;
    
    if (source.length === 0) {
        showNotification(`> ERROR: No ${selectedGender} names available`, true);
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-terminal"></i> <span class="glow">GENERATE</span>';
        isGenerating = false;
        return;
    }
    
    setTimeout(() => {
        const randomName = source[Math.floor(Math.random() * source.length)];
        displayName(randomName);
        generatedCount++;
        resultCount.textContent = generatedCount;
        
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-terminal"></i> <span class="glow">GENERATE</span>';
        isGenerating = false;
        
        showNotification("> New identity generated");
    }, 300); // Simulate processing delay
}

function displayName(name) {
    const nameCard = document.createElement('div');
    nameCard.className = 'name-card glow';
    
    const nameText = document.createElement('div');
    nameText.className = 'name-text';
    nameText.textContent = name;
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = "Copy name";
    
    copyBtn.addEventListener('click', () => {
        copyToClipboard(name, copyBtn);
    });
    
    nameCard.appendChild(nameText);
    nameCard.appendChild(copyBtn);
    resultsDiv.appendChild(nameCard);
    
    // Scroll to the new name
    setTimeout(() => {
        nameCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text)
        .then(() => {
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.classList.remove('copied');
            }, 2000);
            
            showNotification("> Copied to clipboard");
        })
        .catch(err => {
            console.error('Copy failed:', err);
            showNotification("> ERROR: Clipboard access denied", true);
        });
}

function clearResults() {
    if (resultsDiv.children.length === 0) {
        showNotification("> No names to clear");
        return;
    }
    
    resultsDiv.innerHTML = '';
    generatedCount = 0;
    resultCount.textContent = '0';
    showNotification("> Cleared all generated names");
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