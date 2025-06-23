document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.show-status').forEach(button => {
    button.addEventListener('click', () => {
      const className = "3-9";
      console.log(className);   // デバッグ用: クラス名をコンソールに出力
      modal.classList.remove('hidden');
      document.body.classList.add('modal-open'); // モーダル表示時にbodyスクロール禁止
      modalBody.innerHTML = '読み込み中...';
      Gas_Url = `https://script.google.com/macros/s/AKfycbzMRfPuoXAjDxAlNRbkzzK3bmeXy7y_CL5t8SPutjw2Qais7bOPKFIhkvUZL4YaM1CTyw/exec?sheet=${encodeURIComponent(className)}`;
      console.log(Gas_Url);

        fetch(Gas_Url)
        .then(response => response.json())
        .then(data => {
        
        modalBody.innerHTML = data.map(item => {
            const isSoldOut = item["販売状況"] === "完売";

            console.log(`商品名: ${item["商品名"]}`);   // デバッグ用: 商品名をコンソールに出力
            console.log(`価格: ${item["価格"]}`);   // デバッグ用: 価格をコンソールに出力
            console.log(`販売状況: ${item["販売状況"]}`);   // デバッグ用: 販売状況をコンソールに出力
                
            return `<div class="item" style="margin-bottom: 16px;">
                    <strong>${item["商品名"]}</strong><br>
                    価格: ¥${item["価格"]}<br>
                    販売状況: <span style="color:${isSoldOut ? 'red' : 'black'};">${item["販売状況"]}</span><br>
                    </div>`;
            }).join('');
        })

        .catch(error => {
          modalBody.innerHTML = 'データの取得に失敗しました。';
          console.error(error);
        });
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open'); // モーダル非表示時にbodyスクロール復活
  });

  window.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  });
});
