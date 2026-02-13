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
} from 'react-native';
import { COLORS } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';
import ApiService from '../services/ApiService';

export default function ProfileScreen() {
  const authUser = useAppStore((state) => state.authUser);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const setAuthUser = useAppStore((state) => state.setAuthUser);

  const initialValues = useMemo(
    () => ({
      fullName: authUser?.fullName || '',
      phoneNumber: authUser?.phoneNumber || '',
      location: authUser?.location || '',
      bio: authUser?.bio || '',
    }),
    [authUser]
  );

  const [fullName, setFullName] = useState(initialValues.fullName);
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber);
  const [location, setLocation] = useState(initialValues.location);
  const [bio, setBio] = useState(initialValues.bio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFullName(initialValues.fullName);
    setPhoneNumber(initialValues.phoneNumber);
    setLocation(initialValues.location);
    setBio(initialValues.bio);
  }, [initialValues]);

  const handleSave = async () => {
    if (!authUser?.id) {
      setError('Missing user information.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const updatedUser = await ApiService.updateProfile({
        id: authUser.id,
        fullName: fullName.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
        location: location.trim() || null,
        bio: bio.trim() || null,
      });

      setAuthUser(updatedUser);
    } catch (err) {
      setError(err.message || 'Profile update failed.');
    } finally {
      setSaving(false);
    }
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

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={COLORS.textSecondary}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City, Country"
            placeholderTextColor={COLORS.textSecondary}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Tell us about your plants"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            value={bio}
            onChangeText={setBio}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={clearAuth}>
            <Text style={styles.logoutText}>Log Out</Text>
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
    backgroundColor: COLORS.textPrimary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: { color: COLORS.white, fontWeight: '600' },
});
