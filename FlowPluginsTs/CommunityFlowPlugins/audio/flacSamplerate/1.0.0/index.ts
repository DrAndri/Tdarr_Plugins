import {
  IpluginDetails,
  IpluginInputArgs,
  IpluginOutputArgs,
} from '../../../../FlowHelpers/1.0.0/interfaces/interfaces';

const details = ():IpluginDetails => ({
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
});

const plugin = (args:IpluginInputArgs):IpluginOutputArgs => {
  const lib = require('../../../../../methods/lib')();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
  args.inputs = lib.loadDefaultValues(args.inputs, details);
  const threshold = Number(args.inputs.threshold);
  args.jobLog(`Threshold: ${threshold}`);

  let output = 1;

  if (args.inputFileObj.ffProbeData.streams) {
    args.inputFileObj.ffProbeData.streams.forEach((stream) => {
      if (stream.codec_type === 'audio' && stream.sample_rate) {
        const sampleRate = Number(stream.sample_rate);
        args.jobLog(`File samplerate: ${sampleRate}`);
        if (!Number.isNaN(sampleRate)) {
          if (sampleRate <= threshold) {
            output = 2;
          } else {
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
export {
  details,
  plugin,
};
