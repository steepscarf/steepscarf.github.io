let button_play;
let button_playerlist;
let button_shop;
let button_discord;
let button_live;
let button_antybot;

const clickAudio = new Audio("audio/click.wav");
clickAudio.volume = 0.1;

let main_handle = document.querySelector("main");
let inoption_content = document.querySelector("#inoptioncontent");
let tooltips = document.querySelectorAll('.tooltiptext');

let main_html = main_handle.innerHTML;
let mainMenu_Shown = true;
let playerListShown = false;

let players_now = 0;
let players_max = 0;
let sampleArrayPlayersOnline = Array();
let fullArrayPlayersOnline = Array();
let playerSampleList = "Wczytywanie...";

let lastHintCoord = new Array(2);

mainMenuEventRegister();
timerRefresh();

function onPlayClick() {
    clickAudio.play();
    main_handle.innerHTML = '';
    mainMenu_Shown = false;
    inoption_content.innerHTML = '<div class="inOption">\
    <div class="inOptTitle">Dane serwera</div>\
    <div class="inOptBoxTitle">Nazwa serwera</div>\
    <textarea class="blackBox" disabled>SteepScarf Adventure</textarea>\
    <div class="inOptBoxTitle">Adres serwera</div>\
    <textarea id="ipAddress" class="blackBox" disabled>steepscarf.aternos.me</textarea>\
    <button type="button" id="btnCopyIP">Skopiuj adres serwera</button>\
    <div class="inOptBoxTitle" id="infoCopy"></div>\
    <div style="height:175px"></div>\
    <button type="button" id="btnBack">Wstecz</button> \
</div>';
    document.querySelector("#btnBack").addEventListener("click", onBackClick);
    document.querySelector("#btnCopyIP").addEventListener("click", copyAddressToClipboard);
}

function onPlayerListClick() {
    clickAudio.play();
    main_handle.innerHTML = '';
    mainMenu_Shown = false;
    playerListShown = true;
    inoption_content.innerHTML = '<div class="inOption">\
    <div class="inOptTitle">Lista Graczy</div>\
    <div class="playerListOnlineCounter">Online <span style="color: greenyellow;">'+ players_now + '</span><span style="color: white;">/</span><span style="color: red;">' + players_max + '</span></div>\
    <div class="playerList">\
    <div class="playerBox">Wczytywanie...</div>\
    </div><button type="button" id="btnBack">Wstecz</button></div>';
    loadPlayerList();
    document.querySelector("#btnBack").addEventListener("click", onBackClick);
}

function onShopClick() {
    clickAudio.play();
    window.open("https://sklep.steepscarf.github.io");
}

function onDiscordClick() {
    clickAudio.play();
    window.open("https://discord.gg/psSudzBuDZ");
}

function onBackClick() {
    clickAudio.play();
    inoption_content.innerHTML = '';
    main_handle.innerHTML = main_html;
    mainMenuEventRegister();
}

function onLiveClick() {
    clickAudio.play();
    window.open("https://www.youtube.com/@SteepScarf");
}

function onAntyBotClick() {
    clickAudio.play();
    window.open("https://steepscarf.github.io/antibot.html");
}

function copyAddressToClipboard() {
    clickAudio.play();
    navigator.clipboard.writeText("play.eadventure.pl");
    let handle_infoCopy = document.getElementById("infoCopy");
    handle_infoCopy.style.textAlign = "center";
    handle_infoCopy.style.color = "lightgreen";
    handle_infoCopy.innerHTML = "Skopiowano adres IP serwera!"
}

function mainMenuEventRegister() {
    button_play = document.querySelector("#btnPlay");
    button_playerlist = document.querySelector("#btnPlayerList");
    button_shop = document.querySelector("#btnShop");
    button_discord = document.querySelector("#btnDiscord");
    button_live = document.querySelector("#btnLive");
    button_antybot = document.querySelector("#btnAntyBot")

    button_play.addEventListener("click", onPlayClick);
    button_playerlist.addEventListener("click", onPlayerListClick);
    button_shop.addEventListener("click", onShopClick);
    button_discord.addEventListener("click", onDiscordClick);
    button_live.addEventListener("click", onLiveClick);
    button_antybot.addEventListener("click", onAntyBotClick);
    mainMenu_Shown = true;
    playerListShown = false;
    updateMenuPlayersCountAndHint();
}


function timerRefresh() {
    updateMenuPlayersCountAndHint();
    if (players_max == 0) {
        setTimeout(() => {
            timerRefresh();
        }, 1000);
    }
    else {
        setTimeout(() => {
            timerRefresh();
        }, 10000);
    }
}

function readServerData() {
    return new Promise(resolve => {
        fetch('mcapi/playerlist.php')
            .then(response => response.json())
            .then(data => handleServerStatus(data));

        function handleServerStatus(data) {
            if (data.status == 'error') {
                console.log(data.error);
                return resolve(0);
            }
            players_now = data.playerCount;
            players_max = 100;
            sampleArrayPlayersOnline = data.players.slice(0, 15);
            return resolve(1);
        }
    });
}

async function updateMenuPlayersCountAndHint() {
    const status_serverdata = await readServerData();
    if (status_serverdata == 0) return;
    if (playerListShown == true) {
        document.querySelector(".playerListOnlineCounter").innerHTML = 'Online <span style="color: greenyellow;">' + players_now + '</span><span style="color: white;">/</span><span style="color: red;">' + players_max + '</span>';
        loadPlayerList();
    }
    if (mainMenu_Shown == false) return;
    playerSampleList = "";
    let onListVisiblePlayers = 0;
    if (players_now > 0) {
        for (let x = 0; x < sampleArrayPlayersOnline.length; x++) {
            onListVisiblePlayers++;
            if (sampleArrayPlayersOnline.length - 1 != x) playerSampleList += sampleArrayPlayersOnline[x].nick + "</br>";
            else playerSampleList += sampleArrayPlayersOnline[x].nick;
        }
    }
    else playerSampleList = "Brak graczy online.";
    if (players_now > onListVisiblePlayers) {
        playerSampleList += '</br>...i ' + (players_now - onListVisiblePlayers) + ' więcej...';
    }

    button_playerlist.innerHTML = 'Lista Graczy (' + players_now + '/' + players_max + ')<span id="tipPlayerList" class="tooltiptext">' + playerSampleList + '</span>';
    tooltips = document.querySelectorAll('.tooltiptext');
    for (let i = 0; i < tooltips.length; i++) {
        tooltips[i].style.top = lastHintCoord[0];
        tooltips[i].style.left = lastHintCoord[1];
    }
}

window.onmousemove = function (e) {
    let x = (e.clientX + 20) + 'px',
        y = (e.clientY + 20) + 'px';
    for (let i = 0; i < tooltips.length; i++) {
        tooltips[i].style.top = y;
        tooltips[i].style.left = x;
        lastHintCoord[0] = y;
        lastHintCoord[1] = x;
    }
};

async function loadPlayerList() {
    const status_playerlist = await getFullPlayerList();
    if (status_playerlist == 1) {
        let playerListHTML = '';
        for (let x = 0; x < fullArrayPlayersOnline.length; x++) {
            playerListHTML += ' <div class="playerBox">\
        <div class="playerAvatar">\
            <img src="https://minotar.net/avatar/'+ fullArrayPlayersOnline[x].nick + '/16" alt="">\
        </div>\
        <div class="playerName">\
            '+ fullArrayPlayersOnline[x].nick + '\
        </div>\
    </div>';
        }
        playerListHTML += '<div style="clear:both;"></div>';
        document.querySelector(".playerList").innerHTML = playerListHTML;
    }
    else if (status_playerlist == 2) {
        document.querySelector(".playerList").innerHTML = "<div class=\"playerBox\">Brak graczy</div>";
    }
    else {
        document.querySelector(".playerList").innerHTML = "<div class=\"playerBox\">Błąd</div>";
    }
}


function getFullPlayerList() {
    return new Promise(resolve => {
        if (players_now == 0) return resolve(2);
        fetch('mcapi/playerlist.php')
            .then(response => response.json())
            .then(data => handlePlayersOnlineListStatus(data));

        function handlePlayersOnlineListStatus(data) {
            if (data.status == 'error') {
                console.log(data.error);
                return resolve(0);
            }
            fullArrayPlayersOnline = data.players;
            return resolve(1);
        }
    });
}


