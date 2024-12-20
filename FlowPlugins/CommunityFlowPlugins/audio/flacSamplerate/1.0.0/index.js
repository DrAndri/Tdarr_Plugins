"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var details = function () { return ({
    name: 'Check samplerate',
    description: 'Checks if samplerate is higher than threshold',
    style: {
        borderColor: 'orange',
    },
    tags: 'audio',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: 'faQuestion',
    inputs: [
        {
            label: 'Samplerate threshold',
            name: 'threshold',
            type: 'number',
            defaultValue: '96000',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Specify the samplerate threshold',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: 'Samplerate not detected',
        },
        {
            number: 2,
            tooltip: 'Samplerate is equal or lower than threshold',
        },
        {
            number: 3,
            tooltip: 'Samplerate is higher than threshold',
        },
    ],
}); };
exports.details = details;
var plugin = function (args) {
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    var threshold = Number(args.inputs.threshold);
    args.jobLog("Threshold: ".concat(threshold));
    var output = 1;
    if (args.inputFileObj.ffProbeData.streams) {
        args.inputFileObj.ffProbeData.streams.forEach(function (stream) {
            if (stream.codec_type === 'audio' && stream.sample_rate) {
                var sampleRate = Number(stream.sample_rate);
                args.jobLog("File samplerate: ".concat(sampleRate));
                if (!Number.isNaN(sampleRate)) {
                    if (sampleRate <= threshold) {
                        output = 2;
                    }
                    else {
                        output = 3;
                    }
                }
            }
        });
    }
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: output,
        variables: args.variables,
    };
};
exports.plugin = plugin;
