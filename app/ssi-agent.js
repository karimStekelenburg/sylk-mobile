import {Agent} from '@aries-framework/core';
import {agentDependencies} from '@aries-framework/react-native';

const initializeSsiAgent = async (label, walletId, walletKey) => {
    const agentConfig = {
        // The label is used for communication with other agents
        label: label,
        walletConfig: {
            id: walletId,
            key: walletKey,
        },
    };
    const agent = new Agent(agentConfig, agentDependencies);

    await agent.initialize();
};

exports.initializeSsiAgent = initializeSsiAgent;
