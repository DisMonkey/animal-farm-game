class CharacterSystem {
    constructor() {
        this.characters = {
            napoleon: {
                id: 'napoleon',
                name: 'Napoleon',
                type: 'pig',
                description: 'The fierce Berkshire boar who leads the farm.',
                emotions: ['neutral', 'angry', 'happy', 'scheming'],
                spriteBase: 'assets/sprites/napoleon/',
                sounds: {
                    talk: 'assets/sounds/animal/pig.mp3',
                    angry: 'assets/sounds/animal/pig_angry.mp3',
                    happy: 'assets/sounds/animal/pig_happy.mp3'
                },
                defaultDialogue: 'All animals are equal, but some animals are more equal than others.',
                relationships: {},
                position: { x: 50, y: 70 }
            },
            snowball: {
                id: 'snowball',
                name: 'Snowball',
                type: 'pig',
                description: 'The intellectual pig with grand visions for the farm.',
                emotions: ['neutral', 'excited', 'frustrated', 'determined'],
                spriteBase: 'assets/sprites/snowball/',
                sounds: {
                    talk: 'assets/sounds/animal/pig.mp3',
                    excited: 'assets/sounds/animal/pig_excited.mp3'
                },
                defaultDialogue: 'The windmill will bring prosperity to all animals!',
                relationships: {},
                position: { x: 30, y: 70 }
            },
            boxer: {
                id: 'boxer',
                name: 'Boxer',
                type: 'horse',
                description: 'The loyal, hard-working cart-horse.',
                emotions: ['neutral', 'determined', 'tired', 'injured', 'happy'],
                spriteBase: 'assets/sprites/boxer/',
                sounds: {
                    talk: 'assets/sounds/animal/horse.mp3',
                    determined: 'assets/sounds/animal/horse_determined.mp3',
                    injured: 'assets/sounds/animal/horse_pain.mp3'
                },
                defaultDialogue: 'I will work harder!',
                relationships: {},
                position: { x: 70, y: 70 }
            },
            squealer: {
                id: 'squealer',
                name: 'Squealer',
                type: 'pig',
                description: 'The persuasive propagandist.',
                emotions: ['neutral', 'persuasive', 'nervous', 'lying'],
                spriteBase: 'assets/sprites/squealer/',
                sounds: {
                    talk: 'assets/sounds/animal/pig_squeal.mp3',
                    persuasive: 'assets/sounds/animal/pig_persuasive.mp3'
                },
                defaultDialogue: 'Comrades, you do not imagine, I hope, that we pigs are doing this in a spirit of selfishness?',
                relationships: {},
                position: { x: 50, y: 60 }
            },
            animals: {
                id: 'animals',
                name: 'The Animals',
                type: 'collective',
                description: 'The common animals of the farm.',
                emotions: ['neutral', 'happy', 'angry', 'starving', 'rebellious'],
                spriteBase: 'assets/sprites/animals/',
                sounds: {
                    talk: 'assets/sounds/animal/crowd.mp3',
                    angry: 'assets/sounds/animal/crowd_angry.mp3',
                    happy: 'assets/sounds/animal/crowd_happy.mp3'
                },
                defaultDialogue: 'Four legs good, two legs bad!',
                relationships: {},
                position: { x: 50, y: 80 }
            }
        };
        
        this.currentCharacter = null;
        this.dialogueHistory = [];
        this.maxHistory = 100;
        
        // Initialize relationships from game state
        this.updateRelationshipsFromGame();
        
        // Event listeners
        window.addEventListener('metricChange', (e) => {
            this.handleMetricChange(e.detail);
        });
        
        window.addEventListener('seasonChange', () => {
            this.updateCharacterStates();
        });
    }
    
    // Update relationships from game state
    updateRelationshipsFromGame() {
        const state = gameState.getState();
        Object.keys(this.characters).forEach(charId => {
            if (state.relationships[charId] !== undefined) {
                this.characters[charId].relationships.game = state.relationships[charId];
            }
        });
    }
    
    // Get character by ID
    getCharacter(id) {
        return this.characters[id] ? { ...this.characters[id] } : null;
    }
    
    // Get all characters
    getAllCharacters() {
        return Object.values(this.characters).map(char => ({ ...char }));
    }
    
    // Set current character
    setCurrentCharacter(characterId) {
        this.currentCharacter = this.getCharacter(characterId);
        
        if (this.currentCharacter) {
            // Dispatch character changed event
            const event = new CustomEvent('characterChanged', {
                detail: { character: this.currentCharacter }
            });
            window.dispatchEvent(event);
            
            return this.currentCharacter;
        }
        
        return null;
    }
    
    // Start dialogue with character
    startDialogue(characterId, topic = null) {
        const character = this.setCurrentCharacter(characterId);
        
        if (!character) return null;
        
        // Determine dialogue based on game state
        const dialogue = this.generateDialogue(character, topic);
        
        // Add to history
        this.addToHistory({
            character: characterId,
            dialogue,
            timestamp: new Date().toISOString(),
            topic
        });
        
        // Play character sound
        this.playCharacterSound(character, 'talk');
        
        // Dispatch dialogue started event
        const event = new CustomEvent('dialogueStarted', {
            detail: { character, dialogue }
        });
        window.dispatchEvent(event);
        
        return dialogue;
    }
    
    // Generate dialogue based on context
    generateDialogue(character, topic = null) {
        const state = gameState.getState();
        let dialogue = [];
        
        // Base dialogue lines
        const baseDialogues = {
            napoleon: [
                "The farm is prospering under my leadership.",
                "Discipline is necessary for the revolution to succeed.",
                "Snowball was a traitor from the beginning.",
                "The dogs are for your protection, comrades."
            ],
            snowball: [
                "My windmill plans would have brought electricity to all!",
                "Napoleon has betrayed the revolution's principles.",
                "Education is key to preventing tyranny.",
                "The animals must understand their rights."
            ],
            boxer: [
                "I will work harder!",
                "Napoleon is always right.",
                "The farm is my home.",
                "My strength is for the revolution."
            ],
            squealer: [
                "Comrades, let me explain the recent decisions...",
                "The rations reduction is actually an increase, mathematically speaking.",
                "Historical records show Napoleon's wisdom.",
                "Trust in the leadership, comrades."
            ],
            animals: [
                "Four legs good, two legs bad!",
                "We're hungry...",
                "The windmill would have helped.",
                "Remember Old Major's dream?"
            ]
        };
        
        // Add character-specific contextual dialogue
        switch (character.id) {
            case 'napoleon':
                if (state.corruption > 70) {
                    dialogue.push("Leadership requires certain... privileges.");
                }
                if (state.security > 60) {
                    dialogue.push("The dogs ensure stability.");
                }
                if (state.loyalty < 30) {
                    dialogue.push("Discontent will not be tolerated.");
                }
                break;
                
            case 'snowball':
                if (state.windmillBuilt) {
                    dialogue.push("At least they built my windmill... poorly.");
                }
                if (state.purgesCompleted) {
                    dialogue.push("The purges prove Napoleon's tyranny.");
                }
                break;
                
            case 'boxer':
                if (state.boxerInjured) {
                    dialogue.push("My leg... it hurts, but I can still work.");
                }
                if (state.fatigue > 50) {
                    dialogue.push("I'm tired, but the revolution needs me.");
                }
                if (state.loyalty > 80) {
                    dialogue.push("The animals are happy. That's what matters.");
                }
                break;
                
            case 'squealer':
                if (state.historicalTruth < 50) {
                    dialogue.push("The commandments have always been as they are now.");
                }
                if (state.corruption > 50) {
                    dialogue.push("Leadership sacrifices are misunderstood as corruption.");
                }
                break;
                
            case 'animals':
                if (state.rations < 30) {
                    dialogue.push("We're hungry... when will the rations increase?");
                }
                if (state.loyalty < 40) {
                    dialogue.push("This isn't what Old Major promised...");
                }
                if (state.historicalTruth < 60) {
                    dialogue.push("I remember the commandments differently...");
                }
                break;
        }
        
        // Add topic-specific dialogue
        if (topic) {
            dialogue.push(...this.getTopicDialogue(character.id, topic));
        }
        
        // Add base dialogues if no contextual ones
        if (dialogue.length === 0) {
            dialogue = baseDialogues[character.id] || [character.defaultDialogue];
        }
        
        // Determine emotion based on context
        const emotion = this.determineEmotion(character.id, state);
        
        return {
            lines: dialogue,
            emotion,
            character: character.id,
            relationship: state.relationships[character.id] || 50
        };
    }
    
    // Get topic-specific dialogue
    getTopicDialogue(characterId, topic) {
        const topics = {
            windmill: {
                napoleon: ["The windmill was my idea, of course."],
                snowball: ["My windmill designs were perfect! Napoleon ruined them!"],
                boxer: ["I helped build it with my own hooves."],
                animals: ["The windmill work was hard, but necessary."]
            },
            rations: {
                napoleon: ["Rations are allocated according to need and contribution."],
                squealer: ["Statistical analysis shows improved nutrition despite appearances."],
                animals: ["We remember when there was more food..."],
                boxer: ["I don't need much. Others need it more."]
            },
            commandments: {
                squealer: ["The commandments have been clarified, not changed."],
                napoleon: ["Rules must evolve with circumstances."],
                animals: ["I could have sworn it said something different..."],
                snowball: ["The original commandments have been corrupted!"]
            },
            revolution: {
                napoleon: ["The revolution is secure under my leadership."],
                snowball: ["The true revolution has been betrayed."],
                boxer: ["I fight for the revolution every day."],
                animals: ["Was it all for this?"]
            }
        };
        
        return topics[topic]?.[characterId] || [];
    }
    
    // Determine character emotion
    determineEmotion(characterId, gameState) {
        const relationships = gameState.relationships;
        const charRel = relationships[characterId] || 50;
        
        switch (characterId) {
            case 'napoleon':
                if (gameState.security > 80) return 'happy';
                if (gameState.loyalty < 30) return 'angry';
                if (gameState.corruption > 70) return 'scheming';
                return 'neutral';
                
            case 'snowball':
                if (gameState.windmillBuilt) return 'frustrated';
                if (gameState.purgesCompleted) return 'determined';
                return 'neutral';
                
            case 'boxer':
                if (gameState.boxerInjured) return 'injured';
                if (gameState.fatigue > 60) return 'tired';
                if (charRel > 70) return 'happy';
                return 'determined';
                
            case 'squealer':
                if (gameState.historicalTruth < 40) return 'nervous';
                if (gameState.corruption > 60) return 'lying';
                return 'persuasive';
                
            case 'animals':
                if (gameState.rations < 20) return 'starving';
                if (gameState.loyalty < 20) return 'rebellious';
                if (gameState.loyalty > 70) return 'happy';
                return 'neutral';
                
            default:
                return 'neutral';
        }
    }
    
    // Play character sound
    playCharacterSound(character, soundType = 'talk') {
        if (!character.sounds || !character.sounds[soundType]) {
            // Fallback to talk sound
            soundType = 'talk';
        }
        
        if (character.sounds && character.sounds[soundType]) {
            const audio = new Audio(character.sounds[soundType]);
            audio.volume = 0.3;
            
            // Add Undertale-style text sound
            const textAudio = new Audio('assets/sounds/ui/text_blip.mp3');
            textAudio.volume = 0.1;
            
            // Play both sounds
            audio.play().catch(e => console.log('Audio play failed:', e));
            textAudio.play().catch(e => console.log('Text audio play failed:', e));
            
            return audio;
        }
        
        return null;
    }
    
    // Update character sprite
    updateCharacterSprite(characterId, emotion = null) {
        const character = this.getCharacter(characterId);
        if (!character) return;
        
        if (!emotion) {
            const state = gameState.getState();
            emotion = this.determineEmotion(characterId, state);
        }
        
        const spritePath = `${character.spriteBase}${emotion}.png`;
        
        // Dispatch sprite update event
        const event = new CustomEvent('spriteUpdate', {
            detail: { characterId, emotion, spritePath }
        });
        window.dispatchEvent(event);
        
        return spritePath;
    }
    
    // Update all character states
    updateCharacterStates() {
        Object.keys(this.characters).forEach(charId => {
            this.updateCharacterSprite(charId);
        });
    }
    
    // Handle metric changes
    handleMetricChange(detail) {
        const { metric, value } = detail;
        
        // Update character reactions based on metric changes
        Object.keys(this.characters).forEach(charId => {
            this.updateCharacterSprite(charId);
        });
        
        // Add narrative reaction for significant changes
        if (Math.abs(detail.change) >= 15) {
            this.addNarrativeReaction(metric, detail.change);
        }
    }
    
    // Add narrative reaction to metric change
    addNarrativeReaction(metric, change) {
        const reactions = {
            loyalty: {
                positive: ["The animals seem more hopeful today.", "Morale is improving!"],
                negative: ["Grumblings can be heard in the barn.", "The animals look despondent."]
            },
            rations: {
                positive: ["The food stores look plentiful.", "Animals eat with satisfaction."],
                negative: ["Empty troughs echo in the barn.", "Hungry eyes watch the food stores."]
            },
            security: {
                positive: ["The dogs patrol with renewed vigor.", "Security is tight today."],
                negative: ["The dogs seem distracted.", "Security appears lax."]
            }
        };
        
        if (reactions[metric]) {
            const type = change > 0 ? 'positive' : 'negative';
            const messages = reactions[metric][type];
            
            if (messages && messages.length > 0) {
                const message = messages[Math.floor(Math.random() * messages.length)];
                gameState.addToLog(message);
            }
        }
    }
    
    // Add dialogue to history
    addToHistory(entry) {
        this.dialogueHistory.push(entry);
        
        // Keep history manageable
        if (this.dialogueHistory.length > this.maxHistory) {
            this.dialogueHistory.shift();
        }
        
        // Dispatch history update event
        const event = new CustomEvent('dialogueHistoryUpdated', {
            detail: { entry, history: this.dialogueHistory }
        });
        window.dispatchEvent(event);
    }
    
    // Get dialogue history
    getDialogueHistory(characterId = null, limit = 10) {
        let history = this.dialogueHistory;
        
        if (characterId) {
            history = history.filter(entry => entry.character === characterId);
        }
        
        return history.slice(-limit);
    }
    
    // Get character at location
    getCharacterAtLocation(location) {
        const locationCharacters = {
            barn: ['napoleon', 'squealer'],
            windmill: ['boxer', 'animals'],
            commandments: ['animals', 'squealer'],
            fields: ['boxer', 'animals'],
            farmhouse: ['napoleon']
        };
        
        const chars = locationCharacters[location] || [];
        return chars.map(charId => this.getCharacter(charId));
    }
    
    // Get character reaction to event
    getCharacterReaction(characterId, eventType) {
        const state = gameState.getState();
        const character = this.getCharacter(characterId);
        
        if (!character) return null;
        
        const reactions = {
            napoleon: {
                purge: "Discipline is necessary. The traitors have been dealt with.",
                commandment_change: "The commandments must serve the revolution's needs.",
                trade: "Practical arrangements with humans are sometimes necessary.",
                boxer_injury: "Boxer served the revolution well. Send him to the knacker's."
            },
            snowball: {
                purge: "Tyranny! This is not what we fought for!",
                commandment_change: "He's rewriting history right before our eyes!",
                trade: "Collaborating with humans? We've become what we fought against!"
            },
            boxer: {
                purge: "I don't understand... but Napoleon must be right.",
                commandment_change: "The rules are the rules. I will follow them.",
                trade: "If it helps the farm, it must be good.",
                boxer_injury: "I can still work... just need to rest..."
            }
        };
        
        return reactions[characterId]?.[eventType] || character.defaultDialogue;
    }
    
    // Update relationship
    updateRelationship(characterId, change, source = 'dialogue') {
        const character = this.getCharacter(characterId);
        if (!character) return false;
        
        // Update in character system
        if (!character.relationships[source]) {
            character.relationships[source] = 50;
        }
        character.relationships[source] = Math.max(0, Math.min(100, 
            character.relationships[source] + change));
        
        // Update in game state
        const currentRel = gameState.getState().relationships[characterId] || 50;
        const newRel = Math.max(0, Math.min(100, currentRel + change));
        
        gameState.state.relationships[characterId] = newRel;
        
        // Dispatch relationship change event
        const event = new CustomEvent('relationshipChanged', {
            detail: { characterId, newValue: newRel, change, source }
        });
        window.dispatchEvent(event);
        
        return newRel;
    }
    
    // Get overall relationship
    getOverallRelationship(characterId) {
        const character = this.getCharacter(characterId);
        if (!character) return 50;
        
        const sources = Object.values(character.relationships);
        if (sources.length === 0) return 50;
        
        const sum = sources.reduce((a, b) => a + b, 0);
        return Math.round(sum / sources.length);
    }
}

// Create global instance
const characterSystem = new CharacterSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CharacterSystem, characterSystem };
}