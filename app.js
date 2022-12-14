let keysArray = [
  {
    keyBind: 'a',
    soundName: 'clap',
    soundSrc: 'assets/sounds/clap.wav',
  },
  {
    keyBind: 's',
    soundName: 'hihat',
    soundSrc: 'assets/sounds/hihat.wav',
  },
  {
    keyBind: 'd',
    soundName: 'kick',
    soundSrc: 'assets/sounds/kick.wav',
  },
  {
    keyBind: 'f',
    soundName: 'openhat',
    soundSrc: 'assets/sounds/openhat.wav',
  },
  {
    keyBind: 'g',
    soundName: 'boom',
    soundSrc: 'assets/sounds/boom.wav',
  },
  {
    keyBind: 'h',
    soundName: 'ride',
    soundSrc: 'assets/sounds/ride.wav',
  },
  {
    keyBind: 'j',
    soundName: 'snare',
    soundSrc: 'assets/sounds/snare.wav',
  },
  {
    keyBind: 'k',
    soundName: 'tom',
    soundSrc: 'assets/sounds/tom.wav',
  },
  {
    keyBind: 'l',
    soundName: 'tink',
    soundSrc: 'assets/sounds/tink.wav',
  },
  {
    keyBind: 'p',
    soundName: 'cowbell',
    soundSrc: 'https://d9olupt5igjta.cloudfront.net/samples/sample_files/68698/8d9c078a6497811bab1126448f956fceea3c618f/mp3/_X-808CB2.mp3?1617246270',
  },
];

class ModalWindow {
  constructor(windowTypeStyleName, windowTitle, innerEl, okButtonEl) {
    const modalWindowOverlayEl = document.createElement('div');
    modalWindowOverlayEl.classList.add('modal-window__overlay');

    const modalWindowTitleEl = document.createElement('div');
    modalWindowTitleEl.classList.add('modal-window__title');
    modalWindowTitleEl.innerText = windowTitle;

    const modalEl = document.createElement('div');
    modalEl.classList.add('modal-window');
    modalEl.classList.add(windowTypeStyleName);

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('modal-window__button');
    buttonCancel.classList.add('modal-window__button_cancel');
    buttonCancel.innerText = 'x';

    buttonCancel.onclick = () => {
      modalWindowOverlayEl.remove();
    };

    okButtonEl.addEventListener('click', () => modalWindowOverlayEl.remove());

    modalEl.append(modalWindowTitleEl);
    modalEl.append(innerEl);
    modalEl.append(okButtonEl);
    modalEl.append(buttonCancel);

    modalWindowOverlayEl.append(modalEl);
    document.body.appendChild(modalWindowOverlayEl);
  }
}

class DrumKit {
  drumKitKeys = [];
  audioTracksMinPalyTime = 0.001;
  keysArray = null;

  drumKitContainer = null;

  constructor(keysArray) {
    this.createKeys(keysArray);
    this.keysArray = keysArray;
  }

  createKeys(arrayOfKeys) {
    if (!this.drumKitContainer) {
      this.drumKitContainer = document.createElement('div');
      this.drumKitContainer.className = 'drum-kit-key-container';
      document.getElementsByTagName('main')[0].append(this.drumKitContainer);
    }

    arrayOfKeys.forEach((el) => {
      let insertKey = document.createElement('div');
      let keyName = document.createElement('h2');
      keyName.innerText = el.keyBind;
      let soundName = document.createElement('span');
      soundName.innerText = el.soundName;
      insertKey.append(keyName);
      insertKey.append(soundName);
      insertKey.className = 'drum-kit__key';

      insertKey.addEventListener('click', () => {
        let drumKitKey = this.drumKitKeys.find((key) => key.keyBind === el.keyBind);
        drumKitKey.audioTrack.currentTime = 0;

        drumKitKey.audioTrack.play();
        drumKitKey.keyEl.classList.add('keydown');
        setTimeout(() => drumKitKey.keyEl.classList.remove('keydown'), 100);
      });

      document.addEventListener('keydown', (e) => {
        if (e.code === 'Key' + el.keyBind.toUpperCase()) {
          this.drumKitKeys.find((key) => 'Key' + key.keyBind.toUpperCase() === e.code).keyEl.click();
        }
      });

      this.drumKitKeys.push({keyBind: el.keyBind, soundName: el.soundName, keyEl: insertKey, audioTrack: new Audio(el.soundSrc)});
      this.drumKitContainer.append(insertKey);
    });
  }

  deleteKeyBySoundName(soundName) {
    this.drumKitKeys.find((el) => el.soundName === soundName).keyEl.remove();
    this.drumKitKeys = this.drumKitKeys.filter((el) => el.soundName !== soundName);
  }

  export() {
    return this.keysArray;
  }

  deleteAll() {
    this.drumKitKeys.forEach((el) => this.deleteKeyBySoundName(el.soundName));
  }
}

class DrumKitInstrumentPads {
  colorActive = '#e74c3c';
  isPlaying = false;
  instrumentName = null;
  instrumentPads = [];
  drumKitInstrumentsContainer = null;
  instrumentContainer = null;
  instrumentContainerPads = null;
  volInput = null;

  instrumentTimer = null;

  constructor(instrumentName, size, volume) {
    this.instrumentName = instrumentName;
    this.SQUARES = size;
    this.drumKitInstrumentsContainer = document.getElementsByClassName('drum-kit-rhythm-container')[0];
    console.log(!this.drumKitInstrumentsContainer);
    if (!this.drumKitInstrumentsContainer) {
      this.drumKitInstrumentsContainer = document.createElement('div');
      this.drumKitInstrumentsContainer.className = 'drum-kit-rhythm-container';
      document.getElementsByTagName('main')[0].append(this.drumKitInstrumentsContainer);
    }

    this.instrumentContainer = document.createElement('div');
    this.instrumentContainer.className = 'drum-kit-rhythm-instrument-container';

    this.volInput = document.createElement('input');
    this.volInput.value = volume;
    this.volInput.type = 'range';
    this.volInput.min = '0';
    this.volInput.max = '1';
    this.volInput.step = '0.01';

    this.instrumentContainer.appendChild(this.volInput);
    const instrumentNameEl = document.createElement('span');
    instrumentNameEl.textContent = this.instrumentName;
    this.instrumentContainer.appendChild(instrumentNameEl);

    this.addPads(size);
  }

  addPads(numberOfPads) {
    if (!this.instrumentContainerPads) {
      this.instrumentContainerPads = document.createElement('div');
      this.instrumentContainerPads.className = 'instrument-pads-container';
    }

    let padsNumber = this.instrumentPads.length;

    for (let i = padsNumber; i < padsNumber + numberOfPads; i++) {
      const square = document.createElement('div');
      square.classList.add('drum-kit-rhythm__pad');

      if ((i + 8) % 8 > 3) {
        square.classList.add('pad_black');
      } else {
        square.classList.add('pad_gray');
      }

      this.instrumentPads.push({id: i, state: false, padEl: square});

      square.addEventListener('click', () => this.switchState(i));

      this.instrumentContainerPads.appendChild(square);
    }
    this.instrumentContainer.appendChild(this.instrumentContainerPads);
    this.drumKitInstrumentsContainer.append(this.instrumentContainer);
  }

  removePads(numberOfPads) {
    if (numberOfPads > 0 && this.instrumentPads !== null && this.instrumentPads.length >= numberOfPads) {
      let padToRemove = this.instrumentPads.slice(this.instrumentPads.length - numberOfPads, this.instrumentPads.length);
      padToRemove.forEach((el) => el.padEl.remove());
      this.instrumentPads = this.instrumentPads.slice(0, this.instrumentPads.length - numberOfPads);
    }
  }

  remove() {
    this.isPlaying = false;
    clearInterval(this.instrumentTimer);
    this.instrumentTimer = null;
    this.instrumentContainer.remove();
  }

  switchState(padId) {
    let padObj = this.instrumentPads.find((el) => el.id === padId);
    if (!padObj.state) {
      padObj.padEl.classList.remove('pad_black');
      padObj.padEl.classList.add('pad_red');
    } else {
      padObj.padEl.classList.remove('pad_red');
      padObj.padEl.classList.add('pad_black');
    }
    padObj.state = !padObj.state;
  }

  play(interval) {
    this.isPlaying = !this.isPlaying;
    let lastPlayedPadId = 0;
    if (this.instrumentTimer == null) {
      this.instrumentTimer = setInterval(() => {
        if (this.isPlaying === false) {
          clearInterval(this.instrumentTimer);
          this.instrumentTimer = null;
          return;
        }

        if (lastPlayedPadId >= this.instrumentPads.length) {
          lastPlayedPadId = 0;
        }

        let lastPadEl = this.instrumentPads.find((el) => el.id === lastPlayedPadId);
        lastPadEl.padEl.classList.add('pad_current-playing');
        setTimeout(() => lastPadEl.padEl.classList.remove('pad_current-playing'), interval);

        if (this.instrumentPads.find((el) => el.id === lastPlayedPadId).state) {
          let drumKitObj = drumKit.drumKitKeys.find((el) => el.soundName === this.instrumentName);
          drumKitObj.audioTrack.volume = this.volInput.value;
          drumKitObj.keyEl.click();
        }
        lastPlayedPadId++;
      }, interval);
    }
  }

  export() {
    let out = {instrumentName: this.instrumentName, valueLevel: this.volInput.value, pads: []};
    this.instrumentPads.forEach((el) => out.pads.push({id: el.id, state: el.state}));
    return out;
  }
}

class DrumKitRhythm {
  instruments = [];
  bpmInput = null;
  size = 0;
  drumKit = null;
  selectAddInstrument = null;

  constructor(instrumentsArray, size) {
    this.drumKit = new DrumKit(instrumentsArray);

    this.size = size;

    this.instrumentsArray = instrumentsArray;

    this.bpmInput = document.createElement('input');
    this.bpmInput.value = 120;

    document.getElementsByTagName('main')[0].appendChild(this.bpmInput);

    const btnPaly = document.createElement('button');
    btnPaly.textContent = 'play';
    btnPaly.addEventListener('click', () => this.playAll());
    document.getElementsByTagName('main')[0].appendChild(btnPaly);

    const btnAddPads = document.createElement('button');
    btnAddPads.textContent = 'add 8 pads';
    btnAddPads.addEventListener('click', () => this.addPads(8));
    document.getElementsByTagName('main')[0].appendChild(btnAddPads);

    const btnRemovePads = document.createElement('button');
    btnRemovePads.textContent = 'delete 8 pads';
    btnRemovePads.addEventListener('click', () => this.removePads(8));
    document.getElementsByTagName('main')[0].appendChild(btnRemovePads);

    this.updateInstrumentSelectList();

    const btnAddInstrument = document.createElement('button');
    btnAddInstrument.textContent = 'add instrument';
    btnAddInstrument.addEventListener('click', () => this.addInstrument(this.selectAddInstrument.options[this.selectAddInstrument.selectedIndex].value, 1));
    document.getElementsByTagName('main')[0].appendChild(btnAddInstrument);
  }

  updateInstrumentSelectList() {
    if (!this.selectAddInstrument) {
      this.selectAddInstrument = document.createElement('select');
      document.getElementsByTagName('main')[0].appendChild(this.selectAddInstrument);
    } else {
      this.selectAddInstrument.innerText = '';
    }

    this.drumKit.drumKitKeys.forEach((el) => {
      let option = document.createElement('option');
      option.value = option.text = el.soundName;
      this.selectAddInstrument.add(option);
    });
  }

  addPads(numberOfPads) {
    this.size += numberOfPads;
    this.instruments.forEach((el) => {
      el.isPlaying = false;
      el.addPads(numberOfPads);
    });
  }

  deleteKeyBySoundName(instrumentName) {
    this.drumKit.deleteKeyBySoundName(instrumentName);
    this.updateInstrumentSelectList();
    this.deleteInstrumentBySoundName(instrumentName);
  }

  removePads(numberOfPads) {
    if (this.size > numberOfPads) {
      this.size -= numberOfPads;
      this.instruments.forEach((el) => {
        el.removePads(numberOfPads);
        el.isPlaying = false;
      });
    }
  }

  playAll() {
    this.instruments.forEach((el) => el.play(1000 / (this.bpmInput.value / 60) / 4));
  }

  addInstrument(instrumentName, volume) {
    if (!this.instruments.find((el) => el.instrumentName === instrumentName)) {
      this.instruments.push(new DrumKitInstrumentPads(instrumentName, this.size, volume));
    }
  }

  deleteInstrumentBySoundName(instrumentName) {
    this.instruments.find((el) => el.instrumentName === instrumentName).remove();
    this.instruments = this.instruments.filter((el) => el.instrumentName !== instrumentName);
  }

  export() {
    let out = {padsConfig: this.drumKit.export(), instrumentsPads: []};
    drumKitRhythm.instruments.forEach((el) => out.instrumentsPads.push(el.export()));
    return out;
  }

  saveAsFile(fileName) {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(drumKitRhythm.export())], {type: 'text/plain'});

    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(a.href);
  }

  importFromJsonString(jsonString) {
    const importObj = JSON.parse(jsonString);
    this.drumKit.deleteAll();
    this.drumKit = new DrumKit(importObj.padsConfig);

    if (importObj.instrumentsPads.length > 0) {
      importObj.instrumentsPads.forEach((el) => {
        this.addInstrument(el.soundName, el.value);
        this.size = el.pads;
        if (el.pads.length > 0) {
          let instr = this.instruments.find((instr) => instr.instrumentName === el.soundName);
          instr.addPads(el.pads.length);
          console.log(el);
          el.pads.forEach((pad) => (pad.state ? instr.switchState() : flase));
        }
      });
    }
    importObj.instrumentsPads.forEach();
  }
}

class SequenceStep {
  state = null;
  id = null;
  //
  nodeEl = null;

  constructor(id, state = false) {
    this.state = Boolean(state);
    this.id = id;
    this.nodeEl = document.createElement('div');
    this.nodeEl.className = 'sequence-step';
    this.setState(this.state);

    this.nodeEl.addEventListener('click', () => {
      this.switchState();
    });

    if ((this.id + 8) % 8 > 3) {
      this.nodeEl.classList.add('sequence-step_black');
    } else {
      this.nodeEl.classList.add('sequence-step_gray');
    }
  }

  switchState() {
    this.state = !this.state;
    this.nodeEl.classList.toggle('sequence-step_active');
  }

  setState(state) {
    this.state = state;
    if (this.state) {
      this.nodeEl.classList.add('sequence-step_active');
    } else {
      this.nodeEl.classList.remove('sequence-step_active');
    }
  }

  setPlayingState(state) {
    if (state) {
      this.nodeEl.classList.add('sequence-step_current-playing');
    } else {
      this.nodeEl.classList.remove('sequence-step_current-playing');
    }
  }

  getNodeEl() {
    return this.nodeEl;
  }

  remove() {
    this.nodeEl.remove();
  }

  export() {
    return {state: this.state, id: this.id};
  }
}

class ChannelSequence {
  channelName = null;
  sequenceSteps = [];
  stepsNumber = 0;

  nodeEl = null;

  constructor(channelName, stepsNumber = 0, sequenceSteps = null) {
    this.nodeEl = document.createElement('div');
    this.nodeEl.className = 'channel-sequence';

    this.channelName = channelName;
    if (stepsNumber > 0 && !sequenceSteps) {
      this.addSteps(stepsNumber);
    } else if (sequenceSteps && sequenceSteps.length > 0) {
      sequenceSteps.forEach((el) => {
        let step = new SequenceStep(el.id, el.state);
        this.nodeEl.appendChild(step.getNodeEl());
        this.sequenceSteps.push();
        this.stepsNumber++;
      });
    }
  }

  getNodeEl() {
    return this.nodeEl;
  }

  addSteps(numberOfSteps) {
    for (let stepNumber = this.stepsNumber; stepNumber < this.stepsNumber + numberOfSteps; stepNumber++) {
      let step = new SequenceStep(stepNumber);
      this.sequenceSteps.push(step);
      this.nodeEl.appendChild(step.getNodeEl());
    }
    this.stepsNumber += numberOfSteps;
  }

  getStepById(id) {
    return this.sequenceSteps.find((sequenceStep) => sequenceStep.id === id);
  }

  switchStateEvery(N) {
    this.sequenceSteps.forEach((sequenceStep) => {
      if (sequenceStep.id % N) {
        sequenceStep.setState(false);
      } else {
        sequenceStep.setState(true);
      }
    });
  }

  removeSteps(numberOfSteps) {
    let sequenceStepsToRemove = this.sequenceSteps.slice(this.stepsNumber - numberOfSteps, this.stepsNumber);
    sequenceStepsToRemove.forEach((el) => el.remove());
    this.sequenceSteps = this.sequenceSteps.slice(0, this.stepsNumber - numberOfSteps);
    this.stepsNumber -= numberOfSteps;
  }

  remove() {
    this.sequenceSteps.forEach((sequenceStep) => sequenceStep.remove());
    this.nodeEl.remove();
    this.sequenceSteps = null;
  }

  export() {
    let sequenceStepsArray = this.sequenceSteps.map((el) => el.export());
    return {channelName: this.channelName, sequenceSteps: sequenceStepsArray, stepsNumber: this.stepsNumber};
  }
}

class SequencerPattern {
  channelSequences = [];
  patternName = null;
  stepsNumber = null;
  //
  nodeEl = null;

  constructor(patternName, stepsNumber) {
    this.nodeEl = document.createElement('div');
    this.nodeEl.className = 'sequencer-pattern';

    this.patternName = patternName;
    this.stepsNumber = stepsNumber;
  }

  addChannelSequence(channelName) {
    let newChannelSequence = new ChannelSequence(channelName, this.stepsNumber);
    this.nodeEl.appendChild(newChannelSequence.getNodeEl());
    this.channelSequences.push(newChannelSequence);
    return newChannelSequence;
  }

  getChannelSequence(channelName) {
    return this.channelSequences.find((channelSequence) => channelSequence.channelName === channelName);
  }

  addSequenceSteps(numberOfSteps) {
    this.channelSequences.forEach((channelSequence) => channelSequence.addSteps(numberOfSteps));
    this.stepsNumber += numberOfSteps;
    return this.channelSequences;
  }

  removeSequenceSteps(numberOfSteps) {
    if (numberOfSteps > 0 && this.stepsNumber !== null && this.stepsNumber >= numberOfSteps) {
      this.channelSequences.forEach((channelSequence) => channelSequence.removeSteps(numberOfSteps));
      this.stepsNumber -= numberOfSteps;
    }

    return this.channelSequences;
  }

  removeChannelSequence(channelName) {
    this.getChannelSequence(channelName).remove();
    this.channelSequences = this.channelSequences.filter((channelSequence) => channelSequence.channelName !== channelName);
  }

  getNodeEl() {
    return this.nodeEl;
  }

  export() {
    let channelSequencesArray = this.channelSequences.map((el) => el.export());
    return {channelSequences: channelSequencesArray, patternName: this.patternName, stepsNumber: this.stepsNumber};
  }
}

class Channel {
  volume = null;
  name = null;
  soundSrc = null;
  audioTrack = null;
  isMuted = null;

  //
  nodeEl = null;
  volumeSliderEl = null;
  isMutedEl = null;

  constructor(name, soundSrc, volume) {
    this.volume = volume;
    this.name = name;
    this.soundSrc = soundSrc;
    this.audioTrack = new Audio(this.soundSrc);
    this.isMuted = false;

    this.nodeEl = document.createElement('div');
    this.nodeEl.className = 'channel';

    let nameEl = document.createElement('div');
    nameEl.className = 'channel__name';
    nameEl.innerText = this.name;

    this.isMutedEl = document.createElement('input');
    this.isMutedEl.type = 'checkbox';
    this.isMutedEl.className = 'channel__volume-mute';
    this.isMutedEl.checked = false;
    this.isMutedEl.oninput = () => {
      this.setMute(this.isMutedEl.checked);
    };

    this.volumeSliderEl = document.createElement('input');
    this.volumeSliderEl.className = 'channel__volume-slider';
    this.volumeSliderEl.value = this.volume * 100;
    this.volumeSliderEl.type = 'range';
    this.volumeSliderEl.min = '0';
    this.volumeSliderEl.max = '100';
    this.volumeSliderEl.step = '1';
    this.volumeSliderEl.oninput = () => {
      this.setVolume(this.volumeSliderEl.value / 100);
    };

    this.nodeEl.appendChild(nameEl);
    this.nodeEl.appendChild(this.volumeSliderEl);
    this.nodeEl.appendChild(this.isMutedEl);
  }

  setMute(state) {
    this.isMuted = state;
    return state;
  }

  setVolume(volume) {
    this.volume = volume;
    this.volumeSliderEl.value = this.volume * 100;
    return true;
  }

  playSound() {
    if (!this.isMuted) {
      this.audioTrack.currentTime = 0;
      this.audioTrack.volume = this.volume;
      this.audioTrack.play();
    }
  }

  stopSound() {
    this.audioTrack.pause();
    this.audioTrack.currentTime = 0;
  }

  getNodeEl() {
    return this.nodeEl;
  }

  remove() {
    this.nodeEl.remove();
  }

  export() {
    return {volume: this.volume, name: this.name, soundSrc: this.soundSrc};
  }
}

class StepSequencer {
  channels = [];
  sequencerPatterns = [];
  isPlaying = null;
  currentSelectedPatternName = null;
  bpm = 120;
  timer = null;
  lastPlayedStep = 0;

  nodeEl = null;

  channelsEl = null;
  patternEl = null;
  bodyEl = null;
  controlsEl = null;

  bpmInput = null;

  constructor() {
    this.controlsEl = document.createElement('div');
    this.controlsEl.className = 'sequencer-controls';

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'sequencer-body';

    this.channelsEl = document.createElement('div');
    this.channelsEl.className = 'channels';

    this.nodeEl = document.createElement('div');
    this.nodeEl.className = 'step-sequencer';

    this.createControls();
  }

  createControls() {
    this.bpmInput = document.createElement('input');
    this.bpmInput.value = this.bpm;

    this.bpmInput.classList.add('sequencer-controls__bpm-input');

    this.controlsEl.appendChild(this.bpmInput);

    const btnPaly = document.createElement('button');
    btnPaly.classList.add('sequencer-controls__button');
    btnPaly.classList.add('sequencer-controls__button-play');
    btnPaly.classList.add('sequencer-controls__button-play_play');
    btnPaly.textContent = 'play';
    btnPaly.addEventListener('click', () => {
      this.play();
      this.setBPM(this.bpmInput.value);
      btnPaly.classList.toggle('sequencer-controls__button-play_pause');
      btnPaly.classList.toggle('sequencer-controls__button-play_play');
    });
    this.controlsEl.appendChild(btnPaly);

    const btnAddSteps = document.createElement('button');
    btnAddSteps.classList.add('sequencer-controls__button');
    btnAddSteps.classList.add('sequencer-controls__button-add-steps');
    btnAddSteps.textContent = 'add 8 steps';
    btnAddSteps.addEventListener('click', () => this.getCurrentSequencerPattern().addSequenceSteps(8));
    this.controlsEl.appendChild(btnAddSteps);

    const btnRemoveSteps = document.createElement('button');
    btnRemoveSteps.classList.add('sequencer-controls__button');
    btnRemoveSteps.classList.add('sequencer-controls__button-remove-steps');
    btnRemoveSteps.textContent = 'remove 8 steps';
    btnRemoveSteps.addEventListener('click', () => this.getCurrentSequencerPattern().removeSequenceSteps(8));
    this.controlsEl.appendChild(btnRemoveSteps);

    const btnAddChannel = document.createElement('button');
    btnAddChannel.classList.add('sequencer-controls__button');
    btnAddChannel.classList.add('sequencer-controls__button-add-channel');
    btnAddChannel.textContent = 'Add channel';
    btnAddChannel.addEventListener('click', () => this.showAddNewInstrument());
    this.controlsEl.appendChild(btnAddChannel);
  }

  addChannel(name, soundSrc, volume) {
    if (!this.getChannel(name)) {
      let newChannel = new Channel(name, soundSrc, volume);
      this.channels.push(newChannel);
      this.channelsEl.appendChild(newChannel.getNodeEl());

      const btnRemoveChannel = document.createElement('button');
      btnRemoveChannel.classList.add('sequencer-controls__button-remove-channel');
      btnRemoveChannel.textContent = 'x';
      btnRemoveChannel.addEventListener('click', () => this.removeChannelByName(name));
      newChannel.getNodeEl().appendChild(btnRemoveChannel);

      if (this.getCurrentSequencerPattern()) {
        this.getCurrentSequencerPattern().addChannelSequence(name);
      }
      return newChannel;
    }
  }

  addSequencerPattern(patternName, stepsNumber) {
    let newSequencerPattern = new SequencerPattern(patternName, stepsNumber);
    this.channels.forEach((channel) => newSequencerPattern.addChannelSequence(channel.name));
    this.sequencerPatterns.push(newSequencerPattern);
    this.switchCurrentPattern(newSequencerPattern.patternName);
    return newSequencerPattern;
  }

  switchCurrentPattern(patternName) {
    let pattern = this.getSequencerPattern(patternName);
    if (pattern) {
      this.currentSelectedPatternName = patternName;

      this.patternEl = pattern.getNodeEl();
      this.draw();
    }
    return pattern;
  }

  draw() {
    this.nodeEl.innerHTML = '';
    this.bodyEl.innerHTML = '';
    this.bodyEl.appendChild(this.channelsEl);
    this.bodyEl.appendChild(this.patternEl);

    this.nodeEl.appendChild(this.controlsEl);
    this.nodeEl.appendChild(this.bodyEl);
  }

  removeChannelByName(name) {
    let channelToRemove = this.channels.find((channel) => channel.name === name);
    if (channelToRemove) {
      channelToRemove.remove();
      this.sequencerPatterns.forEach((sequencerPattern) => {
        sequencerPattern.removeChannelSequence(name);
      });
      this.channels = this.channels.filter((channel) => channel.name !== name);
      return true;
    }
    return false;
  }

  removeSequencerPatternByName(name) {
    let sequencerPatternToRemove = this.channels.find((sequencerPattern) => sequencerPattern.name === name);
    if (sequencerPatternToRemove) {
      console.log(sequencerPatternToRemove);
      sequencerPatternToRemove.remove();
      this.sequencerPatterns = this.sequencerPatterns.filter((sequencerPattern) => sequencerPattern.name !== name);
      return true;
    }
    return false;
  }

  getSequencerPattern(patternName) {
    return this.sequencerPatterns.find((sequencerPattern) => sequencerPattern.patternName === patternName);
  }

  getChannel(name) {
    return this.channels.find((channel) => channel.name === name);
  }

  getCurrentSequencerPattern() {
    return this.sequencerPatterns.find((sequencerPattern) => sequencerPattern.patternName === this.currentSelectedPatternName);
  }

  showAddNewInstrument() {
    const modalContentEl = document.createElement('div');
    modalContentEl.classList.add('modal-content');
    modalContentEl.classList.add('modal-content_add-instrument');

    const nameInputGroup = document.createElement('div');
    nameInputGroup.classList.add('modal-content__input-group');

    const nameInputLabel = document.createElement('label');
    nameInputLabel.innerText = 'Input unique channel name';
    nameInputLabel.classList.add('modal-content__input-label');

    const nameInput = document.createElement('input');
    nameInput.classList.add('modal-content__input');
    nameInput.placeholder = 'Unique channel name';

    nameInputGroup.append(nameInputLabel);
    nameInputGroup.append(nameInput);

    const srcLinkInputGroup = document.createElement('div');
    srcLinkInputGroup.classList.add('modal-content__input-group');

    const srcLinkInputLabel = document.createElement('label');
    srcLinkInputLabel.innerText = 'Input http or https full link for mp3';
    srcLinkInputLabel.classList.add('modal-content__input-label');

    const srcLinkInput = document.createElement('input');
    srcLinkInput.classList.add('modal-content__input');
    srcLinkInput.placeholder = 'http or https full link for mp3';

    const buttonAdd = document.createElement('button');
    buttonAdd.classList.add('modal-window__button');
    buttonAdd.classList.add('modal-window__button_add');
    buttonAdd.innerText = 'Add channel';

    buttonAdd.onclick = () => {
      this.addChannel(nameInput.value, srcLinkInput.value, 1);
    };

    srcLinkInputGroup.append(srcLinkInputLabel);
    srcLinkInputGroup.append(srcLinkInput);

    modalContentEl.appendChild(nameInputGroup);
    modalContentEl.appendChild(srcLinkInputGroup);

    new ModalWindow('modal-window_add-instrument', 'Add new instrument', modalContentEl, buttonAdd);
  }

  play() {
    this.isPlaying = !this.isPlaying;

    this.lastPlayedStep = 0;
    if (this.timer == null) {
      this.timer = setInterval(() => {
        if (this.isPlaying === false) {
          clearInterval(this.timer);
          this.timer = null;

          this.channels.forEach((channel) => {
            channel.stopSound();
          });

          return;
        }
        if (this.lastPlayedStep >= this.getCurrentSequencerPattern().stepsNumber) {
          this.lastPlayedStep = 0;
        }

        this.channels.forEach((channel) => {
          let currentChannelStep = this.getCurrentSequencerPattern().getChannelSequence(channel.name).getStepById(this.lastPlayedStep);
          currentChannelStep.setPlayingState(true);
          setTimeout(() => currentChannelStep.setPlayingState(false), 1000 / (this.bpm / 60) / 4);
          if (currentChannelStep.state) {
            channel.playSound();
          }
        });

        this.lastPlayedStep++;
        let widthEl = this.getCurrentSequencerPattern().getNodeEl().getBoundingClientRect().width;
        if (Math.ceil(widthEl / 20 / 2) < this.lastPlayedStep) {
          this.getCurrentSequencerPattern().getNodeEl().scrollLeft = 20 * (this.lastPlayedStep - Math.ceil(widthEl / 20 / 2));
        }
        if (this.lastPlayedStep === 1) {
          this.getCurrentSequencerPattern().getNodeEl().scrollLeft = 0;
        }
      }, 1000 / (this.bpm / 60) / 4);
    }
  }

  setBPM(bpm) {
    this.bpmInput.value = bpm;
    this.bpm = bpm;
  }

  getNodeEl() {
    return this.nodeEl;
  }

  export() {
    let channelsArray = this.channels.map((el) => el.export());
    let sequencerPatternsArray = this.sequencerPatterns.map((el) => el.export());
    return {channels: channelsArray, sequencerPatterns: sequencerPatternsArray, bpm: this.bpm};
  }

  remove() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.channels.forEach((channel) => {
      channel.stopSound();
    });
    this.channels = null;
    this.sequencerPatterns = null;
  }
}

class DrumPad {
  //???
  export() {}
}

class DigitalAudioWorkstation {
  drumPad = null;
  stepSequencer = null;
  //
  nodeEl = null;
  controlsEl = null;

  constructor() {
    this.stepSequencer = new StepSequencer();
    this.drumPad = new DrumPad();

    //!HARDCODE>
    keysArray.forEach((el) => this.stepSequencer.addChannel(el.soundName, el.soundSrc, 1));

    // this.stepSequencer.addChannel(
    //   "cowbell",
    //   "https://d9olupt5igjta.cloudfront.net/samples/sample_files/68698/8d9c078a6497811bab1126448f956fceea3c618f/mp3/_X-808CB2.mp3?1617246270",
    //   1
    // );
    // this.stepSequencer.addChannel(
    //   "kick",
    //   "https://d9olupt5igjta.cloudfront.net/samples/sample_files/85486/7e678db81002e109d836d4c89a200ed1c6e0cf1f/mp3/_IqBu__Kick_6_-_A.mp3?1629308763",
    //   1
    // );
    this.stepSequencer.addSequencerPattern('1', 16);
    this.stepSequencer.currentSelectedPatternName = '1';
    // this.stepSequencer.getCurrentSequencerPattern().getChannelSequence("cowbell").switchStateEvry(2);
    // this.stepSequencer.getCurrentSequencerPattern().getChannelSequence("kick").switchStateEvry(8);
    //console.log(this.stepSequencer);
    //!HARDCODE<

    this.nodeEl = document.createElement('div');
    this.nodeEl.className = 'daw-container';

    this.controlsEl = document.createElement('div');
    this.controlsEl.className = 'daw-controls';

    this.createControls();

    document.getElementsByTagName('main')[0].append(this.nodeEl);
    this.render();
  }

  createControls() {
    const btnSaveFile = document.createElement('button');
    btnSaveFile.classList.add('daw-controls__button');
    btnSaveFile.textContent = 'Save File';
    btnSaveFile.addEventListener('click', () => {
      this.showSaveFile();
    });
    this.controlsEl.appendChild(btnSaveFile);

    const btnImportFile = document.createElement('button');
    btnImportFile.classList.add('daw-controls__button');
    btnImportFile.textContent = 'Import File';
    btnImportFile.addEventListener('click', () => {
      this.showImportFile();
    });

    this.controlsEl.appendChild(btnImportFile);

    // const btnAddSteps = document.createElement("button");
    // btnAddSteps.classList.add("sequencer-controls__button-add-steps");
    // btnAddSteps.textContent = "add 8 steps";
    // btnAddSteps.addEventListener("click", () => this.getCurrentSequencerPattern().addSequenceSteps(8));
    // this.controlsEl.appendChild(btnAddSteps);

    // const btnRemoveSteps = document.createElement("button");
    // btnRemoveSteps.classList.add("sequencer-controls__button-remove-steps");
    // btnRemoveSteps.textContent = "remove 8 steps";
    // btnRemoveSteps.addEventListener("click", () => this.getCurrentSequencerPattern().removeSequenceSteps(8));
    // this.controlsEl.appendChild(btnRemoveSteps);

    // const btnAddChannel = document.createElement("button");
    // btnAddChannel.classList.add("sequencer-controls__button-add-channel");
    // btnAddChannel.textContent = "add channel";
    // btnAddChannel.addEventListener("click", () => this.showAddNewInstrument());
    // this.controlsEl.appendChild(btnAddChannel);
  }

  export() {
    return {drumPad: this.drumPad.export(), stepSequencer: this.stepSequencer.export()};
  }

  getNodeEl() {
    return this.nodeEl;
  }

  render() {
    this.nodeEl.innerHTML = '';
    this.nodeEl.appendChild(this.controlsEl);
    this.nodeEl.appendChild(this.stepSequencer.getNodeEl());
  }

  importFromJsonString(jsonString) {
    const importObj = JSON.parse(jsonString);
    this.stepSequencer.remove();
    this.stepSequencer = new StepSequencer();
    this.drumPad = new DrumPad();

    this.stepSequencer.setBPM(importObj.stepSequencer.bpm);

    if (importObj.stepSequencer.channels.length > 0) {
      importObj.stepSequencer.channels.forEach((channel) => this.stepSequencer.addChannel(channel.name, channel.soundSrc, channel.volume));
      if (importObj.stepSequencer.sequencerPatterns.length > 0) {
        importObj.stepSequencer.sequencerPatterns.forEach((sequencerPattern) => {
          let newSequencerPattern = this.stepSequencer.addSequencerPattern(sequencerPattern.patternName, sequencerPattern.stepsNumber);
          sequencerPattern.channelSequences.forEach((channelSequences) => {
            channelSequences.sequenceSteps.forEach((step) => newSequencerPattern.getChannelSequence(channelSequences.channelName).getStepById(step.id).setState(step.state));
          });
        });
        this.stepSequencer.switchCurrentPattern(this.stepSequencer.sequencerPatterns[0].patternName);
      }
    }
    this.render();
  }

  loadFileFromUrl(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = () => {
      var status = xhr.status;
      if (status === 200) {
        this.importFromJsonString(xhr.response);
        return true;
      } else {
        return false;
      }
    };
    xhr.send();
  }

  saveFile(fileName) {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(this.export())], {type: 'text/plain'});

    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(a.href);
  }

  showSaveFile() {
    const modalContentEl = document.createElement('div');
    modalContentEl.classList.add('modal-content');
    modalContentEl.classList.add('modal-content_save-file');

    const saveFileGroup = document.createElement('div');
    saveFileGroup.classList.add('modal-content__input-group');

    const saveFileLabel = document.createElement('label');
    saveFileLabel.innerText = 'Save project to JSON file';
    saveFileLabel.classList.add('modal-content__input-label');

    const nameInput = document.createElement('input');
    nameInput.classList.add('modal-content__input');
    nameInput.placeholder = 'Unique file name';
    const date = new Date();
    const dateString = date.toISOString().split('.')[0];
    nameInput.value = `${dateString}_save.json`;

    const buttonSave = document.createElement('button');
    buttonSave.classList.add('modal-window__button');
    buttonSave.classList.add('modal-window__button_save');
    buttonSave.innerText = 'Save File';

    buttonSave.onclick = () => {
      this.saveFile(nameInput.value);
    };


    saveFileGroup.append(saveFileLabel);
    saveFileGroup.append(nameInput);

    modalContentEl.appendChild(saveFileGroup);

    new ModalWindow('modal-window_save-file', 'Save project', modalContentEl, buttonSave);
  }

  showImportFile() {
    const modalContentEl = document.createElement('div');
    modalContentEl.classList.add('modal-content');
    modalContentEl.classList.add('modal-content_import-file');

    const importFromFileGroup = document.createElement('div');
    importFromFileGroup.classList.add('modal-content__input-group');

    const importFromFileLabel = document.createElement('label');
    importFromFileLabel.innerText = 'Choose JSON project file';
    importFromFileLabel.classList.add('modal-content__input-label');

    const btnImportFile = document.createElement('input');
    btnImportFile.classList.add('modal-content__button-import');
    btnImportFile.type = 'file';
    btnImportFile.addEventListener(
      'change',
      (e) => {
        let file = e.target.files[0];
        if (!file) {
          return;
        }
        let reader = new FileReader();
        reader.onload = (e) => {
          let contents = e.target.result;
          this.importFromJsonString(contents);
        };
        reader.readAsText(file);
      },
      false
    );

    importFromFileGroup.append(importFromFileLabel);
    importFromFileGroup.append(btnImportFile);

    const importFromURLGroup = document.createElement('div');
    importFromURLGroup.classList.add('modal-content__input-group');

    const importFromURLLabel = document.createElement('label');
    importFromURLLabel.innerText = 'Input link for JSON project file';
    importFromURLLabel.classList.add('modal-content__input-label');

    const linkInput = document.createElement('input');
    linkInput.classList.add('modal-content__input');
    linkInput.placeholder = 'URL to JSON save file';
    linkInput.value = 'https://api.npoint.io/166802b5a42fe68d24bd';

    const buttonImportFromURL = document.createElement('button');
    buttonImportFromURL.classList.add('modal-window__button');
    buttonImportFromURL.classList.add('modal-window__button_import');
    buttonImportFromURL.innerText = 'Import File';

    buttonImportFromURL.onclick = () => {
      this.loadFileFromUrl(linkInput.value);
    };

    importFromURLGroup.append(importFromURLLabel);
    importFromURLGroup.append(linkInput);
    importFromURLGroup.append(buttonImportFromURL);

    modalContentEl.append(importFromFileGroup);
    modalContentEl.append(importFromURLGroup);

    new ModalWindow('modal-window_import-file', 'Import project', modalContentEl, document.createElement('div'));
  }
}

let DAW = new DigitalAudioWorkstation();
console.log(
  "[+ 10 points] Understand the code of someone else's project, understand it, reproduce the original application. Edits and changes are allowed and welcomed if they do not worsen the appearance and functionality of the original project"
);
console.log('[+ 10 points] Supplement the original project with mandatory additional functionality specified in the assignment description ');
console.log(
  '[+ 10 points] Supplement the original project with additional functionality to choose from those listed in the description of the task, or invented by you yourself - 10 points for each quality improvement from those proposed in the task or your own, similar to them in complexity'
);

console.log('==============');
console.log('If you are really wanna see "DrumKit", so check out my legacy code and call\nlet drumKit = new DrumKit(keysArray);');

console.log(
  "To open sample project call:\nDAW.loadFileFromUrl('https://api.npoint.io/adda9cae0ffdff9d395a');\nor\nDAW.loadFileFromUrl('https://api.npoint.io/166802b5a42fe68d24bd');"
);

console.log(
  'Fetures: \n Add your own sounds via "Add Channel" button or remove existing channels! \n Save and import your project from file \n Variable BPM \n Variable volume for every channel \n Mute channel function \n Basic step Step Sequencer function'
);
console.log('Share with friends, rs-chat, cat, grandmother, imaginary friend! Enjoy!\nbrought for you by thirdmadman with love, lack of sleep and lots of coffee.');
