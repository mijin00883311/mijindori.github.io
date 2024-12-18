let currentDrag = null;
let draggedBox = null;
let textClickCount = 0; // 텍스트 클릭 횟수
let isIntroActive = true; // "너 누구야?" 메시지 활성화 상태
let introTriggered = false; // "너 누구야?" 메시지가 이미 표시되었는지 확인
let secondMessageTriggered = false; // "아! 미진이구나!" 메시지가 표시되었는지 확인

const dottedBoxes = document.querySelectorAll('.name');
const smallBoxes = document.querySelectorAll('.number');

// 페이지 전체에서 점선 네모가 겹치지 않는 랜덤 위치 생성
function getRandomPosition() {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    return {
        left: Math.random() * (maxWidth - 100),
        top: Math.random() * (maxHeight - 100)
    };
}

// 초기화: 점선 네모를 페이지 전체에서 랜덤 위치로 배치
dottedBoxes.forEach((box) => {
    const { left, top } = getRandomPosition();
    box.style.position = 'absolute';
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
});

// "너 누구야?" 메시지 표시
function showIntroText() {
    if (introTriggered) return;
    introTriggered = true;

    const introText = document.createElement('div');
    introText.innerText = '너 누구야?';
    introText.style.position = 'fixed';
    introText.style.top = '47%';
    introText.style.left = '50%';
    introText.style.transform = 'translate(-50%, -50%)';
    introText.style.fontSize = '16px';
    introText.style.color = 'black';
    introText.style.backgroundColor = 'rgba(255, 255, 255, 10';
    introText.style.padding = '10px';
    introText.style.border = '1.5px solid black';
    introText.style.zIndex = '1000';
    
    document.body.appendChild(introText);

    setTimeout(() => {
        introText.remove();
        isIntroActive = false; // 드래그 활성화
        showSecondMessageListener(); // 두 번째 메시지 대기
    }, 5000);
}

// "아! 미진이구나!" 메시지 표시
function showSecondMessage() {
    if (secondMessageTriggered) return;
    secondMessageTriggered = true;

    const secondText = document.createElement('div');
    secondText.innerText = '아! 미진이구나! 들어와!';
    secondText.style.position = 'fixed';
    secondText.style.top = '47%';
    secondText.style.left = '50%';
    secondText.style.transform = 'translate(-50%, -50%)';
    secondText.style.fontSize = '16px';
    secondText.style.color = 'black';
    secondText.style.backgroundColor = 'rgba(255, 255, 255,10)';
    secondText.style.padding = '10px';
    secondText.style.border = '1.5px solid black';
    secondText.style.zIndex = '1000';
    document.body.appendChild(secondText);

    setTimeout(() => {
        secondText.remove();
    }, 5000);
}

// 첫 번째 메시지 대기
function attachIntroListener() {
    const triggerEvents = ['mousemove', 'click', 'keydown'];
    triggerEvents.forEach((event) => {
        document.addEventListener(event, showIntroText, { once: true });
    });
}

// 두 번째 메시지 대기
function showSecondMessageListener() {
    const triggerEvents = ['mousemove', 'click', 'keydown'];
    triggerEvents.forEach((event) => {
        document.addEventListener(event, showSecondMessage, { once: true });
    });
}

// 점선 네모 드래그 시작
dottedBoxes.forEach((box) => {
    box.addEventListener('mousedown', (e) => {
        if (isIntroActive) return; // "너 누구야?" 표시 중이면 동작 안함
        currentDrag = box;
        draggedBox = box; // 드래그된 상자 추적
        currentDrag.style.zIndex = '1000';
    });
});

// 점선 네모 드래그 이동
document.addEventListener('mousemove', (e) => {
    if (isIntroActive || !currentDrag) return;
    currentDrag.style.position = 'absolute';
    currentDrag.style.left = `${e.pageX - currentDrag.offsetWidth / 2}px`;
    currentDrag.style.top = `${e.pageY - currentDrag.offsetHeight / 2}px`;
});

// 점선 네모 드래그 종료 및 작은 상자와의 충돌 체크
document.addEventListener('mouseup', (e) => {
    if (isIntroActive || !currentDrag) return;

    let isOverlapping = false;

    // 작은 상자들과 겹치는지 확인
    smallBoxes.forEach((smallBox) => {
        const smallBoxRect = smallBox.getBoundingClientRect();
        const dragRect = currentDrag.getBoundingClientRect();

        if (
            dragRect.left < smallBoxRect.right &&
            dragRect.right > smallBoxRect.left &&
            dragRect.top < smallBoxRect.bottom &&
            dragRect.bottom > smallBoxRect.top
        ) {
            isOverlapping = true;
        }
    });

    if (isOverlapping) {
        // 작은 상자와 겹칠 경우 메시지 표시
        const message = document.createElement('div');
        message.innerText = currentDrag.dataset.message; // 점선 네모에 설정된 메시지
        message.style.position = 'fixed';
        message.style.top = '95%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = 'black';
        message.style.fontSize = '16px';
        message.style.zIndex = '1000';
        document.body.appendChild(message);

        // 메시지 표시 후 투명화
        setTimeout(() => {
            let opacity = 1;
            const fadeInterval = setInterval(() => {
                opacity -= 0.05;
                message.style.opacity = opacity;
                draggedBox.style.opacity = opacity;

                if (opacity <= 0) {
                    clearInterval(fadeInterval);
                    message.remove();
                    draggedBox.remove();
                }
            }, 100);
        }, 4000);

        // 클릭 횟수 증가
        textClickCount++;

        // 특정 클릭 횟수에 따라 버튼 생성
        if (textClickCount === 5) {
            createButton('야! 이 얘기 들었어?');
        } else if (textClickCount === 7) {
            updateButtonText('야! 들었냐고!');
        } else if (textClickCount === 10) {
            updateButtonText('아니 좀 들어봐 봐');
        }
    }

    currentDrag = null; // 드래그 상태 초기화
});

// 버튼 생성 함수
function createButton(text) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = 'white';
    button.style.color = 'black';
    button.style.border = '1px solid black';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        const square = document.createElement('div');
        square.style.position = 'fixed';
        square.style.top = '50%';
        square.style.left = '50%';
        square.style.transform = 'translate(-50%, -50%)';
        square.style.width = '400px';
        square.style.height = '200px';
        square.style.backgroundColor = 'white';
        square.style.border = '2ㄴpx solid black';
        square.style.color = 'black';
        square.style.textAlign = 'center'; // 글자 가운데 정렬
        square.style.padding = '20px';
        square.style.fontSize = '16px';
        square.style.zIndex = '1000';
        square.innerHTML = `
            <p>우리 학교 공학으로 바뀐대.</p>
            <p>그러면 옆학교랑 이름이 같아서 학교 이름도 바꿔야 한대.</p>
            <p>그럼 난 이제 출신도 바뀌는거야.</p>
            <p>난 원래 이름이 더 좋은데.</p>
            <p>슬프다. 이제 우리는 없어지네.</p>
        `;
        document.body.appendChild(square);

        button.remove(); // 버튼 제거
    });
}

function updateButtonText(newText) {
    const button = document.querySelector('button');
    if (button) {
        button.innerText = newText;
    }
}

// 첫 번째 메시지 대기
attachIntroListener();
