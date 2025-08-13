const abrir = document.getElementById('abrir');
const fechar = document.getElementById('fechar');
const overlay = document.getElementById('overlay');
const fileInput = document.getElementById('fileInput');
const cardsContainer = document.getElementById('cardsContainer');

const toggleOverlay = (show) => {
  overlay.classList.toggle('mostrar', show);
};

const criarCard = (imgway) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${imgway}" alt="Imagem da publicação" class="card-img"/>
    <div class="card-footer"></div>
  `;
  cardsContainer.prepend(card); 
};

// Abrir e fechar overlay
abrir.addEventListener('click', () => toggleOverlay(true));
fechar.addEventListener('click', () => toggleOverlay(false));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) toggleOverlay(false);
});

// Upload de imagem com verificação de proporção mínima 16:9
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;

      img.onload = () => {
        const proporcao = img.width / img.height;
        const proporcaoMinima = 16 / 9; 

        if (proporcao < proporcaoMinima) {
          alert('Erro: A imagem precisa ter pelo menos proporção 16:9');
          fileInput.value = "";
          return;
        }

        criarCard(e.target.result); 
      };
    };

    reader.readAsDataURL(file);
  }
});

// Tela cheia ao apertar play 
const playBtn = document.getElementById('play');
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');

let currentIndex = 0;
let imageList = [];
let slideshowInterval;

playBtn.addEventListener('click', () => {
  const imgs = Array.from(document.querySelectorAll('.card-img'))
    .map(img => img.src);

  if (imgs.length === 0) return;

  imageList = imgs;
  currentIndex = 0;

  fullscreenImage.src = imageList[currentIndex];
  fullscreenViewer.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  clearInterval(slideshowInterval);

  slideshowInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % imageList.length;
    fullscreenImage.src = imageList[currentIndex];
  }, 5000);
});

// Fechar Tela cheia 
function closeFullscreen() {
  fullscreenViewer.style.display = 'none';
  document.body.style.overflow = '';
}

fullscreenViewer.addEventListener('click', closeFullscreen);