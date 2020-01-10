import React, { useState, useEffect, useRef, Fragment } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import momentFormat from 'moment-duration-format';
import { Text, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from '../assets/styles/blink/_ConferenceHeader.scss';

const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const ConferenceHeader = (props) => {
    let [seconds, setSeconds] = useState(0);

    useInterval(() => {
        setSeconds(seconds + 1);
    }, 1000);

    const duration = moment.duration(seconds, 'seconds').format('hh:mm:ss', {trim: false});

    let videoHeader;
    let callButtons;

    if (props.show) {
        const participantCount = props.participants.length + 1;
        const callDetail = (
            <View>
                <Icon name="clock-outline" /><Text>{duration} - </Text><Icon name="account-group" /><Text>{participantCount} participant{participantCount > 1 ? 's' : ''}</Text>
            </View>
        );

        videoHeader = (
            <View>
                <Appbar.Header style={{backgroundColor: 'black'}}>
                    <Appbar.Content
                        title={`Conference: ${props.remoteIdentity}`}
                        subtitle={callDetail}
                    />
                    {props.buttons.top.right}
                </Appbar.Header>
            </View>
        );

        callButtons = (
            <View className="conference-buttons" style={styles.buttonContainer}>
                {props.buttons.bottom}
            </View>
        );
    }

    return (
        <View>
            {videoHeader}
            {callButtons}
        </View>
    );
}

ConferenceHeader.propTypes = {
    show: PropTypes.bool.isRequired,
    remoteIdentity: PropTypes.string.isRequired,
    participants: PropTypes.array.isRequired,
    buttons: PropTypes.object.isRequired
};


export default ConferenceHeader;
