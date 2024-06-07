import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
    label: string;
};

const CircularButton = ({ label }: Props): React.JSX.Element => (
    <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        padding: 10,
        backgroundColor: "#3498db",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CircularButton;
