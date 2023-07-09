export const TextModels = {
  CLIO: 'clio-v1',
  EUTERPE: 'euterpe-v2',
  KRAKE: 'krake-v2',
  SIGURD: '6B-v4',
}

export const ImageModels = {
  SAFE: 'safe-diffusion',
  NSFW: 'nai-diffusion',
  FURRY: 'nai-diffusion-furry'
}

export const ImageSizes = {
  Portrait: {
    NORMAL: [512, 768],
    LARGE: [832, 1280],
    LARGE_PLUS: [1024, 1536],
    WALLPAPER: [1088, 1920],
  },
  Landscape: {
    NORMAL: [768, 512],
    LARGE: [1280, 832],
    LARGE_PLUS: [1536, 1024],
    WALLPAPER: [1920, 1088],
  },
  Square: {
    NORMAL: [640, 640],
    LARGE: [1024, 1024],
    LARGE_PLUS: [1472, 1472],
  },
}

export const BAD_WORD_IDS = [
  [
    3
  ],
  [
    49356
  ],
  [
    1431
  ],
  [
    31715
  ],
  [
    34387
  ],
  [
    20765
  ],
  [
    30702
  ],
  [
    10691
  ],
  [
    49333
  ],
  [
    1266
  ],
  [
    19438
  ],
  [
    43145
  ],
  [
    26523
  ],
  [
    41471
  ],
  [
    2936
  ]
]

export const DEFAULT_IMAGE_GENERATION_PARAMS =  {
  "width": 512,
  "height": 768,
  "scale": 11,
  "sampler": "k_dpmpp_2m",
  "steps": 28,
  "n_samples": 1,
  "ucPreset": 0,
  "qualityToggle": true,
  "sm": false,
  "sm_dyn": false,
  "dynamic_thresholding": false,
  "controlnet_strength": 1,
  "legacy": false,
  "add_original_image": false,
  "negative_prompt": "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"
}