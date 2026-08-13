import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';
import { NotificationItems } from '../types/notification';
import { COLORS } from '../constants/Color';
interface NotificationCardProps {
    item: NotificationItems;
    onPress: (item: NotificationItems) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    item,
    onPress
}) => {

    return (
        <TouchableOpacity
            style={[
                styles.cardContainer,
                !item.isRead && styles.unreadCardBorder
            ]}
            onPress={() => onPress(item)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.senderImage }}
                    style={styles.senderImage}
                />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.senderNameText}>{item.senderName}</Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.messageText}>
                    {item.message}
                </Text>

                <Text style={styles.timestampText}>{item.timestamp}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationCard

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.black,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#242426',
    },
    unreadCardBorder: {
        borderColor: COLORS.orange,
        backgroundColor: '#1C1A18',
    },
    imageContainer: {
        alignSelf: 'center',
    },
    senderImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    senderNameText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.orange,
    },
    messageText: {
        color: COLORS.textMuted,
        fontSize: 12,
        lineHeight: 17,
        marginBottom: 6,
    },
    timestampText: {
        color: COLORS.textMuted,
        fontSize: 11,
        textAlign: 'right',
    },
})