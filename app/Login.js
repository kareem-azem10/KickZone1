import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app, firebaseConfig } from '../Confige';

export default function Login() {
  const recaptchaRef = useRef(null);
  const auth = getAuth(app);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    let fullNumber = phoneNumber.trim();

    // إضافة كود الدولة +972 إذا ما كان موجود
    if (!fullNumber.startsWith('+')) {
      fullNumber = '+972' + fullNumber.replace(/^0+/, '');
    }

    try {
      setLoading(true);
      const conf = await signInWithPhoneNumber(auth, fullNumber, recaptchaRef.current);
      setConfirmation(conf);
      Alert.alert('تم الإرسال', 'تم إرسال رمز عبر الرسائل القصيرة');
    } catch (e) {
      console.error(e);
      Alert.alert('خطأ', 'تعذر إرسال الرمز. تحقق من الرقم أو أعد المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!confirmation) return;
    try {
      setLoading(true);
      const result = await confirmation.confirm(code);
      Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح');
      console.log('User:', result.user?.uid);
    } catch (e) {
      console.error(e);
      Alert.alert('خطأ', 'رمز غير صحيح أو منتهي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />

      <Text style={styles.title}>تسجيل الدخول برقم الجوال</Text>
      <View style={styles.box}>
        {!confirmation ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="مثال: 059XXXXXXX"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity style={styles.primary} onPress={sendCode} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? 'جاري الإرسال...' : 'إرسال الرمز'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="ادخل الرمز"
              placeholderTextColor="#888"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity style={styles.primary} onPress={confirmCode} disabled={loading}>
              <Text style={styles.primaryText}>{loading ? 'جارٍ التأكيد...' : 'تأكيد الرمز'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 16,
    color: '#111',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#000',
    fontSize: 16,
    marginBottom: 12,
  },
  primary: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
