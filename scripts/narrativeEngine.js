class NarrativeEngine {
    constructor() {
        this.scenes = {
            // Opening Scene
            opening: {
                id: 'opening',
                title: 'The Revolution Begins',
                text: `MANOR FARM, ENGLAND. 1945.\n\nOld Major's dream has become reality. The humans are gone, driven out by the united animals. The farm belongs to those who work it.\n\nYou stand in the barn, now called "ANIMAL FARM." The Seven Commandments gleam on the wall, freshly painted. The animals look to you - one of the pigs, the natural leaders - to guide this new society.\n\nBut already, cracks appear. Napoleon and Snowball argue over the future. The harvest needs planning. The animals' hunger for freedom is matched only by their empty stomachs.\n\nThis is your revolution. What will you make of it?`,
                characters: ['napoleon', 'snowball', 'animals'],
                background: 'barn',
                next: 'year1_spring'
            },
            
            // Year 1 Seasons
            year1_spring: {
                id: 'year1_spring',
                title: 'First Spring of Freedom',
                text: `SPRING, YEAR 1.\n\nThe first thaw brings both hope and hardship. The fields need planting, but the tools are designed for human hands. The animals struggle with their new responsibilities.\n\nSnowball unveils ambitious plans for a windmill - electricity for all, reduced labor, a symbol of animal ingenuity. Napoleon scoffs, calling it a waste of resources.\n\nThe rations are meager but fairly distributed. For now.`,
                characters: ['snowball', 'animals'],
                background: 'fields',
                season: 'Spring',
                year: 1
            },
            
            // Epoch Scenes
            epoch1_windmill: {
                id: 'epoch1_windmill',
                title: 'The Great Windmill Debate',
                text: `The barn echoes with argument. Snowball's diagrams cover the wall - turbines, gears, promises of electrical light and heating.\n\n"Imagine!" Snowball cries. "No more dark winters! Machines to do our work!"\n\nNapoleon stands apart, flanked by the growing puppies. "Food first," he grunts. "Then fantasies."\n\nThe animals look between them, then to you. The decision will set the course of the revolution.`,
                characters: ['snowball', 'napoleon', 'animals'],
                background: 'barn',
                epoch: 1
            },
            
            epoch2_purges: {
                id: 'epoch2_purges',
                title: 'The Purges Begin',
                text: `AUTUMN, YEAR 2.\n\nThe first frost brings more than cold. Whispers of discontent have reached Napoleon's ears.\n\nSquealer calls an emergency meeting. "Comrades," he says, voice trembling with false sorrow. "Traitors walk among us."\n\nThe dogs circle, teeth bared. Napoleon names names. Or will let you name them.\n\nThe original commandment glows in your memory: "No animal shall kill another animal." The paint looks wet.`,
                characters: ['squealer', 'napoleon', 'dogs'],
                background: 'barn',
                epoch: 2,
                effects: ['blood_stains']
            },
            
            epoch3_commandments: {
                id: 'epoch3_commandments',
                title: 'Rewriting History',
                text: `SUMMER, YEAR 3.\n\nSquealer stands before the Commandments wall, paintbrush in hoof. "A minor clarification," he says. "For the good of the farm."\n\nThe animals squint. They remember the words differently. But memory fades under the gaze of the dogs.\n\nWhich commandment will you change? Each revision chips away at Old Major's dream, but strengthens your control.\n\nThe original paint bleeds through the new words.`,
                characters: ['squealer', 'animals'],
                background: 'commandments',
                epoch: 3,
                effects: ['blood_text']
            },
            
            epoch4_boxer: {
                id: 'epoch4_boxer',
                title: 'Boxer\'s Last Stand',
                text: `SUMMER, YEAR 4.\n\nBoxer lies in his stall, his mighty lungs rasping. The loyal horse worked himself to collapse.\n\n"I will work harder," he whispers, trying to rise.\n\nThe vet's wagon can be called. Or the knacker's van.\n\nNapoleon watches, calculating. "Sentiment is a luxury," he says. "The farm needs practical decisions."\n\nBoxer's honest eyes meet yours. What is a revolution worth?`,
                characters: ['boxer', 'napoleon'],
                background: 'barn',
                epoch: 4,
                effects: ['emotional']
            },
            
            epoch5_humans: {
                id: 'epoch5_humans',
                title: 'The Enemy Returns',
                text: `WINTER, YEAR 5.\n\nThey come in a black motorcar, these humans who once owned you. Pilkington and Frederick, neighboring farmers, smell opportunity.\n\n"Business is business," Pilkington says, offering grain.\n"Progress requires partners," Frederick adds, patting strange machines.\n\nThe animals watch from a distance, confused. These men once whipped them. Now they smile and offer deals.\n\nHow far will you go to survive?`,
                characters: ['pilkington', 'frederick', 'animals'],
                background: 'farmhouse',
                epoch: 5
            },
            
            // Ending Scenes
            ending_utopia: {
                id: 'ending_utopia',
                title: 'The Utopia',
                text: `WINTER, YEAR 6.\n\nThe animals gather in the barn, not out of fear, but purpose. Hidden records are produced - Old Major's original speech, the true Commandments, accounts of every betrayal.\n\nNapoleon and his pigs are surrounded, not by dogs, but by truth.\n\nA new constitution is written, with checks and balances, with education for all, with Boxer - recovered and revered - as its guardian.\n\nThe windmill turns, generating light and hope. The farm is truly, finally, of the animals, by the animals, for the animals.\n\nOld Major's dream lives.`,
                characters: ['animals', 'boxer'],
                background: 'barn',
                ending: 'UTOPIA',
                requirements: {
                    loyalty: 85,
                    corruption: 10,
                    historicalTruth: 70,
                    boxerSaved: true
                }
            },
            
            ending_tyranny: {
                id: 'ending_tyranny',
                title: 'The Cycle of Tyranny',
                text: `WINTER, YEAR 6.\n\nYou stand at the farmhouse window, glass of whiskey in hoof, watching the animals shuffle to their cold sheds.\n\nNapoleon toasts you. "To leadership," he slurs.\n\nThrough the window, your reflection shows not a pig, but something worse - a pig in clothes, walking on two legs, indistinguishable from the men you overthrew.\n\nThe dogs whine at your feet. The Commandments wall has only one rule now: "ALL ANIMALS ARE EQUAL, BUT SOME ANIMALS ARE MORE EQUAL THAN OTHERS."\n\nThe revolution has eaten its children. You are what you destroyed.`,
                characters: ['napoleon', 'squealer'],
                background: 'farmhouse',
                ending: 'CYCLE_OF_TYRANNY',
                requirements: {
                    corruption: 90,
                    security: 80
                }
            },
            
            ending_stagnation: {
                id: 'ending_stagnation',
                title: 'The Stagnation',
                text: `WINTER, YEAR 6.\n\nThe farm lies in ruins. The windmill is a skeleton. The fields are weeds. The animals are too weak to rebel, too hopeless to care.\n\nYou call the humans back. They arrive with chains and whips, but also with food.\n\n"Animals need masters," Jones says, counting the purchase money.\n\nAs the humans retake the farmhouse, you realize: you failed not from malice, but from incompetence. The revolution died from a thousand small failures.\n\nThe pigs join the humans at the table. The other animals return to their stalls. Nothing has changed. Nothing will.`,
                characters: ['jones', 'animals'],
                background: 'farmhouse',
                ending: 'STAGNATION',
                requirements: {
                    loyalty: 20,
                    rations: 20,
                    innovation: 30
                }
            },
            
            ending_martyr: {
                id: 'ending_martyr',
                title: 'The Martyr\'s Revolt',
                text: `WINTER, YEAR 6.\n\nYou stand before the animals, the truth spilling from you like blood. Every lie, every betrayal, every commandment changed in the night.\n\nThe dogs turn on you. Napoleon screams treason.\n\nAs the teeth sink in, you see Boxer's loyal, confused face in the crowd. You failed him. But maybe your death will mean something.\n\nThe animals rise. The farmhouse burns. Napoleon's screams join yours.\n\nWhen it's over, the survivors stand in the wreckage, free but leaderless, victorious but empty. What now?\n\nThe revolution continues. Without you.`,
                characters: ['animals', 'napoleon'],
                background: 'barn',
                ending: 'MARTYR_REVOLT',
                requirements: {
                    boxerSaved: false,
                    loyalty: 70,
                    corruption: 30
                }
            },
            
            ending_compromised: {
                id: 'ending_compromised',
                title: 'The Compromised Survival',
                text: `WINTER, YEAR 6.\n\nNapoleon is gone, exiled by a coalition of tired animals and disillusioned pigs. You remain, not as a hero, but as the least terrible option.\n\nThe farm survives. Barely. The debts to human traders will take years to repay. The animals work without inspiration, following rules they don't believe in.\n\nThe Commandments are a patchwork of original ideals and practical compromises. The windmill works, but no one cheers when it turns.\n\nYou won. Sort of. The revolution is safe. And hollow.\n\nThe future is uncertain. But there is a future. For now, that must be enough.`,
                characters: ['animals'],
                background: 'barn',
                ending: 'COMPROMISED_SURVIVAL',
                isDefault: true
            },
            
            // Special Scenes
            commandments_view: {
                id: 'commandments_view',
                title: 'The Seven Commandments',
                text: `THE SEVEN COMMANDMENTS OF ANIMALISM:\n\n1. Whatever goes upon two legs is an enemy.\n2. Whatever goes upon four legs, or has wings, is a friend.\n3. No animal shall wear clothes.\n4. No animal shall sleep in a bed.\n5. No animal shall drink alcohol.\n6. No animal shall kill any other animal.\n7. All animals are equal.`,
                characters: [],
                background: 'commandments',
                interactive: true
            },
            
            commandments_bloody: {
                id: 'commandments_bloody',
                title: 'The Blood-Stained Wall',
                text: `The Commandments wall tells two stories:\n\nThe painted words, revised and re-revised.\n\nAnd the blood seeping through the paint, spelling forgotten truths in crimson.\n\nSome nights, the animals swear they can still read the original words through the stains. They never speak of it aloud.\n\nThe dogs are always listening.`,
                characters: [],
                background: 'commandments',
                effects: ['blood_stains', 'blood_text'],
                mood: 'dark'
            },
            
            massacre_memory: {
                id: 'massacre_memory',
                title: 'What Happened Here',
                text: `The hens remember. The sheep remember. The ground remembers.\n\nAfter the egg rebellion, after the confession of imagined crimes, the dogs were unleashed.\n\nSnowball's name was chanted like a curse as teeth found flesh.\n\nThe Commandments were revised that night: "No animal shall kill any other animal WITHOUT CAUSE."\n\nThe blood was painted over. The memory remains.`,
                characters: ['hens', 'sheep'],
                background: 'barn',
                effects: ['blood_stains', 'emotional'],
                trigger: { historicalTruth: 50, purgesCompleted: true }
            }
        };
        
        this.currentScene = null;
        this.sceneHistory = [];
        this.narrativeQueue = [];
        
        // Event listeners
        window.addEventListener('seasonChange', (e) => {
            this.handleSeasonChange(e.detail);
        });
        
        window.addEventListener('epochTriggered', (e) => {
            this.handleEpochTrigger(e.detail);
        });
        
        window.addEventListener('endgameTriggered', (e) => {
            this.handleEndgame(e.detail);
        });
        
        window.addEventListener('locationChanged', (e) => {
            this.handleLocationChange(e.detail);
        });
    }
    
    // Get scene by ID
    getScene(sceneId) {
        return this.scenes[sceneId] ? { ...this.scenes[sceneId] } : null;
    }
    
    // Start a scene
    startScene(sceneId, force = false) {
        const scene = this.getScene(sceneId);
        
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return null;
        }
        
        // Check requirements
        if (!force && scene.requirements) {
            const state = gameState.getState();
            for (const [requirement, value] of Object.entries(scene.requirements)) {
                if (requirement === 'boxerSaved') {
                    if (state[requirement] !== value) return null;
                } else if (state[requirement] < value) {
                    return null;
                }
            }
        }
        
        this.currentScene = scene;
        
        // Add to history
        this.sceneHistory.push({
            sceneId,
            timestamp: new Date().toISOString(),
            season: gameState.getState().season,
            year: gameState.getState().year
        });
        
        // Keep history manageable
        if (this.sceneHistory.length > 50) {
            this.sceneHistory.shift();
        }
        
        // Dispatch scene started event
        const event = new CustomEvent('sceneStarted', {
            detail: { scene }
        });
        window.dispatchEvent(event);
        
        // Play scene-specific audio
        this.playSceneAudio(scene);
        
        return scene;
    }
    
    // Handle season change
    handleSeasonChange(detail) {
        const { season, year } = detail;
        const sceneId = `year${year}_${season.toLowerCase()}`;
        
        // Check if seasonal scene exists
        if (this.scenes[sceneId]) {
            // Add to narrative queue
            this.addToQueue(sceneId, 1000);
        } else {
            // Generate generic seasonal scene
            this.generateSeasonalScene(season, year);
        }
    }
    
    // Handle epoch trigger
    handleEpochTrigger(detail) {
        const { epoch } = detail;
        const sceneId = `epoch${epoch}_${this.getEpochName(epoch)}`;
        
        if (this.scenes[sceneId]) {
            // Add to narrative queue with priority
            this.addToQueue(sceneId, 500, true);
        }
    }
    
    // Handle endgame
    handleEndgame(detail) {
        const { ending } = detail;
        const sceneId = `ending_${ending.toLowerCase().replace(/ /g, '_')}`;
        
        if (this.scenes[sceneId]) {
            // Immediate scene change for ending
            this.startScene(sceneId, true);
        } else {
            // Fallback to compromised survival
            this.startScene('ending_compromised', true);
        }
    }
    
    // Handle location change
    handleLocationChange(detail) {
        const { location } = detail;
        const state = gameState.getState();
        
        // Special scene for commandments location
        if (location === 'commandments') {
            if (state.historicalTruth < 50 && state.purgesCompleted) {
                this.addToQueue('commandments_bloody', 300);
            } else if (state.commandmentsRevised) {
                this.addToQueue('commandments_view', 300);
            }
        }
        
        // Check for massacre memory
        if (location === 'barn' && state.historicalTruth < 60 && state.purgesCompleted) {
            if (Math.random() < 0.3) {
                this.addToQueue('massacre_memory', 500);
            }
        }
    }
    
    // Get epoch name
    getEpochName(epochNumber) {
        const names = {
            1: 'windmill',
            2: 'purges',
            3: 'commandments',
            4: 'boxer',
            5: 'humans'
        };
        return names[epochNumber] || 'unknown';
    }
    
    // Generate seasonal scene
    generateSeasonalScene(season, year) {
        const state = gameState.getState();
        const sceneId = `gen_${year}_${season}`;
        
        const seasonalTexts = {
            Spring: [
                `SPRING, YEAR ${year}. New shoots push through the thawing earth. The animals work with ${state.loyalty > 60 ? 'renewed hope' : 'quiet resignation'}.`,
                `The first buds appear. ${state.rations > 50 ? 'The planting proceeds smoothly' : 'The empty stomachs make the work harder'}.`,
                `Spring rain washes the farm. ${state.innovation > 40 ? 'New tools make the planting easier' : 'The old tools break in tired hands'}.`
            ],
            Summer: [
                `SUMMER, YEAR ${year}. The sun beats down. ${state.fatigue > 60 ? 'The animals move slowly in the heat' : 'Work proceeds at a steady pace'}.`,
                `Crops grow tall. ${state.security > 60 ? 'The dogs patrol the perimeter' : 'The fields are quiet but for animal sounds'}.`,
                `The longest day. ${state.loyalty > 70 ? 'The animals sing as they work' : 'Silence hangs heavy over the farm'}.`
            ],
            Autumn: [
                `AUTUMN, YEAR ${year}. The harvest ${state.rations > 30 ? 'is bountiful' : 'is meager'}. ${state.loyalty > 50 ? 'The animals work together' : 'Arguments break out over shares'}.`,
                `Leaves turn. ${state.historicalTruth > 60 ? "Old Major's words are remembered" : 'The original dream feels distant'}.`,
                `The last fruits are gathered. ${state.corruption > 50 ? 'The pigs take the best for themselves' : 'The distribution is fair, if sparse'}.`
            ],
            Winter: [
                `WINTER, YEAR ${year}. Cold grips the farm. ${state.rations > 40 ? 'The stores are adequate' : 'Hunger gnaws'}.`,
                `Snow falls. ${state.security > 70 ? 'The dogs keep watch through the night' : 'The farm sleeps uneasily'}.`,
                `The deepest cold. ${state.innovation > 50 ? 'The windmill provides some heat' : 'The animals huddle together for warmth'}.`
            ]
        };
        
        const texts = seasonalTexts[season] || ['The seasons turn.'];
        const text = texts[Math.floor(Math.random() * texts.length)];
        
        const scene = {
            id: sceneId,
            title: `${season}, Year ${year}`,
            text: text,
            characters: ['animals'],
            background: this.getSeasonalBackground(season),
            season,
            year,
            isGenerated: true
        };
        
        this.scenes[sceneId] = scene;
        this.addToQueue(sceneId, 500);
        
        return scene;
    }
    
    // Get seasonal background
    getSeasonalBackground(season) {
        const backgrounds = {
            Spring: 'fields',
            Summer: 'fields',
            Autumn: 'fields',
            Winter: 'barn'
        };
        return backgrounds[season] || 'barn';
    }
    
    // Add scene to narrative queue
    addToQueue(sceneId, delay = 0, priority = false) {
        const queueItem = {
            sceneId,
            delay,
            priority,
            timestamp: Date.now()
        };
        
        if (priority) {
            // Add to front of queue
            this.narrativeQueue.unshift(queueItem);
        } else {
            this.narrativeQueue.push(queueItem);
        }
        
        // Process queue if not already processing
        if (!this.queueProcessor) {
            this.processQueue();
        }
    }
    
    // Process narrative queue
    async processQueue() {
        this.queueProcessor = true;
        
        while (this.narrativeQueue.length > 0) {
            const item = this.narrativeQueue.shift();
            
            // Wait for delay
            if (item.delay > 0) {
                await new Promise(resolve => setTimeout(resolve, item.delay));
            }
            
            // Start the scene
            this.startScene(item.sceneId);
            
            // Wait a bit between scenes
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        this.queueProcessor = false;
    }
    
    // Play scene audio
    playSceneAudio(scene) {
        // Determine audio based on scene mood
        let audioFile = 'assets/sounds/music/narrative_default.mp3';
        
        if (scene.mood === 'dark') {
            audioFile = 'assets/sounds/music/narrative_dark.mp3';
        } else if (scene.effects && scene.effects.includes('emotional')) {
            audioFile = 'assets/sounds/music/narrative_emotional.mp3';
        } else if (scene.ending) {
            audioFile = 'assets/sounds/music/ending.mp3';
        }
        
        // Dispatch audio event
        const event = new CustomEvent('sceneAudio', {
            detail: { audioFile, scene }
        });
        window.dispatchEvent(event);
    }
    
    // Get current narrative context
    getCurrentContext() {
        const state = gameState.getState();
        const context = {
            season: state.season,
            year: state.year,
            metrics: {
                loyalty: state.loyalty,
                rations: state.rations,
                security: state.security,
                corruption: state.corruption,
                innovation: state.innovation,
                historicalTruth: state.historicalTruth
            },
            flags: {
                boxerSaved: state.boxerSaved,
                commandmentsRevised: state.commandmentsRevised,
                purgesCompleted: state.purgesCompleted,
                windmillBuilt: state.windmillBuilt
            },
            location: state.currentLocation,
            epoch: state.currentEpoch
        };
        
        return context;
    }
    
    // Generate narrative based on context
    generateNarrative(context) {
        const narratives = [];
        
        // Metric-based narratives
        if (context.metrics.loyalty < 30) {
            narratives.push("Discontent whispers through the barn. The animals eye the farmhouse with new suspicion.");
        }
        
        if (context.metrics.rations < 20) {
            narratives.push("Empty troughs echo. Hungry eyes follow every movement toward the storage barn.");
        }
        
        if (context.metrics.corruption > 70) {
            narratives.push("The farmhouse glows with light and laughter. The barn is dark and cold.");
        }
        
        if (context.metrics.historicalTruth < 40) {
            narratives.push("Memory fades. What was once unthinkable becomes normal.");
        }
        
        // Flag-based narratives
        if (context.flags.boxerSaved === false && context.year >= 4) {
            narratives.push("Boxer's stall stands empty. No one mentions the van.");
        }
        
        if (context.flags.commandmentsRevised) {
            narratives.push("The painted words on the wall don't match the words in your memory.");
        }
        
        // Location-based narratives
        switch (context.location) {
            case 'barn':
                narratives.push("The barn smells of animals and hay, and something else... fear? Hope?");
                break;
            case 'windmill':
                narratives.push("The windmill turns, a monument to either ambition or folly.");
                break;
            case 'commandments':
                narratives.push("The Seven Commandments watch, their meanings shifting like shadows.");
                break;
        }
        
        // Return random narrative from collected ones
        if (narratives.length > 0) {
            return narratives[Math.floor(Math.random() * narratives.length)];
        }
        
        // Default narrative
        return "The revolution continues. One day at a time.";
    }
    
    // Get scene history
    getSceneHistory(limit = 10) {
        return this.sceneHistory.slice(-limit);
    }
    
    // Clear current scene
    clearScene() {
        this.currentScene = null;
        
        const event = new CustomEvent('sceneCleared');
        window.dispatchEvent(event);
    }
    
    // Get available scenes for current state
    getAvailableScenes() {
        const state = gameState.getState();
        const availableScenes = [];
        
        // Check all scenes for availability
        Object.entries(this.scenes).forEach(([sceneId, scene]) => {
            if (scene.isGenerated) return; // Skip generated scenes
            
            let isAvailable = true;
            
            // Check requirements
            if (scene.requirements) {
                for (const [requirement, value] of Object.entries(scene.requirements)) {
                    if (state[requirement] === undefined) continue;
                    
                    if (requirement === 'boxerSaved') {
                        if (state[requirement] !== value) isAvailable = false;
                    } else if (state[requirement] < value) {
                        isAvailable = false;
                    }
                }
            }
            
            // Check triggers
            if (scene.trigger) {
                if (scene.trigger.year && state.year < scene.trigger.year) {
                    isAvailable = false;
                }
                if (scene.trigger.season && state.season !== scene.trigger.season) {
                    isAvailable = false;
                }
            }
            
            if (isAvailable) {
                availableScenes.push(sceneId);
            }
        });
        
        return availableScenes;
    }
}

// Create global instance
const narrativeEngine = new NarrativeEngine();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NarrativeEngine, narrativeEngine };
}