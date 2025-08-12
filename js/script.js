const abrir = document.getElementById('abrir');
const fechar = document.getElementById('fechar');
const overlay = document.getElementById('overlay');
const fileInput = document.getElementById('fileInput');
const cardsContainer = document.getElementById('cardsContainer');

const toggleOverlay = (show) => {
  overlay.classList.toggle('mostrar', show);
};

const criarCard = (imgSrc) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${imgSrc}" alt="Imagem da publicação" class="card-img"/>
    <div class="card-footer"></div>
  `;
  cardsContainer.appendChild(card);
};

abrir.addEventListener('click', () => toggleOverlay(true));
fechar.addEventListener('click', () => toggleOverlay(false));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) toggleOverlay(false);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => criarCard(e.target.result);
    reader.readAsDataURL(file);
  }
});