class UIManager {
    constructor() {
        this.isInitialized = false;
        this.currentView = 'narrative';
        this.views = {
            narrative: 'narrative-layer',
            decision: 'decision-layer',
            map: 'farm-map',
            dialogue: 'dialogue-box'
        };
        
        // Cache DOM elements
        this.elements = {};
        
        // Event listeners
        window.addEventListener('metricChange', (e) => {
            this.updateMetricDisplay(e.detail);
        });
        
        window.addEventListener('seasonChange', (e) => {
            this.updateSeasonDisplay(e.detail);
        });
        
        window.addEventListener('decisionStarted', (e) => {
            this.showDecisionView(e.detail.decision);
        });
        
        window.addEventListener('decisionCompleted', () => {
            this.hideDecisionView();
        });
        
        window.addEventListener('dialogueStarted', (e) => {
            this.showDialogueView(e.detail);
        });
        
        window.addEventListener('sceneStarted', (e) => {
            this.showNarrativeView(e.detail.scene);
        });
        
        window.addEventListener('spriteUpdate', (e) => {
            this.updateCharacterSprite(e.detail);
        });
        
        window.addEventListener('logUpdated', (e) => {
            this.updateActionLog(e.detail.entry);
        });
        
        window.addEventListener('endgameTriggered', (e) => {
            this.showEndgame(e.detail);
        });
    }
    
    // Initialize UI
    initialize() {
        if (this.isInitialized) return;
        
        // Cache important elements
        this.cacheElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial updates
        this.updateAllDisplays();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
                document.getElementById('game-container').classList.remove('hidden');
                
                // Start opening narrative
                narrativeEngine.startScene('opening');
            }, 500);
        }, 2000);
        
        this.isInitialized = true;
    }
    
    // Cache DOM elements
    cacheElements() {
        this.elements = {
            // Metrics
            loyalty: document.getElementById('loyalty'),
            rations: document.getElementById('rations'),
            security: document.getElementById('security'),
            corruption: document.getElementById('corruption'),
            innovation: document.getElementById('innovation'),
            historicalTruth: document.getElementById('historical-truth'),
            
            // Time display
            seasonText: document.getElementById('season-text'),
            yearText: document.getElementById('year-text'),
            turnCount: document.getElementById('turn-count'),
            
            // Views
            narrativeLayer: document.getElementById('narrative-layer'),
            decisionLayer: document.getElementById('decision-layer'),
            farmMap: document.getElementById('farm-map'),
            dialogueBox: document.getElementById('dialogue-box'),
            
            // Character
            characterSprite: document.getElementById('main-character'),
            speechBubble: document.getElementById('speech-bubble'),
            dialogueText: document.getElementById('dialogue-text'),
            dialogueChoices: document.getElementById('dialogue-choices'),
            
            // Narrative
            narrativeText: document.getElementById('narrative-text'),
            progressDots: document.getElementById('progress-dots'),
            
            // Decision
            decisionTitle: document.getElementById('decision-title'),
            costBenefitPreview: document.getElementById('cost-benefit-preview'),
            decisionOptions: document.getElementById('decision-options'),
            
            // Log
            logEntries: document.getElementById('log-entries'),
            
            // Buttons
            btnMap: document.getElementById('btn-map'),
            btnDecisions: document.getElementById('btn-decisions'),
            btnTalk: document.getElementById('btn-talk'),
            btnSound: document.getElementById('btn-sound'),
            
            // Quick actions
            quickActions: document.querySelector('.quick-actions')
        };
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Map button
        this.elements.btnMap.addEventListener('click', () => {
            this.toggleView('map');
        });
        
        // Decisions button
        this.elements.btnDecisions.addEventListener('click', () => {
            this.showAvailableDecisions();
        });
        
        // Talk button
        this.elements.btnTalk.addEventListener('click', () => {
            this.startRandomDialogue();
        });
        
        // Sound button
        this.elements.btnSound.addEventListener('click', () => {
            this.toggleSound();
        });
        
        // Map tiles
        document.querySelectorAll('.map-tile').forEach(tile => {
            tile.addEventListener('click', (e) => {
                const location = e.currentTarget.dataset.location;
                this.travelToLocation(location);
            });
        });
        
        // Log controls
        document.getElementById('log-prev')?.addEventListener('click', () => {
            this.scrollLog(-1);
        });
        
        document.getElementById('log-next')?.addEventListener('click', () => {
            this.scrollLog(1);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    // Update all displays
    updateAllDisplays() {
        const state = gameState.getState();
        
        // Update metrics
        this.updateMetricDisplay({ metric: 'loyalty', value: state.loyalty });
        this.updateMetricDisplay({ metric: 'rations', value: state.rations });
        this.updateMetricDisplay({ metric: 'security', value: state.security });
        this.updateMetricDisplay({ metric: 'corruption', value: state.corruption });
        this.updateMetricDisplay({ metric: 'innovation', value: state.innovation });
        this.updateMetricDisplay({ metric: 'historicalTruth', value: state.historicalTruth });
        
        // Update time display
        this.updateSeasonDisplay({
            season: state.season,
            year: state.year,
            turn: state.turn
        });
        
        // Update action log
        this.updateActionLog();
    }
    
    // Update metric display
    updateMetricDisplay(detail) {
        const { metric, value, change } = detail;
        const element = this.elements[metric];
        
        if (!element) return;
        
        // Update value display
        const valueElement = element.querySelector('.metric-value');
        if (valueElement) {
            valueElement.textContent = Math.round(value);
            
            // Add change indicator
            if (change) {
                const changeIndicator = document.createElement('span');
                changeIndicator.className = `change-indicator ${change > 0 ? 'positive' : 'negative'}`;
                changeIndicator.textContent = change > 0 ? `+${change}` : change;
                changeIndicator.style.animation = 'fadeIn 0.5s ease';
                
                valueElement.appendChild(changeIndicator);
                
                // Remove after animation
                setTimeout(() => {
                    changeIndicator.remove();
                }, 1000);
            }
        }
        
        // Update progress bar
        const fillElement = element.querySelector('.metric-fill');
        if (fillElement) {
            fillElement.style.width = `${value}%`;
            
            // Add animation for significant changes
            if (change && Math.abs(change) >= 10) {
                fillElement.classList.add('metric-change');
                setTimeout(() => {
                    fillElement.classList.remove('metric-change');
                }, 500);
            }
        }
        
        // Add critical warning
        if (value < 20 || value > 80) {
            element.classList.add('metric-critical');
        } else {
            element.classList.remove('metric-critical');
        }
    }
    
    // Update season display
    updateSeasonDisplay(detail) {
        const { season, year, turn } = detail;
        
        if (this.elements.seasonText) {
            this.elements.seasonText.textContent = season;
            this.elements.seasonText.className = `season-${season.toLowerCase()}`;
        }
        
        if (this.elements.yearText) {
            this.elements.yearText.textContent = `Year ${year}`;
        }
        
        if (this.elements.turnCount) {
            this.elements.turnCount.textContent = turn;
        }
        
        // Update background for season
        this.updateSeasonalBackground(season);
    }
    
    // Update seasonal background
    updateSeasonalBackground(season) {
        const bgLayer = document.getElementById('background-layer');
        if (!bgLayer) return;
        
        // Remove active class from all backgrounds
        bgLayer.querySelectorAll('.background-element').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active class to current season
        const currentBg = bgLayer.querySelector(`[data-season="${season.toLowerCase()}"]`);
        if (currentBg) {
            currentBg.classList.add('active');
        }
        
        // Add seasonal transition effect
        bgLayer.classList.add('season-transition');
        setTimeout(() => {
            bgLayer.classList.remove('season-transition');
        }, 1000);
    }
    
    // Show narrative view
    showNarrativeView(scene) {
        this.switchView('narrative');
        
        if (this.elements.narrativeText && scene.text) {
            // Clear existing text
            this.elements.narrativeText.innerHTML = '';
            
            // Type out the text
            this.typeText(this.elements.narrativeText, scene.text, 30);
        }
        
        // Update progress dots for epoch scenes
        if (scene.epoch) {
            this.updateProgressDots(scene.epoch);
        }
        
        // Show continue button after delay
        if (scene.ending) {
            // Endings don't continue automatically
            this.showEndingOptions(scene);
        } else {
            setTimeout(() => {
                this.showContinueButton();
            }, scene.text.length * 30 + 1000);
        }
    }
    
    // Type text with animation
    typeText(element, text, speed = 30) {
        let i = 0;
        element.textContent = '';
        
        const typeChar = () => {
            if (i < text.length) {
                // Add Undertale-style text sound
                if (text[i] !== ' ') {
                    const audio = new Audio('assets/sounds/ui/text_blip.mp3');
                    audio.volume = 0.1;
                    audio.play().catch(e => console.log('Audio play failed:', e));
                }
                
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        };
        
        typeChar();
    }
    
    // Update progress dots
    updateProgressDots(currentEpoch) {
        if (!this.elements.progressDots) return;
        
        this.elements.progressDots.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === currentEpoch) {
                dot.classList.add('active');
            }
            this.elements.progressDots.appendChild(dot);
        }
    }
    
    // Show continue button
    showContinueButton() {
        const continueBtn = document.getElementById('dialogue-continue');
        if (continueBtn) {
            continueBtn.classList.remove('hidden');
            
            // Set up continue action
            const btn = continueBtn.querySelector('.continue-btn');
            if (btn) {
                btn.onclick = () => {
                    continueBtn.classList.add('hidden');
                    
                    // Advance to next season
                    gameState.nextSeason();
                    
                    // Update UI
                    this.updateAllDisplays();
                };
            }
        }
    }
    
    // Show decision view
    showDecisionView(decision) {
        this.switchView('decision');
        
        if (this.elements.decisionTitle) {
            this.elements.decisionTitle.textContent = decision.title;
        }
        
        if (this.elements.decisionOptions) {
            this.elements.decisionOptions.innerHTML = '';
            
            decision.options.forEach(option => {
                const optionElement = this.createDecisionOption(option);
                this.elements.decisionOptions.appendChild(optionElement);
            });
        }
        
        // Show preview for first option
        if (decision.options.length > 0) {
            this.showCostBenefitPreview(decision.options[0]);
        }
    }
    
    // Create decision option element
    createDecisionOption(option) {
        const div = document.createElement('div');
        div.className = `decision-option ${option.available === false ? 'disabled' : ''}`;
        div.dataset.optionId = option.id;
        
        let html = `
            <div class="option-title">${option.title}</div>
            <div class="option-description">${option.description}</div>
        `;
        
        // Add effects badges
        if (option.costs || option.benefits) {
            html += '<div class="option-effects">';
            
            if (option.costs) {
                Object.entries(option.costs).forEach(([metric, value]) => {
                    const metricName = metric.charAt(0).toUpperCase() + metric.slice(1);
                    html += `<span class="effect-badge cost">-${Math.abs(value)} ${metricName}</span>`;
                });
            }
            
            if (option.benefits) {
                Object.entries(option.benefits).forEach(([metric, value]) => {
                    const metricName = metric.charAt(0).toUpperCase() + metric.slice(1);
                    html += `<span class="effect-badge benefit">+${value} ${metricName}</span>`;
                });
            }
            
            html += '</div>';
        }
        
        div.innerHTML = html;
        
        // Add click handler if available
        if (option.available !== false) {
            div.addEventListener('click', () => {
                this.selectDecisionOption(option);
            });
            
            div.addEventListener('mouseenter', () => {
                this.showCostBenefitPreview(option);
            });
        }
        
        return div;
    }
    
    // Show cost/benefit preview
    showCostBenefitPreview(option) {
        if (!this.elements.costBenefitPreview) return;
        
        const preview = decisionSystem.generatePreviewHTML(option);
        this.elements.costBenefitPreview.innerHTML = preview;
    }
    
    // Select decision option
    selectDecisionOption(option) {
        // Confirm selection
        if (option.costs?.loyalty && option.costs.loyalty < -20) {
            if (!confirm('This decision will significantly harm animal loyalty. Continue?')) {
                return;
            }
        }
        
        if (option.costs?.rations && option.costs.rations < -30) {
            if (!confirm('This will dangerously deplete food supplies. Continue?')) {
                return;
            }
        }
        
        // Make the choice
        decisionSystem.makeChoice(option.id);
    }
    
    // Hide decision view
    hideDecisionView() {
        this.switchView('narrative');
    }
    
    // Show dialogue view
    showDialogueView(detail) {
        const { character, dialogue } = detail;
        this.switchView('dialogue');
        
        // Update character sprite
        this.updateCharacterSprite({
            characterId: character.id,
            emotion: dialogue.emotion,
            spritePath: `${character.spriteBase}${dialogue.emotion}.png`
        });
        
        // Show speech bubble with random line
        if (dialogue.lines && dialogue.lines.length > 0) {
            const randomLine = dialogue.lines[Math.floor(Math.random() * dialogue.lines.length)];
            this.showSpeechBubble(randomLine);
            
            // Update dialogue text
            if (this.elements.dialogueText) {
                this.elements.dialogueText.textContent = randomLine;
            }
            
            // Show dialogue choices based on relationship
            this.showDialogueChoices(character, dialogue.relationship);
        }
    }
    
    // Show speech bubble
    showSpeechBubble(text) {
        if (!this.elements.speechBubble) return;
        
        const bubbleText = this.elements.speechBubble.querySelector('.bubble-text');
        if (bubbleText) {
            bubbleText.textContent = text;
        }
        
        this.elements.speechBubble.classList.remove('hidden');
        
        // Hide after delay
        setTimeout(() => {
            this.elements.speechBubble.classList.add('hidden');
        }, 3000);
    }
    
    // Show dialogue choices
    showDialogueChoices(character, relationship) {
        if (!this.elements.dialogueChoices) return;
        
        this.elements.dialogueChoices.innerHTML = '';
        
        const choices = this.generateDialogueChoices(character, relationship);
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'dialogue-choice';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                this.handleDialogueChoice(character.id, choice);
            });
            this.elements.dialogueChoices.appendChild(button);
        });
    }
    
    // Generate dialogue choices
    generateDialogueChoices(character, relationship) {
        const choices = [
            { text: 'Ask about the farm', type: 'farm' },
            { text: 'Discuss recent events', type: 'events' },
            { text: 'Talk about the revolution', type: 'revolution' }
        ];
        
        // Add relationship-specific choices
        if (relationship > 70) {
            choices.push({ text: 'Share concerns', type: 'concerns' });
        }
        
        if (relationship < 30) {
            choices.push({ text: 'Issue warning', type: 'warning' });
        }
        
        // Add character-specific choices
        switch (character.id) {
            case 'napoleon':
                choices.push({ text: 'Discuss leadership', type: 'leadership' });
                break;
            case 'snowball':
                choices.push({ text: 'Talk about the windmill', type: 'windmill' });
                break;
            case 'boxer':
                choices.push({ text: 'Check on his health', type: 'health' });
                break;
        }
        
        choices.push({ text: 'End conversation', type: 'end' });
        
        return choices;
    }
    
    // Handle dialogue choice
    handleDialogueChoice(characterId, choice) {
        const state = gameState.getState();
        
        switch (choice.type) {
            case 'farm':
                characterSystem.startDialogue(characterId, 'farm');
                break;
            case 'events':
                characterSystem.startDialogue(characterId, 'recent');
                break;
            case 'revolution':
                characterSystem.startDialogue(characterId, 'revolution');
                break;
            case 'concerns':
                // Improve relationship
                characterSystem.updateRelationship(characterId, 10);
                gameState.addToLog(`Shared concerns with ${characterId}`);
                break;
            case 'warning':
                // Decrease relationship but increase security
                characterSystem.updateRelationship(characterId, -15);
                gameState.updateMetric('security', 5);
                break;
            case 'end':
                this.switchView('narrative');
                break;
        }
        
        // Update character sprite based on new relationship
        characterSystem.updateCharacterSprite(characterId);
    }
    
    // Update character sprite
    updateCharacterSprite(detail) {
        const { characterId, emotion, spritePath } = detail;
        
        if (this.elements.characterSprite) {
            const img = this.elements.characterSprite.querySelector('img');
            if (img) {
                img.src = spritePath;
                img.alt = `${characterId} ${emotion}`;
                
                // Add emotion class for animation
                this.elements.characterSprite.className = `character-sprite character-${emotion}`;
            }
        }
    }
    
    // Update action log
    updateActionLog(entry = null) {
        if (!this.elements.logEntries) return;
        
        // Clear and rebuild if entry provided
        if (entry) {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = `Year ${entry.year}, ${entry.season}: ${entry.action}`;
            
            this.elements.logEntries.appendChild(logEntry);
            
            // Scroll to bottom
            this.elements.logEntries.scrollTop = this.elements.logEntries.scrollHeight;
        } else {
            // Refresh from game state
            this.elements.logEntries.innerHTML = '';
            const recentLogs = gameState.getRecentLogEntries(5);
            
            recentLogs.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                logEntry.textContent = `Year ${log.year}, ${log.season}: ${log.action}`;
                this.elements.logEntries.appendChild(logEntry);
            });
        }
    }
    
    // Scroll log
    scrollLog(direction) {
        if (!this.elements.logEntries) return;
        
        const scrollAmount = 50;
        this.elements.logEntries.scrollTop += direction * scrollAmount;
    }
    
    // Toggle view
    toggleView(view) {
        if (this.currentView === view) {
            this.switchView('narrative');
        } else {
            this.switchView(view);
        }
    }
    
    // Switch view
    switchView(view) {
        // Hide all views
        Object.values(this.views).forEach(viewId => {
            const element = document.getElementById(viewId);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        // Show selected view
        const viewElement = document.getElementById(this.views[view]);
        if (viewElement) {
            viewElement.classList.remove('hidden');
            this.currentView = view;
        }
        
        // Special handling for map view
        if (view === 'map') {
            this.updateMapDisplay();
        }
    }
    
    // Update map display
    updateMapDisplay() {
        const state = gameState.getState();
        
        // Highlight current location
        document.querySelectorAll('.map-tile').forEach(tile => {
            tile.classList.remove('highlighted');
            if (tile.dataset.location === state.currentLocation) {
                tile.classList.add('highlighted');
            }
        });
    }
    
    // Travel to location
    travelToLocation(location) {
        const state = gameState.getState();
        state.currentLocation = location;
        
        // Add to log
        gameState.addToLog(`Traveled to ${location}`);
        
        // Dispatch location change event
        const event = new CustomEvent('locationChanged', {
            detail: { location, previous: state.currentLocation }
        });
        window.dispatchEvent(event);
        
        // Return to narrative view
        this.switchView('narrative');
        
        // Show location-specific narrative
        narrativeEngine.handleLocationChange({ location });
    }
    
    // Show available decisions
    showAvailableDecisions() {
        const decisions = decisionSystem.getAvailableDecisions();
        
        if (decisions.length > 0) {
            // Start the first available decision
            decisionSystem.startDecision(decisions[0].id);
        } else {
            // Show notification
            this.showNotification('No decisions available at this time.');
        }
    }
    
    // Start random dialogue
    startRandomDialogue() {
        const characters = characterSystem.getAllCharacters();
        const availableChars = characters.filter(char => 
            char.id !== 'animals' // Don't start dialogue with collective
        );
        
        if (availableChars.length > 0) {
            const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
            characterSystem.startDialogue(randomChar.id);
        }
    }
    
    // Toggle sound
    toggleSound() {
        const btn = this.elements.btnSound;
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('fa-volume-up')) {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            // Mute all audio
            this.muteAllAudio();
        } else {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            // Unmute all audio
            this.unmuteAllAudio();
        }
    }
    
    // Mute all audio
    muteAllAudio() {
        // Implementation depends on audio manager
        window.dispatchEvent(new CustomEvent('muteAudio'));
    }
    
    // Unmute all audio
    unmuteAllAudio() {
        // Implementation depends on audio manager
        window.dispatchEvent(new CustomEvent('unmuteAudio'));
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'm':
            case 'M':
                this.toggleView('map');
                break;
            case 'd':
            case 'D':
                this.showAvailableDecisions();
                break;
            case 't':
            case 'T':
                this.startRandomDialogue();
                break;
            case ' ':
            case 'Enter':
                // Continue/next action
                this.handleContinue();
                break;
            case 'Escape':
                // Return to narrative view
                this.switchView('narrative');
                break;
            case 's':
            case 'S':
                // Quick save
                if (e.ctrlKey) {
                    gameState.saveGame();
                    this.showNotification('Game saved!');
                }
                break;
            case 'l':
            case 'L':
                // Quick load
                if (e.ctrlKey) {
                    if (gameState.loadGame()) {
                        this.showNotification('Game loaded!');
                        this.updateAllDisplays();
                    }
                }
                break;
        }
    }
    
    // Handle continue action
    handleContinue() {
        switch (this.currentView) {
            case 'narrative':
                this.showContinueButton();
                break;
            case 'dialogue':
                // End dialogue
                this.switchView('narrative');
                break;
        }
    }
    
    // Show endgame
    showEndgame(detail) {
        const { ending, state } = detail;
        
        // Create endgame overlay
        const overlay = document.createElement('div');
        overlay.className = 'endgame-overlay';
        overlay.innerHTML = `
            <div class="endgame-container">
                <h2 class="endgame-title">${this.getEndingTitle(ending)}</h2>
                <div class="endgame-stats">
                    <h3>Final Statistics</h3>
                    <div class="stats-grid">
                        <div>Years Survived: ${state.year}</div>
                        <div>Final Loyalty: ${state.loyalty}</div>
                        <div>Final Corruption: ${state.corruption}</div>
                        <div>Historical Truth: ${state.historicalTruth}</div>
                        <div>Boxer: ${state.boxerSaved ? 'Saved' : 'Lost'}</div>
                    </div>
                </div>
                <div class="endgame-actions">
                    <button id="restart-game" class="endgame-btn">New Revolution</button>
                    <button id="view-stats" class="endgame-btn">Detailed Statistics</button>
                    <button id="main-menu" class="endgame-btn">Main Menu</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('restart-game')?.addEventListener('click', () => {
            gameState.resetGame();
            overlay.remove();
            this.updateAllDisplays();
            narrativeEngine.startScene('opening');
        });
        
        document.getElementById('view-stats')?.addEventListener('click', () => {
            this.showDetailedStats(state);
        });
        
        document.getElementById('main-menu')?.addEventListener('click', () => {
            // Return to title screen
            overlay.remove();
            this.showTitleScreen();
        });
    }
    
    // Get ending title
    getEndingTitle(ending) {
        const titles = {
            'UTOPIA': 'The Utopia',
            'CYCLE_OF_TYRANNY': 'The Cycle of Tyranny',
            'STAGNATION': 'The Stagnation',
            'MARTYR_REVOLT': 'The Martyr\'s Revolt',
            'COMPROMISED_SURVIVAL': 'The Compromised Survival'
        };
        return titles[ending] || 'The Revolution Ends';
    }
    
    // Show detailed statistics
    showDetailedStats(state) {
        const stats = document.createElement('div');
        stats.className = 'stats-modal';
        stats.innerHTML = `
            <h3>Detailed Game Statistics</h3>
            <div class="stat-category">
                <h4>Final Metrics</h4>
                <div>Loyalty: ${state.loyalty}</div>
                <div>Rations: ${state.rations}</div>
                <div>Security: ${state.security}</div>
                <div>Corruption: ${state.corruption}</div>
                <div>Innovation: ${state.innovation}</div>
                <div>Historical Truth: ${state.historicalTruth}</div>
            </div>
            <div class="stat-category">
                <h4>Key Decisions</h4>
                <div>Windmill Built: ${state.windmillBuilt ? 'Yes' : 'No'}</div>
                <div>Purges Completed: ${state.purgesCompleted ? 'Yes' : 'No'}</div>
                <div>Commandments Revised: ${state.commandmentsRevised ? 'Yes' : 'No'}</div>
                <div>Boxer Saved: ${state.boxerSaved ? 'Yes' : 'No'}</div>
                <div>Human Visitors: ${state.humanVisitors ? 'Yes' : 'No'}</div>
            </div>
            <button id="close-stats" class="close-btn">Close</button>
        `;
        
        document.body.appendChild(stats);
        
        document.getElementById('close-stats')?.addEventListener('click', () => {
            stats.remove();
        });
    }
    
    // Show title screen
    showTitleScreen() {
        // Hide game container
        document.getElementById('game-container').classList.add('hidden');
        
        // Create title screen
        const titleScreen = document.createElement('div');
        titleScreen.id = 'title-screen';
        titleScreen.innerHTML = `
            <div class="title-container">
                <h1 class="title-main">ANIMAL FARM</h1>
                <h2 class="title-sub">Legacy of the Revolution</h2>
                
                <div class="title-options">
                    <button id="title-new" class="title-btn">New Revolution</button>
                    <button id="title-load" class="title-btn">Continue Revolution</button>
                    <button id="title-tutorial" class="title-btn">Learn the Revolution</button>
                    <button id="title-credits" class="title-btn">The Revolutionaries</button>
                </div>
                
                <div class="title-quote">
                    "All animals are equal, but some animals are more equal than others."
                </div>
            </div>
        `;
        
        document.body.appendChild(titleScreen);
        
        // Add event listeners
        document.getElementById('title-new')?.addEventListener('click', () => {
            gameState.resetGame();
            titleScreen.remove();
            document.getElementById('game-container').classList.remove('hidden');
            narrativeEngine.startScene('opening');
        });
        
        document.getElementById('title-load')?.addEventListener('click', () => {
            this.showLoadMenu();
        });
    }
    
    // Show load menu
    showLoadMenu() {
        // Implementation for load menu
        this.showNotification('Load feature coming soon!');
    }
    
    // Show ending options
    showEndingOptions(scene) {
        const options = document.createElement('div');
        options.className = 'ending-options';
        options.innerHTML = `
            <button id="ending-restart" class="ending-btn">Start New Revolution</button>
            <button id="ending-stats" class="ending-btn">View Statistics</button>
            <button id="ending-quote" class="ending-btn">Final Quote</button>
        `;
        
        document.querySelector('#narrative-layer').appendChild(options);
        
        // Add event listeners
        document.getElementById('ending-restart')?.addEventListener('click', () => {
            gameState.resetGame();
            options.remove();
            this.updateAllDisplays();
            narrativeEngine.startScene('opening');
        });
        
        document.getElementById('ending-stats')?.addEventListener('click', () => {
            this.showDetailedStats(gameState.getState());
        });
        
        document.getElementById('ending-quote')?.addEventListener('click', () => {
            this.showFinalQuote(scene.ending);
        });
    }
    
    // Show final quote
    showFinalQuote(ending) {
        const quotes = {
            'UTOPIA': 'The creatures outside looked from pig to man, and from man to pig, and from pig to man again; but already it was impossible to say which was which.',
            'CYCLE_OF_TYRANNY': 'The animals were happy as they had never conceived it possible to be.',
            'STAGNATION': 'The life of an animal is misery and slavery: that is the plain truth.',
            'MARTYR_REVOLT': 'Man is the only creature that consumes without producing.',
            'COMPROMISED_SURVIVAL': 'Several of them would have protested if they could have found the right arguments.'
        };
        
        this.showNotification(quotes[ending] || 'The end.', 'quote');
    }
}

// Create global instance
const uiManager = new UIManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager, uiManager };
}