const maleProfiles = [
  {
    name: "Rahul Shinde",
    age: "29",
    education: "B.E. Mechanical",
    profession: "Engineer",
    height: "5'9\"",
    location: "Junnar",
    family: "Nuclear family",
    dob:"20/09/1996",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Amit Dhokale",
    age: "31",
    education: "MBA",
    profession: "Business Owner",
    height: "5'10\"",
    location: "Narayangaon",
    family: "Joint family",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Sagar Jadhav",
    age: "28",
    education: "B.Com",
    profession: "Bank Employee",
    height: "5'8\"",
    location: "Junnar Taluka",
    fammly: "Educated family",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80"
  }
];

const femaleProfiles = [
  {
    name: "Snehal Pawar",
    age: "26",
    education: "B.Sc Nursing",
    profession: "Nurse",
    height: "5'4\"",    
    location: "Junnar",
    family: "Well-cultured family",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "प्रियांका बाळशिराम पिंगळ",
    age: "24",
    education: "M.Com",
    profession: "Accountant",
    height: "5'3\"",
    location: "Alephata",
    family: "Nuclear family",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Vaishnavi Kale",
    age: "27",
    education: "B.E. IT",
    profession: "Engineer",
    height: "5'5\"",
    location: "Junnar Taluka",
    family: "Working family",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
  }
];

// Track which gender is currently selected
let currentProfiles = [];

function showProfiles(type) {
  const title = document.getElementById("profileTitle");

  if (type === "male") {
    currentProfiles = maleProfiles;
    title.textContent = "Male Biodata Profiles";
  } else {
    currentProfiles = femaleProfiles;
    title.textContent = "Female Biodata Profiles";
  }

  // Reset filters when switching gender
  document.getElementById("professionFilter").value = "";
  document.getElementById("ageFilter").value = "";

  displayProfiles(currentProfiles);
}

function applyFilters() {
  // Must select a gender first
  if (currentProfiles.length === 0) return;

  const profession = document.getElementById("professionFilter").value.toLowerCase();
  const age = document.getElementById("ageFilter").value;

  const filtered = currentProfiles.filter(p => {
    const matchProfession = profession === "" || p.profession.toLowerCase().includes(profession);

    let matchAge = true;
    if (age !== "") {
      matchAge = parseInt(p.age) <= parseInt(age);
    }

    return matchProfession && matchAge;
  });

  displayProfiles(filtered);
}

function displayProfiles(profiles) {
  const container = document.getElementById("profileContainer");
  container.innerHTML = "";

  if (profiles.length === 0) {
    container.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:#7b1e1e; font-size:18px;'>No profiles found matching your filters.</p>";
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement("div");
    card.className = "biodata-card";

    card.innerHTML = `
      <img src="${profile.image}" alt="${profile.name}">
      <div class="biodata-content">
        <h3>${profile.name}</h3>
        <p><strong>Age:</strong> ${profile.age}</p>
        <p><strong>Date of Birth:</strong> ${profile.dob}</p>
        <p><strong>Education:</strong> ${profile.education}</p>
        <p><strong>Profession:</strong> ${profile.profession}</p>
        <p><strong>Height:</strong> ${profile.height}</p>
        <p><strong>Location:</strong> ${profile.location}</p>
        <p><strong>Family:</strong> ${profile.family}</p>
      </div>
    `;

    container.appendChild(card);
  });
}