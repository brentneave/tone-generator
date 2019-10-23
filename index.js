class ToneGenerator {

    constructor() {

        // initialise vars
        this.hasRun = false;
        this.isRunning = false;
        this.frequency = 440;

        // set up the context
        if (!window.AudioContext || window.webkitAudioContext) throw new Error('Web audio API not supported');
        this.context = new(window.AudioContext || window.webkitAudioContext)();

        // set up the oscillator
        this.oscillator = this.context.createOscillator();
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(0, this.context.currentTime);

        // set up effects
        this.gainEffect = this.context.createGain();
        this.gainEffect.gain.setValueAtTime(1, this.context.currentTime);

        // set up the destination
        this.destination = this.context.destination;

        // connect
        this.oscillator.connect(this.gainEffect).connect(this.destination);
    }

    start() {
        // this.oscillator.connect(this.destination);
        if(!this.hasRun) {
            this.oscillator.start();
            this.hasRun = true;
        }
        this.gainEffect.gain.exponentialRampToValueAtTime(1, this.context.currentTime + 1);
        this.isRunning = true;
    }

    stop() {
        // this.oscillator.disconnect(this.destination);
        this.gainEffect.gain.setValueAtTime(0, this.context.currentTime);
        this.isRunning = false;
    }   

    toggle() {
        if (this.isRunning) {
            this.stop()
        } else {
            this.start();
        }
    }

    setFrequency(f) {
        this.oscillator.frequency.setValueAtTime(f, this.context.currentTime);
    }
}

const generator = new ToneGenerator();
generator.setFrequency(440);

const frequencyRangeInput = document.querySelector("#frequency-range-input");
frequencyRangeInput.oninput = ({ value }) => {
    generator.setFrequency(parseFloat(frequencyRangeInput.value));
    updateUI();
}


const frequencyTextInput = document.querySelector("#frequency-number-input");
frequencyTextInput.oninput = ({ value }) => {
    generator.setFrequency(parseFloat(frequencyTextInput.value));
    updateUI();
}

const startButton = document.querySelector("#start-button");
startButton.onclick = () => {
    generator.toggle()
    updateUI();
}

const updateUI = () => {
    if(document.activeElement !== frequencyTextInput) {
        frequencyTextInput.value = generator.oscillator.frequency.value;
    }
    frequencyRangeInput.value = generator.oscillator.frequency.value;
    startButton.textContent = generator.isRunning ? 'Stop' : 'Start';
}

updateUI();
