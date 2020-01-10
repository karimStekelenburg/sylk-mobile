import React from 'react';
import PropTypes from 'prop-types';
import UserIcon from './UserIcon';
import { Headline, IconButton, Title, Portal, Modal, Surface } from 'react-native-paper';
import { View } from 'react-native';

import styles from '../assets/styles/blink/_IncomingCallModal.scss';

const IncomingCallModal = (props) => {

    const answerAudioOnly = () => {
        props.onAnswer({audio: true, video: false});
    }

    const answer = () => {
        props.onAnswer({audio: true, video: true});
    };

    if (props.call == null) {
        return false;
    }

    let answerButtons = [
        <IconButton id="decline" style={styles.button} onPress={props.onHangup} icon="phone-hangup" />
    ];

    let callType = 'audio';
    if (props.call.mediaTypes.video) {
        callType = 'video';
        answerButtons.push(
            <IconButton id="accept" style={styles.button} onPress={answer} autoFocus icon="video" />
        );
    }

    answerButtons.push(
        <IconButton style={styles.button} id="audio" onPress={answerAudioOnly} icon="phone" />
    );

    const remoteIdentityLine = props.call.remoteIdentity.displayName || props.call.remoteIdentity.uri;

    return (
        <Portal>
            <Modal visible={props.show} dismissable={false}>
                <Surface style={styles.container}>
                    <UserIcon identity={props.call.remoteIdentity} large={true} />
                    <Title>{remoteIdentityLine}</Title>
                    <Headline>is calling with {callType}</Headline>
                    <View style={styles.buttonContainer}>
                        {answerButtons}
                    </View>
                </Surface>
            </Modal>
        </Portal>
    );
}

IncomingCallModal.propTypes = {
    call     : PropTypes.object,
    onAnswer : PropTypes.func.isRequired,
    onHangup : PropTypes.func.isRequired,
    compact  : PropTypes.bool,
    show     : PropTypes.bool
};


export default IncomingCallModal;
