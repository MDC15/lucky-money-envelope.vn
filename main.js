import { Utilities } from "./utilities.js";

class Game {
    constructor() {
        this.constants = {
            MAX_ENVELOPES: 50,
            SPAWN_INTERVAL: 700,
            MONEY_VALUES: [5000, 10000, 20000, 50000, 100000, 200000, 500000],
            MESSAGES: [
                "An khang thịnh vượng",
                "Phát tài phát lộc",
                "Vạn sự như ý",
                "Tấn tài tấn lộc",
                "Xuân an khang, năm thịnh vượng"
            ]
        };

        this.state = {
            playerName: "",
            currentEnvelopes: 0,
            gameInterval: null,
            playedUsers: JSON.parse(localStorage.getItem('playedUsers') || '[]')
        };

        this.init();
    }

    init() {
        Utilities.playBackgroundMusic();
        this.setupEventListeners();
        this.showNameInput();
    }

    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => this.handleStart());
        document.getElementById('dong-button').addEventListener('click', () => this.handleOK());
    }

    generateEnvelope() {
        if (this.state.currentEnvelopes >= this.constants.MAX_ENVELOPES) return;

        const envelope = this.createEnvelopeElement();
        const animation = this.drop(envelope);
        this.setupEnvelopeEvents(envelope, animation);
        document.body.appendChild(envelope);
        this.state.currentEnvelopes++;
    }

    createEnvelopeElement() {
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

    drop(envelope) {
        const horizontalMove = Math.random() * 200 - 100;
        return envelope.animate([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${horizontalMove}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)` }
        ], {
            duration: Math.random() * 4000 + 3000,
            easing: "ease-in-out",
        });
    }

    setupEnvelopeEvents(envelope, animation) {
        const handleClick = () => {
            this.state.currentEnvelopes--;
            const money = this.getRandomMoney();
            const message = this.getRandomMessage();
            this.showPopup(money, message);
            Utilities.playSound();
            animation.cancel();
            envelope.remove();
        };

        envelope.addEventListener("click", handleClick);
        envelope.addEventListener("touchstart", handleClick, { passive: true });

        animation.onfinish = () => {
            envelope.remove();
            this.state.currentEnvelopes--;
        };
    }

    getRandomMoney() {
        return this.constants.MONEY_VALUES[Utilities.getRandomNumber(this.constants.MONEY_VALUES.length)];
    }

    getRandomMessage() {
        return this.constants.MESSAGES[Utilities.getRandomNumber(this.constants.MESSAGES.length)];
    }

    showPopup(money, message) {
        document.getElementById("tien-thuong").textContent = `${money.toLocaleString()} VND`;
        document.getElementById("loi-chuc").textContent = message;
        Utilities.showElement("popup");
        Utilities.showElement("overlay");
    }

    resetGame() {
        clearInterval(this.state.gameInterval);
        Utilities.hideElement("popup");
        Utilities.hideElement("overlay");
        this.showNameInput();
    }

    showNameInput() {
        Utilities.showElement('name-popup');
        Utilities.showElement('name-overlay');
    }

    hideNameInput() {
        Utilities.hideElement('name-popup');
        Utilities.hideElement('name-overlay');
    }

    handleStart() {
        const nameInput = document.getElementById('player-name');
        const errorElement = document.getElementById('name-error');
        const name = nameInput.value.trim();

        errorElement.textContent = '';
        if (!name) {
            errorElement.textContent = 'Vui lòng nhập họ và tên của bạn!';
            return;
        }

        if (!Utilities.isValidName(name)) {
            errorElement.textContent = 'Tên không hợp lệ (2-50 ký tự, không chứa ký tự đặc biệt)';
            return;
        }

        if (this.state.playedUsers.includes(name.toLowerCase())) {
            errorElement.textContent = 'Bạn chỉ được chơi một lần!';
            return;
        }

        this.state.playerName = name;
        this.state.playedUsers.push(name.toLowerCase());
        localStorage.setItem('playedUsers', JSON.stringify(this.state.playedUsers));

        this.hideNameInput();
        this.startGame();
    }

    startGame() {
        if (this.state.gameInterval) clearInterval(this.state.gameInterval);
        this.state.gameInterval = setInterval(() => this.generateEnvelope(), this.constants.SPAWN_INTERVAL);
        document.addEventListener("click", () => Utilities.playBackgroundMusic(), { once: true });
    }

    handleOK() {
        Utilities.hideElement("popup");
        Utilities.hideElement("overlay");
        Utilities.showElement("name-overlay");
        Utilities.showElement("name-popup");
        const nameInput = document.getElementById("player-name");
        if (nameInput) nameInput.value = "";
    }
}

// Khởi động trò chơi
document.addEventListener("DOMContentLoaded", () => new Game());
