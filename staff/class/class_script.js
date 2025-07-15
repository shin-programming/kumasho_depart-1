const class_name = document.getElementById('class_name').dataset.class_name;    // クラス名（例：3-9）
const class_number = document.getElementById('class_number').dataset.class_number;    // クラス番号（例：39）
console.log('デバッグ情報');
console.log(`クラス名: ${class_name}`);
console.log(`クラス番号: ${class_number}`);
const modal_overlay = document.getElementById('modal_overlay');    // モーダルのオーバーレイ要素を取得

// ポイントボタンが押されたとき
document.getElementById('point_button').onclick = () => {
    modal_overlay.style.display = 'flex';

    requestAnimationFrame(() => {
        modal_overlay.classList.add('show');
    });
};

// モーダルの閉じるボタンが押されたとき
document.getElementById('modal_close_button').onclick = () => {
    modal_overlay.classList.remove('show');

    modal_overlay.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') {
            modal_overlay.style.display = 'none';
            modal_overlay.removeEventListener('transitionend', handler);
        };
    }, { once: true });
};

// リロードボタンが押されたとき
document.getElementById('reload_button').onclick = () => {
    window.location.reload();
};

// ログアウトボタンが押されたとき
documentgetelementbyId('logout_button').onclick = () => {
    localStorage.removeitem(`logged_${class_name}`);
    window.location.href = '../../home/home.html';
};

// 不正アクセス防止
if (!localStorage.getitem(`logged_${class_name}`)) {
    alert('不正なアクセスです。ログインページに遷移します。');
    window.location.href = '../../home/home.html';
};

// ページ描画後の読み込み処理
window.addEventListener('DOMContentLoaded', async function() {
    // ローディングの表示
    // document.getElementById('loading').style.displey = 'flex';

    // クラスごとのgasURLを保存
    const all_gas_url = new Map([
        ['1-1', 'https://script.google.com/macros/s/AKfycbzrGDAfgsDU5wQl3wW6QzokWE7Sm3YnM-n3IR9RX90OlNoWmCnH7zyV6jk7MnsWBK8M/exec'],
        ['1-2', 'https://script.google.com/macros/s/AKfycbzjRYlB5w1fK2nFJhqz1myy7RahOqQFoG63iqHq08j6tvewpbKmmlebiCCqr18-ZxvX6A/exec'],
        ['1-3', 'https://script.google.com/macros/s/AKfycbz2R8MK3B76df53AdmPeFKxW0f-MkxmewER6T-wwY8WaC9rD6ypWBWtBPbkcbGsG5e9tQ/exec'],
        ['1-4', 'https://script.google.com/macros/s/AKfycbzJnTClzBWGy_Pm-GY8p9VxtaAnqqruIrHafi-Q9wq-esDEpU2pnlO91KDLXE-jbLtD/exec'],
        ['1-5', 'https://script.google.com/macros/s/AKfycbysWD4QYrPIGeATXcUtY_BSZny4JShp64C5we6tTklol0ARfGxc2f7_P-jwUPevK52EMA/exec'],
        ['1-6', 'https://script.google.com/macros/s/AKfycbytKhfBRORFPC9mof4w0NHEuqADk2iIya48JGn0xaAhhlCweGceUsFdZjM9iLqaVFRN/exec'],
        ['1-7', 'https://script.google.com/macros/s/AKfycbzsrwcVsAipe1Qaj0Bf_ebsX-Qp7LUpXO5IVfSqZ8dvw30hV2DUzEnt8IYz_xyLVAxu/exec'],
        ['1-8', 'https://script.google.com/macros/s/AKfycbymPFhdWibEbLT7KXQUr_UAg_lR4nOY9qJiRnAzcnREzRGLFnnO4oTyGDw6nKkaAEoj/exec'],
        ['1-9', 'https://script.google.com/macros/s/AKfycbwW6Bd03h9hHbifbi1WgbYTUe97GL_G-4-8_DX11bZWn85hLfa_y7uyN6Sj2ioAcczPWQ/exec'],
        ['2-1', 'https://script.google.com/macros/s/AKfycbx4CXcdNsaEU4nZ7eEeUCCuDkiRpyidMtHAuSY4OgTBVzqyoEGjv5EJreKON-gvpwBJ/exec'],
        ['2-2', 'https://script.google.com/macros/s/AKfycbxt1kgPgF595hYUXPZcAl-0a3enZrTGwjLnR4Q_hOohqp6GWz63cDIL9iVfIDExAcq3Ng/exec'],
        ['2-3', 'https://script.google.com/macros/s/AKfycbxXqkb8KI1cfCHWKVULjHM24H5_PXg3wGvO8TqKajiX3a9ouENoYsfgE2hTgS5IaTLs3A/exec'],
        ['2-4', 'https://script.google.com/macros/s/AKfycbx6w4N2vviF2BZiqlFXhNINA0cJd43tfMlcLKvY-Q9z8PHvan0yhU-eDEN6ywvib6ziMg/exec'],
        ['2-5', 'https://script.google.com/macros/s/AKfycbxCk9vN5vm6q2uCJEduc5KDfs_9lcGj3SlWNLzbmiXd1bslTbBz98OCFDNSNE35Fi8h/exec'],
        ['2-6', 'https://script.google.com/macros/s/AKfycbzRFyTPLdJE1gKm8ER9tEbQGzSKWmncz-XDnDsrvw0RxkAWLP-BGmibKaWUpJ34WDjU/exec'],
        ['2-7', 'https://script.google.com/macros/s/AKfycbwnSXOXzz9x7QKrqKZvqTOo2NV9zhkUETeeF8RlCGlcNTxoKQ3PgBmwTUhLCWQ14B42/exec'],
        ['2-8', 'https://script.google.com/macros/s/AKfycbyGaZhmzRajTQAhHjmws_90cROJyGuK3SE-HXIxjjKx8PGoO1L6HgemuG1utWLML5Za/exec'],
        ['2-9', 'https://script.google.com/macros/s/AKfycbwXwJsXWnk315alH5K22R1Mt3HaMStkfv2FXwJuaS1DiPsHJD-pfFMykI2Oi4k3i6BSwA/exec'],
        ['3-1', 'https://script.google.com/macros/s/AKfycbzCvCziusL-GdB26YWdwRA26I3kVF7eDJspK8Q2fN1wep6kS5to_8ategUERdPid97n/exec'],
        ['3-2', 'https://script.google.com/macros/s/AKfycbx1gjtu_aVq1YixIulMIwFrp75VlZTBvM3jgAn51TyIlG4G5XtQ3Nh0FguRPaj1vFH2XQ/exec'],
        ['3-3', 'https://script.google.com/macros/s/AKfycbzpFPkWr6y-SvFuTIBxrziAjdkal5L0Obn71NLbIuXIn-fWTgeq_cDwmfZOccZWbl-V/exec'],
        ['3-4', 'https://script.google.com/macros/s/AKfycbzgT9vXYIkH1OH-EA8FJKEMEKaSnhwJR1CbHUvz38HjIvPufr6_mLLr5SO70kb16_EFTg/exec'],
        ['3-5', 'https://script.google.com/macros/s/AKfycbxb3Xdz0Ffx4o_8fl9YhNE4dTf9F328g6P00Pv9BZ-K97CET33T7wQRw3XNLOovJkVK/exec'],
        ['3-6', 'https://script.google.com/macros/s/AKfycbwzpA861UFnp23VpBpsJi5QRfVJx7kaBKUujJcjidPmLSHiaOm0sJYgjvHjyesr6UmU/exec'],
        ['3-7', 'https://script.google.com/macros/s/AKfycbyUdq7pVqebVflENxobaxbFX9SL9XTEm-W52CdgILMvCK4-IjJaiAmljuL1Vnoj34EL/exec'],
        ['3-8', 'https://script.google.com/macros/s/AKfycbzzR8gp5ANqc-RUguwx8bsACOxLZJYDGA3LjEzfGrFsZ1Rp63Hv1jrn9P3c1PjMlR2k/exec'],
        ['3-9', 'https://script.google.com/macros/s/AKfycbw5dUn9N6EaJjr5CbIJR9In9rY4t0Ute7Img5oNuLoD3y18kMRh2alcX2OaT9K7xxDqTQ/exec']
    ]);

    // get用とpost用のgasURLを変数に格納
    const gas_url_post = all_gas_url.get(class_name);
    const gas_url_get = gas_url_post + '?sheet=' + encodeURIComponent(class_name);
    // URL確認用
    console.log(`get用：${gas_url_get}`);
    console.log(`post用：${gas_url_post}`);

    // URLが有効か判断
    if (!(gas_url_get == null || gas_url_post == null)) {
        // gasからの読み込み開始
        await fetch(gas_url_get)
            .then(responce => responce.json())

            .then(json_data => {
                // gasから帰ってきたデータの確認
                console.log(`json_data: ${json_data}`);
                // 企業ごとの商品をまとめた配列
                const products_by_company = [];
                // 企業ごとの一時保存用オブジェクト
                const now_company = null;

                for (let c = 0; c < data.length; c++) {
                    // json_data　1行分のデータを格納
                    const json_data_row = data[c];

                    // company_nameが現れたら新しい企業開始
                    if (json_data_row.company_name && json_data_row.company_name !== '') {
                        if (now_company) {
                            // 企業を追加
                            products_by_company.push(now_company);
                        };
                        
                        now_company = {
                            company_name: json_data_row.company_name,    // 企業名
                            products: []    // 商品リスト
                        };
                    };

                    // 商品名があれば商品として追加
                    if (now_company && json_data_row.pdname && json_data_row.pdname !== '') {
                        now_company.products.push({
                            product_name: json_data_row.pdname,    // 商品名
                            price: json_data_row.price,    // 販売価格
                            sales: json_data_row.sales    // 販売状況
                        });
                    };
                };

                // 最後の企業も追加
                if (now_company) {
                    products_by_company.push(now_company);
                };

                // 全体の商品数・完売数を集計
                const total_products = products_by_company.reduce((sum, n_c) => sum + n_c.products.length, 0);
                const total_soldout = products_by_company.reduce((sum, n_c) => sum + n_c.products.filter(n_p => (n_p.sales || '').trim() === '完売').length, 0);

                // 全ての商品数・完売数の表示エリアの取得
                let total_display = document.getElementById('total_display');

                // 全ての商品数・完売数の表示
                total_display.innerHTML = `
                    <span>商品数：${total_products}</span>
                        　｜　
                    <span>完売数：${total_soldout}</span>
                `.trim();

                // 企業ごとのテーブルの表示
                const table_by_company = document.getElementById('company_tables');
                if (table_by_company) table_by_company.innerHTML = '';

                // products_by_company（企業ごとのデータ配列）をループ処理
                products_by_company.forEach((company, company_count) => {
                    // 企業ごとのブロック要素を作成
                    const company_block = document.createElement('div');
                    company_block.className = 'company_block';

                    // 企業名
                    const h1 = Object.assign(document.createElement('h1'), {
                        innerHTML: company.name,
                        className: 'company_title'
                    });

                    company_block.appendChild(h1);
                    table_by_company.appendChild(company_block);
                    // 各企業ごとの商品数・完売数の集計
                    const company_total_display = document.getElementById('company_total_display');
                    const company_total_products = company.products.length;
                    const company_total_soldout = company.products.filter(n_p => (n_p.sales || '').trim() === '完売').length;

                    company_total_display.innerHTML = `
                        <br><br>
                        <span>商品数：${company_total_products}</span>
                            　｜　
                        <span>完売数：${company_total_soldout}</span>
                    `.trim();

                    company_block.appendChild(company_total_display);
                    // 商品テーブル
                    const table_wrapper = document.getElementById('table_wrapper');
                    const table = document.getElementById('table');
                    table.setAttribute('data_company_count', company_count);

                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>商品名</th>
                                <th>販売価格</th>
                                <th>販売状況</th>
                            </tr>
                        </thead>
                        
                        <tbody></tbody>
                    `.trim();

                    const tbody = table.querySelector('tbody');

                    company.products.forEach(item => {    // itemは変更する可能性

                    });
                });
                
            })

            .finally(() => {
                document.getElementById('loading').style.display = 'none';
            });
    } else {
        alert('データの読み込みに失敗しました。ログインページに遷移します。');
        window.location.href = '../../home/home.html';
    };
});