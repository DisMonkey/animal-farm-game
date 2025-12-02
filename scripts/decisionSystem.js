class DecisionSystem {
    constructor() {
        this.decisions = {
            // Year 1: The Great Windmill Debate
            windmill_debate: {
                id: 'windmill_debate',
                title: 'The Great Windmill Debate',
                description: 'How should we approach the windmill construction?',
                epoch: 1,
                trigger: { year: 1, season: 'Spring' },
                options: [
                    {
                        id: 'speed',
                        title: 'Maximum Speed',
                        description: 'Push the animals hard to complete the windmill quickly. Show the humans our progress.',
                        costs: { fatigue: 30, rations: -10 },
                        benefits: { innovation: 20, security: 10 },
                        delayed: {
                            type: 'WindmillCompletion',
                            delay: 2,
                            effects: { innovation: 15, loyalty: 5 },
                            success: true
                        },
                        flags: { windmillBuilt: true },
                        relationships: { boxer: -10, animals: -15 }
                    },
                    {
                        id: 'safety',
                        title: 'Safety First',
                        description: 'Prioritize animal welfare and safe working conditions.',
                        costs: { fatigue: 10, innovation: -5 },
                        benefits: { loyalty: 15, rations: 5 },
                        delayed: {
                            type: 'WindmillCompletion',
                            delay: 4,
                            effects: { innovation: 10, loyalty: 10 },
                            success: true
                        },
                        flags: { windmillBuilt: true },
                        relationships: { boxer: 10, animals: 10 }
                    },
                    {
                        id: 'compromise',
                        title: 'Balanced Approach',
                        description: 'Find a middle ground between speed and safety.',
                        costs: { fatigue: 20, rations: -5 },
                        benefits: { innovation: 15, loyalty: 5 },
                        delayed: {
                            type: 'WindmillCompletion',
                            delay: 3,
                            effects: { innovation: 12, loyalty: 7 },
                            success: true
                        },
                        flags: { windmillBuilt: true },
                        relationships: { boxer: 5, animals: 5 }
                    }
                ],
                narrative: 'Snowball presents ambitious windmill plans. Napoleon argues for more practical approaches. The animals look to you for direction.'
            },
            
            // Year 2: The Purges & Show Trials
            purges: {
                id: 'purges',
                title: 'The Purges & Show Trials',
                description: 'Discontent is growing. Who should be made an example?',
                epoch: 2,
                trigger: { year: 2, season: 'Autumn' },
                options: [
                    {
                        id: 'accuse_sheep',
                        title: 'Accuse the Sheep',
                        description: 'Blame the mindless followers. They won\'t defend themselves.',
                        costs: { loyalty: -20, historicalTruth: -25 },
                        benefits: { security: 40, corruption: 20 },
                        delayed: {
                            type: 'PurgeAftermath',
                            delay: 1,
                            effects: { security: 10, loyalty: -10 }
                        },
                        flags: { purgesCompleted: true },
                        relationships: { animals: -30 }
                    },
                    {
                        id: 'accuse_chickens',
                        title: 'Accuse the Chickens',
                        description: 'Their egg production has been lacking. Make an example.',
                        costs: { loyalty: -15, rations: -10, historicalTruth: -20 },
                        benefits: { security: 30, corruption: 15 },
                        delayed: {
                            type: 'PurgeAftermath',
                            delay: 1,
                            effects: { security: 5, rations: -5 }
                        },
                        flags: { purgesCompleted: true },
                        relationships: { animals: -20 }
                    },
                    {
                        id: 'scapegoat',
                        title: 'Create a Scapegoat',
                        description: 'Invent a traitor working with Snowball.',
                        costs: { loyalty: -25, historicalTruth: -30 },
                        benefits: { security: 20, corruption: 25 },
                        delayed: {
                            type: 'PurgeAftermath',
                            delay: 1,
                            effects: { security: 15, loyalty: -15 }
                        },
                        flags: { purgesCompleted: true },
                        relationships: { animals: -25 }
                    }
                ],
                narrative: 'Napoleon demands show trials to consolidate power. Squealer prepares the charges. The animals watch in fear.'
            },
            
            // Year 3: Commandment Revision
            commandment_revision: {
                id: 'commandment_revision',
                title: 'Commandment Revision',
                description: 'Which original commandment should be revised?',
                epoch: 3,
                trigger: { year: 3, season: 'Summer' },
                options: [
                    {
                        id: 'no_beds',
                        title: 'No animal shall sleep in a bed',
                        description: 'Revise to: "No animal shall sleep in a bed with sheets"',
                        costs: { historicalTruth: -50, loyalty: -15 },
                        benefits: { corruption: 95, security: 10 },
                        flags: { commandmentsRevised: true },
                        narrative: 'The pigs begin sleeping in the farmhouse beds. Squealer explains the "clarification."'
                    },
                    {
                        id: 'no_alcohol',
                        title: 'No animal shall drink alcohol',
                        description: 'Revise to: "No animal shall drink alcohol to excess"',
                        costs: { historicalTruth: -50, loyalty: -20 },
                        benefits: { corruption: 95, security: 5 },
                        flags: { commandmentsRevised: true },
                        narrative: 'Whiskey bottles appear in the farmhouse. The pigs stumble at meetings.'
                    },
                    {
                        id: 'no_killing',
                        title: 'No animal shall kill another animal',
                        description: 'Revise to: "No animal shall kill another animal without cause"',
                        costs: { historicalTruth: -50, loyalty: -25 },
                        benefits: { corruption: 95, security: 15 },
                        flags: { commandmentsRevised: true },
                        narrative: 'The dogs\' violence is now justified. The animals remember the purges.'
                    }
                ],
                narrative: 'Squealer approaches with paint. "The commandments need clarification," he says. The original paint is still visible beneath.'
            },
            
            // Year 4: Boxer's Fate
            boxer_fate: {
                id: 'boxer_fate',
                title: 'Boxer\'s Fate',
                description: 'Boxer is injured and cannot work. What is to be done?',
                epoch: 4,
                trigger: { year: 4, season: 'Summer' },
                options: [
                    {
                        id: 'save_rations',
                        title: 'Save with Rations',
                        description: 'Use the farm\'s food reserves to nurse Boxer back to health.',
                        costs: { rations: -75 },
                        benefits: { loyalty: 25 },
                        flags: { boxerSaved: true, boxerInjured: false },
                        requirements: { rations: 75 },
                        relationships: { boxer: 50, animals: 30 },
                        narrative: 'You allocate precious food to save Boxer. He recovers slowly but gratefully.'
                    },
                    {
                        id: 'save_loyalty',
                        title: 'Save with Loyalty',
                        description: 'Mobilize the animals to care for Boxer collectively.',
                        costs: { loyalty: -40, fatigue: 20 },
                        benefits: {},
                        flags: { boxerSaved: true, boxerInjured: false },
                        requirements: { loyalty: 90 },
                        relationships: { boxer: 40, animals: 20 },
                        narrative: 'The animals work extra shifts to care for Boxer. His recovery unites them.'
                    },
                    {
                        id: 'sacrifice',
                        title: 'Send to Knacker\'s',
                        description: 'Boxer is no longer useful. Sell him for glue money.',
                        costs: { loyalty: -25, historicalTruth: -10 },
                        benefits: { rations: 30, security: 10, corruption: 20 },
                        flags: { boxerSaved: false },
                        relationships: { boxer: -100, animals: -40 },
                        narrative: 'The van arrives. Boxer looks confused as he\'s loaded. "Napoleon is always right," he says one last time.'
                    }
                ],
                narrative: 'Boxer lies in his stall, breathing labored. His mighty body failed at last. All eyes are on you.'
            },
            
            // Year 5: The Human Visitors
            human_visitors: {
                id: 'human_visitors',
                title: 'The Human Visitors',
                description: 'Which human farmer should we trade with?',
                epoch: 5,
                trigger: { year: 5, season: 'Winter' },
                options: [
                    {
                        id: 'pilkington',
                        title: 'Mr. Pilkington',
                        description: 'Trade for better rations and supplies.',
                        costs: { security: -20, historicalTruth: -15 },
                        benefits: { rations: 40, corruption: 10 },
                        flags: { humanVisitors: true },
                        relationships: { animals: -15 },
                        narrative: 'Pilkington brings grain and medicine. He eyes the farmhouse appreciatively.'
                    },
                    {
                        id: 'frederick',
                        title: 'Mr. Frederick',
                        description: 'Trade for advanced machinery and technology.',
                        costs: { security: -15, rations: -10 },
                        benefits: { innovation: 30, corruption: 15 },
                        flags: { humanVisitors: true },
                        relationships: { animals: -10 },
                        narrative: 'Frederick brings strange machines. "Progress requires tools," he says with a smile.'
                    },
                    {
                        id: 'neither',
                        title: 'Reject Both',
                        description: 'We are self-sufficient. No dealings with humans.',
                        costs: { rations: -20, loyalty: -10 },
                        benefits: { historicalTruth: 10, security: 5 },
                        flags: { humanVisitors: false },
                        relationships: { animals: 10 },
                        narrative: 'You send the humans away. The animals cheer, but the barn is cold and empty.'
                    }
                ],
                narrative: 'Two human farmers approach with offers. Their laughter echoes old times. The dogs growl uneasily.'
            },
            
            // Regular Seasonal Decisions
            seasonal: {
                spring_planting: {
                    id: 'spring_planting',
                    title: 'Spring Planting Strategy',
                    description: 'How should we approach this year\'s planting?',
                    seasonal: 'Spring',
                    options: [
                        {
                            id: 'intensive',
                            title: 'Intensive Farming',
                            description: 'Plant every available inch for maximum yield.',
                            costs: { fatigue: 15, loyalty: -5 },
                            benefits: { rations: 25 },
                            delayed: {
                                type: 'HarvestResults',
                                delay: 2,
                                effects: { rations: 15 }
                            }
                        },
                        {
                            id: 'sustainable',
                            title: 'Sustainable Farming',
                            description: 'Rotate crops and maintain soil health.',
                            costs: { fatigue: 5, rations: -5 },
                            benefits: { innovation: 10, loyalty: 5 },
                            delayed: {
                                type: 'HarvestResults',
                                delay: 2,
                                effects: { rations: 10, innovation: 5 }
                            }
                        },
                        {
                            id: 'traditional',
                            title: 'Traditional Methods',
                            description: 'Use the methods Jones used, but without the whip.',
                            costs: { fatigue: 10 },
                            benefits: { rations: 15 },
                            delayed: {
                                type: 'HarvestResults',
                                delay: 2,
                                effects: { rations: 12 }
                            }
                        }
                    ]
                },
                
                summer_labor: {
                    id: 'summer_labor',
                    title: 'Summer Labor Allocation',
                    description: 'How should we manage the peak labor season?',
                    seasonal: 'Summer',
                    options: [
                        {
                            id: 'overtime',
                            title: 'Mandatory Overtime',
                            description: 'Everyone works longer hours to maximize production.',
                            costs: { fatigue: 25, loyalty: -10 },
                            benefits: { rations: 20, security: 5 },
                            relationships: { animals: -15 }
                        },
                        {
                            id: 'shifts',
                            title: 'Organized Shifts',
                            description: 'Implement a fair shift system with rest periods.',
                            costs: { fatigue: 10 },
                            benefits: { loyalty: 10, innovation: 5 },
                            relationships: { animals: 10 }
                        },
                        {
                            id: 'voluntary',
                            title: 'Voluntary Extra Work',
                            description: 'Ask for volunteers to work extra.',
                            costs: { fatigue: 5, rations: -5 },
                            benefits: { loyalty: 15 },
                            relationships: { animals: 5 }
                        }
                    ]
                },
                
                autumn_harvest: {
                    id: 'autumn_harvest',
                    title: 'Autumn Harvest Distribution',
                    description: 'How should the harvest be allocated?',
                    seasonal: 'Autumn',
                    options: [
                        {
                            id: 'equal',
                            title: 'Equal Distribution',
                            description: 'Every animal gets exactly the same share.',
                            costs: { security: -5 },
                            benefits: { loyalty: 15 },
                            relationships: { animals: 20 }
                        },
                        {
                            id: 'need',
                            title: 'Distribution by Need',
                            description: 'Those who work hardest or have families get more.',
                            costs: { loyalty: -5 },
                            benefits: { rations: 10, innovation: 5 },
                            relationships: { animals: 0 }
                        },
                        {
                            id: 'leadership',
                            title: 'Leadership Priority',
                            description: 'The pigs need extra for their important work.',
                            costs: { loyalty: -15, corruption: 10 },
                            benefits: { security: 10, rations: 5 },
                            relationships: { animals: -20 }
                        }
                    ]
                },
                
                winter_survival: {
                    id: 'winter_survival',
                    title: 'Winter Survival Measures',
                    description: 'How should we endure the harsh winter?',
                    seasonal: 'Winter',
                    options: [
                        {
                            id: 'rationing',
                            title: 'Strict Rationing',
                            description: 'Cut rations to make supplies last.',
                            costs: { loyalty: -10 },
                            benefits: { rations: 20 },
                            relationships: { animals: -10 }
                        },
                        {
                            id: 'hunting',
                            title: 'Winter Hunting',
                            description: 'Send hunting parties into the woods.',
                            costs: { fatigue: 15, security: -5 },
                            benefits: { rations: 15, innovation: 5 },
                            relationships: { animals: 5 }
                        },
                        {
                            id: 'storage',
                            title: 'Improve Storage',
                            description: 'Use innovation to preserve what we have.',
                            costs: { fatigue: 10, innovation: -5 },
                            benefits: { rations: 25, innovation: 10 },
                            delayed: {
                                type: 'StorageImprovement',
                                delay: 1,
                                effects: { rations: 10 }
                            }
                        }
                    ]
                }
            },
            
            // Special Events
            special: {
                dogs_training: {
                    id: 'dogs_training',
                    title: 'Dog Training Program',
                    description: 'How should Napoleon\'s puppies be trained?',
                    trigger: { year: 1, season: 'Summer' },
                    options: [
                        {
                            id: 'guard',
                            title: 'Guard Dogs',
                            description: 'Train them for farm security and protection.',
                            costs: { loyalty: -5, rations: -10 },
                            benefits: { security: 25 },
                            flags: { dogsTrained: 'guard' }
                        },
                        {
                            id: 'hunting',
                            title: 'Hunting Dogs',
                            description: 'Train them for hunting to supplement rations.',
                            costs: { fatigue: 10 },
                            benefits: { rations: 15, security: 10 },
                            flags: { dogsTrained: 'hunting' }
                        },
                        {
                            id: 'companion',
                            title: 'Companion Animals',
                            description: 'Integrate them with the other animals.',
                            costs: { security: -10 },
                            benefits: { loyalty: 15 },
                            flags: { dogsTrained: 'companion' }
                        }
                    ]
                },
                
                education_program: {
                    id: 'education_program',
                    title: 'Animal Education',
                    description: 'Should we establish a school for the young animals?',
                    trigger: { year: 2, season: 'Spring' },
                    options: [
                        {
                            id: 'literacy',
                            title: 'Literacy Program',
                            description: 'Teach all animals to read and write.',
                            costs: { fatigue: 15, rations: -5 },
                            benefits: { innovation: 20, historicalTruth: 10 },
                            relationships: { animals: 15 }
                        },
                        {
                            id: 'propaganda',
                            title: 'Ideological Education',
                            description: 'Teach the principles of Animalism.',
                            costs: { fatigue: 10 },
                            benefits: { loyalty: 15, security: 10 },
                            relationships: { animals: 5 }
                        },
                        {
                            id: 'vocational',
                            title: 'Vocational Training',
                            description: 'Focus on practical farming skills.',
                            costs: { fatigue: 5 },
                            benefits: { innovation: 15, rations: 10 },
                            relationships: { animals: 10 }
                        }
                    ]
                }
            }
        };
        
        this.currentDecision = null;
        this.decisionHistory = [];
        
        // Event listeners
        window.addEventListener('epochTriggered', (e) => {
            this.handleEpochTrigger(e.detail);
        });
        
        window.addEventListener('seasonChange', (e) => {
            this.checkSeasonalDecisions(e.detail);
        });
    }
    
    // Get decision by ID
    getDecision(decisionId) {
        // Check epoch decisions
        if (this.decisions[decisionId]) {
            return { ...this.decisions[decisionId] };
        }
        
        // Check seasonal decisions
        for (const category in this.decisions) {
            if (typeof this.decisions[category] === 'object' && 
                this.decisions[category][decisionId]) {
                return { ...this.decisions[category][decisionId] };
            }
        }
        
        return null;
    }
    
    // Get decisions for current context
    getCurrentDecisions() {
        const state = gameState.getState();
        const currentDecisions = [];
        
        // Check for epoch decisions
        if (state.currentEpoch > 0) {
            const epochDecision = Object.values(this.decisions).find(
                decision => decision.epoch === state.currentEpoch
            );
            
            if (epochDecision && !state.epochsCompleted.includes(state.currentEpoch)) {
                currentDecisions.push(epochDecision);
            }
        }
        
        // Check for seasonal decisions
        const seasonalKey = `${state.season.toLowerCase()}_${state.season.toLowerCase()}`;
        if (this.decisions.seasonal && this.decisions.seasonal[seasonalKey]) {
            currentDecisions.push(this.decisions.seasonal[seasonalKey]);
        }
        
        // Check for special decisions based on conditions
        if (state.security > 50 && !state.dogsTrained) {
            currentDecisions.push(this.decisions.special.dogs_training);
        }
        
        if (state.innovation > 30 && state.year >= 2) {
            currentDecisions.push(this.decisions.special.education_program);
        }
        
        return currentDecisions;
    }
    
    // Start a decision
    startDecision(decisionId) {
        const decision = this.getDecision(decisionId);
        
        if (!decision) {
            console.error('Decision not found:', decisionId);
            return null;
        }
        
        this.currentDecision = decision;
        
        // Check requirements
        if (decision.options) {
            decision.options.forEach(option => {
                option.available = this.checkOptionRequirements(option);
            });
        }
        
        // Dispatch decision started event
        const event = new CustomEvent('decisionStarted', {
            detail: { decision }
        });
        window.dispatchEvent(event);
        
        return decision;
    }
    
    // Check if option requirements are met
    checkOptionRequirements(option) {
        if (!option.requirements) return true;
        
        const state = gameState.getState();
        
        for (const [metric, requiredValue] of Object.entries(option.requirements)) {
            if (state[metric] === undefined) continue;
            
            if (metric === 'boxerSaved' || metric === 'boxerInjured') {
                if (state[metric] !== requiredValue) return false;
            } else if (state[metric] < requiredValue) {
                return false;
            }
        }
        
        return true;
    }
    
    // Make a choice in current decision
    makeChoice(optionId) {
        if (!this.currentDecision) {
            console.error('No active decision');
            return false;
        }
        
        const option = this.currentDecision.options.find(opt => opt.id === optionId);
        
        if (!option) {
            console.error('Option not found:', optionId);
            return false;
        }
        
        if (option.available === false) {
            console.error('Option requirements not met');
            return false;
        }
        
        // Apply the decision through game state
        gameState.makeDecision({
            title: this.currentDecision.title,
            description: option.description,
            costs: option.costs,
            benefits: option.benefits,
            delayed: option.delayed,
            flags: option.flags,
            relationships: option.relationships
        });
        
        // Add to history
        this.decisionHistory.push({
            decisionId: this.currentDecision.id,
            optionId: option.id,
            timestamp: new Date().toISOString(),
            season: gameState.getState().season,
            year: gameState.getState().year
        });
        
        // Clear current decision
        const completedDecision = this.currentDecision;
        this.currentDecision = null;
        
        // Dispatch decision completed event
        const event = new CustomEvent('decisionCompleted', {
            detail: { decision: completedDecision, option }
        });
        window.dispatchEvent(event);
        
        // If this was an epoch decision, mark it as completed
        if (completedDecision.epoch) {
            const state = gameState.getState();
            if (!state.epochsCompleted.includes(completedDecision.epoch)) {
                state.epochsCompleted.push(completedDecision.epoch);
            }
            state.currentEpoch = 0;
        }
        
        return true;
    }
    
    // Handle epoch trigger
    handleEpochTrigger(detail) {
        const { epoch } = detail;
        
        // Find the decision for this epoch
        const epochDecision = Object.values(this.decisions).find(
            decision => decision.epoch === epoch
        );
        
        if (epochDecision) {
            // Start the decision automatically
            setTimeout(() => {
                this.startDecision(epochDecision.id);
            }, 1000);
        }
    }
    
    // Check for seasonal decisions
    checkSeasonalDecisions(detail) {
        const { season } = detail;
        const seasonalKey = `${season.toLowerCase()}_${season.toLowerCase()}`;
        
        if (this.decisions.seasonal && this.decisions.seasonal[seasonalKey]) {
            // Check if we should show this decision
            const state = gameState.getState();
            const decision = this.decisions.seasonal[seasonalKey];
            
            // Don't show if we're in an epoch decision
            if (state.currentEpoch === 0) {
                // Add small delay for better UX
                setTimeout(() => {
                    this.startDecision(decision.id);
                }, 500);
            }
        }
    }
    
    // Get decision history
    getDecisionHistory(limit = 20) {
        return this.decisionHistory.slice(-limit);
    }
    
    // Get decision statistics
    getDecisionStats() {
        const stats = {
            totalDecisions: this.decisionHistory.length,
            byType: {},
            bySeason: {},
            recent: this.decisionHistory.slice(-5)
        };
        
        // Count by decision type
        this.decisionHistory.forEach(entry => {
            const decision = this.getDecision(entry.decisionId);
            const type = decision?.epoch ? 'epoch' : 'seasonal';
            
            stats.byType[type] = (stats.byType[type] || 0) + 1;
            stats.bySeason[entry.season] = (stats.bySeason[entry.season] || 0) + 1;
        });
        
        return stats;
    }
    
    // Generate cost/benefit preview HTML
    generatePreviewHTML(option) {
        let html = '<div class="preview-details">';
        
        if (option.costs) {
            html += '<div class="cost-section">';
            html += '<h4>Costs</h4>';
            html += '<ul>';
            Object.entries(option.costs).forEach(([metric, value]) => {
                const metricName = metric.charAt(0).toUpperCase() + metric.slice(1);
                const sign = value < 0 ? '' : '-';
                html += `<li><span class="cost-badge">${sign}${Math.abs(value)} ${metricName}</span></li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        if (option.benefits) {
            html += '<div class="benefit-section">';
            html += '<h4>Benefits</h4>';
            html += '<ul>';
            Object.entries(option.benefits).forEach(([metric, value]) => {
                const metricName = metric.charAt(0).toUpperCase() + metric.slice(1);
                const sign = value > 0 ? '+' : '';
                html += `<li><span class="benefit-badge">${sign}${value} ${metricName}</span></li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        if (option.requirements) {
            html += '<div class="requirement-section">';
            html += '<h4>Requirements</h4>';
            html += '<ul>';
            Object.entries(option.requirements).forEach(([metric, value]) => {
                const metricName = metric.charAt(0).toUpperCase() + metric.slice(1);
                const current = gameState.getState()[metric];
                const met = current >= value;
                html += `<li class="${met ? 'met' : 'unmet'}">`;
                html += `${metricName}: ${current}/${value}`;
                html += '</li>';
            });
            html += '</ul>';
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }
    
    // Validate decision requirements
    validateDecision(decisionId) {
        const decision = this.getDecision(decisionId);
        if (!decision) return false;
        
        // Check if decision has already been made
        const state = gameState.getState();
        if (decision.epoch && state.epochsCompleted.includes(decision.epoch)) {
            return false;
        }
        
        // Check trigger conditions
        if (decision.trigger) {
            if (decision.trigger.year && state.year < decision.trigger.year) {
                return false;
            }
            if (decision.trigger.season && state.season !== decision.trigger.season) {
                return false;
            }
        }
        
        return true;
    }
    
    // Get available decisions
    getAvailableDecisions() {
        const allDecisions = [];
        
        // Check epoch decisions
        Object.values(this.decisions).forEach(decision => {
            if (decision.epoch && this.validateDecision(decision.id)) {
                allDecisions.push(decision);
            }
        });
        
        // Check seasonal decisions
        const state = gameState.getState();
        const seasonalKey = `${state.season.toLowerCase()}_${state.season.toLowerCase()}`;
        if (this.decisions.seasonal && this.decisions.seasonal[seasonalKey]) {
            allDecisions.push(this.decisions.seasonal[seasonalKey]);
        }
        
        // Check special decisions
        Object.values(this.decisions.special || {}).forEach(decision => {
            if (this.validateDecision(decision.id)) {
                allDecisions.push(decision);
            }
        });
        
        return allDecisions;
    }
}

// Create global instance
const decisionSystem = new DecisionSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DecisionSystem, decisionSystem };
}