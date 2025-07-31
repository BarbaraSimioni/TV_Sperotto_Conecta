const btnAbrir = document.getElementById('abrir');
const btnFechar = document.getElementById('fechar');
const overlay = document.getElementById('overlay');
const fileInput = document.getElementById('fileInput');
const cardsContainer = document.getElementById('cardsContainer');

btnAbrir.addEventListener('click', () => {
  overlay.classList.add('mostrar');
});

btnFechar.addEventListener('click', () => {
  overlay.classList.remove('mostrar');
});

overlay.addEventListener('click', function (e) {
  if (e.target === overlay) {
    overlay.classList.remove('mostrar');
  }
});

fileInput.addEventListener('change', function () {
  const file = this.files[0]; // CORRIGIDO: "files" no plural
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${e.target.result}" alt="Imagem da Publicação" class="card-img"/>
        <div class="card-footer">
          <h3 class="card-title">Título da Publicação</h3>
        </div>
      `;
      cardsContainer.appendChild(card); // Adiciona novo card ao container
    };
    reader.readAsDataURL(file); // CORRIGIDO: "file", não "fie"
  }
});