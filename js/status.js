/* -------------------------
   初期値
------------------------- */

let hp = 80;
let hunger = 50;
let love = 60;
let stress = 20;
let day = 1;
let coin = 0;
// 音量設定（0〜100）
let bgmVolume = 20;
let seVolume = 10;

/* -------------------------
   保存
------------------------- */

function saveStatus() {
    localStorage.setItem("hp", hp);
    localStorage.setItem("hunger", hunger);
    localStorage.setItem("love", love);
    localStorage.setItem("stress", stress);
    localStorage.setItem("day", day);
    localStorage.setItem("coin", coin);
};


/* -------------------------
   読み込み
------------------------- */

function loadStatus() {
    hp = Number(localStorage.getItem("hp")) || 80;
    hunger = Number(localStorage.getItem("hunger")) || 50;
    love = Number(localStorage.getItem("love")) || 60;
    stress = Number(localStorage.getItem("stress")) || 20;
    day = Number(localStorage.getItem("day")) || 1;
    coin = Number(localStorage.getItem("coin")) || 0;
};

/* -------------------------
音量設定の読み込み
------------------------- */

function loadSoundSettings() {
const savedBgmVolume = localStorage.getItem("bgmVolume");
const savedSeVolume = localStorage.getItem("seVolume");

bgmVolume = savedBgmVolume !== null
    ? Number(savedBgmVolume)
    : 20;

seVolume = savedSeVolume !== null
    ? Number(savedSeVolume)
    : 10;

};

/* -------------------------
音量設定の保存
------------------------- */

function saveSoundSettings() {
localStorage.setItem("bgmVolume", bgmVolume);
localStorage.setItem("seVolume", seVolume);
};

/* -------------------------
   リセット
------------------------- */

function resetStatus() {

    hp = 80;
    hunger = 50;
    love = 60;
    stress = 20;
    day = 1;
    coin = 0;

    inventory = {};
    selectedBall = "ball_1";

    saveStatus();
    saveInventory();

// 初回プレゼントの受け取り記録を削除
    localStorage.removeItem("inventoryInitialized");    
};


/* -------------------------
   日付表示
------------------------- */

function updateDay() {

    const dayText = document.getElementById("day");

    if (dayText) {
        dayText.textContent = `Day ${day}`;
    }

};


/* -------------------------
   コイン表示
------------------------- */

function updateCoin() {

    const coinText = document.getElementById("coin");

    if (coinText) {
        coinText.textContent = coin;
    }

};

/* -------------------------
   所持品
------------------------- */

// 所持品
let inventory = {};

// 選択中のボール
let selectedBall = "ball_1";


/* -------------------------
   所持品の読み込み
------------------------- */

function loadInventory() {
    inventory = JSON.parse(
        localStorage.getItem("inventory") || "{}"
    );

    selectedBall =
        localStorage.getItem("selectedBall") || "ball_1";
};


/* -------------------------
   所持品の保存
------------------------- */

function saveInventory() {
    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        "selectedBall",
        selectedBall
    );
}