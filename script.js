        // 防止页面滚动和缩放
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });

        // 显示规则弹窗
        function showRules() {
            document.getElementById('rulesModal').style.display = 'flex';
            // 阻止背景滚动
            document.body.style.overflow = 'hidden';
        }
        
        // 关闭规则弹窗
        function closeRules() {
            document.getElementById('rulesModal').style.display = 'none';
            // 恢复背景滚动
            document.body.style.overflow = 'auto';
        }
        
        // 点击弹窗外部关闭
        window.onclick = function(event) {
            if (event.target == document.getElementById('rulesModal')) {
                closeRules();
            }
        }

        // 卡牌数据
        const cardData = {
            characters: [
                { name: "勇敢男孩", icon: "👦", description: "永远不会害怕困难的小男孩" },
                { name: "聪明女孩", icon: "👧", description: "总能想出好办法的小女孩" },
                { name: "医生叔叔", icon: "👨‍⚕️", description: "关心大家健康的好医生" },
                { name: "老师阿姨", icon: "👩‍🏫", description: "喜欢教小朋友知识的老师" },
                { name: "农夫爷爷", icon: "👨‍🌾", description: "种植美味蔬菜的爷爷" }
            ],
            goals: [
                { name: "消灭贫困", icon: "🏠", description: "让每个人都有温暖的家" },
                { name: "消灭饥饿", icon: "🍎", description: "让每个人都吃得饱饱的" },
                { name: "健康生活", icon: "❤️", description: "让大家都身体健康快乐" },
                { name: "优质教育", icon: "📚", description: "让每个小朋友都能上学" },
                { name: "性别平等", icon: "⚖️", description: "男孩女孩一样棒" },
                { name: "清洁饮水", icon: "💧", description: "让每个人都喝到干净水" },
                { name: "清洁能源", icon: "☀️", description: "用太阳和风发电" },
                { name: "体面工作", icon: "💼", description: "让大人们有好工作" },
                { name: "创新发展", icon: "🔬", description: "发明有趣的新东西" },
                { name: "减少不平等", icon: "🤝", description: "大家都是好朋友" },
                { name: "可持续城市", icon: "🏙️", description: "建设美丽干净的城市" },
                { name: "负责任消费", icon: "♻️", description: "不浪费爱惜东西" },
                { name: "气候行动", icon: "🌍", description: "保护我们的地球妈妈" },
                { name: "海洋保护", icon: "🐋", description: "让海洋变得更干净" },
                { name: "陆地保护", icon: "🌳", description: "保护森林和小动物" },
                { name: "和平正义", icon: "🕊️", description: "大家和睦相处" },
                { name: "全球合作", icon: "🌐", description: "全世界一起努力" }
            ],
            locations: [
                { name: "美丽学校", icon: "🏫", description: "充满欢声笑语的校园" },
                { name: "绿色公园", icon: "🌳", description: "有花有草的快乐天地" },
                { name: "快乐村庄", icon: "🏘️", description: "邻居们互相帮助的地方" },
                { name: "神秘森林", icon: "🌲", description: "住着小动物的森林" },
                { name: "蓝色海边", icon: "🏖️", description: "听得到海浪声音的地方" }
            ],
            items: [
                { name: "魔法书本", icon: "📖", description: "装满智慧的神奇书" },
                { name: "神奇背包", icon: "🎒", description: "能装下很多有用东西" },
                { name: "希望种子", icon: "🌱", description: "种下就能长出美好" },
                { name: "友谊手环", icon: "💝", description: "连接心与心的礼物" },
                { name: "勇气勋章", icon: "🏅", description: "给人勇气的宝物" }
            ],
            actions: [
                { name: "帮助他人", icon: "🤝", description: "向需要帮助的人伸出援手" },
                { name: "想出妙招", icon: "💡", description: "用聪明的头脑解决问题" },
                { name: "团结协作", icon: "👫", description: "和朋友一起完成任务" },
                { name: "勇敢尝试", icon: "🌟", description: "不害怕去做新的尝试" },
                { name: "分享快乐", icon: "😊", description: "把开心传递给别人" }
            ]
        };

        let gameState = {
            totalCards: 5,
            currentCard: 0,
            drawnCards: [],
            availableCards: [],
            goalCard: null,
            gameStarted: false
        };

        function startGame() {
            const totalCards = parseInt(document.getElementById('totalCards').value);
            if (totalCards < 3 || totalCards > 20) {
                alert('请设置3-20张卡牌哦！😊');
                return;
            }

            gameState.totalCards = totalCards;
            gameState.currentCard = 0;
            gameState.drawnCards = [];
            gameState.gameStarted = true;

            // 准备卡牌库
            prepareCards();

            // 切换界面
            document.getElementById('settingsPanel').style.display = 'none';
            document.getElementById('gamePanel').style.display = 'block';
            document.getElementById('totalCardsDisplay').textContent = totalCards;

            // 重置显示
            document.getElementById('cardDisplay').innerHTML = '<div class="empty-state">点击下方按钮抽取你的第一张卡牌！✨</div>';
            document.getElementById('cardsDrawn').style.display = 'none';
            document.getElementById('hintButton').style.display = 'none';
            document.getElementById('storyHint').style.display = 'none';
        }

        function prepareCards() {
            // 随机选择一个目标卡作为必抽卡
            gameState.goalCard = cardData.goals[Math.floor(Math.random() * cardData.goals.length)];
            
            // 准备其他类型的卡牌
            const otherCards = [];
            
            // 添加角色卡
            cardData.characters.forEach(card => {
                otherCards.push({ ...card, type: 'character' });
            });
            
            // 添加地点卡
            cardData.locations.forEach(card => {
                otherCards.push({ ...card, type: 'location' });
            });
            
            // 添加物品卡
            cardData.items.forEach(card => {
                otherCards.push({ ...card, type: 'item' });
            });
            
            // 添加行动卡
            cardData.actions.forEach(card => {
                otherCards.push({ ...card, type: 'action' });
            });

            // 打乱其他卡牌
            shuffleArray(otherCards);
            
            // 准备可抽取卡牌：第一张是目标卡，然后是随机的其他卡牌
            gameState.availableCards = [
                { ...gameState.goalCard, type: 'goal' },
                ...otherCards.slice(0, gameState.totalCards - 1)
            ];
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function drawCard() {
            if (gameState.currentCard >= gameState.totalCards) {
                alert('所有卡牌都抽完了！你可以开始编故事啦！😊');
                return;
            }

            const card = gameState.availableCards[gameState.currentCard];
            gameState.drawnCards.push(card);
            gameState.currentCard++;

            displayCard(card);
            updateProgress();
            updateDrawnCards();

            if (gameState.currentCard >= gameState.totalCards) {
                document.getElementById('drawButton').textContent = '🎉 抽卡完成！';
                document.getElementById('drawButton').disabled = true;
                document.getElementById('hintButton').style.display = 'inline-block';
            }
        }

        function displayCard(card) {
            // 将类型转换为中文显示
            let typeName = '';
            switch(card.type) {
                case 'character':
                    typeName = '角色';
                    break;
                case 'goal':
                    typeName = '目标';
                    break;
                case 'location':
                    typeName = '地点';
                    break;
                case 'item':
                    typeName = '物品';
                    break;
                case 'action':
                    typeName = '行动';
                    break;
                default:
                    typeName = card.type;
            }
            
            const cardHtml = `
                <div class="card ${card.type}">
                    <div class="card-icon">${card.icon}</div>
                    <div class="card-title">${card.name}</div>
                    <div class="card-type">${typeName}</div>
                    <div class="card-description">${card.description}</div>
                </div>
            `;
            
            document.getElementById('cardDisplay').innerHTML = cardHtml;
        }

        function updateProgress() {
            const progress = (gameState.currentCard / gameState.totalCards) * 100;
            document.getElementById('currentCard').textContent = gameState.currentCard;
            document.getElementById('progressFill').style.width = progress + '%';
        }

        function updateDrawnCards() {
            if (gameState.drawnCards.length > 0) {
                document.getElementById('cardsDrawn').style.display = 'block';
                const cardsHtml = gameState.drawnCards.map(card => 
                    `<span class="mini-card">${card.icon} ${card.name}</span>`
                ).join('');
                document.getElementById('drawnCardsList').innerHTML = cardsHtml;
            }
        }

        function getStoryHint() {
            const goalCard = gameState.drawnCards.find(card => card.type === 'goal');
            if (!goalCard) return;

            const hints = [
                `🌟 试试用"${goalCard.name}"作为你故事的主题，想想怎样能让世界变得更美好！`,
                `✨ 你可以讲述一个关于"${goalCard.name}"的冒险故事，主人公如何解决这个问题？`,
                `🎭 想象一下，如果没有"${goalCard.name}"这个问题，世界会是什么样子？`,
                `🚀 你的角色们可以一起合作，用什么特殊方法来实现"${goalCard.name}"？`,
                `💫 试着从小事开始，想想在日常生活中如何实现"${goalCard.name}"？`
            ];
            
            const randomHint = hints[Math.floor(Math.random() * hints.length)];
            document.getElementById('storyHint').innerHTML = randomHint;
            document.getElementById('storyHint').style.display = 'block';
        }

        function restartGame() {
            gameState = {
                totalCards: 5,
                currentCard: 0,
                drawnCards: [],
                availableCards: [],
                goalCard: null,
                gameStarted: false
            };

            document.getElementById('settingsPanel').style.display = 'block';
            document.getElementById('gamePanel').style.display = 'none';
            document.getElementById('drawButton').disabled = false;
            document.getElementById('drawButton').textContent = '🎴 抽取卡牌';
        }
