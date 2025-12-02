class AudioManager {
    constructor() {
        this.audioElements = {
            bgm: document.getElementById('bgm'),
            animalSound: document.getElementById('animal-sound'),
            uiSound: document.getElementById('ui-sound'),
            narrativeSound: document.getElementById('narrative-sound')
        };
        
        this.soundEnabled = true;
        this.currentBGM = null;
        this.volumeLevels = {
            master: 0.7,
            bgm: 0.5,
            sfx: 0.3,
            ui: 0.2
        };
        
        this.soundLibrary = {
            // Animal sounds
            pig: ['assets/sounds/animal/pig.mp3', 'assets/sounds/animal/pig2.mp3'],
            horse: ['assets/sounds/animal/horse.mp3', 'assets/sounds/animal/horse2.mp3'],
            chicken: ['assets/sounds/animal/chicken.mp3'],
            cow: ['assets/sounds/animal/cow.mp3'],
            sheep: ['assets/sounds/animal/sheep.mp3'],
            dog: ['assets/sounds/animal/dog.mp3'],
            
            // UI sounds (Undertale style)
            click: ['assets/sounds/ui/click.mp3'],
            select: ['assets/sounds/ui/select.mp3'],
            confirm: ['assets/sounds/ui/confirm.mp3'],
            cancel: ['assets/sounds/ui/cancel.mp3'],
            text_blip: ['assets/sounds/ui/text_blip.mp3'],
            notification: ['assets/sounds/ui/notification.mp3'],
            
            // Ambient sounds
            wind: ['assets/sounds/ambient/wind.mp3'],
            rain: ['assets/sounds/ambient/rain.mp3'],
            farm_day: ['assets/sounds/ambient/farm_day.mp3'],
            farm_night: ['assets/sounds/ambient/farm_night.mp3'],
            
            // Music
            theme: ['assets/sounds/music/theme.mp3'],
            spring: ['assets/sounds/music/spring.mp3'],
            summer: ['assets/sounds/music/summer.mp3'],
            autumn: ['assets/sounds/music/autumn.mp3'],
            winter: ['assets/sounds/music/winter.mp3'],
            tense: ['assets/sounds/music/tense.mp3'],
            hopeful: ['assets/sounds/music/hopeful.mp3'],
            tragic: ['assets/sounds/music/tragic.mp3']
        };
        
        // Event listeners
        window.addEventListener('sceneAudio', (e) => {
            this.handleSceneAudio(e.detail);
        });
        
        window.addEventListener('seasonChange', (e) => {
            this.handleSeasonChange(e.detail);
        });
        
        window.addEventListener('metricChange', (e) => {
            this.handleMetricChange(e.detail);
        });
        
        window.addEventListener('muteAudio', () => {
            this.setMute(true);
        });
        
        window.addEventListener('unmuteAudio', () => {
            this.setMute(false);
        });
        
        // Initialize audio context for Web Audio API
        this.initAudioContext();
    }
    
    // Initialize Web Audio API context
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create audio nodes
            this.masterGain = this.audioContext.createGain();
            this.bgmGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            // Connect nodes
            this.bgmGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // Set initial volumes
            this.updateVolumes();
            
        } catch (error) {
            console.warn('Web Audio API not supported, using HTML5 Audio:', error);
            this.audioContext = null;
        }
    }
    
    // Update volume levels
    updateVolumes() {
        if (this.audioContext) {
            this.masterGain.gain.value = this.volumeLevels.master;
            this.bgmGain.gain.value = this.volumeLevels.bgm;
            this.sfxGain.gain.value = this.volumeLevels.sfx;
        } else {
            // Update HTML5 audio volumes
            Object.values(this.audioElements).forEach(audio => {
                if (audio) {
                    audio.volume = this.volumeLevels.master;
                }
            });
        }
    }
    
    // Play sound
    playSound(soundType, options = {}) {
        if (!this.soundEnabled) return null;
        
        const sounds = this.soundLibrary[soundType];
        if (!sounds || sounds.length === 0) return null;
        
        // Randomly select a sound from the array
        const soundFile = sounds[Math.floor(Math.random() * sounds.length)];
        
        if (this.audioContext) {
            // Use Web Audio API
            return this.playWebAudio(soundFile, options);
        } else {
            // Use HTML5 Audio
            return this.playHTML5Audio(soundFile, options);
        }
    }
    
    // Play sound using Web Audio API
    async playWebAudio(soundFile, options) {
        try {
            // Fetch audio file
            const response = await fetch(soundFile);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Create source node
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            
            // Create gain node for this sound
            const gainNode = this.audioContext.createGain();
            
            // Apply volume based on sound type
            if (options.type === 'bgm') {
                gainNode.connect(this.bgmGain);
                gainNode.gain.value = options.volume || this.volumeLevels.bgm;
            } else {
                gainNode.connect(this.sfxGain);
                gainNode.gain.value = options.volume || this.volumeLevels.sfx;
            }
            
            source.connect(gainNode);
            
            // Apply additional effects
            if (options.pitch) {
                source.playbackRate.value = options.pitch;
            }
            
            // Start playback
            source.start();
            
            // Handle playback end
            source.onended = () => {
                if (options.onEnd) options.onEnd();
            };
            
            return {
                source: source,
                gainNode: gainNode,
                stop: () => source.stop()
            };
            
        } catch (error) {
            console.error('Error playing Web Audio:', error);
            return null;
        }
    }
    
    // Play sound using HTML5 Audio
    playHTML5Audio(soundFile, options) {
        try {
            const audio = new Audio(soundFile);
            
            // Set volume
            if (options.type === 'bgm') {
                audio.volume = (options.volume || this.volumeLevels.bgm) * this.volumeLevels.master;
            } else {
                audio.volume = (options.volume || this.volumeLevels.sfx) * this.volumeLevels.master;
            }
            
            // Apply additional options
            if (options.pitch) {
                audio.playbackRate = options.pitch;
            }
            
            // Play
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play failed:', error);
                });
            }
            
            // Handle playback end
            audio.onended = () => {
                if (options.onEnd) options.onEnd();
            };
            
            return {
                element: audio,
                stop: () => {
                    audio.pause();
                    audio.currentTime = 0;
                }
            };
            
        } catch (error) {
            console.error('Error playing HTML5 Audio:', error);
            return null;
        }
    }
    
    // Play background music
    playBGM(musicType, options = {}) {
        // Stop current BGM
        this.stopBGM();
        
        // Play new BGM
        this.currentBGM = this.playSound(musicType, {
            type: 'bgm',
            volume: options.volume || this.volumeLevels.bgm,
            loop: true,
            ...options
        });
        
        return this.currentBGM;
    }
    
    // Stop background music
    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.stop();
            this.currentBGM = null;
        }
    }
    
    // Play UI sound
    playUISound(soundType, options = {}) {
        return this.playSound(soundType, {
            type: 'sfx',
            volume: options.volume || this.volumeLevels.ui,
            ...options
        });
    }
    
    // Play animal sound
    playAnimalSound(animalType, options = {}) {
        return this.playSound(animalType, {
            type: 'sfx',
            volume: options.volume || this.volumeLevels.sfx * 0.5,
            pitch: options.pitch || 1.0,
            ...options
        });
    }
    
    // Handle scene audio
    handleSceneAudio(detail) {
        const { audioFile, scene } = detail;
        
        // Extract music type from filename
        const musicType = audioFile.split('/').pop().replace('.mp3', '');
        
        // Play appropriate music
        this.playBGM(musicType, {
            volume: scene.ending ? 0.3 : 0.5,
            fadeIn: 2000
        });
        
        // Play ambient sounds based on scene
        this.playAmbientSounds(scene);
    }
    
    // Handle season change
    handleSeasonChange(detail) {
        const { season } = detail;
        
        // Change BGM based on season
        const seasonMusic = {
            Spring: 'spring',
            Summer: 'summer',
            Autumn: 'autumn',
            Winter: 'winter'
        };
        
        if (seasonMusic[season]) {
            this.playBGM(seasonMusic[season], {
                fadeIn: 3000,
                fadeOut: 2000
            });
        }
    }
    
    // Handle metric change
    handleMetricChange(detail) {
        const { metric, value } = detail;
        
        // Play subtle sounds for significant metric changes
        if (Math.abs(detail.change) >= 15) {
            if (value < 30) {
                // Critical low - play tense sound
                this.playUISound('notification', { volume: 0.1 });
            } else if (value > 70) {
                // Critical high - play positive sound
                this.playUISound('confirm', { volume: 0.1 });
            }
        }
    }
    
    // Play ambient sounds
    playAmbientSounds(scene) {
        // Stop any existing ambient sounds
        this.stopAmbientSounds();
        
        // Play scene-appropriate ambient sounds
        let ambientType = 'farm_day';
        
        if (scene.background === 'barn') {
            ambientType = 'farm_night';
        } else if (scene.mood === 'dark') {
            ambientType = 'wind';
        } else if (scene.season === 'Winter') {
            ambientType = 'wind';
        } else if (scene.season === 'Spring') {
            ambientType = 'rain';
        }
        
        // Play ambient sound (looped, quiet)
        this.playSound(ambientType, {
            type: 'bgm',
            volume: 0.1,
            loop: true
        });
    }
    
    // Stop ambient sounds
    stopAmbientSounds() {
        // Implementation depends on how ambient sounds are tracked
        // For simplicity, we'll just stop all non-BGM sounds
        // In a full implementation, we'd track and manage individual sounds
    }
    
    // Set mute state
    setMute(muted) {
        this.soundEnabled = !muted;
        
        if (this.audioContext) {
            this.masterGain.gain.value = muted ? 0 : this.volumeLevels.master;
        } else {
            // Mute HTML5 audio elements
            Object.values(this.audioElements).forEach(audio => {
                if (audio) {
                    audio.muted = muted;
                }
            });
        }
        
        // Update UI
        const event = new CustomEvent('audioStateChanged', {
            detail: { muted }
        });
        window.dispatchEvent(event);
    }
    
    // Toggle mute
    toggleMute() {
        this.setMute(this.soundEnabled);
    }
    
    // Set volume level
    setVolume(type, level) {
        if (this.volumeLevels.hasOwnProperty(type)) {
            this.volumeLevels[type] = Math.max(0, Math.min(1, level));
            this.updateVolumes();
            
            // Dispatch volume change event
            const event = new CustomEvent('volumeChanged', {
                detail: { type, level }
            });
            window.dispatchEvent(event);
            
            return true;
        }
        return false;
    }
    
    // Get volume level
    getVolume(type) {
        return this.volumeLevels[type] || 0;
    }
    
    // Fade out sound
    fadeOut(sound, duration = 1000) {
        if (!sound) return;
        
        const startTime = Date.now();
        const startVolume = sound.gainNode ? sound.gainNode.gain.value : 1;
        
        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const volume = startVolume * (1 - progress);
            
            if (sound.gainNode) {
                sound.gainNode.gain.value = volume;
            } else if (sound.element) {
                sound.element.volume = volume;
            }
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                sound.stop();
            }
        };
        
        fade();
    }
    
    // Fade in sound
    fadeIn(sound, duration = 1000, targetVolume = 1) {
        if (!sound) return;
        
        const startTime = Date.now();
        
        if (sound.gainNode) {
            sound.gainNode.gain.value = 0;
        } else if (sound.element) {
            sound.element.volume = 0;
        }
        
        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const volume = targetVolume * progress;
            
            if (sound.gainNode) {
                sound.gainNode.gain.value = volume;
            } else if (sound.element) {
                sound.element.volume = volume;
            }
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        };
        
        fade();
    }
    
    // Play sound sequence (for dialogue, etc.)
    playSequence(sounds, options = {}) {
        let currentIndex = 0;
        
        const playNext = () => {
            if (currentIndex >= sounds.length) {
                if (options.onComplete) options.onComplete();
                return;
            }
            
            const soundSpec = sounds[currentIndex];
            const sound = this.playSound(soundSpec.type, {
                ...soundSpec.options,
                onEnd: () => {
                    currentIndex++;
                    
                    if (options.delayBetween) {
                        setTimeout(playNext, options.delayBetween);
                    } else {
                        playNext();
                    }
                }
            });
            
            if (sound && options.onSoundPlay) {
                options.onSoundPlay(sound, currentIndex);
            }
        };
        
        playNext();
    }
    
    // Preload sounds
    preloadSounds(soundTypes) {
        soundTypes.forEach(soundType => {
            const sounds = this.soundLibrary[soundType];
            if (sounds) {
                sounds.forEach(soundFile => {
                    // Create audio element to preload
                    const audio = new Audio();
                    audio.src = soundFile;
                    audio.preload = 'auto';
                    
                    // Store for later use
                    if (!this.preloadedSounds) {
                        this.preloadedSounds = {};
                    }
                    if (!this.preloadedSounds[soundType]) {
                        this.preloadedSounds[soundType] = [];
                    }
                    this.preloadedSounds[soundType].push(audio);
                });
            }
        });
    }
}

// Create global instance
const audioManager = new AudioManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioManager, audioManager };
}