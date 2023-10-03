import { AdjustmentOperations, Mode, TransformOperations } from 'expo-image-crop-editor';
import { ImageDimensions } from 'image-crop/src/Store';
import React from 'react';

type EditorContextType = {
	throttleBlur: boolean;
	minimumCropDimensions: ImageDimensions;
	fixedAspectRatio: number;
	lockAspectRatio: boolean;
	mode: Mode;
	onCloseEditor: () => void;
	onEditingComplete: (_result: any) => void;
	allowedTransformOperations?: TransformOperations[];
	allowedAdjustmentOperations?: AdjustmentOperations[];
};

export const EditorContext = React.createContext<EditorContextType>({
	throttleBlur: true,
	minimumCropDimensions: {
		width: 0,
		height: 0,
	},
	fixedAspectRatio: 1.6,
	lockAspectRatio: false,
	mode: 'full',
	onCloseEditor: () => {},
	onEditingComplete: () => {},
});
