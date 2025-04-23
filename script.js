let selectedGender = "male";
let nameData = null;

// Load names from names.json
fetch('names.json')
  .then(response => response.json())
  .then(data => {
    nameData = data;
  })
  .catch(error => {
    console.error("Failed to load name data:", error);
    document.getElementById("nameDisplay").innerText = "Error loading names.";
  });

function selectGender(gender) {
  selectedGender = gender;
  document.getElementById("maleButton").classList.remove("active");
  document.getElementById("femaleButton").classList.remove("active");

  if (gender === "male") {
    document.getElementById("maleButton").classList.add("active");
  } else {
    document.getElementById("femaleButton").classList.add("active");
  }
}

function generateName() {
  if (!nameData) {
    document.getElementById("nameDisplay").innerText = "Names are still loading...";
    return;
  }

  const firstNames = selectedGender === "male" ? nameData.maleFirstNames : nameData.femaleFirstNames;
  const lastNames = nameData.lastNames;

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  document.getElementById("nameDisplay").innerText = `${firstName} ${lastName}`;
}
