// classNameをHTMLから取得（例: 3-9など）
const className = document.getElementById("className").dataset.classname;
// classNumberをHTMLから取得（例: 9など）
const classNumber = document.getElementById("classNumber").dataset.classnumber;
// デバッグ用にclassNameとclassNumberをコンソール出力
console.log("デバッグ情報:");
console.log(`className: ${className}`);
console.log(`classNumber: ${classNumber}`);
// モーダルのオーバーレイ要素を取得
const overlay = document.getElementById('modal-overlay');
// ポイントボタン押下時にモーダル表示
document.getElementById('point-button').onclick = () => {
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
        overlay.classList.add('show');
    });
};  
// モーダルのクローズボタン押下時にモーダル非表示
document.getElementById('modal-close-button').onclick = () => {
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', function handler (e) {
        if (e.propertyName === 'opacity'){
            overlay.style.display = 'none';
            overlay.removeEventListener('transitionend', handler);
        }
    }, { once: true });
};
// リロードボタン押下時にページ再読み込み
document.getElementById('reload-button').onclick = () => {
    window.location.reload();
};
// ログアウトボタン押下時にログイン情報削除しホームへ遷移
document.getElementById('logout-button').onclick = () => {
    localStorage.removeItem(`isLoggedIn${classNumber}`);
    window.location.href = '../../home/home.html';
};
// ログインしていなければホームへ遷移
if (!localStorage.getItem(`isLoggedIn${classNumber}`)) {
    window.location.href = '../../home/home.html';
};
// ページ描画後の初期化処理
window.addEventListener('DOMContentLoaded', async function () {
    // ローディング表示
    document.getElementById('loading').style.display = 'flex';
    // クラスごとのGAS URLをMapで管理
    const GAS_URLs = new Map([
        ["3-1", ""],
        ["3-2", ""],
        ["3-3", ""],
        ["3-4", ""],
        ["3-5", ""],
        ["3-6", ""],
        ["3-7", ""],
        ["3-8", "https://script.google.com/macros/s/AKfycbzPAqWNAJfEDddH0so-CXYUBPYEnS8EBT7ZvjFTP_g4PD2cFFzSHE4iKNq1IHZwqpBG/exec"],
        ["3-9", "https://script.google.com/macros/s/AKfycbxbE5UJ-MwuEAcWXQCZ_H7WGyGZWxSECtSa8q7O1XU-xUOI72tIYY-YhGoJT-O7yk9ldQ/exec"],
    ])
    // POST用URL
    const gas_post_url = GAS_URLs.get(className);
    // GET用URL
    const gas_url = gas_post_url + "?sheet=" + encodeURIComponent(className)
    // URL確認用ログ
    console.log(`gas_url: ${gas_url}`);
    console.log(`gas_post_url: ${gas_post_url}`);
    // URLが有効な場合のみ処理
    if(!(gas_url == null || gas_post_url == null)){
        await fetch(gas_url)
            .then(response => response.json())
            .then(data => {
                // GASから取得したデータをログ出力
                console.log(data);
                // 企業ごとにデータを分割
                const companyList = [];
                let currentCompany = null;
                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    // company_nameが現れたら新しい企業開始
                    if (row.company_name && row.company_name !== "") {
                        if (currentCompany) {
                            companyList.push(currentCompany);
                        }
                        currentCompany = {
                            name: row.company_name,
                            products: []
                        };
                    }
                    // 商品名があれば商品として追加
                    if (currentCompany && row.pdname && row.pdname !== "") {
                        currentCompany.products.push({
                            pdname: row.pdname,
                            price: row.price,
                            sales: row.sales
                        });
                    }
                }
                // 最後の企業も追加
                if (currentCompany) {
                    companyList.push(currentCompany);
                }
                // 全体の商品数・完売数を集計
                const totalProducts = companyList.reduce((sum, c) => sum + c.products.length, 0);
                const totalSoldout = companyList.reduce((sum, c) => sum + c.products.filter(p => (p.sales||'').trim() === '完売').length, 0);
                // 全体集計表示エリア取得・なければ作成
                let summaryElem = document.getElementById('all-summary');
                if (!summaryElem) {
                    summaryElem = document.createElement('div');
                    summaryElem.id = 'all-summary';
                    // 3年9組のh1直後に挿入
                    const titleElem = document.querySelector('h1');
                    if (titleElem && titleElem.parentNode) {
                        titleElem.parentNode.insertBefore(summaryElem, titleElem.nextSibling);
                    } else {
                        document.body.insertBefore(summaryElem, document.body.firstChild);
                    }
                }
                // 全体の商品数・完売数を表示
                summaryElem.innerHTML = `<span>商品数：${totalProducts}</span>　｜　<span>完売数：${totalSoldout}</span>`;
                // 企業ごとのテーブル表示
                const container = document.getElementById('company-tables');
                // 企業ごとのテーブル表示用のコンテナを取得し、内容を初期化
                if (container) container.innerHTML = '';
                // companyList（企業ごとのデータ配列）をループ処理
                companyList.forEach((company, companyIndex) => {
                    // 企業ごとのブロック要素を作成
                    const companyBlock = document.createElement('div');
                    // 企業名を表示するh1要素を作成し、企業名＋改行を設定
                    const h1 = document.createElement('h1');
                    h1.innerHTML = company.name + '<br>';
                    // h1を企業ブロックに追加
                    companyBlock.appendChild(h1);
                    // 企業ごとの商品数・完売数を表示するdivを作成
                    const cSummary = document.createElement('div');
                    cSummary.className = 'company-summary'; // クラス名を設定
                    // 商品数を計算
                    const cPd = company.products.length;
                    // 完売数を計算（salesが"完売"のものをカウント）
                    const cSold = company.products.filter(p => (p.sales||'').trim() === '完売').length;
                    // 商品数・完売数をHTMLとして設定
                    cSummary.innerHTML = `<span>商品数：${cPd}</span>　｜　<span>完売数：${cSold}</span>`;
                    // 企業ブロックにサマリーを追加
                    companyBlock.appendChild(cSummary);
                    // 商品テーブルを作成
                    const table = document.createElement('table');
                    table.className = 'product-table'; // テーブルにクラス名を付与
                    table.setAttribute('data-company-index', companyIndex); // 企業インデックスを属性にセット
                    // テーブルのヘッダー行を設定
                    table.innerHTML = `<thead><tr><th>商品名</th><th>販売価格</th><th>販売状況</th></tr></thead><tbody></tbody>`;
                    // tbody要素を取得
                    const tbody = table.querySelector('tbody');
                    // 企業の商品リストをループ
                    company.products.forEach(item => {
                        // 商品ごとの行を作成
                        const tr = document.createElement('tr');
                        let statusClass = '';
                        // 商品名を取得し、前後の空白を除去
                        const pdname = (item.pdname || '').trim();
                        // 販売状況が"完売"か判定
                        const isSoldout = (item.sales || '').trim() === '完売';
                        // 販売状況に応じてクラス名を設定
                        statusClass = isSoldout ? 'status-soldout' : 'status-on-sale';
                        // チェックボックスのHTMLを作成（商品名を属性にセット）
                        const checkbox = `<input type="checkbox" class="status-checkbox" data-pdname="${pdname}">`;
                        // 行のHTMLを設定（商品名・価格・販売状況）
                        tr.innerHTML = `<td>${pdname || '商品名が読み込めませんでした'}</td><td>¥${item.price ? Number(item.price).toLocaleString() : '商品価格が読み込めませんでした'}</td><td class="${statusClass}">${checkbox}<span class="status-label">${isSoldout ? '完売' : '販売中'}</span></td>`;
                        // チェックボックスに企業インデックスを属性で付与
                        tr.querySelector('.status-checkbox').setAttribute('data-company-index', companyIndex);
                        // 完売の場合はチェックボックスをONにする
                        if (isSoldout) tr.querySelector('.status-checkbox').checked = true;
                        // 行をtbodyに追加
                        tbody.appendChild(tr);
                    });
                    // テーブルを企業ブロックに追加
                    companyBlock.appendChild(table);
                    // 企業ブロックをコンテナに追加
                    if (container) container.appendChild(companyBlock);
                });
                // 販売状況チェックボックスにイベントリスナーを登録
                // すべての.status-checkbox要素を取得し、1つずつ処理
                // チェックボックスの状態が変わったときの処理
                // 何番目の企業テーブルかをdata-company-index属性から取得
                // 商品名をdata-pdname属性から取得
                // 新しい販売状況（完売 or 販売中）を判定
                // ラベルとクラスを切り替え
                // GAS（Google Apps Script）へPOSTリクエストで販売状況を送信
                // レスポンスがOKでなければアラート表示
                // 再度GASからデータを取得し直す（画面の再描画用）
                document.querySelectorAll('.status-checkbox').forEach(cb => {
                    cb.addEventListener('change', function () {
                        const companyIndex = this.getAttribute('data-company-index'); // 企業インデックス取得
                        console.log('このチェックボックスは' + companyIndex + '番目の表です'); // デバッグ用
                        const pdname = (this.getAttribute('data-pdname') || '').trim(); // 商品名取得
                        const newStatus = this.checked ? '完売' : '販売中'; // 新しい販売状況
                        this.nextElementSibling.textContent = newStatus; // ラベル切り替え
                        this.parentElement.className = this.checked ? 'status-soldout' : 'status-on-sale'; // クラス切り替え
                        // GASへPOSTリクエスト
                        const params = new URLSearchParams({
                            sheet: className,
                            pdname: pdname,
                            status: newStatus,
                            companyIndex: companyIndex
                        });
                        fetch(gas_post_url, {
                            method: 'POST',
                            body: params
                        })
                            .then(res => res.text())
                            .then(result => {
                                if (result !== 'OK') alert('スプレッドシート更新に失敗しました');
                                fetch(gas_url)
                                    .then(response => response.json())
                                    .then(data => {
                                        // ...（再描画処理などがあればここに記述）
                                    });
                            });
                    });
                });
            })
            .finally(() => {
                document.getElementById('loading').style.display = 'none';
            });
    } else {
        alert("データ読み込みに失敗しました。ログインページに遷移します。");
        window.location.href = '../../home/home.html';
    };
});