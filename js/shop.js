/* -------------------------
    ステータス読み込み
------------------------- */

loadStatus();
loadInventory();

/* -------------------------
    要素取得
------------------------- */

const settingBtn = document.getElementById("shop_setting-btn");
const settingPanel = document.getElementById("shop_setting-panel");

const volume = document.getElementById("volum");
const bgm = document.getElementById("bgm");
const se = document.getElementById("se");
const seVolumeSlider = document.getElementById("se-volum");

const coinText = document.getElementById("coin");
const backBtn = document.getElementById("shop_back-btn");

const lookBtn = document.getElementById("look");
const shopItem = document.getElementById("shop-item");
const shopCloseBtn = document.getElementById("shop-close-btn");

const inventoryBtn = document.getElementById("inventory-btn");
const inventoryPanel = document.getElementById("inventory-panel");
const inventoryList = document.getElementById("inventory-list");
const inventoryClose = document.getElementById("inventory-close");

/* -------------------------
    音量設定の読み込み
------------------------- */

loadSoundSettings();

bgm.volume = bgmVolume / 100;
se.volume = seVolume / 100;

volume.value = bgmVolume;
seVolumeSlider.value = seVolume;

/* -------------------------
    おうちへ
------------------------- */

backBtn.addEventListener("click", () => {
saveStatus();
saveInventory();
location.href = "index.html";
});

/* -------------------------
    コイン表示
------------------------- */

function updateCoinDisplay() {
coinText.textContent = coin;
}

/* -------------------------
    設定パネル
------------------------- */

settingBtn.addEventListener("click", () => {
if (settingPanel.style.display === "block") {
settingPanel.style.display = "none";
} else {
settingPanel.style.display = "block";
}
});

/* -------------------------
    BGM音量
------------------------- */

volume.addEventListener("input", () => {
bgmVolume = Number(volume.value);

bgm.volume = bgmVolume / 100;

saveSoundSettings();

volume.style.background =
    `linear-gradient(
        to right,
        #f3b2c1 0%,
        #f3b2c1 ${bgmVolume}%,
        #d8d3c9 ${bgmVolume}%,
        #d8d3c9 100%
    )`;

});

/* -------------------------
    効果音量
------------------------- */

seVolumeSlider.addEventListener("input", () => {
seVolume = Number(seVolumeSlider.value);

se.volume = seVolume / 100;

saveSoundSettings();

});

/* -------------------------
    BGM再生
------------------------- */

document.addEventListener("click", () => {
bgm.play().catch(() => {
console.log("BGMを再生できませんでした");
});
}, { once: true });

/* -------------------------
    商品一覧の開閉
------------------------- */

lookBtn.addEventListener("click", () => {
shopItem.style.display = "block";
});

shopCloseBtn.addEventListener("click", () => {
shopItem.style.display = "none";
});


/* -------------------------
    購入ボタンの表示更新
------------------------- */

function updateBuyButtons() {
document.querySelectorAll(".buy-btn").forEach(button => {
const itemId = button.dataset.item;
const count = inventory[itemId] || 0;


    if (count > 0) {
        button.textContent = `購入する（所持数：${count}）`;
    } else {
        button.textContent = "購入する";
    }
});
}

/* -------------------------
    購入処理
------------------------- */

document.querySelectorAll(".buy-btn").forEach(button => {
button.addEventListener("click", () => {
const itemId = button.dataset.item;
const product = shopProducts[itemId];

    if (!product) return;

    if (coin < product.price) {
        alert("コインが足りないよ！");
        return;
    }

    // コインを消費
    coin -= product.price;

    // 所持数を増やす
    inventory[itemId] = (inventory[itemId] || 0) + 1;

    // 保存
    saveStatus();
    saveInventory();

    // コイン表示更新
    updateCoin();

    // 購入音
    se.currentTime = 0;
    se.play().catch(() => {});

    // 表示を更新
    updateBuyButtons();
    renderInventory();
});
});

/* -------------------------
    初期表示
------------------------- */

updateBuyButtons();


/* -------------------------
   所持品一覧を表示
------------------------- */

function renderInventory() {
    inventoryList.innerHTML = "";

    const ownedItems = itemOrder
        .map(itemId => [itemId, inventory[itemId] || 0])
        .filter(([itemId, count]) => {
            return shopProducts[itemId] && count > 0;
        });

    if (ownedItems.length === 0) {
        inventoryList.innerHTML =
            "<p>まだアイテムを持っていないよ。</p>";
        return;
    }

    ownedItems.forEach(([itemId, count]) => {
        const product = shopProducts[itemId];

        const card = document.createElement("div");
        card.className = "item-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.className = "inventory-image";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const quantity = document.createElement("p");
        quantity.textContent = `所持数：${count}`;

        const useButton = document.createElement("button");
        useButton.className = "use-btn";

        useButton.textContent =
            selectedBall === itemId
                ? "使用中"
                : "このボールを使う";

        useButton.disabled = selectedBall === itemId;

        useButton.addEventListener("click", () => {
            askToSelectBall(itemId);
        });

        card.append(image, name, quantity, useButton);
        inventoryList.appendChild(card);
    });
}

/* -------------------------
    所持品一覧の開閉
------------------------- */

inventoryBtn.addEventListener("click", () => {
renderInventory();
inventoryPanel.style.display = "block";
});

inventoryClose.addEventListener("click", () => {
inventoryPanel.style.display = "none";
});

/* -------------------------
   ボール選択確認パネル
------------------------- */

let pendingBallId = null;

const itemConfirmPanel =
    document.getElementById("item-confirm-panel");

const confirmItemImage =
    document.getElementById("confirm-item-image");

const confirmItemName =
    document.getElementById("confirm-item-name");

const itemConfirmYes =
    document.getElementById("item-confirm-yes");

const itemConfirmNo =
    document.getElementById("item-confirm-no");

// 確認パネルを開く
function askToSelectBall(itemId) {
    const product = shopProducts[itemId];

    if (!product || (inventory[itemId] || 0) <= 0) {
        alert("このボールは持っていないよ！");
        return;
    }

    // 選択候補を保存
    pendingBallId = itemId;

    // パネルにボールの情報を表示
    confirmItemImage.src = product.image;
    confirmItemImage.alt = product.name;
    confirmItemName.textContent = product.name;

    // パネルを表示
    itemConfirmPanel.style.display = "flex";
}

// 「選ぶ！」を押したとき
itemConfirmYes.addEventListener("click", () => {
    if (pendingBallId === null) return;

    const product = shopProducts[pendingBallId];

    if (!product || (inventory[pendingBallId] || 0) <= 0) {
        alert("このボールは持っていないよ！");
        itemConfirmPanel.style.display = "none";
        pendingBallId = null;
        return;
    }

    // ボールを選択
    selectedBall = pendingBallId;

    // 選択したボールを保存
    saveInventory();

    // パネルを閉じる
    itemConfirmPanel.style.display = "none";
    pendingBallId = null;

    // 所持品一覧を更新
    renderInventory();

});

// 「やめる」を押したとき
itemConfirmNo.addEventListener("click", () => {
    itemConfirmPanel.style.display = "none";
    pendingBallId = null;
});

/* -------------------------
    初期化
------------------------- */
updateCoin();
