"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var flowUtils_1 = require("../../../../FlowHelpers/1.0.0/interfaces/flowUtils");
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () { return ({
    name: 'Set audio samplerate',
    description: 'Set audio samplerate using ffmpeg. ',
    style: {
        borderColor: '#6efefc',
    },
    tags: 'audio',
    isStartPlugin: false,
    pType: '',
    requiresVersion: '2.11.01',
    sidebarPosition: -1,
    icon: '',
    inputs: [
        {
            label: 'Samplerate',
            name: 'samplerate',
            type: 'number',
            defaultValue: '96000',
            inputUI: {
                type: 'text',
            },
            tooltip: 'Specify samplerate value in Hz',
        },
    ],
    outputs: [
        {
            number: 1,
            tooltip: 'Continue to next plugin',
        },
    ],
}); };
exports.details = details;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    (0, flowUtils_1.checkFfmpegCommandInit)(args);
    var desiredSampleRate = Number(args.inputs.samplerate);
    args.jobLog("Desired samplerate: ".concat(desiredSampleRate));
    args.variables.ffmpegCommand.streams.forEach(function (stream) {
        if (stream.codec_type === 'audio') {
            args.jobLog('Using desired samplerate.');
            // eslint-disable-next-line max-len
            // stream.outputArgs.push('-af ', `aresample=${String(desiredSampleRate)}:resampler=soxr:precision=33:osf=${String(stream.sample_fmt)}:dither_method=triangular`);
            stream.outputArgs.push('-sample_fmt ', stream.sample_fmt);
            stream.outputArgs.push('-ar ', "".concat(String(desiredSampleRate)));
            stream.outputArgs.push('-dither_method', 'triangular');
            // eslint-disable-next-line no-param-reassign
            args.variables.ffmpegCommand.shouldProcess = true;
        }
        else {
            args.jobLog('codec type is not audio.');
        }
    });
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;
