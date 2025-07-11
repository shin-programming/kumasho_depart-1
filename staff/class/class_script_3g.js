// classNameをHTMLから取得（例: 3-9など）
const className = document.getElementById("className").dataset.classname;
// classNumberをHTMLから取得（例: 39など）
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
    // GAS_URLs: クラス名ごとに対応するGASのURLを格納するMapオブジェクト
    // 例: "3-9" → 3年9組用のGASエンドポイント
    const GAS_URLs = new Map([
        ["3-1", "https://script.google.com/macros/s/AKfycbzCvCziusL-GdB26YWdwRA26I3kVF7eDJspK8Q2fN1wep6kS5to_8ategUERdPid97n/exec"],
        ["3-2", "https://script.google.com/macros/s/AKfycbx1gjtu_aVq1YixIulMIwFrp75VlZTBvM3jgAn51TyIlG4G5XtQ3Nh0FguRPaj1vFH2XQ/exec"],
        ["3-3", "https://script.google.com/macros/s/AKfycbzpFPkWr6y-SvFuTIBxrziAjdkal5L0Obn71NLbIuXIn-fWTgeq_cDwmfZOccZWbl-V/exec"],
        ["3-4", "https://script.google.com/macros/s/AKfycbzgT9vXYIkH1OH-EA8FJKEMEKaSnhwJR1CbHUvz38HjIvPufr6_mLLr5SO70kb16_EFTg/exec"],
        ["3-5", "https://script.google.com/macros/s/AKfycbxb3Xdz0Ffx4o_8fl9YhNE4dTf9F328g6P00Pv9BZ-K97CET33T7wQRw3XNLOovJkVK/exec"],
        ["3-6", "https://script.google.com/macros/s/AKfycbwzpA861UFnp23VpBpsJi5QRfVJx7kaBKUujJcjidPmLSHiaOm0sJYgjvHjyesr6UmU/exec"],
        ["3-7", "https://script.google.com/macros/s/AKfycbyUdq7pVqebVflENxobaxbFX9SL9XTEm-W52CdgILMvCK4-IjJaiAmljuL1Vnoj34EL/exec"],
        ["3-8", "https://script.google.com/macros/s/AKfycbzzR8gp5ANqc-RUguwx8bsACOxLZJYDGA3LjEzfGrFsZ1Rp63Hv1jrn9P3c1PjMlR2k/exec"],
        ["3-9", "https://script.google.com/macros/s/AKfycbw5dUn9N6EaJjr5CbIJR9In9rY4t0Ute7Img5oNuLoD3y18kMRh2alcX2OaT9K7xxDqTQ/exec"],
    ])

    // POST用URL: GASに販売状況を送信する際のエンドポイント
    // className（例: "3-9"）に対応するURLを取得
    const gas_post_url = GAS_URLs.get(className);
    // GET用URL: GASからデータを取得する際のエンドポイント
    // sheetパラメータにclassNameを付与
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
                // companyList: 企業ごとの商品リストをまとめた配列
                // 例: [ { name: "企業A", products: [...] }, ... ]
                const companyList = [];
                let currentCompany = null; // 企業ごとの一時オブジェクト

                for (let i = 0; i < data.length; i++) {
                    const row = data[i]; // 1行分のデータ

                    // company_nameが現れたら新しい企業開始
                    if (row.company_name && row.company_name !== "") {
                        if (currentCompany) {
                            companyList.push(currentCompany); // 直前の企業をリストに追加
                        }

                        currentCompany = {
                            name: row.company_name, // 企業名
                            products: [] // 商品リスト
                        };
                    }

                    // 商品名があれば商品として追加
                    if (currentCompany && row.pdname && row.pdname !== "") {
                        currentCompany.products.push({
                            pdname: row.pdname, // 商品名
                            price: row.price,   // 価格
                            sales: row.sales    // 販売状況
                        });
                    }
                }

                // 最後の企業も追加
                if (currentCompany) {
                    companyList.push(currentCompany);
                }

                // 全体の商品数・完売数を集計
                // totalProducts: 全企業の商品数合計
                // totalSoldout: 全企業の完売数合計
                const totalProducts = companyList.reduce((sum, c) => sum + c.products.length, 0);
                const totalSoldout = companyList.reduce((sum, c) => sum + c.products.filter(p => (p.sales || '').trim() === '完売').length, 0);
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
                    companyBlock.className = 'company-block';
                    // 企業名（左寄せ）
                    const h1 = document.createElement('h1');
                    h1.innerHTML = company.name + "<br>";
                    h1.className = 'company-title';
                    companyBlock.appendChild(h1);
                    // 商品数・完売数（企業名の次の行に表示）
                    const cSummary = document.createElement('div');
                    cSummary.className = 'company-summary';
                    cSummary.style.marginTop = '-8px'; // 行間を詰める
                    const cPd = company.products.length;
                    const cSold = company.products.filter(p => (p.sales||'').trim() === '完売').length;
                    cSummary.innerHTML = `<br><br><span>商品数：${cPd}</span>　｜　<span>完売数：${cSold}</span>`;
                    companyBlock.appendChild(cSummary);
                    // 商品テーブル（中央・幅可変）
                    const tableWrapper = document.createElement('div');
                    tableWrapper.className = 'table-wrapper';
                    const table = document.createElement('table');
                    table.className = 'product-table';
                    table.setAttribute('data-company-index', companyIndex);
                    table.innerHTML = `<thead><tr><th>商品名</th><th>販売価格</th><th>販売状況</th></tr></thead><tbody></tbody>`;
                    const tbody = table.querySelector('tbody');

                    company.products.forEach(item => {
                        const tr = document.createElement('tr');
                        let statusClass = '';
                        const pdname = (item.pdname || '').trim();
                        const isSoldout = (item.sales || '').trim() === '完売';
                        statusClass = isSoldout ? 'status-soldout' : 'status-on-sale';
                        const checkbox = `<input type="checkbox" class="status-checkbox" data-pdname="${pdname}">`;
                        tr.innerHTML = `<td>${pdname || '商品名が読み込めませんでした'}</td><td>¥${item.price ? Number(item.price).toLocaleString() : '商品価格が読み込めませんでした'}</td><td class="${statusClass}">${checkbox}<span class="status-label">${isSoldout ? '完売' : '販売中'}</span></td>`;
                        tr.querySelector('.status-checkbox').setAttribute('data-company-index', companyIndex);
                        if (isSoldout) tr.querySelector('.status-checkbox').checked = true;
                        tbody.appendChild(tr);
                    });

                    tableWrapper.appendChild(table);
                    companyBlock.appendChild(tableWrapper);
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

                        fetch(gas_post_url, {method: 'POST', body: params})
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