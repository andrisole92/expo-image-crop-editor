import React from 'react';
import { Modal } from 'react-native';

interface IUniversalModalProps extends React.ComponentProps<typeof Modal> {
	children: React.ReactNode;
}

export const UniversalModal = (props: IUniversalModalProps) => {
	return (
		<Modal
			{...props}
			style={{ paddingTop: 30, margin: 100, backgroundColor: 'red', width: '100%', height: '100%' }}
		/>
	);
};

export default React.memo(UniversalModal);
