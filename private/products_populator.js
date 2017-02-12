// To use this file: mongo localhost:3001/meteor ./private/products_populator.js

const products = [
  // Speakos
  {
    _id: 'SPK_1',
    type: 'speako',
    title: 'Speako',
    urlTitle: 'speako',
    price: 120,
    image: '/images/products/speako_1.jpg',
    subtitle: '',
    description: `
      Speako<sup>TM</sup> is a voice monitor that works by letting you hear your accent
      instantly and adjust as you speak.
      Simply plug a headset into Speako<sup>TM</sup> and talk into the microphone.
      <br />
      <br />
      When you hear your own accent, you will naturally correct your
      pronunciation mistakes and reduce your accent quickly!
      <br />
      <br />
      Standard USB charging cable included.
      Requires a separate analog (dual 3.5mm connectors) headset with microphone, available below.
    `,
    specs: {
      'Warranty': '1 year',
      'Battery': 'Built-in rechargable lithium ion',
      'Battery Life': '8 - 12 hours',
      'Charging Interface': 'USB (cable included)',
      'Controls': 'Power, volume up/down',
      'Diameter': '8cm / 2.5"',
      'Thickness': '1.5cm / 0.5"',
    },
    images: [
      {
        original: '/images/products/speako_1.jpg',
      },
      {
        original: '/images/products/speako_2.jpg',
      },
      {
        original: '/images/products/XC1037_1.jpg',
      },
      {
        original: '/images/products/XC1037_3.jpg',
      },
    ],
  },

  // Headsets
  {
    _id: 'HDS_1',
    type: 'headset',
    title: 'Large Ear Pads',
    urlTitle: 'samsung-shs-100-headset-with-microphone',
    ribbon: 'Most popular',
    price: 27,
    image: '/images/products/SHS100_1.jpg',
    subtitle: 'Samsung SHS-100',
    description: `
      Large comfortable around-the-ear pads combine with a noise-cancelling microphone
      for a crystal clear accent reduction experience.
      Microphone boom is very flexible allowing you to optimize for
      the strength of your voice and breath sounds.
      <br />
      <br />
      Convenient volume and mic mute controls so you don't even need
      to take Speako<sup>TM</sup> out of your pocket!
      <br />
      <br />
      Superb audio quality and dual analog 3.5mm connectors
      make the Samsung SHS-100 perfectly compatible with your Speako<sup>TM</sup>.
    `,
    specs: {
      'Connectors': 'Dual 3.5mm',
      'Cable Length': '2m / 6.5\'',
      'Inline Controls': 'Volume, mic mute',
      'Microphone': 'Noise-cancelling',
      'Microphone Boom': 'Flexible',
      'Headband Size': 'Adjustable',
      'Headphone Drivers': '40mm x2',
      'Headphone Frequency': '20Hz - 20kHz',
      'Microphone Frequency': '30Hz - 16kHz',
      'Microphone Sensitivity': '-58dB - 3dB',
    },
    images: [
      {
        original: '/images/products/SHS100_1.jpg',
      },
      {
        original: '/images/products/SHS100_2.jpg',
      },
      {
        original: '/images/products/3.5mm_Connectors.jpg',
      },
    ],
  },
  // {
  //   _id: 'HDS_2',
  //   type: 'headset',
  //   title: 'Light Classic',
  //   urlTitle: 'cyber-acustics-ac-201-headset-with-microphone',
  //   ribbon: 'Basic option',
  //   price: 18,
  //   image: '/images/products/AC201_1.jpg',
  //   subtitle: 'Cyber Acustics AC-201',
  //   description: `
  //     Small on-ear pads make this a sleek light-weight option.
  //     Unidirectional noise-cancelling microphone
  //     for a crystal clear accent reduction experience.
  //     Microphone boom extends/retracts allowing you to optimize for
  //     the strength of your voice and breath sounds.
  //     Microphone also rotates 180&deg; so it can be used on left or right side.
  //     <br />
  //     <br />
  //     Superb audio quality and dual analog 3.5mm connectors
  //     make the Cyber Acustics AC-201 perfectly compatible with your Speako<sup>TM</sup>.
  //   `,
  //   specs: {
  //     'Connectors': 'Dual 3.5mm',
  //     'Cable Length': '2.1m / 7\'',
  //     'Inline Controls': 'None',
  //     'Microphone': 'Noise-cancelling',
  //     'Microphone Boom': 'Extensible, ambidextrous',
  //     'Headband Size': 'Adjustable',
  //     'Headphone Drivers': '30mm x2',
  //     'Headphone Frequency': '20Hz - 20kHz',
  //     'Microphone Frequency': '100Hz - 16kHz',
  //     'Microphone Sensitivity': '-62dB - 3dB',
  //   },
  //   images: [
  //     {
  //       original: '/images/products/AC201_1.jpg',
  //     },
  //     {
  //       original: '/images/products/AC201_2.jpg',
  //     },
  //     {
  //       original: '/images/products/AC201_3.jpg',
  //     },
  //     {
  //       original: '/images/products/AC201_4.jpg',
  //     },
  //     {
  //       original: '/images/products/3.5mm_Connectors.jpg',
  //     },
  //   ],
  // },
  {
    _id: 'HDS_3',
    type: 'headset',
    title: 'Extra Durable',
    urlTitle: 'cyber-acustics-ac-960-headset-with-microphone',
    ribbon: 'Most popular with ESL schools',
    price: 36,
    image: '/images/products/AC960_1.jpg',
    subtitle: 'Cyber Acustics AC-960',
    description: `
      Our most popular headset with ESL schools and classrooms!
      Extra durable design makes this perfect for educational settings
      and is a favourite with English teachers, tutors, and speech therapists.
      <br /><br />
      Large comfortable around-the-ear pads combine with a noise-cancelling microphone
      for a crystal clear accent reduction experience.
      Microphone also rotates 180&deg; so it can be used on left or right side.
      Convenient volume control right on the headset so you don't even need
      to take Speako<sup>TM</sup> out of your pocket!
      <br />
      <br />
      Superb audio quality and dual analog 3.5mm connectors
      make the Cyber Acustics AC-960 perfectly compatible with your Speako<sup>TM</sup>.
    `,
    specs: {
      'Connectors': 'Dual 3.5mm',
      'Cable Length': '1.8m / 6\'',
      'On-Ear Controls': 'Volume',
      'Microphone': 'Noise-cancelling',
      'Microphone Boom': 'Adjustable, ambidextrous',
      'Headband Size': 'Adjustable',
      'Headphone Drivers': '40mm x2',
      'Headphone Frequency': '20Hz - 20kHz',
      'Microphone Frequency': '100Hz - 16kHz',
      'Microphone Sensitivity': '-67dB - 3dB',
    },
    images: [
      {
        original: '/images/products/AC960_1.jpg',
      },
      {
        original: '/images/products/3.5mm_Connectors.jpg',
      },
    ],
  },

  // Cables
  {
    _id: 'CBL_1',
    type: 'accessory',
    title: 'Replacement Charging Cable',
    urlTitle: 'usb-micro-charging-cable',
    price: 3,
    image: '/images/products/XC1037_1.jpg',
    subtitle: 'Micro-USB charging cable',
    description: `
      Use to charge your Speako<sup>TM</sup> and many other USB devices including Android phones.
      Standard micro-USB to USB-A.
      Highly flexible woven metal sheathing ensures long-lasting durability.
      <br /><br />
      Note: Your Speako<sup>TM</sup> purchase includes a charging cable.
      This is a replacement only.
    `,
    specs: {
      'Length': '25cm / 10"',
      'Shielding': 'Metal',
      'Construction': 'Woven',
    },
    images: [
      {
        original: '/images/products/XC1037_1.jpg',
      },
      {
        original: '/images/products/XC1037_3.jpg',
      },
      {
        original: '/images/products/XC1037_2.jpg',
      },
    ],
  },
];


const collection = 'krondor-store.products';
db[collection].drop(); // eslint-disable-line no-undef
products.forEach((product) => {
  db[collection].update( // eslint-disable-line no-undef
    { _id: product._id },
    product,
    { upsert: true }
  );
});
