document.addEventListener('DOMContentLoaded', function() {
    createRainEffect();
    const typewriter = document.getElementById('typewriter');
    const typingSound = document.getElementById('typingSound');
    const clickPrompt = document.getElementById('clickPrompt');
    const heartIcon = document.getElementById('heartIcon');
    const clickSound = document.getElementById('clickSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const creditsMusic = document.getElementById('creditsMusic');
    const skipButton = document.getElementById('skipButton');

    const lines = [
        '* Long ago, two friends discovered each other in this vast world.',
        '* Through countless adventures and quiet moments, their bond grew stronger.',
        '* They weathered storms together, celebrated victories side by side.',
        '* Distance and time could not break what they had built.',
        '* No matter where life takes them, they remain connected.',
        '* Their friendship is a constant light in an ever-changing world.',
        '* And so their story continues, together.'
    ];

    let charIndex = 0;
    let lineIndex = 0;
    let typingInterval;
    let hasUserInteracted = false;
    let isTypingActive = false;

    function enableAudio() {
        if (!hasUserInteracted) {
            hasUserInteracted = true;

            if (clickSound) {
                clickSound.volume = 1.0;
                clickSound.play().then(() => {
                    console.log('audio played');
                }).catch(e => {
                    clickSound.load();
                    setTimeout(() => {
                        clickSound.play();
                    }, 200);
                });
            } else {
                console.log('no click sound found');
            }

            heartIcon.src = 'assets/images/brokenheart.png';

            setTimeout(() => {
                clickPrompt.style.opacity = '0';
                setTimeout(() => {
                    clickPrompt.style.display = 'none';
                }, 300);
            }, 200);

            if (backgroundMusic && hasUserInteracted) {
                backgroundMusic.volume = 0.4;
                backgroundMusic.play();
            }

            setTimeout(() => {
                const titleImage = document.getElementById('titleImage');
                titleImage.style.display = 'block';

                const chatBox = document.getElementById('chatBox');
                chatBox.style.display = 'flex';
                chatBox.style.animation = 'fadeIn 1s ease-in forwards';

                setTimeout(() => {
                    startTyping();
                }, 1000);
            }, 500);
        }
    }

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });

    skipButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isTypingActive) {
            skipToMenu();
        }
    });

    function skipToMenu() {
        clearInterval(typingInterval);

        if (typingSound) {
            typingSound.pause();
            typingSound.currentTime = 0;
        }

        skipButton.style.display = 'none';

        isTypingActive = false;
        lineIndex = lines.length; 

        showMenu();
    }

    function startTyping() {
        if (lineIndex >= lines.length) {
            if (typingSound) {
                fadeOutAudio(typingSound, 1000);
            }
            skipButton.style.display = 'none';
            isTypingActive = false;
            showMenu();
            return;
        }

        if (lineIndex === 0) {
            skipButton.style.display = 'block';
            isTypingActive = true;
        }

        const currentLine = lines[lineIndex];

        if (typingSound && hasUserInteracted) {
            typingSound.loop = true;
            typingSound.volume = 0.3;
            typingSound.play();
        }

        typingInterval = setInterval(() => {
            if (charIndex < currentLine.length) {
                typewriter.innerHTML = currentLine.slice(0, charIndex + 1) + '<span class="cursor"></span>';
                charIndex++;
            } else {
                clearInterval(typingInterval);
                if (typingSound) {
                    fadeOutAudio(typingSound, 500);
                }

                setTimeout(() => {
                    typewriter.innerHTML = currentLine;
                    setTimeout(() => {
                        typewriter.innerHTML = '';
                        charIndex = 0;
                        lineIndex++;

                        setTimeout(() => {
                            startTyping();
                        }, 500);
                    }, 2000);
                }, 500);
            }
        }, 80);
    }

    function showMenu() {
        const chatBox = document.getElementById('chatBox');
        const menuContainer = document.getElementById('menuContainer');

        if (backgroundMusic) {
            fadeOutAudio(backgroundMusic, 2000);
        }

        chatBox.style.animation = 'fadeOut 2s ease-out forwards';

        setTimeout(() => {
            chatBox.style.display = 'none';
            menuContainer.style.display = 'flex';
            menuContainer.classList.add('menu-fadeIn');

            initializeMenu();
        }, 2000);
    }

    function fadeOutAudio(audioElement, duration) {
        const fadeStep = 0.05;
        const fadeInterval = duration / (audioElement.volume / fadeStep);

        const fade = setInterval(() => {
            if (audioElement.volume > fadeStep) {
                audioElement.volume -= fadeStep;
            } else {
                audioElement.volume = 0;
                audioElement.pause();
                audioElement.currentTime = 0;
                clearInterval(fade);
            }
        }, fadeInterval);
    }

    let selectedMenuIndex = 0;
    const menuOptions = ['start', 'credits'];

    function initializeMenu() {
        const startOption = document.getElementById('startOption');
        const creditsOption = document.getElementById('creditsOption');
        const menuSelectSound = document.getElementById('menuSelectSound');
        const menuHoverSound = document.getElementById('menuHoverSound');
        const whiteFade = document.getElementById('whiteFade');
        updateMenuSelection();

        startOption.addEventListener('mouseenter', () => {
            playHoverSound();
            selectedMenuIndex = 0;
            updateMenuSelection();
        });

        creditsOption.addEventListener('mouseenter', () => {
            playHoverSound();
            selectedMenuIndex = 1;
            updateMenuSelection();
        });

        function playHoverSound() {
            if (menuHoverSound) {
                menuHoverSound.currentTime = 0;
                menuHoverSound.volume = 0.3;
                menuHoverSound.play();
            }
        }

        startOption.addEventListener('click', () => selectOption('start'));
        creditsOption.addEventListener('click', () => selectOption('credits'));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                playHoverSound();
                selectedMenuIndex = selectedMenuIndex === 0 ? 1 : 0;
                updateMenuSelection();
            } else if (e.key === 'ArrowDown') {
                playHoverSound();
                selectedMenuIndex = selectedMenuIndex === 1 ? 0 : 1;
                updateMenuSelection();
            } else if (e.key === 'Enter' || e.key === ' ') {
                selectOption(menuOptions[selectedMenuIndex]);
            }
        });

        function updateMenuSelection() {
            startOption.classList.toggle('selected', selectedMenuIndex === 0);
            creditsOption.classList.toggle('selected', selectedMenuIndex === 1);
        }

        function selectOption(option) {
            if (menuSelectSound) {
                menuSelectSound.volume = 0.7;
                menuSelectSound.play();
            }

            whiteFade.classList.add('white-fade-in');

            setTimeout(() => {
                whiteFade.classList.remove('white-fade-in');

                if (option === 'start') {
                    showNameEntryPage();
                } else if (option === 'credits') {
                    showCreditsPage();
                }
            }, 1000);
        }
    }

    function showNameEntryPage() {
        const menuContainer = document.getElementById('menuContainer');
        const nameEntryPage = document.getElementById('nameEntryPage');
        const titleImage = document.getElementById('titleImage');

        menuContainer.style.display = 'none';
        titleImage.style.display = 'none';

        nameEntryPage.style.display = 'flex';
        nameEntryPage.style.animation = 'fadeIn 2s ease-in forwards';

        initializeNameEntry();
    }

    let currentName = '';

    function initializeNameEntry() {
        const alphabetGrid = document.getElementById('alphabetGrid');
        const nameDisplay = document.getElementById('nameDisplay');
        const backspaceBtn = document.getElementById('backspaceBtn');
        const doneBtn = document.getElementById('doneBtn');

        alphabetGrid.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement('button');
            button.className = 'letter-button';
            button.textContent = letter;
            button.addEventListener('click', () => {
                playMenuSelectSound();
                addLetter(letter);
            });
            alphabetGrid.appendChild(button);
        }

        const spaceButton = document.createElement('button');
        spaceButton.className = 'letter-button';
        spaceButton.textContent = 'SPACE';
        spaceButton.addEventListener('click', () => {
            playMenuSelectSound();
            addLetter(' ');
        });
        alphabetGrid.appendChild(spaceButton);

        backspaceBtn.addEventListener('click', () => {
            playMenuSelectSound();
            if (currentName.length > 0) {
                currentName = currentName.slice(0, -1);
                updateNameDisplay();
            }
        });

        doneBtn.addEventListener('click', () => {
            playMenuSelectSound();
            if (currentName.trim().length > 0) {
                showBlogPage();
            }
        });

        function playMenuSelectSound() {
            const menuSelectSound = document.getElementById('menuSelectSound');
            if (menuSelectSound) {
                menuSelectSound.currentTime = 0;
                menuSelectSound.volume = 0.3;
                menuSelectSound.play();
            }
        }

        function addLetter(letter) {
            if (currentName.length < 20) { 
                currentName += letter;
                updateNameDisplay();
            }
        }

        function updateNameDisplay() {
            nameDisplay.textContent = currentName;
        }

        updateNameDisplay();
    }

    function showBlogPage() {
        const nameEntryPage = document.getElementById('nameEntryPage');
        const blogPage = document.getElementById('blogPage');

        nameEntryPage.style.display = 'none';

        blogPage.style.display = 'flex';
        blogPage.style.animation = 'fadeIn 2s ease-in forwards';

        initializeMusicPlayer();
    }

    function initializeMusicPlayer() {
        const playBtn = document.querySelector('.music-btn:nth-child(2)');
        const prevBtn = document.querySelector('.music-btn:nth-child(1)');
        const nextBtn = document.querySelector('.music-btn:nth-child(3)'); 
        const progressFill = document.querySelector('.progress-fill');
        const currentTimeSpan = document.querySelector('.current-time');
        const totalTimeSpan = document.querySelector('.total-time');
        const musicTitle = document.querySelector('.music-title');
        const musicArtist = document.querySelector('.music-artist');

        let isPlaying = false;
        let currentTrackIndex = 0;

        const tracks = [
            {
                title: "Swing the Scythe",
                artist: "Buckshot",
                src: "assets/audio/sts.wav",
                cover: "assets/images/sts.png"
            },
            {
                title: "Pikachu",
                artist: "Yung Lean",
                src: "assets/audio/pikachu.flac",
                cover: "assets/images/starz.jpg"
            },
            {
                title: "Sacrifyce",
                artist: "Sematary",
                src: "assets/audio/sac.flac",
                cover: "assets/images/ba.png"
            },
            {
                title: "pj",
                artist: "fakemink",
                src: "assets/audio/pj.flac",
                cover: "assets/images/pj.jpg"
            },
            {
                title: "Expression On Your Face",
                artist: "Mechatok, Ecco2k, Bladee",
                src: "assets/audio/exp.flac",
                cover: "assets/images/exp.jpg"
            },
            {
                title: "8888each Divinity",
                artist: "Yabujin",
                src: "assets/audio/888.flac",
                cover: "assets/images/888.jpg"
            },
            {
                title: "Cartoon",
                artist: "OUTBY16",
                src: "assets/audio/cartoon.mp3",
                cover: "assets/images/cartoon.png"
            }
        ];

        let currentAudio = new Audio();
        currentAudio.preload = 'auto';
        currentAudio.loop = false;

        function loadTrack(index) {
            const track = tracks[index];
            const albumCover = document.querySelector('.album-cover');

            currentAudio.src = track.src;
            musicTitle.textContent = track.title;
            musicArtist.textContent = track.artist;

            albumCover.innerHTML = `<img src="${track.cover}" alt="Album Cover" style="width: 100%; height: 100%; object-fit: cover;">`;

            currentAudio.addEventListener('loadedmetadata', () => {
                totalTimeSpan.textContent = formatTime(currentAudio.duration);
            });
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function updateProgress() {
            if (currentAudio.duration) {
                const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                progressFill.style.width = progress + '%';
                currentTimeSpan.textContent = formatTime(currentAudio.currentTime);
            }
        }

        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                currentAudio.pause();
                playBtn.textContent = 'PLAY';
                isPlaying = false;
            } else {
                if (backgroundMusic) {
                    backgroundMusic.pause();
                }

                currentAudio.play().then(() => {
                    playBtn.textContent = 'PAUSE';
                    isPlaying = true;
                }).catch(e => {
                    console.log('music player failed:', e);
                });
            }
        });

        prevBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                currentAudio.play();
            }
        });

        nextBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                currentAudio.play();
            }
        });

        currentAudio.addEventListener('timeupdate', updateProgress);
        currentAudio.addEventListener('ended', () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            if (isPlaying) {
                currentAudio.play();
            }
        });

        loadTrack(currentTrackIndex);
    }


    function showCreditsPage() {
        const menuContainer = document.getElementById('menuContainer');
        const creditsPage = document.getElementById('creditsPage');
        const titleImage = document.getElementById('titleImage');

        menuContainer.style.display = 'none';
        titleImage.style.display = 'none';
        creditsPage.style.display = 'block';
        creditsPage.style.animation = 'fadeIn 2s ease-in forwards';

        if (creditsMusic) {
            creditsMusic.volume = 0.5;
            creditsMusic.currentTime = 0;

            creditsMusic.play().then(() => {
                console.log('credits music started');
            }).catch(e => {
                console.log('credits music failed', e);
                creditsMusic.load();
                setTimeout(() => {
                    creditsMusic.play().catch(err => console.log('retry failed:', err));
                }, 200);
            });
        }
    }

    function createRainEffect() {
        const canvas = document.getElementById('rain-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const raindrops = [];
        const numberOfDrops = 100;

        for (let i = 0; i < numberOfDrops; i++) {
            raindrops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 3 + 2,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        function animateRain() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            raindrops.forEach(drop => {
                ctx.strokeStyle = `rgba(125, 211, 192, ${drop.opacity})`;
                ctx.lineWidth = 1;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;
                drop.x += 0.5;

                if (drop.y > canvas.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animateRain);
        }

        animateRain();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
});