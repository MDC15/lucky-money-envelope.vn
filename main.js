(async function () {
    const SO_LUONG_BAO_TOI_DA = 100;
    const KHOANG_THOI_GIAN_TAO_BAO = 500;
    const TIEN_MENH_GIA = [
        5000, 10000, 20000,
        30000, 40000, 50000,
        60000, 83860, 100000
    ];
    let LOI_CHUC = []; // Sẽ được tải từ file JSON
    let playerName = ''; // Tên người chơi
    let soBaoDangCo = 0;
    let gameInterval = null;

    // Hàm tải lời chúc từ file JSON
    async function loadLoiChuc() {
        try {
            const response = await fetch('data/data.json');
            const data = await response.json();
            LOI_CHUC = data.loiChuc.flatMap(category => category.messages);
            console.log('Loaded', LOI_CHUC.length, 'lời chúc');
        } catch (error) {
            console.error('Error loading lời chúc:', error);
            LOI_CHUC = [
                "Phúc lộc song hành",
                "Tài vận hanh thông",
                "Xuân sang đắc lộc"
            ];
        }
    }

    function generateEnvelope() {
        if (soBaoDangCo >= SO_LUONG_BAO_TOI_DA) return;

        const envelope = createEnvelopeElement();
        const animation = drop(envelope);
        setupEvents(envelope, animation);
        document.body.appendChild(envelope);
        soBaoDangCo++;
    }

    function createEnvelopeElement() {
        const padding = 20;
        const randomX = Math.random() * (window.innerWidth - 2 * padding) + padding;
        const randomY = Math.random() * (window.innerHeight * 0.2) + padding;

        const envelope = document.createElement("div");
        envelope.className = "bao-li-xi";
        envelope.style.left = `${randomX}px`;
        envelope.style.top = `${randomY}px`;
        envelope.textContent = "🎁";
        return envelope;
    }

    function drop(envelope) {
        const horizontalMove = Math.random() * 200 - 100;
        const keyframes = [
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${horizontalMove}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)` }
        ];
        return envelope.animate(keyframes, {
            duration: Math.random() * 4000 + 3000,
            easing: "ease-in-out",
        });
    }

    function setupEvents(envelope, animation) {
        const handleClick = () => {
            const money = getRandomMoney();
            const message = getRandomMessage();
            showPopup(money, message);
            playSound();
            animation.cancel();
            envelope.remove();
            soBaoDangCo--;
        };

        envelope.addEventListener("click", handleClick);
        envelope.addEventListener("touchstart", handleClick, { passive: true });
        animation.onfinish = () => {
            envelope.remove();
            soBaoDangCo--;
        };
    }

    function getRandomMoney() {
        return TIEN_MENH_GIA[Math.floor(Math.random() * TIEN_MENH_GIA.length)];
    }

    function getRandomMessage() {
        return LOI_CHUC[Math.floor(Math.random() * LOI_CHUC.length)];
    }

    function showPopup(money, message) {
        document.getElementById("tien-thuong").textContent = `${money.toLocaleString()} VND`;
        document.getElementById("loi-chuc").textContent = message;
        document.getElementById("popup").style.display = "block";
        document.getElementById("overlay").style.display = "block";

        const replayButton = document.getElementById("start-button");
        replayButton.textContent = "Chơi lại";
        replayButton.style.display = "block";
        replayButton.disabled = false;

        replayButton.addEventListener("click", function () {
            resetGame();
        }, { once: true });
    }

    function playSound() {
        const audio = new Audio('./assets/audio/click.mp3');
        audio.play().catch((error) => console.log("Auto-play prevented"));
    }

    async function playBackgroundMusic() {
        const music = document.getElementById("background-music");
        music.volume = 1;
        await music.play().catch((error) => console.log("Auto-play prevented"));
    }

    function resetGame() {
        clearInterval(gameInterval);
        document.getElementById("popup").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        playerName = "";
        soBaoDangCo = 0;
        showNameInput();
    }

    function isValidName(name) {
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]{2,50}$/;
        return nameRegex.test(name.trim());
    }

    function showNameInput() {
        document.getElementById('name-popup').style.display = 'block';
        document.getElementById('name-overlay').style.display = 'block';
        document.getElementById('start-button').textContent = "Bắt đầu";
    }

    function hideNameInput() {
        document.getElementById('name-popup').style.display = 'none';
        document.getElementById('name-overlay').style.display = 'none';
    }

    document.getElementById('start-button').addEventListener('click', function () {
        const nameInput = document.getElementById('player-name');
        const errorElement = document.getElementById('name-error');
        const name = nameInput.value.trim();

        if (!name) {
            errorElement.textContent = 'Vui lòng nhập tên của bạn!';
            return;
        }

        if (!isValidName(name)) {
            errorElement.textContent = 'Tên không hợp lệ (2-50 ký tự, không chứa ký tự đặc biệt)';
            return;
        }

        const playedUsers = JSON.parse(localStorage.getItem('playedUsers') || '[]');
        if (playedUsers.includes(name.toLowerCase())) {
            errorElement.textContent = 'Bạn chỉ được chơi 1 lần!';
            return;
        }

        playerName = name;
        localStorage.setItem('playedUsers', JSON.stringify([...playedUsers, name.toLowerCase()]));
        hideNameInput();
        startGame();
    });

    async function startGame() {
        await loadLoiChuc();
        if (gameInterval) clearInterval(gameInterval); // Đảm bảo không chạy nhiều interval
        gameInterval = setInterval(generateEnvelope, KHOANG_THOI_GIAN_TAO_BAO);
        document.addEventListener("click", playBackgroundMusic, { once: true });
    }

    showNameInput();
})();
