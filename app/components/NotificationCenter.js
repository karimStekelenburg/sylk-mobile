import React, { Component } from 'react';
import { ProgressBar, Colors, Snackbar } from 'react-native-paper';
import moment from 'moment';
import autoBind from 'auto-bind';

import config from '../config';

class NotificationCenter extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            visible: false,
            message: null,
            title: null,
            autoDismiss: null,
            action: null
        }
    }

    postSystemNotification(title, options={}) {    // eslint-disable-line space-infix-ops
        this.setState({
            visible: true,
            autoDismiss: 3,
            title: title,
            message: options.body
        });
    }

    postConferenceInvite(originator, room, cb) {
        if (originator.uri.endsWith(config.defaultGuestDomain)) {
            return;
        }
        const idx = room.indexOf('@');
        if (idx === -1) {
            return;
        }
        const currentDate = moment().format('MMMM Do YYYY [at] HH:mm:ss');
        const action = {
            label: 'Join',
            onPress: () => { cb(room); }
        };
        this.setState({
            visible: true,
            message: `${(originator.displayName || originator.uri)} invited you to join conference room ${room.substring(0, idx)}<br />On ${currentDate}`,
            title: 'Conference Invite',
            autoDismiss: 0,
            action: action,
        });
    }

    postMissedCall(originator, cb) {
        const currentDate = moment().format('MMMM Do YYYY [at] HH:mm:ss');
        let action;
        if (originator.uri.endsWith(config.defaultGuestDomain)) {
            action = null;
        } else {
            action = {
                label: 'Call',
                onPress: () => { cb(originator.uri); }
            };
        }
        this.setState({
            visible: true,
            message: `From ${(originator.displayName || originator.uri)} <br />On ${currentDate}`,
            title: 'Missed Call',
            autoDismiss: 0,
            action: action
        });
    }

    postFileUploadProgress(filename, cb) {
        this.setState({
            visible: true,
            message: `${filename}`,
            title: 'Uploading file',
            autoDismiss: 0,
            action: {
                label: 'OK',
                onPress: () => cb()
            },
            // children: (
            //     <View>
            //         <ProgressBar
            //             style={{marginTop: '2px'}}
            //             classes={{barColorPrimary: 'blue-bar'}}
            //             variant="determinate"
            //             progress={0}
            //         />
            //     </View>
            // )
        });
    }

    editFileUploadNotification(progress, notification) {
        if (progress === undefined) {
            progress = 100;
        }
        this.setState({
            visible: true,
            message: `${filename}`,
            title: 'Upload Successful',
            autoDismiss: 3,
        });
    }

    removeFileUploadNotification(notification) {
        let timer = setTimeout(() => {
            this.setState({visible: false});
        }, 3000);
    }

    removeNotification(notification) {
        this.setState({visible: false});
    }

    postFileUploadFailed(filename) {
        this.setState({
            visible: true,
            message: `Uploading of ${filename} failed`,
            title: 'File sharing failed',
            autoDismiss: 10,
        });
    }

    postFileShared(file, cb) {
        const uploader = file.uploader.displayName || file.uploader.uri || file.uploader;

        this.setState({
            visible: true,
            message: `${uploader} shared ${file.filename}`,
            title: 'File shared',
            autoDismiss: 10,
            action: {
                label: 'Show Files',
                onPress: () => cb()
            }
        });
    }

    render() {
        console.log('Re-rendering snackbar');
        return (
            <Snackbar
                visible={this.state.visible}
                duration={this.state.autoDismiss * 1000}
                onDismiss={() => this.setState({ visible: false })}
                action={this.state.action}
            >
                {this.state.title} - {this.state.message}
            </Snackbar>
        );
    }
}


export default NotificationCenter;