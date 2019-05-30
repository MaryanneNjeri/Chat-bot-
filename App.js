import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from "./.env";

type Props = {};
const BOT_USER = {
    _id: 2,
    name: 'FAQ Bot',
    avatar: 'https://img.icons8.com/bubbles/100/000000/lol-female.png'
};

export default class App extends Component<Props> {
    state = {
        messages: [
            {
                _id: 1,
                text: `Hi! I am the FAQ bot 🤖 from Jscrambler.\n\nHow may I help you with today?`,
                createdAt: new Date(),
                user: BOT_USER // note
            }
        ]
    };

    componentDidMount() {
        Dialogflow_V2.setConfiguration(
            dialogflowConfig.client_email,
            dialogflowConfig.private_key,
            Dialogflow_V2.LANG_ENGLISH_US, // You can set to many other languages
            dialogflowConfig.project_id
        )
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }))
        let message = messages[0].text;
        Dialogflow_V2.requestQuery(
            message,
            result => this.handleGoogleResponse(result),
            error => console.log(error)
        )
    }

    handleGoogleResponse(result) {

        let text = result.queryResult.fulfillmentMessages[0].text.text[0];
        this.sendBotResponse(text);

    }

    sendBotResponse(text) {
        let msg = {
            _id: this.state.messages.length + 1,
            text,
            createdAt: new Date(),
            user: BOT_USER
        };
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, [msg])
        }))

    }

    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
