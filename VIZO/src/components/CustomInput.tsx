import React from 'react';
import { TextInputProps } from 'react-native';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  KeyboardTypeOptions,
} from 'react-native';
import { COLORS } from '../constants/Color';

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: TextInputProps['onBlur'];
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string | any;
  touched?: boolean | any;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'sentences',
  error,
  touched,
}) => {
  const isError = touched && Boolean(error);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          isError ? styles.inputErrorBorder : null,
        ]}
      />
      {isError && <Text style={styles.errorText}>{String(error)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 52,
    color: COLORS.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputErrorBorder: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});