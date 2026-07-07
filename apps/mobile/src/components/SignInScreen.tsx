import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { colors, typography, spacing } from '@zenth/utils';
import { Button } from '@zenth/ui';

export function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors?.[0]?.message || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zenth</Text>
      <Text style={styles.subtitle}>Sign in to sync your data</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          placeholder="Password..."
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      
      <Button onPress={onSignInPress} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontFamily: typography.fonts.heading.semiBold,
    fontSize: 48,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fonts.body.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontFamily: typography.fonts.body.regular,
    fontSize: 16,
  },
  button: {
    width: '100%',
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.text,
    fontFamily: typography.fonts.body.medium,
    fontSize: 16,
  }
});
