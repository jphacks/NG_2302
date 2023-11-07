/* global currentTime */
const SMOOTHING_FACTOR = 0.9;
const FRAME_PER_SECOND = 30;
const FRAME_INTERVAL = 1 / FRAME_PER_SECOND;

/**
 *  Measure microphone volume.
 *
 * @class VolumeMeter
 * @extends AudioWorkletProcessor
 */
class VolumeMeter extends AudioWorkletProcessor {
    constructor() {
        super();
        this._lastUpdate = currentTime;
        this._volume = 0;
        this._count;
    }

    calculateRMS(inputChannelData) {
        // Calculate the squared-sum.
        let sum = 0;
        for (let i = 0; i < inputChannelData.length; i++) {
            sum += inputChannelData[i] * inputChannelData[i];
        }

        // Calculate the RMS level and update the volume.
        let rms = Math.sqrt(sum / inputChannelData.length);
        this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);
    }

    process(inputs, outputs) {
        // This example only handles mono channel.
        const inputChannelData = inputs[0][0];

        // Post a message to the node every 32ms.
        if (currentTime - this._lastUpdate > FRAME_INTERVAL) {
            this.calculateRMS(inputChannelData);
            // 画面描画のため
            if (this._count < FRAME_PER_SECOND/10) {
                this._count++;
            } else {
                this._count = 0;
                this.port.postMessage(this._volume);
            }
            this._lastUpdate = currentTime;
        }

        return true;
    }
}

registerProcessor("volume-meter", VolumeMeter);
