let currentProfiles = [];
let currentPage = 1;
let currentProfileType = "";
const profilesPerPage = 4; // Show 4 profiles per page

function showProfiles(type) {
  const container = document.getElementById("profileContainer");
  const title = document.getElementById("profileTitle");
  currentProfileType = type;

  if (type === "male") {
    currentProfiles = maleProfiles;
    title.textContent = "Male Biodata Profiles";
  } else {
    currentProfiles = femaleProfiles;
    title.textContent = "Female Biodata Profiles";
  }

  // Reset filters and pagination
  document.getElementById("professionFilter").value = "";
  document.getElementById("ageFilter").value = "";
  currentPage = 1;

  updateBiodataUrl();
  displayProfiles(currentProfiles, currentPage);
}

function displayProfiles(profiles, page = 1) {
  const container = document.getElementById("profileContainer");
  const startIndex = (page - 1) * profilesPerPage;
  const endIndex = startIndex + profilesPerPage;
  const profilesToShow = profiles.slice(startIndex, endIndex);

  container.innerHTML = "";

  profilesToShow.forEach(profile => {
    const card = document.createElement("div");
    card.className = "biodata-card";
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="biodata-code-badge"># ${profile.code}</div>
      <img src="${profile.image}" alt="${profile.name}">
      <div class="biodata-content">
        <h3>${profile.name}</h3>
        <p><strong>Profile Code:</strong> <span class="profile-code">${profile.code}</span></p>
        <p><strong>वय:</strong> ${profile.age}</p>
        <p><strong>शिक्षण:</strong> ${profile.education}</p>
        <p><strong>Profession:</strong> ${profile.profession}</p>
        <p><strong>उंची:</strong> ${profile.height}</p>
        <p><strong>ठिकाण:</strong> ${profile.location}</p>
        <p><strong>पगार:</strong> ${profile.family}</p>
      </div>
    `;

    const goToDetail = () => {
      window.location.href = `view-profile.html?code=${profile.code}&type=${currentProfileType}&page=${currentPage}`;
    };

    card.addEventListener("click", goToDetail);
    card.addEventListener("keypress", event => {
      if (event.key === "Enter" || event.key === " ") {
        goToDetail();
      }
    });

    container.appendChild(card);
  });

  // Add pagination controls
  displayPagination(profiles.length, page);
}

function displayPagination(totalProfiles, currentPage) {
  const paginationContainer = document.getElementById("paginationContainer");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalProfiles / profilesPerPage);

  if (totalPages <= 1) return; // No pagination needed for single page

  // Previous button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "← Pre";
    prevButton.className = "pagination-btn";
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevButton);
  }

  // Page numbers with smart ellipsis
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add first page button if not showing
  if (startPage > 1) {
    const firstButton = document.createElement("button");
    firstButton.textContent = "1";
    firstButton.className = "pagination-btn";
    firstButton.onclick = () => changePage(1);
    paginationContainer.appendChild(firstButton);

    // Add ellipsis if there's a gap
    if (startPage > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.className = "pagination-ellipsis";
      ellipsis.style.display = "flex";
      ellipsis.style.alignItems = "center";
      ellipsis.style.padding = "0 4px";
      paginationContainer.appendChild(ellipsis);
    }
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    pageButton.onclick = () => changePage(i);
    paginationContainer.appendChild(pageButton);
  }

  // Add last page button if not showing
  if (endPage < totalPages) {
    // Add ellipsis if there's a gap
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.textContent = "...";
      ellipsis.className = "pagination-ellipsis";
      ellipsis.style.display = "flex";
      ellipsis.style.alignItems = "center";
      ellipsis.style.padding = "0 4px";
      paginationContainer.appendChild(ellipsis);
    }

    const lastButton = document.createElement("button");
    lastButton.textContent = totalPages;
    lastButton.className = "pagination-btn";
    lastButton.onclick = () => changePage(totalPages);
    paginationContainer.appendChild(lastButton);
  }

  // Next button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next →";
    nextButton.className = "pagination-btn";
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextButton);
  }
}

function changePage(page) {
  currentPage = page;
  updateBiodataUrl();
  displayProfiles(currentProfiles, currentPage);
}

function updateBiodataUrl() {
  if (!window.location.pathname.includes('biodata.html') || !currentProfileType) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("type", currentProfileType);
  url.searchParams.set("page", currentPage);
  window.history.replaceState({}, "", url);
}

// Display action buttons (Back and WhatsApp) on profile view page
function displayActionButtons(profileCode, page, type) {
  const actionButtonsDiv = document.getElementById("actionButtons");
  
  if (!actionButtonsDiv) return; // Not on profile view page

  const backUrl = `biodata.html?type=${type || "female"}&page=${page}`;
  
  actionButtonsDiv.innerHTML = `
    <a href="${backUrl}" class="btn btn-back">← Back to Profiles</a>
    <button onclick="shareViaWhatsApp('${profileCode}')" class="btn btn-whatsapp">💬 Get Contact Info</button>
  `;
}

// Share profile via WhatsApp to admin
function shareViaWhatsApp(profileCode) {
  if (typeof ADMIN_WHATSAPP === 'undefined') {
    alert("Admin WhatsApp number not configured.");
    return;
  }
  
  const message = `Hello, I'm interested in profile code: ${profileCode}. Please provide me the contact information.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank');
}

const allProfiles = [...maleProfiles, ...femaleProfiles];
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const type = params.get("type") || "female";
const page = params.get("page") || 1; // Get page parameter, default to 1
const profile = allProfiles.find(p => p.code === code);
const details = document.getElementById("profileDetails");

if (details) {
  if (profile) {
    // Display action buttons
    displayActionButtons(code, page, type);
    
    details.innerHTML = `
      <img src="${profile.image}" alt="${profile.name}">
      <div class="details-content">
        <h1>${profile.name}</h1>

<p><strong>Code:</strong> ${profile.code}</p>
<p><strong>नाव:</strong> ${profile.name}</p>
<p><strong>वय:</strong> ${profile.age}</p>
<p><strong>जन्मतारीख:</strong> ${profile.dateOfBirth}</p>
<p><strong>धर्म:</strong> ${profile.religion}</p>
<p><strong>जात:</strong> ${profile.caste}</p>
<p><strong>रक्त गट:</strong> ${profile.bloodGroup}</p>
<p><strong>रास:</strong> ${profile.ras}</p>
<p><strong>गण:</strong> ${profile.गण}</p>
<p><strong>नाडी:</strong> ${profile.नाडी}</p>
<p><strong>देवक:</strong> ${profile.देवक}</p>
<p><strong>जन्मस्थळ:</strong> ${profile.Birthplace}</p>
<p><strong>जन्म वेळ:</strong> ${profile.Birthtime}</p>
<p><strong>शिक्षण:</strong> ${profile.education}</p>
<p><strong>नोकरी:</strong> ${profile.profession}</p>
<p><strong>उंची:</strong> ${profile.height}</p>
<p><strong>ठिकाण:</strong> ${profile.location}</p>
<p><strong>वडिलांचा व्यवसाय:</strong> ${profile.fatherOccupation}</p>
<p><strong>आईचा व्यवसाय:</strong> ${profile.motherOccupation}</p>
<p><strong>भावंडे:</strong> ${profile.siblings}</p>
<p><strong>छंद:</strong> ${profile.hobbies}</p>
<p><strong>सध्याचे ठिकाण:</strong> ${profile.expectations}</p>
<p><strong>नातेसंबधं:</strong> ${profile.relatives}</p>


      </div>
    `;
  } else {
    displayActionButtons(code, page, type);
    details.innerHTML = `<h2>Profile not found</h2>`;
  }
}

function applyFilters() {
  const profession = document.getElementById("professionFilter").value.toLowerCase();
  const age = document.getElementById("ageFilter").value;

  let filtered = currentProfiles.filter(p => {
    let matchProfession = profession === "" || p.profession.toLowerCase().includes(profession);

    let matchAge = true;
    if (age !== "") {
      matchAge = parseInt(p.age) <= parseInt(age);
    }

    return matchProfession && matchAge;
  });

  currentPage = 1; // Reset to first page when filtering
  displayProfiles(filtered, currentPage);
}

// Initialize page on biodata.html load
if (window.location.pathname.includes('biodata.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  const pageParam = urlParams.get('page');

  if (typeParam || pageParam) {
    currentProfileType = typeParam === "male" ? "male" : "female";
    currentProfiles = currentProfileType === "male" ? maleProfiles : femaleProfiles;
    currentPage = parseInt(pageParam) || 1;
    document.getElementById("profileTitle").textContent = currentProfileType === "male"
      ? "Male Biodata Profiles"
      : "Female Biodata Profiles";
    updateBiodataUrl();
    displayProfiles(currentProfiles, currentPage);
  }
}
