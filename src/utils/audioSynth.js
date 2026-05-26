// Web Audio API Synthesizer untuk Ambient Sounds
// Menyediakan suara Hujan, Cafe, dan Lofi secara lokal tanpa file audio eksternal

class AmbientSynth {
  constructor() {
    this.ctx = null;
    this.sources = {};
    this.gains = {};
    this.isPlaying = { rain: false, cafe: false, lofi: false };
    this.lofiTimer = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Membuat noise buffer untuk suara hujan
  createNoiseBuffer() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  startRain() {
    this.init();
    if (this.isPlaying.rain) return;

    // 1. Noise source
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer();
    noiseSource.loop = true;

    // 2. Bandpass filter untuk memotong frekuensi ekstrim (biar empuk kayak hujan)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.value = 150;

    // 3. Gain node untuk volume
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 1.5); // Fade in

    // Connect
    noiseSource.connect(filter);
    filter.connect(filter2);
    filter2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noiseSource.start();

    this.sources.rain = noiseSource;
    this.gains.rain = gainNode;
    this.isPlaying.rain = true;
  }

  stopRain() {
    if (!this.isPlaying.rain) return;
    const gain = this.gains.rain;
    if (gain) {
      gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0); // Fade out
      setTimeout(() => {
        try {
          this.sources.rain.stop();
        } catch (e) {}
        this.isPlaying.rain = false;
      }, 1000);
    } else {
      this.isPlaying.rain = false;
    }
  }

  startCafe() {
    this.init();
    if (this.isPlaying.cafe) return;

    // Cafe vibe disintesis menggunakan gabungan pink-noise lembut (gemuruh orang) 
    // ditambah dentingan sendok/garpu berkala secara random
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer();
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 250;
    filter.Q.value = 0.5; // low focus rumble

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.5);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    noiseSource.start();

    this.sources.cafe = noiseSource;
    this.gains.cafe = gainNode;
    this.isPlaying.cafe = true;

    // Dentingan gelas/sendok berkala (random clinks)
    this.cafeInterval = setInterval(() => {
      if (!this.isPlaying.cafe) return;
      try {
        const osc = this.ctx.createOscillator();
        const clinkGain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1500 + Math.random() * 800, this.ctx.currentTime);
        
        clinkGain.gain.setValueAtTime(0, this.ctx.currentTime);
        clinkGain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 0.05);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        
        osc.connect(clinkGain);
        clinkGain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      } catch (e) {}
    }, 4000);
  }

  stopCafe() {
    if (!this.isPlaying.cafe) return;
    clearInterval(this.cafeInterval);
    const gain = this.gains.cafe;
    if (gain) {
      gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
      setTimeout(() => {
        try {
          this.sources.cafe.stop();
        } catch (e) {}
        this.isPlaying.cafe = false;
      }, 1000);
    } else {
      this.isPlaying.cafe = false;
    }
  }

  startLofi() {
    this.init();
    if (this.isPlaying.lofi) return;

    // Lofi disintesis sebagai progresi chord synthesizer yang sangat empuk, low-passed
    // Chord progression: Am7 -> D7 -> Gmaj7 -> Cmaj7 (Lofi classic)
    this.isPlaying.lofi = true;
    
    const chords = [
      [220, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // D7
      [196.00, 246.94, 293.66, 392.00], // Gmaj7
      [261.63, 329.63, 392.00, 493.88]  // Cmaj7
    ];
    
    let currentChordIndex = 0;
    
    const playNextChord = () => {
      if (!this.isPlaying.lofi) return;

      const oscs = [];
      const chordGain = this.ctx.createGain();
      
      // Filter agar lofi terasa mendem hangat
      const lofiFilter = this.ctx.createBiquadFilter();
      lofiFilter.type = 'lowpass';
      lofiFilter.frequency.value = 450;

      chordGain.gain.setValueAtTime(0, this.ctx.currentTime);
      chordGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);
      chordGain.gain.setValueAtTime(0.12, this.ctx.currentTime + 5.5);
      chordGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 7.8);

      const notes = chords[currentChordIndex];
      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle'; // Suara lembut
        osc.frequency.value = freq;
        osc.connect(lofiFilter);
        oscs.push(osc);
      });

      lofiFilter.connect(chordGain);
      chordGain.connect(this.ctx.destination);

      oscs.forEach(osc => osc.start());
      
      // Hentikan chord setelah 8 detik
      setTimeout(() => {
        oscs.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
      }, 8000);

      currentChordIndex = (currentChordIndex + 1) % chords.length;
      
      // Jadwalkan chord berikutnya 7.8 detik lagi
      this.lofiTimer = setTimeout(playNextChord, 7800);
    };

    playNextChord();
  }

  stopLofi() {
    if (!this.isPlaying.lofi) return;
    this.isPlaying.lofi = false;
    if (this.lofiTimer) {
      clearTimeout(this.lofiTimer);
      this.lofiTimer = null;
    }
  }

  // Mematikan semua audio
  stopAll() {
    this.stopRain();
    this.stopCafe();
    this.stopLofi();
  }
}

export const ambientSynth = new AmbientSynth();
