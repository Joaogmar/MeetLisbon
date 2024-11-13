document.addEventListener("DOMContentLoaded", async function () {
  const newRouteBtn = document.getElementById("new-route-btn");
  const selectPointsPopup = document.getElementById("select-points-popup");
  const pointsList = document.getElementById("points-list");
  const confirmBtn = document.getElementById("confirm-btn");
  const logoutBtn = document.querySelector(".logout button");
  const saveRouteBtn = document.getElementById("save-create-route-btn");
  const routeNameInput = document.getElementById("route-name");
  const routesTable = document.getElementById("routes-body");

  let points;
  let sessionData;

  async function fetchFavoriteRoutes() {
    try {
        const response = await fetch("/favoriteRoutes");
        if (response.ok) {
            const favoriteRoutes = await response.json();
            displayFavoriteRoutes(favoriteRoutes);
        } else {
            console.error("Error fetching favorite routes:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching favorite routes:", error);
    }
}

function displayFavoriteRoutes(favoriteRoutes) {
    routesTable.innerHTML = "";
    favoriteRoutes.forEach(route => {
        const row = document.createElement("tr");

        const routeNameCell = document.createElement("td");
        routeNameCell.textContent = route.route_name;
        row.appendChild(routeNameCell);

        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteFavoriteRoute(route.user_id, route.route_name); 
        });
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);

        routesTable.appendChild(row);
    });
}

async function deleteFavoriteRoute(user_id, route_name) {
    try {
        const response = await fetch(`/favoriteRoutes/${user_id}/${encodeURIComponent(route_name)}`, {
            method: "DELETE"
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Favorite route deleted:", data);
            fetchFavoriteRoutes();
        } else {
            console.error("Error deleting favorite route:", response.statusText);
        }
    } catch (error) {
        console.error("Error deleting favorite route:", error);
    }
}

fetchFavoriteRoutes();

  async function fetchSessionInfo() {
      try {
          const response = await fetch("/sessionInfo", {
              method: "GET",
              credentials: "include"
          });
          if (response.ok) {
              sessionData = await response.json();
              console.log("Session data received:", sessionData);
          } else {
              console.error("Error fetching session information:", response.statusText);
          }
      } catch (error) {
          console.error("Error fetching session information:", error);
      }
  }

  fetchSessionInfo();

  function getUserIdFromSession() {
      if (sessionData) {
          return sessionData.user_id;
      } else {
          console.error('User object not found in session');
          return null;
      }
  }

  newRouteBtn.addEventListener("click", async function () {
      try {
          const response = await fetch("/locations");
          points = await response.json();

          pointsList.innerHTML = "";

          points.forEach((point) => {
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.name = "point";
              checkbox.value = point.location_id;

              const label = document.createElement("label");
              label.textContent = point.location_name;

              const div = document.createElement("div");
              div.appendChild(checkbox);
              div.appendChild(label);

              pointsList.appendChild(div);
          });

          selectPointsPopup.style.display = "block";
      } catch (error) {
          console.error("Error fetching points:", error);
      }
  });

  selectPointsPopup
      .querySelector(".close-btn")
      .addEventListener("click", function () {
          selectPointsPopup.style.display = "none";
      });

  confirmBtn.addEventListener("click", function () {
      selectPointsPopup.style.display = "none";
      const createRoutePopup = document.getElementById("create-route-popup");
      createRoutePopup.style.display = "block";

      const selectedLocationsList = document.getElementById(
          "selected-locations-list"
      );
      selectedLocationsList.innerHTML = "";
      const selectedPoints = Array.from(
          pointsList.querySelectorAll('input[type="checkbox"]:checked')
      ).map((checkbox) => parseInt(checkbox.value));
      selectedPoints.forEach((point) => {
        const listItem = document.createElement("li");
        const foundPoint = points.find((p) => p.location_id === point);
        listItem.textContent = foundPoint.location_name;
        listItem.setAttribute("data-location-id", foundPoint.location_id);
        listItem.draggable = true;
        selectedLocationsList.appendChild(listItem);
    });

      setUpDragAndDrop(selectedLocationsList);
  });

  saveRouteBtn.addEventListener("click", async function () {
      const routeName = routeNameInput.value.trim();
      const sortedPointIds = getSortedPointIdsFromDragAndDrop();
      const userId = getUserIdFromSession();

      try {
          const response = await fetch("/favoriteRoutes", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  user_id: userId,
                  route_name: routeName,
                  route_points: sortedPointIds,
              }),
          });
          if (response.ok) {
              const data = await response.json();
              console.log("Favorite route added:", data);
              const createRoutePopup = document.getElementById("create-route-popup");
              createRoutePopup.style.display = "none";
              alert("Route created successfully");
              fetchFavoriteRoutes();
          } else {
              console.error("Error adding favorite route:", response.statusText);
          }
      } catch (error) {
          console.error("Error adding favorite route:", error);
      }
  });

  logoutBtn.addEventListener("click", function () {
      console.log("Logout button clicked");
  });
});

function setUpDragAndDrop(selectedLocationsList) {
  const listItems = selectedLocationsList.querySelectorAll("li");

  listItems.forEach((listItem) => {
      listItem.addEventListener("dragstart", handleDragStart);
      listItem.addEventListener("dragover", handleDragOver);
      listItem.addEventListener("drop", handleDrop);
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.textContent);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setDragImage(event.target, 10, 10);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();

  const draggedText = event.dataTransfer.getData("text/plain");

  let draggedElement;
  for (let i = 0; i < event.target.parentNode.children.length; i++) {
      if (event.target.parentNode.children[i].textContent === draggedText) {
          draggedElement = event.target.parentNode.children[i];
          break;
      }
  }

  if (draggedElement && event.target.tagName === "LI") {
      event.target.parentNode.insertBefore(draggedElement, event.target);
  }
}

function getSortedPointIdsFromDragAndDrop() {
    const selectedLocationsList = document.getElementById("selected-locations-list");
    const listItems = selectedLocationsList.querySelectorAll("li");

    const sortedPointIds = [];
    listItems.forEach((listItem) => {
        const pointId = parseInt(listItem.getAttribute("data-location-id"));
        sortedPointIds.push(pointId);
    });

    return sortedPointIds;
}
