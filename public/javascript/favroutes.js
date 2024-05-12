document.addEventListener('DOMContentLoaded', () => {
    // Populate the points dropdown
    const pointsDropdown = document.getElementById('points');
    const points = [
      { id: 1, name: 'Padrão dos Descobrimentos' },
      { id: 2, name: 'Torre de Belém' },
      { id: 3, name: 'Armazéns do Chiado' },
      { id: 4, name: 'Lisboa Story Centre' },
      { id: 5, name: 'Praça Luís de Camões' },
      { id: 6, name: 'Farol de Belém' },
      { id: 7, name: 'Timeout Market Lisboa' },
      { id: 8, name: 'Arco do Triunfo' },
      { id: 9, name: 'Estátua D. José I' },
      { id: 10, name: 'IADE' },
      { id: 11, name: 'Rua cor de Rosa' },
      { id: 12, name: 'Teatro da Trindade INATEL' },
    ];
    points.forEach((point) => {
      const option = document.createElement('option');
      option.value = point.id;
      option.textContent = point.name;
      pointsDropdown.appendChild(option);
    });
  
    // Populate the routes table
    const routesTable = document.getElementById('routes-table');
    const routes = [
      { id: 1, name: 'Route 1' },
      { id: 2, name: 'Route 2' },
      { id: 3, name: 'Route 3' },
    ];
    routes.forEach((route) => {
      const row = document.createElement('tr');
      const routeCell = document.createElement('td');
      routeCell.textContent = route.name;
      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.addEventListener('click', () => {
        // Delete route from database and table
        console.log(`Delete route ${route.id}`);
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(routeCell);
      row.appendChild(deleteCell);
      routesTable.tBodies[0].appendChild(row);
    });
  
    // Add event listener for creating a new route
    const newRouteButton = document.getElementById('new-route-button');
    newRouteButton.addEventListener('click', () => {
      const newRoutePopup = document.getElementById('new-route-popup');
      newRoutePopup.style.display = 'block';
    });
  
    // Add event listener for closing the new route popup
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      const newRoutePopup = document.getElementById('new-route-popup');
      newRoutePopup.style.display = 'none';
    });
  
    // Add event listener for submitting the new route form
    const newRouteForm = document.getElementById('new-route-form');
    newRouteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pointsSelected = Array.from(pointsDropdown.selectedOptions, (option) => option.value);
      console.log(`Create new route with points: ${pointsSelected}`);
      // Create new route in database
    });
  });