let currentScene = 0;
let selectedIngredients = new Set();
let challengeTimer = null;


/**
 * 切换场景函数 (保持不变)
 */
function nextScene(nextIndex) {
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
 * 场景通用答案检查 (场景 2 的 case 2 已彻底删除)
 */
function checkAnswer(sceneIndex, userAnswer = null) {
    const feedbackElement = document.getElementById(`feedback-${sceneIndex}`);
    let isCorrect = false;

    switch (sceneIndex) {
        case 1: // 橘子洲头 (选择题)
            isCorrect = (userAnswer === 'A');
            break;
        
        // **场景 2 (岳麓书院) 的 case 逻辑已删除，改为 HTML 直接跳转 nextScene(3)**

        case 4: // 凤凰古城 (悬疑观察题)
            isCorrect = (userAnswer === 'B');
            break;

        case 5: { // 湘菜 (多选配料题)
            const required = ['chili', 'garlic', 'soy'];
            isCorrect = required.every(key => selectedIngredients.has(key));

            selectedIngredients.clear();
            document.querySelectorAll('.ingredient-button').forEach(btn => btn.classList.remove('selected'));
            break;
        }

        default:
            return;
    }

    if (isCorrect) {
        feedbackElement.innerHTML = '✅ 规则验证成功！秘境大门已为你开启。';
        setTimeout(() => nextScene(sceneIndex + 1), 1000); 
    } else {
        feedbackElement.innerHTML = '❌ 规则错误。请重新审视秘境提示！';
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
    counterElement.textContent = '0';
    timerElement.textContent = time;
    feedbackElement.innerHTML = '点击开始！';

    clickArea.onclick = () => {
        clicks++;
        counterElement.textContent = clicks;
        if (clicks >= requiredClicks) {
            clearInterval(challengeTimer);
            clickArea.onclick = null;
            feedbackElement.innerHTML = '✅ 挑战成功！你征服了天门山。';
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