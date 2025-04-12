async function loadAllProjects() {
    try {
      const response = await fetch('/data/projects.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const projects = XLSX.utils.sheet_to_json(sheet);
      renderAllProjects(projects);
    } catch (error) {
      console.error("Error loading Excel file:", error);
    }
  }

  function renderAllProjects(projects) {
    const container = document.getElementById("projectContainer");
    container.innerHTML = "";

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <div class="card-content">
          <div class="project-img" style="background-image: url('${project.ImageURL}')"></div>
          <h2>${project.Title}</h2>
          <p class="project-desc">${project.Description}</p>
          <p class="languages-tools"><strong>Languages & Tools:</strong> ${project.LanguagesTools}</p>
        </div>
        <a href="${project.GitHubLink}" target="_blank" class="overlay-text">GitHub Link</a>
      `;

      container.appendChild(card);
    });
  }

  window.addEventListener("DOMContentLoaded", loadAllProjects);