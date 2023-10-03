import React from 'react';
import { Platform, Modal as RNModal } from 'react-native';

interface IUniversalModalProps extends React.ComponentProps<typeof RNModal> {
	children: React.ReactNode;
}

export const UniversalModal = (props: IUniversalModalProps) => {
	return <RNModal {...props} style={{ paddingTop: 30, margin: 100 }} />;
};
