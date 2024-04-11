import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';



const TestScreen = (props) => {
    const { navigation } = props;
    useEffect(() => {
        navigation.setOptions({
            title: props.route.params.name,
        });
    }, [navigation]);

    console.log(props.route.params.name);
    return (
        <View>
            <Text>{props.route.params.name}</Text>
        </View>
    );
};

export default TestScreen;

TestScreen.navigationOptions = ({ route }) => ({
    title: route.params.name, // Set the header title to the user name
    headerTitle: route.params.name, // Set the screen name to the user name
    headerStyle: {
        backgroundColor: '#f4511e',
      },
});
