let currentScene = 0;
let selectedIngredients = new Set();
let challengeTimer = null;


/**
 * 切换场景函数 
 */
function nextScene(nextIndex) {
    // 确保在跳转前清除场景 3 的计时器
    if (currentScene === 3 && challengeTimer) {
        clearInterval(challengeTimer);
        challengeTimer = null;
        document.getElementById(`click-area-3`).style.display = 'none';
        document.getElementById(`start-3`).style.display = 'block'; 
    }

    const currentElement = document.getElementById(`scene-${currentScene}`);
    if (currentElement) {
        currentElement.classList.remove('active');
    }
    
    currentScene = nextIndex;
    const nextElement = document.getElementById(`scene-${currentScene}`);
    if (nextElement) {
        nextElement.classList.add('active');
    }
}


/**
 * 场景通用答案检查 
 */
function checkAnswer(sceneIndex, userAnswer = null) {
    const feedbackElement = document.getElementById(`feedback-${sceneIndex}`);
    let isCorrect = false;

    switch (sceneIndex) {
        case 1: // 橘子洲头 (青年之问)
            // 答案：A. 到中流击水，浪遏飞舟。
            isCorrect = (userAnswer === 'A');
            break;
        
        case 4: { // 凤凰古城 (文人线索)
            // 答案：B. 《边城》女主角翠翠的职业是看渡船。
            isCorrect = (userAnswer === 'B');
            break;
        }

        case 5: { // 湘菜 (火焰秘方)
            // 核心配料：辣椒(chili), 蒜蓉(garlic), 酱油(soy)
            const required = ['chili', 'garlic', 'soy'];
            isCorrect = required.every(key => selectedIngredients.has(key));

            // 答题后清除状态
            selectedIngredients.clear();
            document.querySelectorAll('.ingredient-button').forEach(btn => btn.classList.remove('selected'));
            break;
        }

        default:
            return;
    }

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ 秘境线索收集成功！继续旅程。';
        setTimeout(() => nextScene(sceneIndex + 1), 1000); 
    } else {
        feedbackElement.innerHTML = '❌ 线索错误。请重新审视秘境提示！';
    }
}


// --- 场景 3: 张家界挑战的特殊函数 (计时挑战逻辑) ---
function startChallenge(sceneIndex) {
    if (challengeTimer) {
        clearInterval(challengeTimer);
    }
    
    const startButton = document.getElementById(`start-${sceneIndex}`);
    const clickArea = document.getElementById(`click-area-${sceneIndex}`);
    const counterElement = document.getElementById(`counter-${sceneIndex}`);
    const timerElement = document.getElementById(`timer-${sceneIndex}`);
    const feedbackElement = document.getElementById(`feedback-${sceneIndex}`);

    let clicks = 0;
    let time = 5;
    const requiredClicks = 10;

    startButton.style.display = 'none';
    clickArea.style.display = 'flex'; 
    counterElement.textContent = clicks;
    timerElement.textContent = time;
    feedbackElement.innerHTML = '点击开始！';

    clickArea.onclick = () => {
        clicks++;
        counterElement.textContent = clicks;
        if (clicks >= requiredClicks) {
            clearInterval(challengeTimer);
            clickArea.onclick = null;
            feedbackElement.innerHTML = '✅ 勇气试炼成功！';
            setTimeout(() => nextScene(sceneIndex + 1), 1000);
        }
    };

    challengeTimer = setInterval(() => {
        time--;
        timerElement.textContent = time;

        if (time <= 0 && clicks < requiredClicks) {
            clearInterval(challengeTimer);
            clickArea.onclick = null; 
            clickArea.style.display = 'none';
            startButton.style.display = 'block'; 
            feedbackElement.innerHTML = '❌ 时间到！勇气不足，请重新试炼！';
        }
    }, 1000);
}


// --- 场景 5: 湘菜多选的特殊函数 ---
function toggleIngredient(button) {
    const key = button.getAttribute('data-key');
    if (selectedIngredients.has(key)) {
        selectedIngredients.delete(key);
        button.classList.remove('selected');
    } else {
        selectedIngredients.add(key);
        button.classList.add('selected');
    }
}
