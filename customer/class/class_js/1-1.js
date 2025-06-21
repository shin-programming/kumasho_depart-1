const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

document.querySelectorAll('.show-status').forEach(button => {
  button.addEventListener('click', () => {
    const className = button.dataset.class;
    modal.style.display = 'flex';
    modalBody.innerHTML = '読み込み中...';

    fetch(`https://script.google.com/macros/s/AKfycbywrvIhsu7u9Uw_tXxxYZR7ro0ReQPZdrurz_R0bNyaL3IunLQwUboClCf7ijNlFaS4/exec?class=${className}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          modalBody.innerHTML = `<p style="color:red;">${data.error}</p>`;
        } else {
          modalBody.innerHTML = data.map(item =>
            `<div class="item">
               <strong>${item["商品名"]}</strong><br>
               価格: ¥${item["価格"]}<br>
               状況: ${item["販売状況"]}
             </div>`
          ).join('');
        }
      })
      .catch(error => {
        modalBody.innerHTML = 'データの取得に失敗しました。';
        console.error(error);
      });
  });
});

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    modal.style.display = 'none';
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});
