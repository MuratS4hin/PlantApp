import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';
import ApiService from '../services/ApiService';

export default function ProfileScreen() {
  const authUser = useAppStore((state) => state.authUser);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const clearPlants = useAppStore((state) => state.clearPlants);

  const deleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your plants will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.deleteAccount(authUser.id);
              clearPlants();
              clearAuth();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>{authUser?.email || 'No user data'}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={clearAuth}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { marginTop: 8, color: COLORS.textSecondary, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  bioInput: { minHeight: 90, textAlignVertical: 'top' },
  error: { color: '#D14343', marginBottom: 12 },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: { color: COLORS.white, fontWeight: '600' },
  logoutButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: { color: COLORS.white, fontWeight: '600' },
  deleteButton: {
    marginTop: 12,
    backgroundColor: COLORS.delete,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteText: { color: COLORS.white, fontWeight: '600' },
});
