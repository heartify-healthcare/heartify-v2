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
  requirementsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: width * 0.03,
    marginBottom: height * 0.02,
  },
  requirementsTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: height * 0.01,
  },
  requirementText: {
    fontSize: width * 0.03,
    color: '#7f8c8d',
    marginBottom: 2,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: width * 0.03,
    fontSize: width * 0.04,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 18,
    color: '#7f8c8d',
  },
});