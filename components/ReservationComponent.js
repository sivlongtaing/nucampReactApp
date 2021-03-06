import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Alert, Picker, Switch, Button, Modal } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            showModal: false
        };
    }

    static navigationOptions = {
        title: 'Reserve Campsite'
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    showAlert() {
        Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
              {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                  text: 'OK', 
                  onPress: () => 
                  {
                    this.presentLocalNotification(this.state.date);
                    this.resetForm();
                    }                
                },
            ],
            {cancelable: false},
          );
        }


    handleReservation() {
        console.log(JSON.stringify(this.state));

        let message = `Number of Campers: ${this.state.campers}\n\n` +
            `Hike-In?: ${this.state.hikeIn}\n\n` +
            `Date: ${this.state.date}`;

        Alert.alert(
            'Begin Search?',
            message,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                        console.log('Reservation search cancelled.');
                        this.resetForm();
                    }
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        this.resetForm();
                    }
                }
            ],
            { cancelable: false }
        );
        

    }

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        const permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            const permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
            return permission;
        }
        return permission;
    }

    async presentLocalNotification(date) {
        const permission = await this.obtainNotificationPermission();
        if (permission.status === 'granted') {
            Notifications.presentLocalNotificationAsync({
                title: 'Your Campsite Reservation Search',
                body: 'Search for ' + date + ' requested'
            });
        }
    }


    render() {
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Camp Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            trackColor={{true: '#512DA8', false: null}} 
                            onValueChange={(value) =>
                            this.setState({smoking: value})}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format=''
                            mode="datetime"
                            placeholder="select date and Time"
                            minDate="2017-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys. 
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title="RESERVE"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#5637DD',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;