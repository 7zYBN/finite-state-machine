class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error('Wrong config');
        }

        this.config = config;
        this.state = this.config.initial;
        this.undoState = null;
        this.redoState = null;
        this.history = [];
        
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!state || !(this.config.states.hasOwnProperty(state))) {
            throw new Error('Wrong state');
        }
        this.undoState = this.state;
        this.state = state;;
        this.history.push(this.changeState.name);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!event || !(this.config.states[this.state].transitions.hasOwnProperty(event))) {
            throw new Error('Wrong event');
        }
        const stateAccordingEvent = this.config.states[this.state].transitions[event];
        this.changeState(stateAccordingEvent);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
        this.undoState = null;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const arrayOfStates = [];
        if (event) {
            for (const key in this.config.states) {
                if (this.config.states[key].transitions.hasOwnProperty(event)) {
                    arrayOfStates.push(key);
                }
            }
            
            return arrayOfStates;
        }

        return Object.keys(this.config.states);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.undoState || this.state === this.undoState) {
            return false;
        }
        this.redoState = this.state;
        this.state = this.undoState;
        this.history.push(this.undo.name);
        
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.history.pop() !== this.undo.name || this.state === this.redoState) {
            return false;
        }
        this.state = this.redoState;
        this.history.push(this.redo.name);

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.undoState = null;
        this.redoState = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
