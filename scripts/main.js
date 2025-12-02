// Main Game Controller
class AnimalFarmGame {
    constructor() {
        this.isInitialized = false;
        this.gameSpeed = 1; // Normal speed
        this.isPaused = false;
        
        // Initialize all systems
        this.init();
    }
    
    // Initialize game
    init() {
        if (this.isInitialized) return;
        
        // Initialize UI first
        uiManager.initialize();
        
        // Preload sounds
        audioManager.preloadSounds([
            'pig', 'horse', 'chicken', 'click', 'select',
            'theme', 'spring', 'summer', 'autumn', 'winter'
        ]);
        
        // Set up game loop
        this.setupGameLoop();
        
        // Set up autosave
        this.setupAutosave();
        
        // Set up error handling
        this.setupErrorHandling();
        
        // Start background music
        setTimeout(() => {
            audioManager.playBGM('theme', { volume: 0.3, fadeIn: 3000 });
        }, 1000);
        
        this.isInitialized = true;
        
        console.log('Animal Farm: Legacy of the Revolution initialized successfully!');
    }
    
    // Set up game loop
    setupGameLoop() {
        // Game runs on event-driven model, not continuous loop
        // This function sets up periodic checks and updates
        
        // Check for seasonal events every minute
        setInterval(() => {
            if (!this.isPaused) {
                this.checkSeasonalEvents();
            }
        }, 60000); // Check every minute
        
        // Update UI periodically
        setInterval(() => {
            if (!this.isPaused) {
                this.updatePeriodicUI();
            }
        }, 5000); // Update every 5 seconds
    }
    
    // Set up autosave
    setupAutosave() {
        // Autosave every 5 minutes
        setInterval(() => {
            if (!this.isPaused) {
                gameState.saveGame(0); // Autosave slot
                console.log('Game autosaved');
            }
        }, 300000); // 5 minutes
    }
    
    // Set up error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Game error:', e.error);
            
            // Try to save game state before crash
            try {
                gameState.saveGame(9); // Emergency save slot
            } catch (saveError) {
                console.error('Failed to emergency save:', saveError);
            }
            
            // Show error to user
            uiManager.showNotification('A game error occurred. Game state has been saved.', 'error');
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
    
    // Check for seasonal events
    checkSeasonalEvents() {
        const state = gameState.getState();
        
        // Check for random seasonal events
        if (Math.random() < 0.3) { // 30% chance each check
            this.triggerRandomEvent();
        }
    }
    
    // Trigger random event
    triggerRandomEvent() {
        const state = gameState.getState();
        const events = [];
        
        // Weather events
        if (state.season === 'Spring') {
            events.push({
                type: 'weather',
                message: 'Heavy spring rains flood the fields!',
                effects: { rations: -10, innovation: -5 }
            });
        } else if (state.season === 'Summer') {
            events.push({
                type: 'weather',
                message: 'A summer drought parches the crops!',
                effects: { rations: -15 }
            });
        } else if (state.season === 'Winter') {
            events.push({
                type: 'weather',
                message: 'A brutal winter storm hits the farm!',
                effects: { rations: -20, loyalty: -5 }
            });
        }
        
        // Animal events
        events.push({
            type: 'animal',
            message: 'A sickness spreads among the animals!',
            effects: { rations: -5, loyalty: -10 },
            condition: state.rations < 40
        });
        
        // Leadership events
        if (state.corruption > 60) {
            events.push({
                type: 'corruption',
                message: 'The pigs are caught with human luxuries!',
                effects: { loyalty: -15, corruption: 5 }
            });
        }
        
        // Security events
        if (state.security > 70) {
            events.push({
                type: 'security',
                message: 'The dogs intimidate the animals into submission!',
                effects: { loyalty: -10, security: 5 }
            });
        }
        
        // Historical truth events
        if (state.historicalTruth < 50) {
            events.push({
                type: 'memory',
                message: 'An old animal remembers the original Commandments!',
                effects: { historicalTruth: 10, loyalty: 5 },
                condition: Math.random() < 0.2
            });
        }
        
        // Filter applicable events
        const applicableEvents = events.filter(event => {
            if (event.condition !== undefined) {
                return event.condition;
            }
            return true;
        });
        
        // Trigger a random event if any are applicable
        if (applicableEvents.length > 0) {
            const event = applicableEvents[Math.floor(Math.random() * applicableEvents.length)];
            
            // Add to log
            gameState.addToLog(`RANDOM EVENT: ${event.message}`);
            
            // Apply effects
            if (event.effects) {
                Object.entries(event.effects).forEach(([metric, value]) => {
                    gameState.updateMetric(metric, value);
                });
            }
            
            // Play appropriate sound
            audioManager.playUISound('notification', { volume: 0.2 });
        }
    }
    
    // Update periodic UI
    updatePeriodicUI() {
        // Update any time-sensitive UI elements
        const state = gameState.getState();
        
        // Update fatigue warning
        if (state.fatigue > 70) {
            uiManager.showNotification('Warning: High fatigue levels! Accidents are likely.', 'warning');
        }
        
        // Update ration warning
        if (state.rations < 20) {
            uiManager.showNotification('Warning: Food supplies are critically low!', 'warning');
        }
        
        // Update loyalty warning
        if (state.loyalty < 20) {
            uiManager.showNotification('Warning: Animals are near rebellion!', 'warning');
        }
    }
    
    // Pause game
    pauseGame() {
        this.isPaused = true;
        
        // Pause audio
        audioManager.setMute(true);
        
        // Show pause menu
        this.showPauseMenu();
    }
    
    // Resume game
    resumeGame() {
        this.isPaused = false;
        
        // Resume audio
        audioManager.setMute(false);
        
        // Hide pause menu
        this.hidePauseMenu();
    }
    
    // Show pause menu
    showPauseMenu() {
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'pause-overlay';
        pauseMenu.innerHTML = `
            <div class="pause-container">
                <h2>Game Paused</h2>
                <div class="pause-options">
                    <button id="resume-game" class="pause-btn">Resume Revolution</button>
                    <button id="save-game" class="pause-btn">Save Revolution</button>
                    <button id="load-game" class="pause-btn">Load Revolution</button>
                    <button id="options-game" class="pause-btn">Revolution Options</button>
                    <button id="quit-game" class="pause-btn">Abandon Revolution</button>
                </div>
                <div class="pause-stats">
                    <div>Year: ${gameState.getState().year}</div>
                    <div>Season: ${gameState.getState().season}</div>
                    <div>Turn: ${gameState.getState().turn}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(pauseMenu);
        
        // Add event listeners
        document.getElementById('resume-game').addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('save-game').addEventListener('click', () => {
            this.showSaveMenu();
        });
        
        document.getElementById('load-game').addEventListener('click', () => {
            this.showLoadMenu();
        });
        
        document.getElementById('quit-game').addEventListener('click', () => {
            if (confirm('Abandon the revolution and return to main menu?')) {
                this.quitToMainMenu();
            }
        });
    }
    
    // Hide pause menu
    hidePauseMenu() {
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.remove();
        }
    }
    
    // Show save menu
    showSaveMenu() {
        const saveSlots = 5;
        let html = '<div class="save-menu"><h3>Save Revolution</h3>';
        
        for (let i = 1; i <= saveSlots; i++) {
            const saveData = localStorage.getItem(`animal_farm_save_${i}`);
            let saveInfo = 'Empty Slot';
            
            if (saveData) {
                try {
                    const parsed = JSON.parse(saveData);
                    saveInfo = `Year ${parsed.state.year}, ${parsed.state.season} - ${new Date(parsed.timestamp).toLocaleDateString()}`;
                } catch (e) {
                    saveInfo = 'Corrupted Save';
                }
            }
            
            html += `
                <div class="save-slot" data-slot="${i}">
                    <div class="slot-info">Slot ${i}: ${saveInfo}</div>
                    <button class="slot-save" data-slot="${i}">Save Here</button>
                    ${saveData ? `<button class="slot-load" data-slot="${i}">Load</button>` : ''}
                </div>
            `;
        }
        
        html += '<button id="close-save" class="close-btn">Close</button></div>';
        
        const saveMenu = document.createElement('div');
        saveMenu.className = 'modal-overlay';
        saveMenu.innerHTML = html;
        document.body.appendChild(saveMenu);
        
        // Add event listeners
        saveMenu.querySelectorAll('.slot-save').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;
                if (gameState.saveGame(slot)) {
                    uiManager.showNotification('Game saved successfully!');
                    saveMenu.remove();
                }
            });
        });
        
        saveMenu.querySelectorAll('.slot-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.dataset.slot;
                if (gameState.loadGame(slot)) {
                    uiManager.showNotification('Game loaded successfully!');
                    saveMenu.remove();
                    this.hidePauseMenu();
                    this.resumeGame();
                }
            });
        });
        
        document.getElementById('close-save').addEventListener('click', () => {
            saveMenu.remove();
        });
    }
    
    // Show load menu
    showLoadMenu() {
        // Similar to save menu but focused on loading
        this.showSaveMenu(); // Reuse save menu for now
    }
    
    // Quit to main menu
    quitToMainMenu() {
        // Save progress first
        gameState.saveGame(0);
        
        // Reset game state
        gameState.resetGame();
        
        // Hide pause menu
        this.hidePauseMenu();
        
        // Show title screen
        uiManager.showTitleScreen();
    }
    
    // Get game statistics
    getGameStats() {
        const state = gameState.getState();
        const decisions = decisionSystem.getDecisionStats();
        const scenes = narrativeEngine.getSceneHistory();
        const locations = farmMap.getLocationHistory();
        
        return {
            gameState: state,
            decisions: decisions,
            scenes: scenes.length,
            locations: locations.length,
            totalPlayTime: this.calculatePlayTime()
        };
    }
    
    // Calculate play time
    calculatePlayTime() {
        // This would track actual play time
        // For now, return estimated time based on turns
        const state = gameState.getState();
        const minutes = state.totalTurns * 5; // Estimate 5 minutes per turn
        return minutes;
    }
    
    // Export game data
    exportGameData() {
        const stats = this.getGameStats();
        const dataStr = JSON.stringify(stats, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `animal_farm_game_data_${Date.now()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    // Import game data
    importGameData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                // Process imported data
                console.log('Game data imported:', data);
                uiManager.showNotification('Game data imported successfully!');
            } catch (error) {
                console.error('Failed to import game data:', error);
                uiManager.showNotification('Failed to import game data!', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    // Debug commands (remove in production)
    setupDebugCommands() {
        // Only in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.debug = {
                addLoyalty: (amount) => gameState.updateMetric('loyalty', amount),
                addRations: (amount) => gameState.updateMetric('rations', amount),
                nextSeason: () => gameState.nextSeason(),
                triggerEpoch: (epoch) => gameState.triggerEpoch(epoch),
                getState: () => gameState.getState(),
                setState: (newState) => Object.assign(gameState.state, newState)
            };
            
            console.log('Debug commands enabled. Use window.debug to access.');
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new AnimalFarmGame();
    
    // Make game accessible globally for debugging
    window.game = game;
    
    // Set up debug commands in development
    game.setupDebugCommands();
    
    // Handle browser tab visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Auto-pause when tab is hidden
            if (!game.isPaused) {
                game.pauseGame();
            }
        }
    });
    
    // Handle beforeunload for unsaved changes
    window.addEventListener('beforeunload', (e) => {
        // Auto-save before leaving
        gameState.saveGame(0);
        
        // Optional: Prompt user
        // e.preventDefault();
        // e.returnValue = '';
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimalFarmGame };
}