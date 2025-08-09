import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DatePickerModal({ isVisible, onCancel, onConfirm }) {
  const [date, setDate] = useState(new Date());

  return (
    <DateTimePickerModal
  isVisible={isDatePickerVisible}
  mode="date"
  onConfirm={handleConfirm}
  onCancel={hideDatePicker}
  locale="ar"
  value={selectedDate || new Date()}
/>

  );
}