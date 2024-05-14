document.addEventListener("DOMContentLoaded", async function () {
  const newRouteBtn = document.getElementById("new-route-btn");
  const selectPointsPopup = document.getElementById("select-points-popup");
  const pointsList = document.getElementById("points-list");
  const confirmBtn = document.getElementById("confirm-btn");
  const logoutBtn = document.querySelector(".logout button");
  const saveRouteBtn = document.getElementById("save-create-route-btn");
  const routeNameInput = document.getElementById("route-name");
  const sessionInfoDiv = document.getElementById("session-info");

  let points;
  let sessionData; // Variable to store session information

  // Function to fetch user session information from the server
  async function fetchSessionInfo() {
      try {
          const response = await fetch("/sessionInfo", {
              method: "GET",
              credentials: "include" // Include credentials to send cookies
          });
          if (response.ok) {
              sessionData = await response.json(); // Save session information
              console.log("Session data received:", sessionData); // Log session data received from server
              displaySessionInfo(sessionData);
          } else {
              console.error("Error fetching session information:", response.statusText);
          }
      } catch (error) {
          console.error("Error fetching session information:", error);
      }
  }

  // Function to display session information on the page
  function displaySessionInfo(sessionData) {
      if (sessionData) {
          sessionInfoDiv.innerHTML = `
              <p>Username: ${sessionData.username}</p>
              <p>User ID: ${sessionData.user_id}</p>
              <p>Role: ${sessionData.role}</p>
          `;
      } else {
          sessionInfoDiv.innerHTML = "<p>No user session information found</p>";
      }
  }

  // Call fetchSessionInfo when the page loads
  fetchSessionInfo();

  // Function to retrieve user ID from session
  function getUserIdFromSession() {
      // Retrieve user object from session
      if (sessionData) {
          // Return the user ID
          return sessionData.user_id;
      } else {
          // Handle case where user object is not found in session
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
        listItem.textContent = foundPoint.location_name; // Display name of the location
        listItem.setAttribute("data-location-id", foundPoint.location_id); // Store location ID as a data attribute
        listItem.draggable = true;
        selectedLocationsList.appendChild(listItem); // Append <li> to the "selected-locations-list"
    });

      setUpDragAndDrop(selectedLocationsList);
  });

  saveRouteBtn.addEventListener("click", async function () {
      const routeName = routeNameInput.value.trim();
      const sortedPointIds = getSortedPointIdsFromDragAndDrop();
      
      // Retrieve user ID from session
      const userId = getUserIdFromSession(); // Replace this with actual method to get user ID from session
      
      console.log("Route Name:", routeName);
      console.log("Sorted Point IDs:", sortedPointIds);
      console.log("User ID:", userId);
      
      try {
          console.log("Sending request to add favorite route:", {
              user_id: userId,
              route_name: routeName,
              route_points: sortedPointIds,
          });
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
          const data = await response.json();
          console.log("Favorite route added:", data);
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
        const pointId = parseInt(listItem.getAttribute("data-location-id")); // Retrieve location ID from data attribute
        sortedPointIds.push(pointId);
    });

    return sortedPointIds;
}
