class FarmMap {
    constructor() {
        this.locations = {
            barn: {
                id: 'barn',
                name: 'The Barn',
                description: 'The heart of the farm. Meetings are held here, and the Commandments wall stands at one end.',
                features: ['commandments_wall', 'meeting_space', 'animal_stalls'],
                characters: ['napoleon', 'squealer', 'animals'],
                events: ['meetings', 'trials', 'announcements'],
                background: 'barn',
                interactive: true
            },
            windmill: {
                id: 'windmill',
                name: 'The Windmill',
                description: 'A monument to animal labor and either hope or folly, depending on who you ask.',
                features: ['windmill', 'construction_site', 'tool_storage'],
                characters: ['boxer', 'animals'],
                events: ['construction', 'maintenance', 'accidents'],
                background: 'windmill',
                interactive: true
            },
            commandments: {
                id: 'commandments',
                name: 'Commandments Wall',
                description: 'The Seven Commandments of Animalism are painted here. The paint has been refreshed many times.',
                features: ['commandments_wall', 'paint_cans', 'blood_stains'],
                characters: ['squealer', 'animals'],
                events: ['revisions', 'readings', 'discoveries'],
                background: 'commandments',
                interactive: true,
                special: 'commandments_view'
            },
            fields: {
                id: 'fields',
                name: 'The Fields',
                description: 'The farm\'s lifeblood. Crops grow or fail here, determining the animals\' survival.',
                features: ['crops', 'plowing_equipment', 'irrigation'],
                characters: ['boxer', 'animals'],
                events: ['planting', 'harvest', 'drought', 'blight'],
                background: 'fields',
                interactive: true
            },
            farmhouse: {
                id: 'farmhouse',
                name: 'The Farmhouse',
                description: 'Once Mr. Jones\' home, now occupied by the pigs. Lights burn late into the night.',
                features: ['human_house', 'pigs_quarters', 'storage'],
                characters: ['napoleon', 'squealer'],
                events: ['planning', 'feasting', 'human_visits'],
                background: 'farmhouse',
                interactive: true,
                restricted: true
            }
        };
        
        this.currentLocation = 'barn';
        this.visitedLocations = new Set(['barn']);
        this.locationHistory = [];
        
        // Event listeners
        window.addEventListener('locationChanged', (e) => {
            this.handleLocationChange(e.detail);
        });
        
        window.addEventListener('seasonChange', (e) => {
            this.updateLocationAppearance(e.detail.season);
        });
        
        window.addEventListener('metricChange', (e) => {
            this.handleMetricChange(e.detail);
        });
    }
    
    // Get location by ID
    getLocation(locationId) {
        return this.locations[locationId] ? { ...this.locations[locationId] } : null;
    }
    
    // Get current location
    getCurrentLocation() {
        return this.getLocation(this.currentLocation);
    }
    
    // Change location
    changeLocation(locationId) {
        const newLocation = this.getLocation(locationId);
        if (!newLocation) return false;
        
        const oldLocation = this.currentLocation;
        
        // Check restrictions
        if (newLocation.restricted) {
            const state = gameState.getState();
            if (state.security < 50 || state.corruption < 30) {
                gameState.addToLog(`Access to ${newLocation.name} is restricted.`);
                return false;
            }
        }
        
        // Update current location
        this.currentLocation = locationId;
        this.visitedLocations.add(locationId);
        
        // Add to history
        this.locationHistory.push({
            from: oldLocation,
            to: locationId,
            timestamp: new Date().toISOString(),
            season: gameState.getState().season,
            year: gameState.getState().year
        });
        
        // Update game state
        gameState.state.currentLocation = locationId;
        
        // Dispatch location change event
        const event = new CustomEvent('locationChanged', {
            detail: {
                location: locationId,
                previous: oldLocation,
                locationData: newLocation
            }
        });
        window.dispatchEvent(event);
        
        // Log the movement
        gameState.addToLog(`Traveled to ${newLocation.name}`);
        
        return true;
    }
    
    // Handle location change
    handleLocationChange(detail) {
        const { location, locationData } = detail;
        
        // Update map display
        this.updateMapDisplay();
        
        // Trigger location-specific events
        this.triggerLocationEvents(location, locationData);
    }
    
    // Update map display
    updateMapDisplay() {
        // Update map tile highlights
        document.querySelectorAll('.map-tile').forEach(tile => {
            tile.classList.remove('current-location');
            if (tile.dataset.location === this.currentLocation) {
                tile.classList.add('current-location');
            }
        });
    }
    
    // Trigger location-specific events
    triggerLocationEvents(locationId, locationData) {
        const state = gameState.getState();
        
        switch (locationId) {
            case 'commandments':
                // Check for blood stain discovery
                if (state.historicalTruth < 50 && state.purgesCompleted) {
                    if (Math.random() < 0.4) {
                        this.triggerBloodStainDiscovery();
                    }
                }
                break;
                
            case 'windmill':
                // Check for windmill events
                if (state.windmillBuilt) {
                    if (state.innovation > 60 && Math.random() < 0.3) {
                        this.triggerWindmillSuccess();
                    } else if (state.innovation < 30 && Math.random() < 0.3) {
                        this.triggerWindmillProblems();
                    }
                }
                break;
                
            case 'farmhouse':
                // Farmhouse events
                if (state.corruption > 70 && Math.random() < 0.5) {
                    this.triggerFarmhouseRevelation();
                }
                break;
        }
        
        // Random encounter chance
        if (Math.random() < 0.2) {
            this.triggerRandomEncounter(locationId);
        }
    }
    
    // Trigger blood stain discovery
    triggerBloodStainDiscovery() {
        const state = gameState.getState();
        
        if (state.historicalTruth > 70) {
            // Animals remember the truth
            gameState.addToLog('At the Commandments wall, an animal points to blood seeping through the paint. "That\'s not what it used to say," they whisper.');
            gameState.updateMetric('historicalTruth', 5);
            gameState.updateMetric('loyalty', -5);
        } else if (state.historicalTruth < 40) {
            // Animals are confused
            gameState.addToLog('Strange stains mar the Commandments wall. No one remembers how they got there.');
            gameState.updateMetric('historicalTruth', -5);
        }
    }
    
    // Trigger windmill success
    triggerWindmillSuccess() {
        const successEvents = [
            'The windmill turns smoothly, generating power for the farm.',
            'Animals take pride in their work on the windmill.',
            'The windmill becomes a symbol of animal achievement.'
        ];
        
        const event = successEvents[Math.floor(Math.random() * successEvents.length)];
        gameState.addToLog(event);
        gameState.updateMetric('loyalty', 5);
        gameState.updateMetric('innovation', 3);
    }
    
    // Trigger windmill problems
    triggerWindmillProblems() {
        const problemEvents = [
            'The windmill creaks ominously in the wind.',
            'Repairs are constantly needed on the poorly-built structure.',
            'Animals grumble about the wasted labor on the windmill.'
        ];
        
        const event = problemEvents[Math.floor(Math.random() * problemEvents.length)];
        gameState.addToLog(event);
        gameState.updateMetric('loyalty', -5);
        gameState.updateMetric('rations', -3);
    }
    
    // Trigger farmhouse revelation
    triggerFarmhouseRevelation() {
        const revelations = [
            'Through the window, you see the pigs feasting while the animals go hungry.',
            'Whiskey bottles litter the farmhouse floor.',
            'The pigs sleep in human beds, wrapped in human clothes.'
        ];
        
        const event = revelations[Math.floor(Math.random() * revelations.length)];
        gameState.addToLog(event);
        gameState.updateMetric('corruption', 5);
        gameState.updateMetric('loyalty', -10);
    }
    
    // Trigger random encounter
    triggerRandomEncounter(locationId) {
        const location = this.getLocation(locationId);
        if (!location || !location.characters) return;
        
        // Random character from location
        const charId = location.characters[Math.floor(Math.random() * location.characters.length)];
        
        // Start dialogue with character
        characterSystem.startDialogue(charId, 'location');
    }
    
    // Update location appearance based on season
    updateLocationAppearance(season) {
        // This would update visual aspects of locations based on season
        // For now, we'll just log it
        const seasonalEffects = {
            Spring: 'New growth appears around the farm.',
            Summer: 'The farm basks in sunlight.',
            Autumn: 'Leaves fall and the harvest is gathered.',
            Winter: 'Snow covers the farm, muffling all sounds.'
        };
        
        if (seasonalEffects[season]) {
            // gameState.addToLog(seasonalEffects[season]);
        }
    }
    
    // Handle metric change
    handleMetricChange(detail) {
        const { metric, value } = detail;
        
        // Update location accessibility based on metrics
        if (metric === 'security' || metric === 'corruption') {
            this.updateLocationRestrictions();
        }
    }
    
    // Update location restrictions
    updateLocationRestrictions() {
        const state = gameState.getState();
        
        // Farmhouse access requires high security or corruption
        if (state.security >= 50 || state.corruption >= 30) {
            this.locations.farmhouse.restricted = false;
        } else {
            this.locations.farmhouse.restricted = true;
        }
    }
    
    // Get available locations
    getAvailableLocations() {
        const available = [];
        const state = gameState.getState();
        
        Object.values(this.locations).forEach(location => {
            if (!location.restricted) {
                available.push(location);
            } else if (location.id === 'farmhouse') {
                // Special handling for farmhouse
                if (state.security >= 50 || state.corruption >= 30) {
                    available.push(location);
                }
            }
        });
        
        return available;
    }
    
    // Get location history
    getLocationHistory(limit = 10) {
        return this.locationHistory.slice(-limit);
    }
    
    // Generate location description
    generateLocationDescription(locationId) {
        const location = this.getLocation(locationId);
        if (!location) return '';
        
        const state = gameState.getState();
        let description = location.description;
        
        // Add seasonal details
        switch (state.season) {
            case 'Spring':
                description += ' Spring flowers bloom at the edges.';
                break;
            case 'Summer':
                description += ' The summer sun beats down.';
                break;
            case 'Autumn':
                description += ' Autumn leaves gather in corners.';
                break;
            case 'Winter':
                description += ' A layer of snow covers everything.';
                break;
        }
        
        // Add metric-based details
        if (state.loyalty < 30 && location.id === 'barn') {
            description += ' The animals gather here with sullen expressions.';
        }
        
        if (state.rations < 20 && location.id === 'fields') {
            description += ' The crops look sparse and sickly.';
        }
        
        if (state.corruption > 70 && location.id === 'farmhouse') {
            description += ' Laughter and the clink of glasses can be heard from inside.';
        }
        
        return description;
    }
    
    // Check for special location interactions
    checkSpecialInteractions(locationId) {
        const location = this.getLocation(locationId);
        if (!location || !location.special) return null;
        
        const state = gameState.getState();
        
        switch (location.special) {
            case 'commandments_view':
                // Return to narrative engine for special scene
                return {
                    type: 'scene',
                    sceneId: 'commandments_view',
                    condition: state.historicalTruth > 40
                };
        }
        
        return null;
    }
    
    // Get characters at location
    getCharactersAtLocation(locationId) {
        const location = this.getLocation(locationId);
        if (!location || !location.characters) return [];
        
        return location.characters.map(charId => 
            characterSystem.getCharacter(charId)
        ).filter(char => char !== null);
    }
    
    // Get events possible at location
    getPossibleEvents(locationId) {
        const location = this.getLocation(locationId);
        if (!location || !location.events) return [];
        
        const state = gameState.getState();
        const possibleEvents = [];
        
        location.events.forEach(eventType => {
            switch (eventType) {
                case 'meetings':
                    if (state.loyalty > 50) possibleEvents.push('Hold a meeting');
                    break;
                case 'trials':
                    if (state.security > 60) possibleEvents.push('Conduct a trial');
                    break;
                case 'construction':
                    if (!state.windmillBuilt) possibleEvents.push('Continue windmill construction');
                    break;
                case 'planting':
                    if (state.season === 'Spring') possibleEvents.push('Begin planting');
                    break;
                case 'harvest':
                    if (state.season === 'Autumn') possibleEvents.push('Begin harvest');
                    break;
            }
        });
        
        return possibleEvents;
    }
}

// Create global instance
const farmMap = new FarmMap();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FarmMap, farmMap };
}