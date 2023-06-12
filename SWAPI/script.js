const BASE_URL = "https://swapi.dev/api/";

function fetchData(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

function createButtons(data) {
  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const button = document.createElement("button");
      button.textContent = key;
      button.addEventListener("click", () => {
        fetchData(data[key]).then((result) => handleData(result));
      });
      buttonsDiv.appendChild(button);
    }
  }
}

function handleData(data) {
  createButtons(data);
  createTable(data.results);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;

  return `${day}-${month}-${year}`;
}

function createTable(results) {
  const table = document.getElementById("data-table");
  table.innerHTML = "";

  if (results.length === 0) {
    const messageRow = document.createElement("tr");
    const messageCell = document.createElement("td");
    messageCell.setAttribute("colspan", "5");
    messageCell.textContent = "No data available";
    messageRow.appendChild(messageCell);
    table.appendChild(messageRow);
  } else {
    const headerRow = document.createElement("tr");

    for (const key in results[0]) {
      if (results[0].hasOwnProperty(key)) {
        const headerCell = document.createElement("th");
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
      }
    }

    headerRow.innerHTML += "<th>Created</th>";
    headerRow.innerHTML += "<th>Actions</th>";
    table.appendChild(headerRow);

    for (let i = 0; i < results.length; i++) {
      const dataRow = document.createElement("tr");

      for (const key in results[i]) {
        if (results[i].hasOwnProperty(key)) {
          const dataCell = document.createElement("td");
          dataCell.textContent = results[i][key];
          dataRow.appendChild(dataCell);
        }
      }

      const createdCell = document.createElement("td");
      createdCell.textContent = formatDate(results[i].created);
      dataRow.appendChild(createdCell);

      const actionsCell = document.createElement("td");
      const detailsButton = document.createElement("button");
      detailsButton.textContent = "Details";
      detailsButton.addEventListener("click", () => {
        showDetails(results[i]);
      });
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        showDeleteModal(results[i]);
      });
      actionsCell.appendChild(detailsButton);
      actionsCell.appendChild(deleteButton);
      dataRow.appendChild(actionsCell);

      table.appendChild(dataRow);
    }
  }
}

function showDetails(data) {
  const detailsModal = document.getElementById("details-modal");
  const detailsContent = document.getElementById("details-content");
  detailsContent.innerHTML = "";

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const detail = document.createElement("p");
      detail.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
      detailsContent.appendChild(detail);
    }
  }

  detailsModal.style.display = "block";
}

function hideDetails() {
  const detailsModal = document.getElementById("details-modal");
  detailsModal.style.display = "none";
}

function showDeleteModal(data) {
  const deleteModal = document.getElementById("delete-modal");
  const deleteYesButton = document.getElementById("delete-yes");
  const deleteNoButton = document.getElementById("delete-no");

  deleteYesButton.addEventListener("click", () => {
    deleteRow(data);
    deleteModal.style.display = "none";
  });

  deleteNoButton.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });

  deleteModal.style.display = "block";
}

function deleteRow(rowData) {
  const table = document.getElementById("data-table");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      if (
        cells[j].textContent === rowData.name ||
        cells[j].textContent === rowData.title
      ) {
        table.deleteRow(i);
        return;
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData(BASE_URL).then((result) => handleData(result));
});

const darkModeButton = document.getElementById("darkModeButton");
const body = document.body;

darkModeButton.addEventListener("click", function () {
  body.classList.toggle("dark-mode");
});
