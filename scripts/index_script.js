async function loadExcelProjects() {
    try {
        const response = await fetch('/data/projects.xlsx');
        const arrayBuffer = await response.arrayBuffer();
  
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const projects = XLSX.utils.sheet_to_json(sheet);

        console.log(projects);  // Log the parsed data

        renderProjects(projects);
    } catch (error) {
        console.error("Error loading Excel file:", error);
    }
}


    function renderProjects(projects) {
      const container = document.getElementById("projectContainer");
      const showMoreContainer = document.getElementById("showMoreContainer");
      container.innerHTML = "";
      showMoreContainer.innerHTML = "";

      const maxProjectsToShow = 6;
      const limitedProjects = projects.slice(0, maxProjectsToShow);

      limitedProjects.forEach(project => {
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

      if (projects.length > maxProjectsToShow) {
        const button = document.createElement("button");
        button.textContent = "Show More Projects";
        button.className = "show-more-btn";
        button.onclick = () => {
          window.location.href = "all_projects_mobile.html";
        };
        showMoreContainer.appendChild(button);
      }
    }

    window.addEventListener("DOMContentLoaded", loadExcelProjects);