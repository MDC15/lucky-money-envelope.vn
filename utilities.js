export class Utilities {
    static isValidName(name) {
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]{2,50}$/;
        return nameRegex.test(name.trim());
    }

    static async playSound() {
        const audio = new Audio('./assets/audio/click.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => console.log("Auto-play prevented"));
    }

    static playBackgroundMusic() {
        const music = document.getElementById("background-music");
        if (music) {
            music.volume = 1;
            music.loop = true;
            music.muted = false;
            
            // Add click listener to document
            const playMusic = () => {
                music.play().catch(() => console.log("Auto-play prevented"));
                document.removeEventListener('click', playMusic);
            };
            document.addEventListener('click', playMusic);
        }
    }

    static getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    static showElement(elementId) {
        document.getElementById(elementId).style.display = 'block';
    }

    static hideElement(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }

    static logLocalStorage() {
        console.log('PlayedUsers from localStorage:', localStorage.getItem('playedUsers'));
    }

    static clearLocalStorage() {
        localStorage.removeItem('playedUsers');
    }
}
