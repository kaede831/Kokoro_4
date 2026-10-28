/* -------------------------
   ステータス読み込み
------------------------- */
loadStatus();
loadInventory();

/* -------------------------
   初回プレゼント
------------------------- */

function giveFirstGift() {
    const initialized =
        localStorage.getItem("inventoryInitialized");

    // すでにプレゼントを受け取っていたら何もしない
    if (initialized === "true") {
        return;
    }

    // ボール ver.1 を5個プレゼント
    inventory["ball_1"] = 5;

    // 所持品を保存
    saveInventory();

    // 受け取り済みにする
    localStorage.setItem("inventoryInitialized", "true");

    console.log("初回プレゼント：ボール ver.1 を5個！");
}

// 所持品の読み込み後に実行
giveFirstGift();

/* -------------------------
   要素取得
------------------------- */

const dayText = document.getElementById("day");

const petGauge = document.getElementById("pet-gauge-fill");

const hungerBar = document.getElementById("hunger-bar");
const loveBar = document.getElementById("love-bar");
const stressBar = document.getElementById("stress-bar");
const hpBar = document.getElementById("hp-bar");

const feedBtn = document.getElementById("food-btn");
const petBtn = document.getElementById("pet-btn");
const playBtn = document.getElementById("play-btn");
const sleepBtn = document.getElementById("sleep-btn");
const settingBtn = document.getElementById("setting-btn");
const shopBtn = document.getElementById("shop-btn");

const settingPanel = document.getElementById("setting-panel");

const volume = document.getElementById("volum");
const bgm = document.getElementById("bgm");
const se = document.getElementById("se");
const seVolumeSlider = document.getElementById("se-volum");

const inventoryBtn = document.getElementById("inventory-btn");
const inventoryPanel = document.getElementById("inventory-panel");
const inventoryList = document.getElementById("inventory-list");
const inventoryClose = document.getElementById("inventory-close");

const resetOpen = document.getElementById("reset-open");
const resetModal = document.getElementById("reset-modal");
const cancelReset = document.getElementById("cancel-reset");
const doReset = document.getElementById("do-reset");

const kokoro = document.getElementById("kokoro");
const coinText = document.getElementById("coin");


/* -------------------------
   バー更新
------------------------- */

function updateBars() {

    hungerBar.style.width = hunger + "%";
    loveBar.style.width = love + "%";
    stressBar.style.width = stress + "%";
    hpBar.style.width = hp + "%";

    dayText.textContent = `Day ${day}`;
}

/* -------------------------
   表情変更
------------------------- */

function updateFace() {
    if (stress >= 70) {
        kokoro.src = "img/dog_angry.png";
    } else if (hp <= 30) {
        kokoro.src = "img/dog_sad.png";
    } else if (hunger <= 30) {
        kokoro.src = "img/dog_sad.png";
    } else if (love >= 80) {
        kokoro.src = "img/dog_fun.png";
    } else {
        kokoro.src = "img/dog.png";
    }
}

/* -------------------------
BGM / SE
------------------------- */

// 共通の音量設定を読み込む
loadSoundSettings();

// 音量を反映
bgm.volume = bgmVolume / 100;
se.volume = seVolume / 100;

// スライダーに現在の音量を表示
volume.value = bgmVolume;
seVolumeSlider.value = seVolume;

// BGM音量
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

// 効果音量
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
   コイン
------------------------- */

function updateCoinDisplay() {

    coinText.textContent = coin;

};

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
    店へ行く
------------------------- */

shopBtn.addEventListener("click", () => {
    saveStatus();
    location.href = "shop.html";
})

/* -------------------------
   ごはん
------------------------- */

feedBtn.addEventListener("click", () => {

    hunger += 15;

    if (hunger > 100) {
        hunger = 100;
    }

    hp += 3;

    if (hp > 100) {
        hp = 100;
    }

    stress -= 3;

    if (stress < 0) {
        stress = 0;
    }

    kokoro.classList.add("bounce");

    setTimeout(() => {
        kokoro.classList.remove("bounce");
    }, 300);

    se.currentTime = 0;
    se.play();

    saveStatus();
    updateBars();
    updateFace();

});


/* -------------------------
   なでる
------------------------- */

let petMode = false;
let petTimer = 0;
let petCountdown = null;

petBtn.addEventListener("click", () => {

    document.body.style.cursor = 'url("../img/hand.png"), auto';

    petMode = true;

    se.currentTime = 0;
    se.play();

    let timeLeft = 5;

    petGauge.style.width = "100%";

    if (petCountdown) {
        clearInterval(petCountdown);
    }

    petCountdown = setInterval(() => {

        timeLeft--;

        petGauge.style.width =
            (timeLeft / 5) * 100 + "%";

        if (timeLeft <= 0) {

            clearInterval(petCountdown);

            petMode = false;

            petGauge.style.width = "0%";

            document.body.style.cursor = "default";

        }

    }, 1000);

});


function petKokoro() {

    if (!petMode) {
        return;
    }

    const now = Date.now();

    if (now - petTimer < 300) {
        return;
    }

    petTimer = now;

    love += 2;

    if (love > 100) {
        love = 100;
    }

    stress -= 1;

    if (stress < 0) {
        stress = 0;
    }

    kokoro.classList.add("happy");

    setTimeout(() => {
        kokoro.classList.remove("happy");
    }, 200);

    saveStatus();
    updateBars();
    updateFace();

};
/* ----------------
    PC:マウス
-------------- */
kokoro.addEventListener('mousemove', () =>{
    petKokoro();
});
/* ---------------
    スマホ:指
-------------- */
kokoro.addEventListener("touchmove", (e) =>{
    if (!petMode){
        return
    };
    e.preventDefault ();

    petKokoro();
},{passive: false});
/* -------------------------
   あそぶ
------------------------- */

playBtn.addEventListener("click", () => {

    saveStatus();

    se.currentTime = 0;
    se.play();

    setTimeout(() => {

        location.href = "play.html";

    }, 150);

});


/* -------------------------
   ねる
------------------------- */

sleepBtn.addEventListener("click", () => {

    hp += 20;

    if (hp > 100) {
        hp = 100;
    }

    hunger -= 5;

    if (hunger < 0) {
        hunger = 0;
    }

    stress -= 10;

    if (stress < 0) {
        stress = 0;
    }

    se.currentTime = 0;
    se.play();

    saveStatus();
    updateBars();
    updateFace();

});


/* -------------------------
   設定
------------------------- */

settingBtn.addEventListener("click", () => {

    if (settingPanel.style.display === "block") {

        settingPanel.style.display = "none";

    } else {

        settingPanel.style.display = "block";

    }

});

/* -------------------------
   リセットモーダル
------------------------- */

resetOpen.addEventListener("click", () => {

    resetModal.style.display = "flex";

});


cancelReset.addEventListener("click", () => {

    resetModal.style.display = "none";

});


doReset.addEventListener("click", () => {

    resetStatus();

    loadStatus();

    resetModal.style.display = "none";

    updateBars();
    updateFace();
    updateDay();
    updateCoin();

});


/* -------------------------
   Dayの経過
   5分 = 1 Day
------------------------- */

setInterval(() => {

    day++;

    saveStatus();

    updateBars();

}, 300000);


/* -------------------------
   ステータス時間経過
   5秒ごと
------------------------- */

setInterval(() => {

    love -= 2;
    hunger -= 1;
    stress += 1;

    if (love < 0) {
        love = 0;
    }

    if (hunger < 0) {
        hunger = 0;
    }

    if (stress > 100) {
        stress = 100;
    }

    saveStatus();

    updateBars();
    updateFace();

}, 5000);


/* -------------------------
   初期化
------------------------- */

updateBars();
updateFace();
updateDay();
updateCoin();

