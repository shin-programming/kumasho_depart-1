//htmlファイルから格納されたデータの取得
const className = document.getElementById("className").dataset.classname;
const classNumber = document.getElementById("classNumber").dataset.classnumber;

// 正常に取得できているかの確認
console.log("デバッグ情報:");
console.log(`className: ${className}`);
console.log(`classNumber: ${classNumber}`);

// ログイン時にlocalStorageへ 'isLoggedIn${classNumber}' を保存している前提
if (!localStorage.getItem(`isLoggedIn${classNumber}`)) {
    window.location.href = '../../home/home.html';
}
// ページ描画後にイベント登録・データ取得
window.addEventListener('DOMContentLoaded', async function () {

    // ログアウト処理
    document.querySelector('.logout-button').addEventListener('click', function () {
        localStorage.removeItem(`isLoggedIn${classNumber}`);
        window.location.href = '../../home/home.html';
    });

    // 再読み込みボタン処理
    document.querySelector('.reload-button').addEventListener('click', function () {
        window.location.reload();
    });

    // ローディング表示
    document.getElementById('loading').style.display = 'flex';
    // GET用（初期データ取得）
    const gas_url = "https://script.google.com/macros/s/AKfycbx4CXcdNsaEU4nZ7eEeUCCuDkiRpyidMtHAuSY4OgTBVzqyoEGjv5EJreKON-gvpwBJ/exec?sheet=" + encodeURIComponent(className);
    // POST用（販売状況更新）
    const gas_post_url = "https://script.google.com/macros/s/AKfycbx4CXcdNsaEU4nZ7eEeUCCuDkiRpyidMtHAuSY4OgTBVzqyoEGjv5EJreKON-gvpwBJ/exec";

    console.log(`gas_url: ${gas_url}`);    //URLが正しいかを確認

    await fetch(gas_url)
        .then(response => response.json())
        .then(data => {

            console.log(data);    //gasから取得したデータの確認
            console.log(`number of products: ${data.length}`);    //データ数（商品数の確認）
            console.log(`number of sold out products: ${data.filter(item => item.sales === "完売").length}`);    //完売数の確認

            document.getElementById("pd").textContent = data.length;
            document.getElementById("sold-out").textContent = data.filter(item => item.sales === "完売").length;

            // 商品テーブル生成
            const table = document.getElementById('product-table');

            // ヘッダー
            table.innerHTML = `<thead><tr><th>商品名</th><th>販売価格</th><th>販売状況</th></tr></thead><tbody></tbody>`;
            const tbody = table.querySelector('tbody');

            // データ行
            data.slice(0).forEach(item => {
                const tr = document.createElement('tr');
                // 販売状況のクラス分岐
                let statusClass = '';
                // 商品名の前後空白を除去して比較用に格納
                const pdname = (item.pdname || '').trim();
                const isSoldout = (item.sales || '').trim() === '完売';
                statusClass = isSoldout ? 'status-soldout' : 'status-on-sale';
                // チェックボックスHTML
                const checkbox = `<input type="checkbox" class="status-checkbox" data-pdname="${pdname}" ${isSoldout ? 'checked' : ''}>`;
                tr.innerHTML = `<td>${pdname || '商品名が読み込めませんでした'}</td><td>¥${item.price.toLocaleString() || '商品価格が読み込めませんでした'}</td><td class="${statusClass}">${checkbox}<span class="status-label">${isSoldout ? '完売' : '販売中'}</span></td>`;
                tbody.appendChild(tr);
            });
            // チェックボックスイベント登録
            tbody.querySelectorAll('.status-checkbox').forEach(cb => {
                cb.addEventListener('change', function () {
                    // 商品名の前後空白を除去して送信
                    const pdname = (this.getAttribute('data-pdname') || '').trim();
                    const newStatus = this.checked ? '完売' : '販売中';
                    // ラベルも即時切り替え
                    this.nextElementSibling.textContent = newStatus;
                    // クラスも切り替え
                    this.parentElement.className = this.checked ? 'status-soldout' : 'status-on-sale';
                    // GASへPOST（POST用URLはクエリなし）
                    const params = new URLSearchParams({
                        sheet: className,
                        pdname: pdname,
                        status: newStatus
                    });

                    fetch(gas_post_url, {
                        method: 'POST',
                        body: params
                    })

                    .then(res => res.text())
                    .then(result => {
                        // alert('GAS返却値: ' + result); // ★デバッグ用
                        if (result !== 'OK') alert('スプレッドシート更新に失敗しました');

                        fetch(gas_url)
                            .then(response => response.json())
                            .then(data => {
                                // 完売数を更新
                                document.getElementById("sold-out").textContent = data.filter(item => item.sales === "完売").length;
                            });

                    });
                });
            });
        })
        .finally(() => {    // ローディング非表示
            document.getElementById('loading').style.display = 'none';    
        });
});