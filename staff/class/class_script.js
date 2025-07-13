const class_name = document.getElementById("class_name").dataset.class_name;    // クラス名（例：3-9）
const class_number = document.getElementById("class_number").dataset.class_number;    // クラス番号（例：39）
console.log("デバッグ情報");
console.log(`クラス名: ${class_name}`);
console.log(`クラス番号: ${class_number}`);
const modal_overlay = document.getElementById("modal_overlay");    // モーダルのオーバーレイ要素を取得

// ポイントボタンが押されたとき
document.getElementById("point_button").onclick = () => {
    modal_overlay.style.display = "flex";

    requestAnimationFrame(() => {
        modal_overlay.classList.add("show");
    });
};

// モーダルの閉じるボタンが押されたとき
document.getElementById("modal_close_button").onclick = () => {
    modal_overlay.classList.remove("show");

    modal_overlay.addEventListener("transitionend", function handler(e) {
        if (e.propertyName === "opacity") {
            modal_overlay.style.display = "none";
            modal_overlay.removeEventListener("transitionend", handler);
        };
    }, { once: true });
};