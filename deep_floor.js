var deepFloors = [
{'rect': [311.0, 1077.0, 278.0, 1084.0], 'text': 'Identity_1 [1,266] (Identity)', 'color': '#a4d3ee'} ,
{'rect': [57.0, 1077.0, 25.0, 1084.0], 'text': 'Identity [1,1404] (Identity)', 'color': '#a4d3ee'} ,
{'rect': [319.0, 1064.0, 270.0, 1070.0], 'text': 'model/output_contours/Reshape (Reshape)', 'color': '#d1eeee'} ,
{'rect': [64.0, 1064.0, 18.0, 1070.0], 'text': 'model/output_mesh/Reshape (Reshape)', 'color': '#d1eeee'} ,
{'rect': [320.0, 1050.0, 269.0, 1057.0], 'text': 'model/conv2d_26/BiasAdd (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [67.0, 1050.0, 16.0, 1057.0], 'text': 'model/conv2d_20/BiasAdd (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [312.0, 1036.0, 276.0, 1043.0], 'text': 'model/p_re_lu_24/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [59.0, 1036.0, 23.0, 1043.0], 'text': 'model/p_re_lu_19/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [358.0, 1008.0, 277.0, 1015.0], 'text': 'model/batch_normalization_v1_24/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [105.0, 1008.0, 23.0, 1015.0], 'text': 'model/batch_normalization_v1_19/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [311.0, 1022.0, 278.0, 1029.0], 'text': 'model/add_21/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [353.0, 994.0, 279.0, 1001.0], 'text': 'model/depthwise_conv2d_21/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [164.0, 980.0, 134.0, 987.0], 'text': 'Identity_2 [1,1] (Identity)', 'color': '#a4d3ee'} ,
{'rect': [58.0, 1022.0, 25.0, 1029.0], 'text': 'model/add_17/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [100.0, 994.0, 25.0, 1001.0], 'text': 'model/depthwise_conv2d_17/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [173.0, 966.0, 125.0, 973.0], 'text': 'model/output_faceflag/Reshape (Reshape)', 'color': '#d1eeee'} ,
{'rect': [170.0, 952.0, 128.0, 959.0], 'text': 'model/activation/Sigmoid (Sigmoid)', 'color': '#cd853f'} ,
{'rect': [334.0, 980.0, 252.0, 987.0], 'text': 'model/batch_normalization_v1_23/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [82.0, 980.0, 0.0, 987.0], 'text': 'model/batch_normalization_v1_18/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [311.0, 966.0, 275.0, 973.0], 'text': 'model/p_re_lu_22/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [59.0, 966.0, 23.0, 973.0], 'text': 'model/p_re_lu_17/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [174.0, 938.0, 123.0, 945.0], 'text': 'model/conv2d_30/BiasAdd (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [357.0, 938.0, 275.0, 945.0], 'text': 'model/batch_normalization_v1_22/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [167.0, 924.0, 131.0, 931.0], 'text': 'model/p_re_lu_27/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [105.0, 938.0, 23.0, 945.0], 'text': 'model/batch_normalization_v1_17/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [193.0, 896.0, 111.0, 903.0], 'text': 'model/batch_normalization_v1_27/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [309.0, 952.0, 276.0, 959.0], 'text': 'model/add_20/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [351.0, 924.0, 277.0, 931.0], 'text': 'model/depthwise_conv2d_20/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [57.0, 952.0, 24.0, 959.0], 'text': 'model/add_16/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [99.0, 924.0, 25.0, 931.0], 'text': 'model/depthwise_conv2d_16/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [310.0, 910.0, 274.0, 917.0], 'text': 'model/p_re_lu_21/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [73.0, 910.0, 36.0, 917.0], 'text': 'model/p_re_lu_16/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [310.0, 882.0, 228.0, 889.0], 'text': 'model/batch_normalization_v1_21/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [165.0, 910.0, 132.0, 917.0], 'text': 'model/add_23/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [187.0, 882.0, 113.0, 889.0], 'text': 'model/depthwise_conv2d_23/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [88.0, 882.0, 6.0, 889.0], 'text': 'model/batch_normalization_v1_16/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [308.0, 896.0, 275.0, 903.0], 'text': 'model/add_19/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [308.0, 868.0, 233.0, 875.0], 'text': 'model/depthwise_conv2d_19/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [186.0, 868.0, 104.0, 875.0], 'text': 'model/batch_normalization_v1_26/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [71.0, 896.0, 38.0, 903.0], 'text': 'model/add_15/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [86.0, 868.0, 11.0, 875.0], 'text': 'model/depthwise_conv2d_15/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [297.0, 854.0, 260.0, 861.0], 'text': 'model/p_re_lu_20/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [163.0, 854.0, 127.0, 861.0], 'text': 'model/p_re_lu_25/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [87.0, 854.0, 50.0, 861.0], 'text': 'model/p_re_lu_15/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [325.0, 826.0, 244.0, 833.0], 'text': 'model/batch_normalization_v1_20/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [240.0, 826.0, 159.0, 833.0], 'text': 'model/batch_normalization_v1_25/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [99.0, 826.0, 17.0, 833.0], 'text': 'model/batch_normalization_v1_15/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [295.0, 840.0, 262.0, 847.0], 'text': 'model/add_18/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [161.0, 840.0, 128.0, 847.0], 'text': 'model/add_22/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [85.0, 840.0, 52.0, 847.0], 'text': 'model/add_14/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [316.0, 812.0, 242.0, 819.0], 'text': 'model/depthwise_conv2d_18/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [228.0, 812.0, 153.0, 819.0], 'text': 'model/depthwise_conv2d_22/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [115.0, 812.0, 40.0, 819.0], 'text': 'model/depthwise_conv2d_14/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [155.0, 826.0, 102.0, 833.0], 'text': 'model/max_pooling2d_4/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [173.0, 798.0, 137.0, 805.0], 'text': 'model/p_re_lu_14/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [219.0, 770.0, 138.0, 777.0], 'text': 'model/batch_normalization_v1_14/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [172.0, 784.0, 139.0, 791.0], 'text': 'model/add_13/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [214.0, 756.0, 139.0, 763.0], 'text': 'model/depthwise_conv2d_13/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [172.0, 742.0, 135.0, 749.0], 'text': 'model/p_re_lu_13/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [218.0, 714.0, 136.0, 721.0], 'text': 'model/batch_normalization_v1_13/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [170.0, 728.0, 137.0, 735.0], 'text': 'model/add_12/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [212.0, 700.0, 138.0, 707.0], 'text': 'model/depthwise_conv2d_12/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [170.0, 686.0, 134.0, 693.0], 'text': 'model/p_re_lu_12/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [228.0, 658.0, 146.0, 665.0], 'text': 'model/batch_normalization_v1_12/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [168.0, 672.0, 135.0, 679.0], 'text': 'model/add_11/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [217.0, 644.0, 143.0, 651.0], 'text': 'model/depthwise_conv2d_11/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [143.0, 658.0, 90.0, 665.0], 'text': 'model/max_pooling2d_3/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [170.0, 630.0, 134.0, 637.0], 'text': 'model/p_re_lu_11/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [216.0, 602.0, 134.0, 609.0], 'text': 'model/batch_normalization_v1_11/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [168.0, 616.0, 135.0, 623.0], 'text': 'model/add_10/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [210.0, 588.0, 136.0, 595.0], 'text': 'model/depthwise_conv2d_10/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [168.0, 574.0, 132.0, 581.0], 'text': 'model/p_re_lu_10/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [214.0, 547.0, 133.0, 553.0], 'text': 'model/batch_normalization_v1_10/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [166.0, 560.0, 134.0, 567.0], 'text': 'model/add_9/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [208.0, 533.0, 135.0, 540.0], 'text': 'model/depthwise_conv2d_9/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [165.0, 519.0, 131.0, 526.0], 'text': 'model/p_re_lu_9/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [164.0, 505.0, 132.0, 512.0], 'text': 'model/add_8/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [221.0, 491.0, 141.0, 498.0], 'text': 'model/batch_normalization_v1_9/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [137.0, 491.0, 94.0, 498.0], 'text': 'model/channel_padding_2/Pad (Pad)', 'color': '#d1eeee'} ,
{'rect': [218.0, 477.0, 145.0, 484.0], 'text': 'model/depthwise_conv2d_8/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [141.0, 477.0, 88.0, 484.0], 'text': 'model/max_pooling2d_2/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [165.0, 463.0, 131.0, 470.0], 'text': 'model/p_re_lu_8/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [211.0, 435.0, 131.0, 442.0], 'text': 'model/batch_normalization_v1_8/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [164.0, 449.0, 132.0, 456.0], 'text': 'model/add_7/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [206.0, 421.0, 133.0, 428.0], 'text': 'model/depthwise_conv2d_7/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [164.0, 407.0, 129.0, 414.0], 'text': 'model/p_re_lu_7/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [209.0, 379.0, 129.0, 386.0], 'text': 'model/batch_normalization_v1_7/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [162.0, 393.0, 130.0, 400.0], 'text': 'model/add_6/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [204.0, 365.0, 131.0, 372.0], 'text': 'model/depthwise_conv2d_6/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [162.0, 351.0, 127.0, 358.0], 'text': 'model/p_re_lu_6/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [160.0, 337.0, 129.0, 344.0], 'text': 'model/add_5/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [217.0, 323.0, 137.0, 330.0], 'text': 'model/batch_normalization_v1_6/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [133.0, 323.0, 91.0, 330.0], 'text': 'model/channel_padding_1/Pad (Pad)', 'color': '#d1eeee'} ,
{'rect': [214.0, 309.0, 141.0, 316.0], 'text': 'model/depthwise_conv2d_5/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [138.0, 309.0, 85.0, 316.0], 'text': 'model/max_pooling2d_1/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [162.0, 295.0, 127.0, 302.0], 'text': 'model/p_re_lu_5/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [208.0, 267.0, 127.0, 274.0], 'text': 'model/batch_normalization_v1_5/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [160.0, 281.0, 129.0, 288.0], 'text': 'model/add_4/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [202.0, 253.0, 129.0, 260.0], 'text': 'model/depthwise_conv2d_4/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [160.0, 239.0, 125.0, 246.0], 'text': 'model/p_re_lu_4/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [206.0, 211.0, 125.0, 218.0], 'text': 'model/batch_normalization_v1_4/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [159.0, 225.0, 127.0, 232.0], 'text': 'model/add_3/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [200.0, 197.0, 127.0, 204.0], 'text': 'model/depthwise_conv2d_3/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [158.0, 183.0, 124.0, 190.0], 'text': 'model/p_re_lu_3/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [157.0, 169.0, 125.0, 176.0], 'text': 'model/add_2/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [213.0, 155.0, 133.0, 162.0], 'text': 'model/batch_normalization_v1_3/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [129.0, 155.0, 90.0, 162.0], 'text': 'model/channel_padding/Pad (Pad)', 'color': '#d1eeee'} ,
{'rect': [210.0, 141.0, 137.0, 148.0], 'text': 'model/depthwise_conv2d_2/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [134.0, 141.0, 84.0, 148.0], 'text': 'model/max_pooling2d/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [158.0, 127.0, 124.0, 134.0], 'text': 'model/p_re_lu_2/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [204.0, 99.0, 124.0, 106.0], 'text': 'model/batch_normalization_v1_2/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [157.0, 113.0, 125.0, 120.0], 'text': 'model/add_1/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [199.0, 85.0, 126.0, 92.0], 'text': 'model/depthwise_conv2d_1/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [157.0, 71.0, 122.0, 78.0], 'text': 'model/p_re_lu_1/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [202.0, 43.0, 122.0, 50.0], 'text': 'model/batch_normalization_v1_1/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [154.0, 57.0, 125.0, 64.0], 'text': 'model/add/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [195.0, 29.0, 124.0, 36.0], 'text': 'model/depthwise_conv2d/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [176.0, 16.0, 98.0, 23.0], 'text': 'model/batch_normalization_v1/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [157.0, 2.0, 116.0, 9.0], 'text': 'input_1 [1,192,192,3] (Placeholder)', 'color': '#a4d3ee'} ,
        ];
var currDeepFloors = [];