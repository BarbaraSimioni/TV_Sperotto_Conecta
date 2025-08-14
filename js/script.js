const abrir = document.getElementById('abrir');
const fechar = document.getElementById('fechar');
const overlay = document.getElementById('overlay');
const fileInput = document.getElementById('fileInput');
const cardsContainer = document.getElementById('cardsContainer');
const playBtn = document.getElementById('play');
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');
const cestoLixo = document.getElementById('trash');

let cardArrastando = null;
let currentIndex = 0;
let imageList = [];
let slideshowInterval;

// Função para abrir/fechar overlay
const toggleOverlay = (show) => {
  overlay.classList.toggle('mostrar', show);
};

// Função para criar card
const criarCard = (imgway, id = null) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('draggable', 'true');
  if (id) card.setAttribute('data-id', id);

  card.innerHTML = `
    <img src="${imgway}" alt="Imagem da publicação" class="card-img"/>
    <div class="card-footer"></div>
  `;

  // Drag & Drop
  card.addEventListener('dragstart', (e) => {
    cardArrastando = card;

    const clone = card.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.top = '-1000px';
    clone.style.left = '-1000px';
    document.body.appendChild(clone);

    e.dataTransfer.setDragImage(clone, clone.offsetWidth / 2, clone.offsetHeight / 2);

    setTimeout(() => card.classList.add('arrastando'), 0);

    setTimeout(() => {
      if (clone.parentNode) document.body.removeChild(clone);
    }, 50);
  });

  card.addEventListener('dragend', () => {
    cardArrastando = null;
    card.classList.remove('arrastando');
  });

  cardsContainer.prepend(card);
};

// Carregar cards do banco ao iniciar
function carregarCards() {
  const setor = "RH"; // alterar conforme a TV
  fetch(`get_cards.php?setor=${setor}`)
    .then(res => res.json())
    .then(cards => {
      cardsContainer.innerHTML = ""; // limpa cards antigos
      cards.forEach(card => criarCard(card.image_path, card.id));
    })
    .catch(err => console.error("Erro ao carregar cards:", err));
}

window.addEventListener('DOMContentLoaded', carregarCards);

// Abrir/fechar overlay
abrir.addEventListener('click', () => toggleOverlay(true));
fechar.addEventListener('click', () => toggleOverlay(false));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) toggleOverlay(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleOverlay(false);
});

// Upload de imagem com proporção mínima 16:9 e envio ao PHP
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const img = new Image();
  const reader = new FileReader();

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

      // Envia imagem para PHP
      const setor = "RH"; // alterar conforme a TV
      const formData = new FormData();
      formData.append('imagem', file);
      formData.append('setor', setor);

      fetch('upload.php', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          criarCard(data.path, data.id);
        } else {
          alert("Erro no upload: " + data.msg);
        }
      })
      .catch(err => console.error("Erro:", err));
    };
  };

  reader.readAsDataURL(file);
});

// Fullscreen e slideshow
playBtn.addEventListener('click', () => {
  const imgs = Array.from(document.querySelectorAll('.card-img')).map(img => img.src);
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

function closeFullscreen() {
  fullscreenViewer.style.display = 'none';
  document.body.style.overflow = '';
}

fullscreenViewer.addEventListener('click', closeFullscreen);

// Drag & Drop Lixeira com exclusão no banco
cestoLixo.addEventListener('dragover', (e) => {
  e.preventDefault();
  cestoLixo.classList.add('ativo');
});

cestoLixo.addEventListener('dragleave', () => {
  cestoLixo.classList.remove('ativo');
});

cestoLixo.addEventListener('drop', (e) => {
  e.preventDefault();
  cestoLixo.classList.remove('ativo');

  if (cardArrastando) {
    if (confirm('Deseja excluir?')) {
      const id = cardArrastando.getAttribute('data-id');
      fetch('delete_card.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `id=${id}`
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') cardArrastando.remove();
      })
      .catch(err => console.error(err));
    }
  }
});