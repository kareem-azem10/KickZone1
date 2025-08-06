import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DatePickerModal({ isVisible, onCancel, onConfirm }) {
  const [date, setDate] = useState(new Date());

  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      date={date}
      onConfirm={selectedDate => {
        setDate(selectedDate);
        onConfirm(selectedDate);
      }}
      onCancel={onCancel}
      locale="ar"
      display="spinner"
    />
  );
}