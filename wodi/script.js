let currentGame = {
    playerCount: 0,
    currentPlayer: 0,
    players: [],
    currentWordPair: null,
    spyIndex: -1,
    wordPairs: [] // 初始化空数组，将在加载数据后填充
};

// 获取DOM元素
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const revealBtn = document.getElementById('revealBtn');
const restartBtn = document.getElementById('restartBtn');

// 添加事件监听器
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextPlayer);
revealBtn.addEventListener('click', revealWords);
restartBtn.addEventListener('click', restartGame);

// 加载JSON数据
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        currentGame.wordPairs = data.wordPairs;
        console.log('词汇数据加载成功');
    })
    .catch(error => {
        console.error('加载词汇数据失败:', error);
        // 可以在这里设置一些默认词汇作为后备
        currentGame.wordPairs = [
            {
                civilian: { word: "太阳能板", desc: "将阳光转化为电能的清洁能源设备" },
                spy: { word: "风车", desc: "利用风力发电的可再生能源设备" }
            },
            {
                civilian: { word: "竹制品", desc: "用竹子制作的环保可降解产品" },
                spy: { word: "木制品", desc: "用木材制作的天然材料产品" }
            }
        ];
    });

// 禁用滚动和缩放
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

function startGame() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    
    if (playerCount < 3 || playerCount > 8) {
        alert('玩家人数应该在3-8人之间哦！');
        return;
    }

    // 检查是否已加载词汇数据
    if (currentGame.wordPairs.length === 0) {
        alert('词汇数据正在加载中，请稍后再试');
        return;
    }

    // 随机选择词汇对
    currentGame.currentWordPair = currentGame.wordPairs[Math.floor(Math.random() * currentGame.wordPairs.length)];
    currentGame.playerCount = playerCount;
    currentGame.currentPlayer = 0;
    
    // 随机选择卧底
    currentGame.spyIndex = Math.floor(Math.random() * playerCount);
    
    // 初始化玩家数组
    currentGame.players = [];
    for (let i = 0; i < playerCount; i++) {
        currentGame.players.push({
            name: `玩家 ${i + 1}`,
            isSpy: i === currentGame.spyIndex,
            word: i === currentGame.spyIndex ? 
                  currentGame.currentWordPair.spy : 
                  currentGame.currentWordPair.civilian
        });
    }

    // 切换到游戏界面
    document.getElementById('gameSetup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'flex';
    
    showCurrentPlayer();
}

function showCurrentPlayer() {
    const player = currentGame.players[currentGame.currentPlayer];
    
    document.getElementById('currentPlayerName').textContent = player.name;
    document.getElementById('playerProgress').textContent = 
        `${currentGame.currentPlayer + 1} / ${currentGame.playerCount}`;
    document.getElementById('wordDisplay').textContent = player.word.word;
    document.getElementById('wordDescription').textContent = player.word.desc;
}

function nextPlayer() {
    currentGame.currentPlayer++;
    
    if (currentGame.currentPlayer >= currentGame.playerCount) {
        // 所有玩家都看完了，显示游戏结束按钮
        document.getElementById('currentPlayerName').textContent = '全部完成！';
        document.getElementById('playerProgress').textContent = '可以开始讨论了';
        document.getElementById('wordDisplay').textContent = '🤔';
        document.getElementById('wordDescription').textContent = '现在开始描述你们的词汇，找出卧底吧！';
    } else {
        showCurrentPlayer();
    }
}

function revealWords() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameEnd').style.display = 'block';
    
    document.getElementById('civilianWord').textContent = currentGame.currentWordPair.civilian.word;
    document.getElementById('civilianDesc').textContent = currentGame.currentWordPair.civilian.desc;
    document.getElementById('spyWord').textContent = currentGame.currentWordPair.spy.word;
    document.getElementById('spyDesc').textContent = currentGame.currentWordPair.spy.desc;
}

function restartGame() {
    document.getElementById('gameEnd').style.display = 'none';
    document.getElementById('gameSetup').style.display = 'block';
    
    // 重置游戏状态
    currentGame = {
        ...currentGame,
        playerCount: 0,
        currentPlayer: 0,
        players: [],
        currentWordPair: null,
        spyIndex: -1
    };
}