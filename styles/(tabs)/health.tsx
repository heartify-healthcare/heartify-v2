import { 
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: height * 0.03,
    lineHeight: width * 0.05,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: '#34495e',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: '#2c3e50',
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
    color: '#7f8c8d',
  },
  disabledText: {
    color: '#7f8c8d',
  },
  dropdownButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    padding: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: width * 0.04,
    color: '#2c3e50',
    flex: 1,
  },
  placeholderText: {
    color: '#bdc3c7',
  },
  dropdownArrow: {
    fontSize: width * 0.03,
    color: '#7f8c8d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.05,
    width: width * 0.8,
    maxHeight: height * 0.6,
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  modalOption: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  selectedOption: {
    backgroundColor: '#e74c3c',
  },
  modalOptionText: {
    fontSize: width * 0.04,
    color: '#2c3e50',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // New styles for date picker
  datePickerModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: width * 0.05,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: width * 0.01,
  },
  datePickerLabel: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#34495e',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  datePickerScroll: {
    maxHeight: height * 0.25,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  datePickerOption: {
    padding: width * 0.025,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ecf0f1',
  },
  selectedDateOption: {
    backgroundColor: '#e74c3c',
  },
  datePickerOptionText: {
    fontSize: width * 0.035,
    color: '#2c3e50',
  },
  selectedDateOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: width * 0.035,
    flex: 0.45,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: height * 0.02,
  },
  button: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: width * 0.035,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 5,
    padding: width * 0.035,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});