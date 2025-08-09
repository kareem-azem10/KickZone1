import { useNavigation } from 'expo-router';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../Confige';
import { strings } from '../Strings';

const { width: screenWidth } = Dimensions.get('window');
const { arabic } = strings;
const { Tiltels, Informations } = arabic;

const HomeScreen = () => {
  const navigation = useNavigation();

  const [modalVisibleImages, setModalVisibleImages] = useState(false);
  const [modalVisibleImportant, setModalVisibleImportant] = useState(false);
  const [modalVisibleReservation, setModalVisibleReservation] = useState(false);

  const fieldImages = [
    require('../photos2app/images/FieldImg.jpg'),
    require('../photos2app/images/FieldImg2.jpg'),
    require('../photos2app/images/FieldImg4.jpg'),
    require('../photos2app/images/FIeldImg5.jpg'),
    require('../photos2app/images/FIeldImg6.jpg'),
    require('../photos2app/images/FIeldImg7.jpg'),
    require('../photos2app/images/FIeldImg8.jpg'),
  ];

  const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showHourModal, setShowHourModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [reservationName, setReservationName] = useState('');
  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [reservationNumber, setReservationNumber] = useState(null);
  const [lastReservation, setLastReservation] = useState(null);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [isDatePickerButtonDisabled, setIsDatePickerButtonDisabled] = useState(false);

  const showDatePicker = () => {
    if (!isDatePickerButtonDisabled) {
      setDatePickerVisibility(true);
      setIsDatePickerButtonDisabled(true);
      setTimeout(() => setIsDatePickerButtonDisabled(false), 500);
    }
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      Alert.alert('تنبيه', 'التاريخ الذي اخترته منتهي الصلاحية.');
      hideDatePicker();
      return;
    }

    setSelectedDate(date);
    hideDatePicker();
    setTimeout(() => setShowHourModal(true), 300);
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    setShowHourModal(false);
    setShowNameModal(true);
  };

  const handleNameConfirm = async () => {
    if (!reservationName.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم صالح.');
      return;
    }

    try {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setReservationNumber(randomNum);

      await addDoc(collection(db, 'reservations'), {
        date: selectedDate,
        hour: selectedHour,
        name: reservationName,
        reservationNumber: randomNum,
        createdAt: serverTimestamp(),
      });

      setReservationConfirmed(true);
      ToastAndroid.show('تم الحجز وحفظه بنجاح.', ToastAndroid.LONG);
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الحجز.');
      console.error(error);
    }
  };

  const handleCloseAll = () => {
    setDatePickerVisibility(false);
    setShowHourModal(false);
    setShowNameModal(false);
    setSelectedDate(null);
    setSelectedHour(null);
    setReservationName('');
    setReservationConfirmed(false);
    setReservationNumber(null);
    setLastReservation(null);
  };

  const handleCurrentReservation = async () => {
    setLoadingReservation(true);
    setDatePickerVisibility(false);
    try {
      const q = query(
        collection(db, 'reservations'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        Alert.alert('تنبيه', 'لا يوجد حجز حالياً.');
        setLastReservation(null);
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setLastReservation({
            id: doc.id,
            date: data.date ? data.date.toDate() : null,
            hour: data.hour,
            name: data.name,
            reservationNumber: data.reservationNumber,
          });
          setShowNameModal(true);
        });
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء جلب الحجز.');
      setLastReservation(null);
    }
    setLoadingReservation(false);
  };

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{Tiltels.title}</Text>
          <View style={styles.underline} />
  
          {/* معلومات هامة */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialDesignIcons name="alert-circle-outline" style={styles.icon} />
              <Text style={styles.cardTitle}>{Informations.Info}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisibleImportant(true)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>{Informations.Show + " المعلومات الهامة"}</Text>
            </TouchableOpacity>
          </View>
  
          {/* صور الملعب */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialDesignIcons name="soccer-field" style={styles.icon} />
              <Text style={styles.cardTitle}>{Informations.imgs}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisibleImages(true)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>{Informations.Show + " الصور"}</Text>
            </TouchableOpacity>
          </View>
  
          {/* حجز تاريخ */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialDesignIcons name="calendar-month" style={styles.icon} />
              <Text style={styles.cardTitle}>حجز تاريخ</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisibleReservation(true)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>{`احجز الآن`}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  
        {/* مودال الصور */}
        <Modal
          visible={modalVisibleImages}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisibleImages(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{Informations.imgs}</Text>
            <ScrollView contentContainerStyle={styles.imageScroll}>
              {fieldImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.imageFrame, { borderWidth: 1, borderColor: 'black' }]} // إضافة البوردر هنا
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setFullScreenImageVisible(true);
                  }}
                >
                  <Image source={image} style={styles.imageStyle} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisibleImages(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeButtonText, { fontSize: 20, marginLeft: 10 }]}>{Informations.closeBtn || 'إغلاق'}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
  
        {/* مودال عرض الصورة بملء الشاشة مع التكبير والتصغير */}
        <Modal visible={fullScreenImageVisible} transparent={true} onRequestClose={() => setFullScreenImageVisible(false)}>
          <ImageViewer
            imageUrls={fieldImages.map(image => ({ url: Image.resolveAssetSource(image).uri }))}
            index={selectedImageIndex}
            enableSwipeDown={true}
            onSwipeDown={() => setFullScreenImageVisible(false)}
            renderHeader={() => (
              <TouchableOpacity
                style={styles.fullScreenCloseButton}
                onPress={() => setFullScreenImageVisible(false)}
              >
                <MaterialDesignIcons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          />
        </Modal>
  
        {/* مودال معلومات هامة */}
        <Modal
          visible={modalVisibleImportant}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisibleImportant(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{Informations.Info}</Text>
            <ScrollView>
              <Text style={styles.infoText}>
                {`
  * تأكد من قراءة كافة الشروط قبل الحجز. يرجى الالتزام بالتعليمات لضمان تجربة ممتازة للجميع.
  
  1. عند الحجز، يُفضل أخذ لقطة شاشة (screenshot) للحجز لتأكيده عند الوصول.
  
  2. لا يوجد تأمين على اللاعبين أو الممتلكات داخل الملعب، لذلك الدخول على مسؤوليتكم الشخصية.
  
  3. يرجى المحافظة على نظافة الملعب والمرافق المحيطة به، ورمي النفايات في الأماكن المخصصة.
  
  4. الوقت المُحجوز يبدأ من لحظة الدخول وليس عند بدء اللعب، لذا يرجى الالتزام بالوقت المحدد.
  
  5. أي أضرار تحدث للمرافق أو الممتلكات بسبب سوء الاستخدام، يتحمل المتسبب تكاليف الإصلاح.
  
  6. يرجى عدم التدخل في الملعب أثناء اللعب، وتجنب التدخل في الملعب أثناء اللعب.
  
  7. يرجى التواصل مع مدير الملعب في حالة وجود أي مشاكل أو استفسارات.`}
              </Text>
  
            </ScrollView>
            <View style={styles.contactRow}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:0535322328')}
                style={styles.phoneButton}
              >
                <MaterialDesignIcons name="phone" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.contactText}>{Informations.owner}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisibleImportant(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{Informations.closeBtn}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
  
        {/* مودال الحجز */}
        <Modal
          visible={modalVisibleReservation}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            setModalVisibleReservation(false);
            handleCloseAll();
          }}
        >
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>حجز موعد جديد</Text>
            <View style={styles.separator} />
  
            <TouchableOpacity
              onPress={showDatePicker}
              style={[
                styles.blueButton,
                isDatePickerButtonDisabled && { opacity: 0.5 },
              ]}
              disabled={isDatePickerButtonDisabled}
            >
              <MaterialDesignIcons name="calendar-plus" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>حجز موعد جديد</Text>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={handleCurrentReservation} style={styles.blueButton}>
              <MaterialDesignIcons name="calendar-clock" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>الحجز الحالي</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => {
                setModalVisibleReservation(false);
                handleCloseAll();
              }}
              style={[styles.blueButton, { marginTop: 10 }]}
            >
              <MaterialDesignIcons name="arrow-right" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>رجوع</Text>
            </TouchableOpacity>
  
            {/* ✅ مودال اختيار التاريخ */}
            {isDatePickerVisible && (
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                locale="ar"
              />
            )}
  
            {/* ✅ مودال اختيار الساعة */}
            <Modal visible={showHourModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.reservationModalBox}>
                  <Text style={styles.hourTitleRed}>اختر ساعة البداية</Text>
                  {[14, 16, 18, 20, 22].map((hour, idx) => {
                    const label = `${hour}:00 - ${hour + 2 === 24 ? '00' : hour + 2 + ':00'}`;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setSelectedHour(hour);
                          setShowHourModal(false);
                          setShowNameModal(true); // ✅ فتح مودال الاسم بعد اختيار الساعة
                        }}
                        style={styles.hourOptionRow}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.hourOptionText}>{label}</Text>
                        <View style={styles.hourOptionUnderline} />
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    onPress={() => setShowHourModal(false)}
                    style={styles.outlineButton}
                  >
                    <Text style={styles.outlineButtonText}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
  
            {/* ✅ مودال إدخال الاسم وعرض التأكيد */}
            <Modal visible={showNameModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.reservationModalBox}>
                  {loadingReservation ? (
                    <ActivityIndicator size="large" color="#000" />
                  ) : lastReservation ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.reservationTitle}>آخر حجز محفوظ</Text>
                      <Text style={styles.resultText}>
                        التاريخ: {lastReservation.date?.toLocaleDateString()}
                      </Text>
                      <Text style={styles.resultText}>
                        الساعة: {`${lastReservation.hour}:00 - ${lastReservation.hour + 2 === 24 ? '00' : lastReservation.hour + 2 + ':00'
                          }`}
                      </Text>
                      <Text style={styles.resultText}>الاسم: {lastReservation.name}</Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
                        رقم الحجز: {lastReservation.reservationNumber}
                      </Text>
                      <TouchableOpacity
                        onPress={handleCloseAll}
                        style={styles.screenshotCloseButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.screenshotCloseButtonText}>إغلاق</Text>
                      </TouchableOpacity>
                    </View>
                  ) : !reservationConfirmed ? (
                    <>
                      <Text style={styles.reservationTitle}>ادخل اسم صاحب الحجز</Text>
                      <TextInput
                        placeholder="اسم صاحب الحجز (الاسم مع اسم العائله)"
                        value={reservationName}
                        onChangeText={setReservationName}
                        style={styles.input}
                        placeholderTextColor="#888"
                      />
                      <TouchableOpacity
                        onPress={handleNameConfirm}
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.primaryButtonText}>تأكيد</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleCloseAll}
                        style={styles.outlineButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.outlineButtonText}>إلغاء</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <React.Fragment>
                      {/* confirmation */}
                      <View style={{ alignItems: 'center' }}>
                       <Text style={{ fontSize: 20, color: 'green', fontWeight: 'bold', marginBottom: 12 }}>
                         تم الحجز بنجاح!
                       </Text>
                       <Text style={styles.resultText}>
                         التاريخ: {selectedDate?.toLocaleDateString()}
                       </Text>
                       <Text style={styles.resultText}>
                         الساعة: {`${selectedHour}:00 - ${selectedHour + 2 === 24 ? '00' : selectedHour + 2 + ':00'
                           }`}
                       </Text>
                       <Text style={styles.resultText}>الاسم: {reservationName}</Text>
                       <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
                         رقم الحجز: {reservationNumber}
                       </Text>
                       <Text style={styles.screenshotNote}>{`⚠️ ارجو اخذ لقطه للشاشه (Screenshot) كإثبات للحجز`}</Text>
                       <TouchableOpacity
                         onPress={handleCloseAll}
                         style={styles.screenshotCloseButton}
                         activeOpacity={0.8}
                       >
                         <Text style={styles.screenshotCloseButtonText}>إغلاق</Text>
                       </TouchableOpacity>
                      </View>
                    </React.Fragment>
                  )}
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  underline: {
    height: 2,
    backgroundColor: '#007AFF',
    width: '78%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
    color: 'black',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  actionButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  imageScroll: {
    alignItems: 'center',
  },
  imageFrame: {
    width: screenWidth - 40,
    height: 250,
    marginBottom: 18,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 35,
    marginTop: 15,
    elevation: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  screenshotCloseButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#000',
    width: '100%',
    alignSelf: 'center',
    elevation: 4,
  },
  screenshotCloseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 20,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  phoneButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 30,
    marginRight: 10,
  },
  contactText: {
    fontSize: 20,
    color: '#555',
    fontWeight: 'bold',
  },
  separator: {
    height: 2,
    backgroundColor: '#007AFF',
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
  blueButton: {
    backgroundColor: '#000',
    marginHorizontal: 30,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    elevation: 4,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
  },
  // Reservation-specific modal styles
  reservationModalBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  reservationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 14,
    textAlign: 'center',
  },
  hourTitleRed: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 8,
  },
  blackUnderline: {
    height: 2,
    backgroundColor: '#000',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    marginTop: 15,
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outlineButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    elevation: 0,
  },
  outlineButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Optional: use these for list-like reservation options (e.g., "حجز موعد جديد", "الحجز الحالي")
  reservationOptionButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reservationOptionText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    flex: 1,
  },
  hourButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 6,
    width: '100%',
  },
  hourText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  hourOptionRow: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 2,
    alignItems: 'flex-start',
  },
  hourOptionText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
  },
  hourOptionUnderline: {
    height: 2,
    width: '70%',
    maxWidth: 140,
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 6,
    borderRadius: 1,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  cancelText: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
    color: '#000',
  },
  resultText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 6,
  },
  screenshotNote: {
    marginTop: 6,
    marginBottom: 4,
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: '#FFF3F3',
    borderWidth: 1,
    borderColor: '#F5C2C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: '100%',
  },
});
