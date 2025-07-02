// 全局变量
let timerInterval;
let startTime = 0;
let elapsedTime = 0;

// 获取 DOM 元素
const writingArea = document.getElementById('writing-area');
const startBtn = document.getElementById('start-btn');
const finishBtn = document.getElementById('finish-btn');
const timerDisplay = document.getElementById('timer');
const wordCountDisplay = document.getElementById('word-count');
const imageUploadInput = document.getElementById('image-upload');
const uploadedImage = document.getElementById('uploaded-image');

// 更新字数显示
function updateWordCount() {
    const text = writingArea.value.trim();
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    wordCountDisplay.textContent = `字数：${wordCount}`;
}

// 更新计时器显示
function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timerDisplay.textContent = `时间：${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 开始计时
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
    startBtn.disabled = true;
    finishBtn.disabled = false;
}

// 停止计时并复制内容到剪贴板
function stopTimer() {
    clearInterval(timerInterval);
    const text = writingArea.value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('内容已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
    } else {
        alert('浏览器不支持剪贴板 API');
    }
    writingArea.disabled = true;
    startBtn.disabled = true;
    finishBtn.disabled = true;
}

// 处理图片上传
function handleImageUpload() {
    const file = imageUploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // 将 Base64 数据设置到 img 的 src 属性中
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file); // 读取文件并转换为 Base64
    } else {
        // 如果没有选择文件，则清空图片
        uploadedImage.src = '';
    }
}

// 初始化事件监听器
startBtn.addEventListener('click', () => {
    startTimer();
});

finishBtn.addEventListener('click', () => {
    stopTimer();
});

writingArea.addEventListener('input', () => {
    updateWordCount();
});

const instructionDiv = document.getElementById('task-instruction');

// 初始状态：显示默认提示文字
function setPlaceholder() {
    instructionDiv.innerText = '输入题目内容';
    instructionDiv.style.color = '#aaa';
    instructionDiv.style.fontStyle = 'italic';
}

function setContent(text) {
    instructionDiv.innerText = text;
    instructionDiv.style.color = '#333';
    instructionDiv.style.fontStyle = 'normal';
}

// 初始化显示
window.addEventListener('DOMContentLoaded', () => {
    if (!instructionDiv.innerText.trim()) {
        setPlaceholder();
    }
});

// 双击进入编辑模式
instructionDiv.addEventListener('dblclick', () => {
    if (instructionDiv.isContentEditable) return;

    // 清除 placeholder 文字
    if (instructionDiv.innerText === '输入题目内容') {
        instructionDiv.innerText = '';
        instructionDiv.style.color = '#333';
        instructionDiv.style.fontStyle = 'normal';
    }

    instructionDiv.contentEditable = 'true';
    instructionDiv.focus();
});

// 按下 Enter 键保存并退出编辑
instructionDiv.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // 阻止换行
        instructionDiv.contentEditable = 'false';

        const text = instructionDiv.innerText.trim();
        if (!text) {
            setPlaceholder();
        } else {
            setContent(text);
        }
    }
});

// 初始状态
updateWordCount();

