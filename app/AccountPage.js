import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AccountPage() {
  const [active, setActive] = useState('profile');

  const TabButton = ({ id, label, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, active === id && styles.tabButtonActive]}
      onPress={() => setActive(id)}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name={icon} size={20} color={active === id ? '#fff' : '#444'} style={{ marginLeft: 6, marginRight: 6 }} />
      <Text style={[styles.tabLabel, active === id && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (active) {
      case 'profile':
        return (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
            <Text style={styles.sectionText}>الاسم، الرقم، البريد، وغيرها...</Text>
          </View>
        );
      case 'reservations':
        return (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>حجوزاتي</Text>
            <Text style={styles.sectionText}>سيتم عرض حجوزاتك الأخيرة هنا.</Text>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>الإعدادات</Text>
            <Text style={styles.sectionText}>تغيير اللغة، التنبيهات، والمزيد.</Text>
            <TouchableOpacity
              style={[styles.tabLoginBtn, { marginTop: 12 }]}
              onPress={() => {
                // navigate using expo-router
                try {
                  const { router } = require('expo-router');
                  router.push('/Login');
                } catch (e) {
                  console.warn('expo-router not available in this scope', e);
                }
              }}
            >
              <Text style={styles.tabLoginBtnText}>تسجيل الدخول برقم الجوال</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>حسابي</Text>
      <View style={styles.headerUnderline} />

      <View style={styles.tabsRow}>
        <TabButton id="profile" label="البيانات" icon="account" />
        <TabButton id="reservations" label="الحجوزات" icon="calendar-check" />
        <TabButton id="settings" label="الإعدادات" icon="cog" />
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '10%',
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
  },
  headerUnderline: {
    height: 2,
    width: '70%',
    backgroundColor: '#007AFF',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 6,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
    elevation: 3,
  },
  tabLabel: {
    color: '#444',
    fontSize: 15,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#fff',
  },
  contentScroll: {
    padding: 16,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111',
    textAlign: 'right',
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'right',
    lineHeight: 22,
  },
  tabLoginBtn: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabLoginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
