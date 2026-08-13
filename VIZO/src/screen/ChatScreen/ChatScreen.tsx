import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatScreen = () => {
  return (
    <View>
      <Text style={styles.chatScreen}>ChatScreen</Text>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    chatScreen:{
        justifyContent:"center",
        alignItems:"center",
    },
})