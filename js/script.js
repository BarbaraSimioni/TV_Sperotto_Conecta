  const fileInput = document.getElementById('fileInput');
  const cardsContainer = document.getElementById('cardsContainer');

  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Criar o card
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${e.target.result}" alt="Imagem da Publicação" class="card-img"/>
          <div class="card-title">Título da Publicação</div>
        `;
        cardsContainer.appendChild(card);
      };
      reader.readAsDataURL(file);
    }
  });