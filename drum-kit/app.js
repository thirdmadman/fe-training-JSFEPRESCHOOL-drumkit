let keysArray = [
  {
    keyBind: "a",
    soundName: "clap",
    soundSrc: "assets/sounds/clap.wav",
  },
  {
    keyBind: "s",
    soundName: "hihat",
    soundSrc: "assets/sounds/hihat.wav",
  },
  {
    keyBind: "d",
    soundName: "kick",
    soundSrc: "assets/sounds/kick.wav",
  },
  {
    keyBind: "f",
    soundName: "openhat",
    soundSrc: "assets/sounds/openhat.wav",
  },
  {
    keyBind: "g",
    soundName: "boom",
    soundSrc: "assets/sounds/boom.wav",
  },
  {
    keyBind: "h",
    soundName: "ride",
    soundSrc: "assets/sounds/ride.wav",
  },
  {
    keyBind: "j",
    soundName: "snare",
    soundSrc: "assets/sounds/snare.wav",
  },
  {
    keyBind: "k",
    soundName: "tom",
    soundSrc: "assets/sounds/tom.wav",
  },
  {
    keyBind: "l",
    soundName: "tink",
    soundSrc: "assets/sounds/tink.wav",
  },
  {
    keyBind: "p",
    soundName: "cowbell",
    soundSrc: "https://d9olupt5igjta.cloudfront.net/samples/sample_files/68698/8d9c078a6497811bab1126448f956fceea3c618f/mp3/_X-808CB2.mp3?1617246270",
  },
];
class DrumKit {
  drumkitKeys = [];
  audioTracksMinPalyTime = 0.001;
  keysArray = null;

  drumkitContainer = null;

  constructor(keysArray) {
    this.createKeys(keysArray);
    this.keysArray = keysArray;
  }

  createKeys(arrayOfKeys) {
    if (!this.drumkitContainer) {
      this.drumkitContainer = document.createElement("div");
      this.drumkitContainer.className = "drum-kit-key-container";
      document.getElementsByTagName("main")[0].append(this.drumkitContainer);
    }

    arrayOfKeys.forEach((el) => {
      let insertKey = document.createElement("div");
      let keyName = document.createElement("h2");
      keyName.innerText = el.keyBind;
      let soundName = document.createElement("span");
      soundName.innerText = el.soundName;
      insertKey.append(keyName);
      insertKey.append(soundName);
      insertKey.className = "drum-kit__key";

      insertKey.addEventListener("click", () => {
        let drumkitKey = this.drumkitKeys.find((key) => key.keyBind === el.keyBind);
        //if (drumkitKey.audiotrack.paused) {
        //if ((drumkitKey.audiotrack.currentTime >= this.audioTracksMinPalyTime && !drumkitKey.audiotrack.paused) || drumkitKey.audiotrack.paused) {
        drumkitKey.audiotrack.currentTime = 0;

        drumkitKey.audiotrack.play();
        drumkitKey.keyEl.classList.add("keydown");
        setTimeout(() => drumkitKey.keyEl.classList.remove("keydown"), 100);
        //}
      });

      document.addEventListener("keydown", (e) => {
        if (e.code === "Key" + el.keyBind.toUpperCase()) {
          this.drumkitKeys.find((key) => "Key" + key.keyBind.toUpperCase() === e.code).keyEl.click();
        }
      });

      this.drumkitKeys.push({ keyBind: el.keyBind, soundName: el.soundName, keyEl: insertKey, audiotrack: new Audio(el.soundSrc) });
      this.drumkitContainer.append(insertKey);
    });
  }

  deleteKeyBySoundName(soundName) {
    this.drumkitKeys.find((el) => el.soundName === soundName).keyEl.remove();
    this.drumkitKeys = this.drumkitKeys.filter((el) => el.soundName !== soundName);
  }

  export() {
    // let out = {};
    // this.drumkitKeys.forEach( el => );
    return this.keysArray;
  }

  deleteAll() {
    this.drumkitKeys.forEach((el) => this.deleteKeyBySoundName(el.soundName));
  }
}

class DrumKitInstrumentPads {
  colorActive = "#e74c3c";
  isPlaying = false;
  instrumentName = null;
  instrumentPads = [];
  drumkitInstrumentsContainer = null;
  instrumentContainer = null;
  instrumentContainerPads = null;
  volInput = null;

  instrumentTimer = null;

  constructor(instrumentName, size, volume) {
    this.instrumentName = instrumentName;
    this.SQUARES = size;
    this.drumkitInstrumentsContainer = document.getElementsByClassName("drum-kit-rhythm-container")[0];
    console.log(!this.drumkitInstrumentsContainer);
    if (!this.drumkitInstrumentsContainer) {
      this.drumkitInstrumentsContainer = document.createElement("div");
      this.drumkitInstrumentsContainer.className = "drum-kit-rhythm-container";
      document.getElementsByTagName("main")[0].append(this.drumkitInstrumentsContainer);
    }

    this.instrumentContainer = document.createElement("div");
    this.instrumentContainer.className = "drum-kit-rhythm-instrument-container";

    this.volInput = document.createElement("input");
    this.volInput.value = volume;
    this.volInput.type = "range";
    this.volInput.min = "0";
    this.volInput.max = "1";
    this.volInput.step = "0.01";

    this.instrumentContainer.appendChild(this.volInput);
    const instrumentNameEl = document.createElement("span");
    instrumentNameEl.textContent = this.instrumentName;
    this.instrumentContainer.appendChild(instrumentNameEl);

    this.addPads(size);
  }

  addPads(numberOfPads) {
    if (!this.instrumentContainerPads) {
      this.instrumentContainerPads = document.createElement("div");
      this.instrumentContainerPads.className = "instrument-pads-container";
    }

    let padsNumer = this.instrumentPads.length;

    for (let i = padsNumer; i < padsNumer + numberOfPads; i++) {
      const square = document.createElement("div");
      square.classList.add("drum-kit-rhythm__pad");

      // if ((i + 8) % 8 > 3) {
      //   square.classList.add("drum-kit-rhythm_fouth");
      // }

      //if ((i + 24) % 16 > 7) {
      if ((i + 8) % 8 > 3) {
        square.classList.add("pad_black");
      } else {
        square.classList.add("pad_gray");
      }

      this.instrumentPads.push({ id: i, state: false, padEl: square });

      square.addEventListener("click", () => this.switchState(i));

      //square.addEventListener("mouseout", () => this.removeColor(square));
      this.instrumentContainerPads.appendChild(square);
    }
    this.instrumentContainer.appendChild(this.instrumentContainerPads);
    this.drumkitInstrumentsContainer.append(this.instrumentContainer);
  }

  removePads(numberOfPads) {
    if (numberOfPads > 0 && this.instrumentPads !== null && this.instrumentPads.length >= numberOfPads) {
      // this.instrumentPads.forEach( (el, i) => i > this.instrumentPads.length - numberOfPads -1 ? el.padEl.remove() : null);
      // this.instrumentPads.forEach( (el, i) => i > this.instrumentPads.length - numberOfPads - 1? delete this.instrumentPads[i] : null);
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
      padObj.padEl.classList.remove("pad_black");
      padObj.padEl.classList.add("pad_red");
      //padObj.padEl.style.background = this.colorActive;
      //padObj.padEl.style.boxShadow = `0 0 2px ${this.colorActive}, 0 0 10px ${this.colorActive}`;
    } else {
      padObj.padEl.classList.remove("pad_red");
      padObj.padEl.classList.add("pad_black");
      //padObj.padEl.style.background = "#1d1d1d";
      //padObj.padEl.style.boxShadow = "0 0 2px #000";
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
        //this.instrumentPads.find((el) => el.id === (lastPlayedPadId -1)).padEl.classList.remove("pad_current-playing");
        //let lastPadEl = this.instrumentPads.find((el) => el.id === lastPlayedPadId );

        let lastPadEl = this.instrumentPads.find((el) => el.id === lastPlayedPadId);
        lastPadEl.padEl.classList.add("pad_current-playing");
        setTimeout(() => lastPadEl.padEl.classList.remove("pad_current-playing"), interval);
        //console.log(lastPadEl);
        if (this.instrumentPads.find((el) => el.id === lastPlayedPadId).state) {
          let drumKitObj = drumKit.drumkitKeys.find((el) => el.soundName === this.instrumentName);
          drumKitObj.audiotrack.volume = this.volInput.value;
          drumKitObj.keyEl.click();
        }
        lastPlayedPadId++;
      }, interval);
    }
  }

  export() {
    let out = { instrumentName: this.instrumentName, valueLevel: this.volInput.value, pads: [] };
    this.instrumentPads.forEach((el) => out.pads.push({ id: el.id, state: el.state }));
    return out;
  }
}

class DrumKitRhythm {
  instruments = [];
  bpminput = null;
  size = 0;
  drumKit = null;
  selectAddInstrument = null;

  constructor(instrumentsArray, size) {
    this.drumKit = new DrumKit(instrumentsArray);

    this.size = size;
    //instrumentsArray.forEach((el) => this.addInstrument(el.soundName, this.size));

    this.instrumentsArray = instrumentsArray;

    this.bpminput = document.createElement("input");
    this.bpminput.value = 120;

    document.getElementsByTagName("main")[0].appendChild(this.bpminput);

    const btnPaly = document.createElement("button");
    btnPaly.textContent = "play";
    btnPaly.addEventListener("click", () => this.playAll());
    document.getElementsByTagName("main")[0].appendChild(btnPaly);

    const btnAddPads = document.createElement("button");
    btnAddPads.textContent = "add 8 pads";
    btnAddPads.addEventListener("click", () => this.addPads(8));
    document.getElementsByTagName("main")[0].appendChild(btnAddPads);

    const btnRemovePads = document.createElement("button");
    btnRemovePads.textContent = "delete 8 pads";
    btnRemovePads.addEventListener("click", () => this.removePads(8));
    document.getElementsByTagName("main")[0].appendChild(btnRemovePads);

    this.updateInstrumetSelectList();

    const btnAddInstrument = document.createElement("button");
    btnAddInstrument.textContent = "add instrument";
    btnAddInstrument.addEventListener("click", () => this.addInstrument(this.selectAddInstrument.options[this.selectAddInstrument.selectedIndex].value, 1));
    document.getElementsByTagName("main")[0].appendChild(btnAddInstrument);
  }

  updateInstrumetSelectList() {
    if (!this.selectAddInstrument) {
      this.selectAddInstrument = document.createElement("select");
      document.getElementsByTagName("main")[0].appendChild(this.selectAddInstrument);
    } else {
      this.selectAddInstrument.innerText = "";
    }
    //console.log(this.drumKit.drumkitKeys);

    this.drumKit.drumkitKeys.forEach((el) => {
      let option = document.createElement("option");
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
    this.updateInstrumetSelectList();
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
    this.instruments.forEach((el) => el.play(1000 / (this.bpminput.value / 60) / 4));
  }

  addInstrument(instrumentName, volume) {
    if (!this.instruments.find((el) => el.instrumentName === instrumentName)) {
      this.instruments.push(new DrumKitInstrumentPads(instrumentName, this.size, volume));
    }
  }

  deleteInstrumentBySoundName(instrumentName) {
    this.instruments.find((el) => el.instrumentName === instrumentName).remove();
    this.instruments = this.instruments.filter((el) => el.instrumentName !== instrumentName);
    //this.drumkitKeys = this.drumkitKeys.filter((el) => el.soundName !== soundName);
  }

  export() {
    let out = { padsConfig: this.drumKit.export(), instrumentsPads: [] };
    drumKitRhythm.instruments.forEach((el) => out.instrumentsPads.push(el.export()));
    return out;
  }

  saveAsFile(fileName) {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(drumKitRhythm.export())], { type: "text/plain" });

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

let drumKitRhythm = new DrumKitRhythm(keysArray, 16);

//console.log(drumKitRhythm.export());

class SequenceStep {
  state = null;
  id = null;
  constructor(id, state = false) {
    this.state = Boolean(state);
    this.id = id;
  }
  switchState() {
    this.state = !this.state;
  }
  setState(state) {
    this.state = state;
  }

  export() {
    return { state: this.state, id: this.id };
  }
}

class ChannelSequence {
  channelName = null;
  sequenceSteps = [];
  stepsNumber = 0;
  constructor(channelName, stepsNumber = 0, sequenceSteps = null) {
    this.channelName = channelName;
    if (stepsNumber > 0 && !sequenceSteps) {
      this.addSteps(stepsNumber);
    } else if (sequenceSteps && sequenceSteps.length > 0) {
      sequenceSteps.forEach((el) => {
        this.sequenceSteps.push(new SequenceStep(el.id, el.state));
        this.stepsNumber++;
      });
    }
  }

  addSteps(numberOfSteps) {
    for (let stepNumber = this.stepsNumber; stepNumber < this.stepsNumber + numberOfSteps; stepNumber++) {
      this.sequenceSteps.push(new SequenceStep(stepNumber));
    }
    this.stepsNumber += numberOfSteps;
  }

  getStepById(id) {
    return this.sequenceSteps.find((sequenceStep) => sequenceStep.id === id);
  }

  switchStateEvry(N) {
    this.sequenceSteps.forEach((sequenceStep) => (!((sequenceStep.id + 1) % N) ? sequenceStep.setState(true) : null));
  }

  removeSteps(numberOfSteps) {
    // let sequenceStepsToRemove = this.sequenceSteps.slice(stepsNumber - numberOfSteps, this.stepsNumber);
    // sequenceStepsToRemove.forEach((el) => el.remove());
    this.sequenceSteps = this.sequenceSteps.slice(0, this.stepsNumber - numberOfSteps);
    this.stepsNumber -= numberOfSteps;
  }

  export() {
    let sequenceStepsArray = this.sequenceSteps.map((el) => el.export());
    return { channelName: this.channelName, sequenceSteps: sequenceStepsArray, stepsNumber: this.stepsNumber };
  }
}

class SequencerPattern {
  channelSequences = [];
  patternName = null;
  stepsNumber = null;

  constructor(patternName, stepsNumber) {
    this.patternName = patternName;
    this.stepsNumber = stepsNumber;
  }
  addChannelSequence(channelName) {
    let newChannelSequence = new ChannelSequence(channelName, this.stepsNumber);
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

  export() {
    let channelSequencesArray = this.channelSequences.map((el) => el.export());
    return { channelSequences: channelSequencesArray, patternName: this.patternName, stepsNumber: this.stepsNumber };
  }
}

class Channel {
  //volume
  //name
  //soundSrc
  //audiotrack

  volume = null;
  name = null;
  soundSrc = null;
  audiotrack = null;
  isMuted = null;

  constructor(name, soundSrc, volume) {
    this.volume = volume;
    this.name = name;
    this.soundSrc = soundSrc;
    this.audiotrack = new Audio(this.soundSrc);
    this.isMuted = false;
  }

  switchMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setVolume(volume) {
    this.volume = volume;
    return true;
  }

  playSound() {
    if (!this.isMuted) {
      this.audiotrack.currentTime = 0;
      this.audiotrack.volume = this.volume;
      this.audiotrack.play();
    }
  }

  remove() {}

  export() {
    return { volume: this.volume, name: this.name, soundSrc: this.soundSrc };
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

  constructor() {}

  addChannel(name, soundSrc, volume) {
    let newChannel = new Channel(name, soundSrc, volume);
    this.channels.push(newChannel);
    return newChannel;
  }

  addSequencerPattern(patternName, stepsNumber) {
    let newSequencerPattern = new SequencerPattern(patternName, stepsNumber);
    this.channels.forEach((channel) => newSequencerPattern.addChannelSequence(channel.name));
    this.sequencerPatterns.push(newSequencerPattern);
    return newSequencerPattern;
  }

  removeChannelByName(name) {
    let channelToRemove = this.channels.find((channel) => channel.name === name);
    if (channelToRemove) {
      console.log(channelToRemove);
      channelToRemove.remove();
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

  getCurretnSequencerPattern() {
    return this.sequencerPatterns.find((sequencerPattern) => sequencerPattern.patternName === this.currentSelectedPatternName);
  }

  play() {
    this.isPlaying = !this.isPlaying;

    this.lastPlayedStep = 0;
    if (this.timer == null) {
      this.timer = setInterval(() => {
        if (this.isPlaying === false) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        if (this.lastPlayedStep >= this.getCurretnSequencerPattern().stepsNumber) {
          this.lastPlayedStep = 0;
        }

        this.channels.forEach((channel) => {
          //console.log(this.getCurretnSequencerPattern().getChannelSequence(channel.name).getStepById(this.lastPlayedStep));
          let curretnChannelStep = this.getCurretnSequencerPattern().getChannelSequence(channel.name).getStepById(this.lastPlayedStep);
          if (curretnChannelStep.state) {
            channel.playSound();
          }
        });

        this.lastPlayedStep++;
      }, 1000 / (this.bpm / 60) / 4);
    }
  }

  export() {
    let channelsArray = this.channels.map((el) => el.export());
    let sequencerPatternsArray = this.sequencerPatterns.map((el) => el.export());
    return { channels: channelsArray, sequencerPatterns: sequencerPatternsArray, bpm: this.bpm };
  }
}

class DrumPad {
  //???
  export() {}
}

class DigitalAudioWorkstation {
  drumPad = null;
  stepSequencer = null;

  constructor() {
    this.stepSequencer = new StepSequencer();
    this.drumPad = new DrumPad();
    //!HARDCODE
    this.stepSequencer.addChannel(
      "cowbell",
      "https://d9olupt5igjta.cloudfront.net/samples/sample_files/68698/8d9c078a6497811bab1126448f956fceea3c618f/mp3/_X-808CB2.mp3?1617246270",
      1
    );
    this.stepSequencer.addChannel(
      "kick",
      "https://d9olupt5igjta.cloudfront.net/samples/sample_files/85486/7e678db81002e109d836d4c89a200ed1c6e0cf1f/mp3/_IqBu__Kick_6_-_A.mp3?1629308763",
      1
    );
    this.stepSequencer.addSequencerPattern("1", 16);
    this.stepSequencer.currentSelectedPatternName = "1";
    this.stepSequencer.getCurretnSequencerPattern().getChannelSequence("cowbell").switchStateEvry(2);
    this.stepSequencer.getCurretnSequencerPattern().getChannelSequence("kick").switchStateEvry(8);
    console.log(this.stepSequencer);
  }

  export() {
    return { drumPad: this.drumPad.export(), stepSequencer: this.stepSequencer.export() };
  }

  importFromJsonString(jsonString) {
    const importObj = JSON.parse(jsonString);
    this.stepSequencer = new StepSequencer();
    this.drumPad = new DrumPad();

    this.stepSequencer.bpm = importObj.stepSequencer.bpm;

    if (importObj.stepSequencer.channels.length > 0) {
      importObj.stepSequencer.channels.forEach((channel) => this.stepSequencer.addChannel(channel.name, channel.soundSrc, channel.volume));
      if (importObj.stepSequencer.sequencerPatterns.length > 0) {
        importObj.stepSequencer.sequencerPatterns.forEach((sequencerPattern) => {
          let newsequencerPattern = this.stepSequencer.addSequencerPattern(sequencerPattern.patternName, sequencerPattern.stepsNumber);
          sequencerPattern.channelSequences.forEach( channelSequences => {
            channelSequences.sequenceSteps.forEach( step => newsequencerPattern.getChannelSequence(channelSequences.channelName).getStepById(step.id).setState(step.state));
          })
        });
        this.stepSequencer.currentSelectedPatternName = this.stepSequencer.sequencerPatterns[0].patternName;
      }
    }
  }

  loadFile(fileContent) {}

  saveFile(fileName) {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(this.export())], { type: "text/plain" });

    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(a.href);
  }
}

let DAW = new DigitalAudioWorkstation();
//console.log(DAW.saveFile("gg.json"));
