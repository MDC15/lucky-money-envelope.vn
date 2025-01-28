(async function () {
    const SO_LUONG_BAO_TOI_DA = 100;
    const KHOANG_THOI_GIAN_TAO_BAO = 500;
    const TIEN_MENH_GIA = [
        5000, 10000, 20000,
        30000, 40000, 50000,
        60000, 83860, 100000
    ];
    let LOI_CHUC = []; // Will be populated from JSON

    let soBaoDangCo = 0;

    // Fetch and load the lời chúc from JSON file
    async function loadLoiChuc() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            // Flatten all messages from different categories into a single array
            LOI_CHUC = data.loiChuc.flatMap(category => category.messages);
            console.log('Loaded', LOI_CHUC.length, 'lời chúc');
        } catch (error) {
            console.error('Error loading lời chúc:', error);
            // Fallback to a few basic messages if loading fails
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
    }

    function playSound() {
        const audio = new Audio('click.mp3');
        audio.play().catch((error) => console.log("Auto-play prevented"));
    }

    document.getElementById("dong-button").addEventListener("click", function () {
        document.getElementById("popup").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    });

    async function start() {
        document.addEventListener("click", playBackgroundMusic, { once: true });
        setInterval(generateEnvelope, KHOANG_THOI_GIAN_TAO_BAO);
        await loadLoiChuc();
    }

    async function playBackgroundMusic() {
        const music = document.getElementById("background-music");
        music.volume = 1;
        await music.play().catch((error) => console.log("Auto-play prevented"));
    }

    start();
})();
