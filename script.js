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

// 初始状态
updateWordCount();