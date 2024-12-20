import { checkFfmpegCommandInit } from '../../../../FlowHelpers/1.0.0/interfaces/flowUtils';
import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from '../../../../FlowHelpers/1.0.0/interfaces/interfaces';

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = () :IpluginDetails => ({
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
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plugin = (args:IpluginInputArgs):IpluginOutputArgs => {
  const lib = require('../../../../../methods/lib')();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details);

  checkFfmpegCommandInit(args);

  const desiredSampleRate = Number(args.inputs.samplerate);

  args.jobLog(`Desired samplerate: ${desiredSampleRate}`);

  args.variables.ffmpegCommand.streams.forEach((stream) => {
    if (stream.codec_type === 'audio') {
      args.jobLog('Using desired samplerate.');
      // eslint-disable-next-line max-len
      // stream.outputArgs.push('-af ', `aresample=${String(desiredSampleRate)}:resampler=soxr:precision=33:osf=${String(stream.sample_fmt)}:dither_method=triangular`);
      stream.outputArgs.push('-sample_fmt ', stream.sample_fmt);
      stream.outputArgs.push('-ar ', `${String(desiredSampleRate)}`);
      stream.outputArgs.push('-dither_method', 'triangular');
      // eslint-disable-next-line no-param-reassign
      args.variables.ffmpegCommand.shouldProcess = true;
    } else {
      args.jobLog('codec type is not audio.');
    }
  });

  return {
    outputFileObj: args.inputFileObj,
    outputNumber: 1,
    variables: args.variables,
  };
};
export {
  details,
  plugin,
};
