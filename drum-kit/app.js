class DrumKit {
  drumkitKeys = [];
  audioTracksMinPalyTime = 0.1;
  constructor(keysArray) {
    this.createKeys(keysArray);
  }

  createKeys(arrayOfKeys) {
    let mainBody = document.getElementsByTagName("main")[0];
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
        if ((drumkitKey.audiotrack.currentTime >= this.audioTracksMinPalyTime && !drumkitKey.audiotrack.paused) || drumkitKey.audiotrack.paused) {
          drumkitKey.audiotrack.currentTime = 0;

          drumkitKey.audiotrack.play();
          drumkitKey.keyEl.classList.add('keydown');
          setTimeout(() => drumkitKey.keyEl.classList.remove('keydown'),100);
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.code === "Key" + el.keyBind.toUpperCase()) {
          this.drumkitKeys.find((key) => "Key" + key.keyBind.toUpperCase() === e.code).keyEl.click();
        }
      });

      this.drumkitKeys.push({ keyBind: el.keyBind, soundName: el.soundName, keyEl: insertKey, audiotrack: new Audio(el.soundSrc) });
      mainBody.append(insertKey);
    });
  }
}

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
  // {
  //   keyBind: "p",
  //   soundName: "cowbell",
  //   soundSrc: "https://d9olupt5igjta.cloudfront.net/samples/sample_files/68698/8d9c078a6497811bab1126448f956fceea3c618f/mp3/_X-808CB2.mp3?1617246270"
  // }
];

let audioGG = new Audio("assets/sounds/ride.wav");

let drumKit = new DrumKit(keysArray);

